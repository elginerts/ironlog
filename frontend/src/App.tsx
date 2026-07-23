import { useEffect, useRef, useState } from "react";
import "./App.css";
import { supabase } from "./utils/supabase";
import { detectPersonalRecord, isAnyPersonalRecord, calculateEstimated1RM} from "./utils/PersonalRecord";

import Navbar from "./components/Navbar";
import SignUpModal from "./components/SignUpModal";
import LoginModal from "./components/LoginModal";
import type { Workout } from "./components/types";
import HomePage from "./pages/HomePage";
import WorkoutsPage from "./pages/WorkoutsPage";
import ProgressPage from "./pages/ProgressPage";
import FeedPage from "./pages/FeedPage";

type FetchWorkoutsOptions = {
  shouldUpdate?: () => boolean;
};

function App() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [currentPage, setCurrentPage] = useState<string>("home");
  const isMountedRef = useRef(false);

  async function fetchWorkouts({
    shouldUpdate = () => isMountedRef.current,
  }: FetchWorkoutsOptions = {}) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!shouldUpdate()) {
      return;
    }

    if (userError) {
      alert(userError.message);
      return;
    }

    if (!user) {
      setWorkouts([]);
      return;
    }

    const { data, error } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", user.id)
      .order("workout_date", { ascending: false });

    if (!shouldUpdate()) {
      return;
    }

    if (error) {
      alert(error.message);
      return;
    }

    const chronologicalWorkouts: Workout[] = [...data]
      .sort(
        (firstWorkout, secondWorkout) =>
          new Date(firstWorkout.workout_date).getTime() -
          new Date(secondWorkout.workout_date).getTime(),
      )
      .map((workout) => ({
        id: workout.id,
        exerciseName: workout.exercise_name,
        sets: workout.sets,
        reps: workout.reps,
        weight: workout.weight,
        date: workout.workout_date,
      }));
      const workoutsWithCurrentRecords = chronologicalWorkouts.map((workout) => {
        const sameExerciseWorkouts = chronologicalWorkouts.filter(
          (item) =>
            item.exerciseName.trim().toLowerCase() ===
            workout.exerciseName.trim().toLowerCase(),
        );

      const latestHighestWeightWorkout = [...sameExerciseWorkouts]
        .filter(
          (item) =>
            Number(item.weight) ===
            Math.max(
              ...sameExerciseWorkouts.map((entry) => Number(entry.weight)),
            ),
        )
      .at(-1);

      const latestHighestRepsWorkout = [...sameExerciseWorkouts]
        .filter(
          (item) =>
            Number(item.reps) ===
            Math.max(
              ...sameExerciseWorkouts.map((entry) => Number(entry.reps)),
          ),
      )
      .at(-1);

      const highestEstimated1RM = Math.max(
        ...sameExerciseWorkouts.map((item) =>
          calculateEstimated1RM(Number(item.weight), Number(item.reps)),
        ),
      );

      const latestHighest1RMWorkout = [...sameExerciseWorkouts]
        .filter(
          (item) =>
            calculateEstimated1RM(
              Number(item.weight),
              Number(item.reps),
            ) === highestEstimated1RM,
        )
        .at(-1);

      const estimated1RM = calculateEstimated1RM(
        Number(workout.weight),
        Number(workout.reps),
      );

      return {
        ...workout,
        personalRecord: {
          weightPR: workout.id === latestHighestWeightWorkout?.id,
          repsPR: workout.id === latestHighestRepsWorkout?.id,
          estimated1RMPR: workout.id === latestHighest1RMWorkout?.id,
          estimated1RM,
        },
      };
    });

const formattedWorkouts = workoutsWithCurrentRecords.reverse();

    setWorkouts(formattedWorkouts);
  }

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let isCurrentRequest = true;

    void Promise.resolve().then(() => {
      if (!isCurrentRequest) {
        return;
      }

      void fetchWorkouts({
        shouldUpdate: () => isCurrentRequest && isMountedRef.current,
      });
    });

    return () => {
      isCurrentRequest = false;
    };
  }, [userEmail]);

  async function addWorkout(workout: Workout): Promise<boolean> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      alert(userError.message);
      return false;
    }

    if (!user) {
      alert("You must be logged in to save a workout.");
      return false;
    }

    const personalRecord = detectPersonalRecord(workout, workouts);

    const { error } = await supabase.from("workouts").insert({
      user_id: user.id,
      exercise_name: workout.exerciseName,
      sets: workout.sets,
      reps: workout.reps,
      weight: workout.weight,
      workout_date: workout.date,
    });

    if (error) {
      alert(error.message);
      return false;
    }

    await fetchWorkouts();

    if (isAnyPersonalRecord(personalRecord)) {
      const achievements: string[] = [];
  
    if (personalRecord.weightPR) {
      achievements.push("Weight PR");
    }
    
    if (personalRecord.repsPR) {
      achievements.push("Repetition PR");
    }

    if (personalRecord.estimated1RMPR) {
      achievements.push(
        `Estimated 1RM PR: ${personalRecord.estimated1RM} kg`,
      );
    }

    alert(
      `Workout saved!\n\n🏆 New Personal Record!\n${achievements.join("\n")}`,
    );
  } else {
    alert("Workout saved!");
  }
    return true;
  }

  async function shareWorkout(workout: Workout): Promise<boolean> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      alert(userError.message);
      return false;
    }

    if (!user) {
      alert("You must be logged in to share a workout.");
      return false;
    }

    const { error } = await supabase.from("workout_posts").insert({
      user_id: user.id,
      exercise_name: workout.exerciseName,
      sets: workout.sets,
      reps: workout.reps,
      weight: workout.weight,
      workout_date: workout.date,
      caption: "Shared my workout!",
      visibility: "public",
    });

    if (error) {
      alert(error.message);
      return false;
    }

    alert("Workout shared to feed!");
    return true;
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    setUserEmail(null);
    setWorkouts([]);
    setCurrentPage("home");
  }

  function renderPage() {
    if (currentPage === "workouts") {
      return (
        <WorkoutsPage
          workouts={workouts}
          onAddWorkout={addWorkout}
          onShareWorkout={shareWorkout}
        />
      );
    }

    if (currentPage === "progress") {
      return <ProgressPage workouts={workouts} userEmail={userEmail} />;
    }

    if (currentPage === "feed") {
      return <FeedPage />;
    }

    return (
      <HomePage
        userEmail={userEmail}
        workouts={workouts}
        onSignUpClick={() => setShowSignUp(true)}
        onLoginClick={() => setShowLogin(true)}
        onLogoutClick={handleLogout}
      />
    );
  }

  return (
    <div className="app">
      <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />

      <main>{renderPage()}</main>

      {showSignUp && <SignUpModal onClose={() => setShowSignUp(false)} />}

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoginSuccess={(email) => {
            setUserEmail(email);
            setShowLogin(false);
          }}
        />
      )}
    </div>
  );
}

export default App;

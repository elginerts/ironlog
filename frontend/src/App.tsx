import { useEffect, useRef, useState } from "react";
import "./App.css";
import { supabase } from "./utils/supabase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { firebaseAuth } from "./utils/firebase";
import {
  calculateEstimated1RM,
  detectPersonalRecord,
  isAnyPersonalRecord,
} from "./utils/personalRecord";
import LeaderboardPage from "./pages/LeaderboardPage";
import {
  createWorkoutThroughApi,
  fetchWorkoutsFromApi,
} from "./services/workoutApi";

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setUserEmail(user?.email ?? null);
    });

    return unsubscribe;
  }, []);

  async function fetchWorkouts({
    shouldUpdate = () => isMountedRef.current,
  }: FetchWorkoutsOptions = {}) {
    if (!shouldUpdate()) {
      return;
    }

    if (!firebaseAuth.currentUser) {
      setWorkouts([]);
      return;
    }

    let data;

    try {
      data = await fetchWorkoutsFromApi();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to retrieve workouts.";

      alert(message);
      return;
    }

    if (!shouldUpdate()) {
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
            Math.max(...sameExerciseWorkouts.map((entry) => Number(entry.reps))),
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
    if (!firebaseAuth.currentUser) {
      alert("You must be logged in to save a workout.");
      return false;
    }

    const personalRecord = detectPersonalRecord(workout, workouts);

    try {
      await createWorkoutThroughApi(workout);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to save workout.";

      alert(message);
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
    try {
      await signOut(firebaseAuth);

      setUserEmail(null);
      setWorkouts([]);
      setCurrentPage("home");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to log out.";

      alert(message);
    }
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

    if (currentPage === "leaderboard") {
      return <LeaderboardPage />;
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

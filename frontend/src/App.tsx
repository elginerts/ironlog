import { useState } from "react";
import "./App.css";
import { supabase } from "./utils/supabase";

import Navbar from "./components/Navbar";
import SignUpModal from "./components/SignUpModal";
import LoginModal from "./components/LoginModal";
import type { Workout } from "./components/types";
import HomePage from "./pages/HomePage";
import WorkoutsPage from "./pages/WorkoutsPage";
import ProgressPage from "./pages/ProgressPage";

function App() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [currentPage, setCurrentPage] = useState<string>("home");

async function addWorkout(workout: Workout): Promise<boolean> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  console.log("Current user:", user);

  if (userError) {
    console.log("Get user error:", userError);
    alert(userError.message);
    return false;
  }

  if (!user) {
    alert("You must be logged in to save a workout.");
    return false;
  }

  const { data, error } = await supabase
    .from("workouts")
    .insert({
      user_id: user.id,
      exercise_name: workout.exerciseName,
      sets: workout.sets,
      reps: workout.reps,
      weight: workout.weight,
      workout_date: workout.date,
    })
    .select();

  if (error) {
    console.log("Add workout error:", error);
    alert(error.message);
    return false;
  }

  console.log("Saved workout:", data);

  setWorkouts((currentWorkouts) => [workout, ...currentWorkouts]);

  alert("Workout saved!");
  return true;
}

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log("Logout error:", error.message);
      return;
    }

    setUserEmail(null);
  }

  function renderPage() {
    if (currentPage === "workouts") {
      return (
        <WorkoutsPage
          workouts={workouts}
          onAddWorkout={addWorkout}
        />
      );
    }

    if (currentPage === "progress") {
      return <ProgressPage />;
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
      <Navbar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      <main>
        {renderPage()}
      </main>

      {showSignUp && (
        <SignUpModal onClose={() => setShowSignUp(false)} />
      )}

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

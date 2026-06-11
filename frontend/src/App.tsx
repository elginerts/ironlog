import { useState } from 'react';
import "./App.css";
import { supabase } from "./utils/supabase";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import SignUpModal from "./components/SignUpModal";
import LoginModal from "./components/LoginModal";
import WorkoutForm from "./components/WorkoutForm";
import WorkoutLog from "./components/WorkoutLog";
import type { Workout } from './components/types';





function App() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  async function addWorkout(workout: Workout): Promise<boolean> {
    const { error } = await supabase.from("workouts").insert({
      exercise_name: workout.exerciseName,
      sets: workout.sets,
      reps: workout.reps,
      weight: workout.weight,
    });

    if (error) {
      console.log("Add workout error:", error.message);
      alert("Could not save workout.");
      return false;
    }

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


  return (
    <div className="app">
      <Navbar />

      <main>
        <HeroSection 
          userEmail={userEmail}
          workouts={workouts}  
          onSignUpClick={() => setShowSignUp(true)} 
          onLoginClick={() => setShowLogin(true)}
          onLogoutClick={handleLogout}
        />

        <WorkoutForm onAddWorkout={addWorkout} />
        <WorkoutLog workouts={workouts} />

        <FeaturesSection />
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

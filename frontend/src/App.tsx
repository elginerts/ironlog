import { useEffect, useState } from 'react';
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

type DBWorkoutRow = {
  exercise_name: string;
  sets: number | null;
  reps: number | null;
  weight: number | null;
  workout_date: string | null;
  id: number;
  created_at: string;
};

function App() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  // We store `userEmail` as `string | null`. Supabase `user.email` can be
  // `string | undefined` (e.g. some OAuth providers or incomplete profiles),
  // so we normalize `undefined` -> `null` before storing in state. Use
  // `user.id` (UUID) for auth/permission checks and RLS enforcement.
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [currentPage, setCurrentPage] = useState<string>("home");

  async function addWorkout(workout: Workout): Promise<boolean> {
    try {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (!user) {
        alert("Please log in to save workouts.");
        return false;
      }

      const workoutDate = workout.date ? new Date(workout.date).toISOString().split('T')[0] : null;

      // insert and return the inserted row (including id)
      const { data: insertData, error } = await supabase
        .from('workouts')
        .insert({
          user_id: user.id,
          exercise_name: workout.exerciseName,
          sets: workout.sets,
          reps: workout.reps,
          weight: workout.weight,
          workout_date: workoutDate,
        })
        .select('*')
        .single();

      if (error || !insertData) {
        console.log('Add workout error:', error?.message);
        alert('Could not save workout.');
        return false;
      }

      // optimistic update with returned id
      const inserted: Workout = {
        id: insertData.id,
        exerciseName: insertData.exercise_name,
        sets: insertData.sets ?? 0,
        reps: insertData.reps ?? 0,
        weight: insertData.weight ?? 0,
        date: insertData.workout_date ? new Date(insertData.workout_date).toLocaleDateString() : new Date(insertData.created_at).toLocaleDateString(),
      };

      setWorkouts((currentWorkouts) => [inserted, ...currentWorkouts]);
      alert('Workout saved!');
      return true;
    } catch (err) {
      console.error('Failed to save workout:', err);
      alert('Could not save workout.');
      return false;
    }
  }

  // Update an existing workout row in the database and update local state
  async function updateWorkout(id: number, changes: Partial<Workout>): Promise<boolean> {
    try {
      const payload: any = {};
      if (typeof changes.sets === 'number') payload.sets = changes.sets;
      if (typeof changes.reps === 'number') payload.reps = changes.reps;
      if (typeof changes.weight === 'number') payload.weight = changes.weight;
      if (typeof changes.date === 'string') payload.workout_date = new Date(changes.date).toISOString().split('T')[0];

      const { error } = await supabase.from('workouts').update(payload).eq('id', id);
      if (error) {
        console.error('Failed to update workout:', error.message);
        return false;
      }

      // update local state
      setWorkouts((prev) => prev.map((w) => (w.id === id ? { ...w, ...changes } : w)));
      return true;
    } catch (err) {
      console.error('Update workout error:', err);
      return false;
    }
  }

  // Fetch workouts for a user and map DB rows to client Workout type
  async function fetchWorkoutsForUser(uid: string) {
    try {
      const { data, error } = await supabase
        .from('workouts')
        .select('id, exercise_name, sets, reps, weight, workout_date, created_at')
        .eq('user_id', uid)
        .order('workout_date', { ascending: false });

      const rows = data as DBWorkoutRow[] | null;

      if (error) {
        console.error('Failed to load workouts:', error.message);
        return;
      }

      if (rows && rows.length > 0) {
        const mapped: Workout[] = rows.map((row: DBWorkoutRow) => ({
          exerciseName: row.exercise_name,
          sets: row.sets ?? 0,
          reps: row.reps ?? 0,
          weight: row.weight ?? 0,
          date: row.workout_date ? new Date(row.workout_date).toLocaleDateString() : new Date(row.created_at).toLocaleDateString(),
        }));

        setWorkouts(mapped);
      } else {
        setWorkouts([]);
      }
    } catch (err) {
      console.error('Error fetching workouts:', err);
    }
  }

  useEffect(() => {
    // check current user on mount and load their workouts
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const user = data?.user;
        if (user) {
          // Normalize `undefined` to `null` for consistent state typing.
          // Authorization is based on `user.id` (not email).
          setUserEmail(user.email ?? null);
          await fetchWorkoutsForUser(user.id);
        }
      } catch (err) {
        console.error('Auth init error:', err);
      }
    })();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      // mark unused first arg as intentionally unused
      void _;
      const user = session?.user;
      if (user) {
        // Normalize `undefined` to `null` for consistent state typing.
        // Authorization is based on `user.id` (not email).
        setUserEmail(user.email ?? null);
        fetchWorkoutsForUser(user.id);
      } else {
        setUserEmail(null);
        setWorkouts([]);
      }
    });

    return () => {
      try { listener?.subscription?.unsubscribe?.(); } catch (err) { void err; }
    };
  }, []);

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
      <Navbar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      <main>
        {currentPage === "home" && (
          <>
            <HeroSection
              userEmail={userEmail}
              workouts={workouts}
              onSignUpClick={() => setShowSignUp(true)}
              onLoginClick={() => setShowLogin(true)}
              onLogoutClick={() => { void handleLogout(); }}
            />

            <FeaturesSection />
          </>
        )}

        {currentPage === "workouts" && (
          <>
            <WorkoutForm onAddWorkout={addWorkout} />
            <WorkoutLog workouts={workouts} onEdit={updateWorkout} />
          </>
        )}

        {currentPage === "progress" && (
          <section className="card">
            <h2>Progress</h2>
            <p>Your progress page will go here.</p>
          </section>
        )}
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

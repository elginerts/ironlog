import type { Workout } from "../components/types";
import { supabase } from "../utils/supabase";

const apiUrl =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function getAuthorizationHeader() {
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    throw new Error("You must be logged in.");
  }

  return {
    Authorization: `Bearer ${data.session.access_token}`,
    "Content-Type": "application/json",
  };
}

export async function fetchWorkoutsFromApi() {
  const headers = await getAuthorizationHeader();

  const response = await fetch(`${apiUrl}/api/workouts`, {
    method: "GET",
    headers,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ?? "Unable to retrieve workouts.",
    );
  }

  return result.workouts;
}

export async function createWorkoutThroughApi(
  workout: Workout,
) {
  const headers = await getAuthorizationHeader();

  const response = await fetch(`${apiUrl}/api/workouts`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      exerciseName: workout.exerciseName,
      sets: workout.sets,
      reps: workout.reps,
      weight: workout.weight,
      workoutDate: workout.date,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ?? "Unable to save workout.",
    );
  }

  return result.workout;
}

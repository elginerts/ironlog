import { firebaseAuth } from "../utils/firebase";

export type WorkoutSessionExerciseInput = {
  exerciseName: string;
  sets: number;
  reps: number;
  weight: number;
};

export type CreateWorkoutSessionInput = {
  title: string;
  workoutDate: string;
  exercises: WorkoutSessionExerciseInput[];
};

export type WorkoutSessionExercise = {
  id: string;
  exercise_name: string;
  exercise_order: number;
  sets: number;
  reps: number;
  weight: number;
};

export type WorkoutSession = {
  id: string;
  title: string;
  workout_date: string;
  created_at: string;
  workout_exercises: WorkoutSessionExercise[];
};

const apiUrl =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function getAuthorizationHeaders() {
  const user = firebaseAuth.currentUser;

  if (!user) {
    throw new Error("You must be logged in.");
  }

  const token = await user.getIdToken();

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function createWorkoutSession(
  session: CreateWorkoutSessionInput,
) {
  const headers = await getAuthorizationHeaders();

  const response = await fetch(
    `${apiUrl}/api/workout-sessions`,
    {
      method: "POST",
      headers,
      body: JSON.stringify(session),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ?? "Unable to create workout session.",
    );
  }

  return result.session;
}

export async function fetchWorkoutSessions(): Promise<
  WorkoutSession[]
> {
  const headers = await getAuthorizationHeaders();

  const response = await fetch(
    `${apiUrl}/api/workout-sessions`,
    {
      method: "GET",
      headers,
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ?? "Unable to retrieve workout sessions.",
    );
  }

  return result.sessions;
}
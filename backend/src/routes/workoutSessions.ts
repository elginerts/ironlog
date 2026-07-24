import { Router } from "express";
import {
  authenticate,
  type AuthenticatedRequest,
} from "../middleware/authenticate.js";
import { supabase } from "../supabase.js";

type ExerciseInput = {
  exerciseName?: string;
  sets?: number;
  reps?: number;
  weight?: number;
};

type CreateSessionBody = {
  title?: string;
  workoutDate?: string;
  exercises?: ExerciseInput[];
};

const router = Router();

async function getProfileId(request: AuthenticatedRequest) {
  const firebaseUid = request.firebaseUser?.uid;

  if (!firebaseUid) {
    throw new Error("Authenticated user could not be identified.");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("firebase_uid", firebaseUid)
    .single();

  if (error || !data) {
    throw new Error("No linked profile was found.");
  }

  return data.id;
}

router.post(
  "/",
  authenticate,
  async (request: AuthenticatedRequest, response) => {
    const {
      title,
      workoutDate,
      exercises,
    } = request.body as CreateSessionBody;

    if (
      !workoutDate ||
      !Array.isArray(exercises) ||
      exercises.length === 0
    ) {
      response.status(400).json({
        message: "A workout date and at least one exercise are required.",
      });
      return;
    }

    const cleanedExercises = exercises.map((exercise, index) => ({
      exercise_name: exercise.exerciseName?.trim(),
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight,
      exercise_order: index + 1,
    }));

    const hasInvalidExercise = cleanedExercises.some(
      (exercise) =>
        !exercise.exercise_name ||
        !Number.isInteger(exercise.sets) ||
        Number(exercise.sets) <= 0 ||
        !Number.isInteger(exercise.reps) ||
        Number(exercise.reps) <= 0 ||
        typeof exercise.weight !== "number" ||
        !Number.isFinite(exercise.weight) ||
        exercise.weight < 0,
    );

    if (hasInvalidExercise) {
      response.status(400).json({
        message: "Please provide valid exercise details.",
      });
      return;
    }

    try {
      const userId = await getProfileId(request);

      const { data: session, error: sessionError } = await supabase
        .from("workout_sessions")
        .insert({
          user_id: userId,
          title: title?.trim() || "Workout",
          workout_date: workoutDate,
        })
        .select("id, user_id, title, workout_date, created_at")
        .single();

      if (sessionError || !session) {
        console.error("Session creation failed:", sessionError);

        response.status(500).json({
          message: "Unable to create workout session.",
        });
        return;
      }

      const exerciseRows = cleanedExercises.map((exercise) => ({
        session_id: session.id,
        ...exercise,
      }));

      const { data: savedExercises, error: exercisesError } =
        await supabase
          .from("workout_exercises")
          .insert(exerciseRows)
          .select(
            "id, session_id, exercise_name, exercise_order, sets, reps, weight",
          );

      if (exercisesError) {
        console.error("Exercise creation failed:", exercisesError);

        await supabase
          .from("workout_sessions")
          .delete()
          .eq("id", session.id);

        response.status(500).json({
          message: "Unable to save workout exercises.",
        });
        return;
      }

      response.status(201).json({
        session: {
          ...session,
          workout_exercises: savedExercises ?? [],
        },
      });
    } catch (error) {
      console.error("Workout session route error:", error);

      response.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Unable to save workout session.",
      });
    }
  },
);

router.get(
  "/",
  authenticate,
  async (request: AuthenticatedRequest, response) => {
    try {
      const userId = await getProfileId(request);

      const { data, error } = await supabase
        .from("workout_sessions")
        .select(`
          id,
          title,
          workout_date,
          created_at,
          workout_exercises (
            id,
            exercise_name,
            exercise_order,
            sets,
            reps,
            weight
          )
        `)
        .eq("user_id", userId)
        .order("workout_date", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Session retrieval failed:", error);

        response.status(500).json({
          message: "Unable to retrieve workout sessions.",
        });
        return;
      }

      const sessions = (data ?? []).map((session) => ({
        ...session,
        workout_exercises: [...session.workout_exercises].sort(
          (firstExercise, secondExercise) =>
            firstExercise.exercise_order -
            secondExercise.exercise_order,
        ),
      }));

      response.status(200).json({
        sessions,
      });
    } catch (error) {
      console.error("Workout session retrieval error:", error);

      response.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Unable to retrieve workout sessions.",
      });
    }
  },
);

export default router;
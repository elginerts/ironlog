import { Router } from "express";
import {
  authenticate,
  type AuthenticatedRequest,
} from "../middleware/authenticate.js";
import { supabase } from "../supabase.js";

type CreateWorkoutBody = {
  exerciseName?: string;
  sets?: number;
  reps?: number;
  weight?: number;
  workoutDate?: string;
};

const router = Router();

async function ensureProfile(
  request: AuthenticatedRequest,
): Promise<string> {
  const userId = request.user?.id;
  const email = request.user?.email?.trim().toLowerCase();

  if (!userId) {
    throw new Error("Authenticated user could not be identified.");
  }

  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: userId,
        username: email?.split("@")[0] ?? "IronLog User",
      },
      {
        onConflict: "id",
        ignoreDuplicates: true,
      },
    );

  if (error) {
    throw new Error(
      `Unable to ensure the user profile exists: ${error.message}`,
    );
  }

  return userId;
}

router.get(
  "/",
  authenticate,
  async (
    request: AuthenticatedRequest,
    response,
  ) => {
    try {
      const userId = await ensureProfile(request);

      const { data, error } = await supabase
        .from("workouts")
        .select(
          `
            id,
            user_id,
            exercise_name,
            sets,
            reps,
            weight,
            workout_date,
            created_at
          `,
        )
        .eq("user_id", userId)
        .order("workout_date", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Workout retrieval failed:", error);

        response.status(500).json({
          message: "Unable to retrieve workouts.",
        });
        return;
      }

      response.status(200).json({
        workouts: data ?? [],
      });
    } catch (error) {
      console.error("Workout route error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to retrieve workouts.";

      response.status(500).json({
        message,
      });
    }
  },
);

router.post(
  "/",
  authenticate,
  async (
    request: AuthenticatedRequest,
    response,
  ) => {
    const {
      exerciseName,
      sets,
      reps,
      weight,
      workoutDate,
    } = request.body as CreateWorkoutBody;

    const cleanedExerciseName = exerciseName?.trim();

    if (
      !cleanedExerciseName ||
      !Number.isInteger(sets) ||
      Number(sets) <= 0 ||
      !Number.isInteger(reps) ||
      Number(reps) <= 0 ||
      typeof weight !== "number" ||
      !Number.isFinite(weight) ||
      weight < 0 ||
      !workoutDate
    ) {
      response.status(400).json({
        message: "Please provide valid workout details.",
      });
      return;
    }

    try {
      const userId = await ensureProfile(request);

      const { data, error } = await supabase
        .from("workouts")
        .insert({
          user_id: userId,
          exercise_name: cleanedExerciseName,
          sets,
          reps,
          weight,
          workout_date: workoutDate,
        })
        .select(
          `
            id,
            user_id,
            exercise_name,
            sets,
            reps,
            weight,
            workout_date,
            created_at
          `,
        )
        .single();

      if (error) {
        console.error("Workout creation failed:", error);

        response.status(500).json({
          message: "Unable to save the workout.",
        });
        return;
      }

      response.status(201).json({
        workout: data,
      });
    } catch (error) {
      console.error("Workout route error:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Unable to save the workout.";

      response.status(500).json({
        message,
      });
    }
  },
);

export default router;

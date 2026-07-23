import { Router } from "express";
import { supabase } from "../supabase.js";
import {
  authenticate,
  type AuthenticatedRequest,
} from "../middleware/authenticate.js";

type CreateWorkoutBody = {
  exerciseName?: string;
  sets?: number;
  reps?: number;
  weight?: number;
  workoutDate?: string;
};

const router = Router();

router.post("/", authenticate, async (request: AuthenticatedRequest, response) => {
  const {exerciseName, sets, reps, weight, workoutDate } =
    request.body as CreateWorkoutBody;

  const cleanedExerciseName = exerciseName?.trim();

  if (
    !cleanedExerciseName ||
    typeof sets !== "number" ||
    !Number.isInteger(sets) ||
    sets <= 0 ||
    typeof reps !== "number" ||
    !Number.isInteger(reps) ||
    reps <= 0 ||
    typeof weight !== "number" ||
    weight < 0 ||
    !workoutDate
  ) {
    response.status(400).json({
      message: "Please provide valid workout details.",
    });
    return;
  }

  const { data, error } = await supabase
    .from("workouts")
    .insert({
      exercise_name: cleanedExerciseName,
      sets,
      reps,
      weight,
      workout_date: workoutDate,
    })
    .select()
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
});

router.get("/", authenticate, async (request: AuthenticatedRequest, response) => {
  const userId = request.firebaseUser?.uid;

if (!userId) {
  response.status(401).json({
    message: "Authenticated user could not be identified.",
  });
  return;
}

  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .eq("user_id", userId)
    .order("workout_date", { ascending: false });

  if (error) {
    console.error("Workout retrieval failed:", error);

    response.status(500).json({
      message: "Unable to retrieve workouts.",
    });
    return;
  }

  response.status(200).json({
    workouts: data,
  });
});

export default router;

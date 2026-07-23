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

type ProfileRow = {
  id: string;
  firebase_uid: string | null;
  username: string | null;
};

const router = Router();

async function getOrCreateProfileId(
  request: AuthenticatedRequest,
): Promise<string> {
  const firebaseUid = request.firebaseUser?.uid;
  const email = request.firebaseUser?.email?.trim().toLowerCase();

  if (!firebaseUid) {
    throw new Error("Firebase user could not be identified.");
  }

  const { data: linkedProfile, error: linkedProfileError } =
    await supabase
      .from("profiles")
      .select("id, firebase_uid, username")
      .eq("firebase_uid", firebaseUid)
      .maybeSingle<ProfileRow>();

  if (linkedProfileError) {
    throw new Error(
      `Unable to check linked profile: ${linkedProfileError.message}`,
    );
  }

  if (linkedProfile) {
    return linkedProfile.id;
  }

  if (!email) {
    throw new Error(
      "The authenticated Firebase account does not have an email address.",
    );
  }

  const { data: existingUsersData, error: existingUsersError } =
    await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

  if (existingUsersError) {
    throw new Error(
      `Unable to search existing users: ${existingUsersError.message}`,
    );
  }

  const existingSupabaseUser = existingUsersData.users.find(
    (user) => user.email?.trim().toLowerCase() === email,
  );

  if (existingSupabaseUser) {
    const defaultUsername =
      existingSupabaseUser.user_metadata?.username ??
      existingSupabaseUser.user_metadata?.display_name ??
      email.split("@")[0];

    const { error: profileUpsertError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: existingSupabaseUser.id,
          firebase_uid: firebaseUid,
          username: defaultUsername,
        },
        {
          onConflict: "id",
        },
      );

    if (profileUpsertError) {
      throw new Error(
        `Unable to link existing profile: ${profileUpsertError.message}`,
      );
    }

    return existingSupabaseUser.id;
  }

  const defaultUsername = email.split("@")[0];

  const { data: createdUserData, error: createUserError } =
    await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        username: defaultUsername,
      },
    });

  if (createUserError || !createdUserData.user) {
    throw new Error(
      createUserError?.message ??
        "Unable to create the Supabase database user.",
    );
  }

  const supabaseUserId = createdUserData.user.id;

  const { error: profileCreateError } = await supabase
    .from("profiles")
    .upsert(
      {
        id: supabaseUserId,
        firebase_uid: firebaseUid,
        username: defaultUsername,
      },
      {
        onConflict: "id",
      },
    );

  if (profileCreateError) {
    throw new Error(
      `Unable to create the linked profile: ${profileCreateError.message}`,
    );
  }

  return supabaseUserId;
}

router.get(
  "/",
  authenticate,
  async (
    request: AuthenticatedRequest,
    response,
  ) => {
    try {
      const userId = await getOrCreateProfileId(request);

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
      const userId = await getOrCreateProfileId(request);

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
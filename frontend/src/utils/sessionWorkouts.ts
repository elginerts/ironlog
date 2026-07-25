import type { Workout } from "../components/types";
import type {
  WorkoutSession,
  WorkoutSessionExercise,
} from "../services/workoutSessionsApi";
import { calculateEstimated1RM } from "./personalRecord";

export function flattenWorkoutSessions(
  sessions: WorkoutSession[],
): Workout[] {
  const chronologicalWorkouts = sessions
    .flatMap((session) =>
      session.workout_exercises.map((exercise) => ({
        id: exercise.id,
        exerciseName: exercise.exercise_name,
        sets: exercise.sets,
        reps: exercise.reps,
        weight: exercise.weight,
        date: session.workout_date,
      })),
    )
    .sort(
      (firstWorkout, secondWorkout) =>
        new Date(firstWorkout.date).getTime() -
        new Date(secondWorkout.date).getTime(),
    );

  const bestByExercise = new Map<
    string,
    { weight: number; reps: number; estimated1RM: number }
  >();

  const workoutsWithRecords = chronologicalWorkouts.map((workout) => {
    const exerciseKey = workout.exerciseName.trim().toLowerCase();
    const previousBest = bestByExercise.get(exerciseKey);
    const estimated1RM = calculateEstimated1RM(
      workout.weight,
      workout.reps,
    );
    const personalRecord = {
      weightPR: !previousBest || workout.weight > previousBest.weight,
      repsPR: !previousBest || workout.reps > previousBest.reps,
      estimated1RMPR:
        !previousBest || estimated1RM > previousBest.estimated1RM,
      estimated1RM,
    };

    bestByExercise.set(exerciseKey, {
      weight: Math.max(previousBest?.weight ?? 0, workout.weight),
      reps: Math.max(previousBest?.reps ?? 0, workout.reps),
      estimated1RM: Math.max(
        previousBest?.estimated1RM ?? 0,
        estimated1RM,
      ),
    });

    return {
      ...workout,
      personalRecord,
    };
  });

  return workoutsWithRecords.reverse();
}

export function attachPersonalRecordsToSessions(
  sessions: WorkoutSession[],
  workouts: Workout[],
): WorkoutSession[] {
  const recordsByExerciseId = new Map(
    workouts.map((workout) => [workout.id, workout.personalRecord]),
  );

  return sessions.map((session) => ({
    ...session,
    workout_exercises: session.workout_exercises.map(
      (exercise): WorkoutSessionExercise => ({
        ...exercise,
        personalRecord: recordsByExerciseId.get(exercise.id),
      }),
    ),
  }));
}

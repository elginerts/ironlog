import type { PersonalRecord, Workout } from "../components/types";

export function calculateEstimated1RM(
  weight: number,
  reps: number,
): number {
  if (weight <= 0 || reps <= 0) {
    return 0;
  }

  if (reps === 1) {
    return weight;
  }

  return Number((weight * (1 + reps / 30)).toFixed(1));
}

export function detectPersonalRecord(
  workout: Workout,
  previousWorkouts: Workout[],
): PersonalRecord {
  const sameExerciseWorkouts = previousWorkouts.filter(
    (previousWorkout) =>
      previousWorkout.exerciseName.trim().toLowerCase() ===
      workout.exerciseName.trim().toLowerCase(),
  );

  const estimated1RM = calculateEstimated1RM(
    Number(workout.weight),
    Number(workout.reps),
  );

  if (sameExerciseWorkouts.length === 0) {
    return {
      weightPR: true,
      repsPR: true,
      estimated1RMPR: true,
      estimated1RM,
    };
  }

  const previousHighestWeight = Math.max(
    ...sameExerciseWorkouts.map((previousWorkout) =>
      Number(previousWorkout.weight),
    ),
  );

  const previousHighestReps = Math.max(
    ...sameExerciseWorkouts.map((previousWorkout) =>
      Number(previousWorkout.reps),
    ),
  );

  const previousHighestEstimated1RM = Math.max(
    ...sameExerciseWorkouts.map((previousWorkout) =>
      calculateEstimated1RM(
        Number(previousWorkout.weight),
        Number(previousWorkout.reps),
      ),
    ),
  );

  return {
    weightPR: Number(workout.weight) > previousHighestWeight,
    repsPR: Number(workout.reps) > previousHighestReps,
    estimated1RMPR: estimated1RM > previousHighestEstimated1RM,
    estimated1RM,
  };
}

export function isAnyPersonalRecord(
  personalRecord: PersonalRecord,
): boolean {
  return (
    personalRecord.weightPR ||
    personalRecord.repsPR ||
    personalRecord.estimated1RMPR
  );
}
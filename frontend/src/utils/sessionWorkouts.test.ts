import { describe, expect, it } from "vitest";
import {
  attachPersonalRecordsToSessions,
  flattenWorkoutSessions,
} from "./sessionWorkouts";
import type { WorkoutSession } from "../services/workoutSessionsApi";

const sessions: WorkoutSession[] = [
  {
    id: "session-2",
    title: "Heavy Day",
    workout_date: "2026-07-02",
    created_at: "2026-07-02T10:00:00Z",
    workout_exercises: [
      {
        id: "exercise-2",
        exercise_name: "Squat",
        exercise_order: 1,
        sets: 3,
        reps: 5,
        weight: 110,
      },
    ],
  },
  {
    id: "session-1",
    title: "First Day",
    workout_date: "2026-07-01",
    created_at: "2026-07-01T10:00:00Z",
    workout_exercises: [
      {
        id: "exercise-1",
        exercise_name: "Squat",
        exercise_order: 1,
        sets: 3,
        reps: 5,
        weight: 100,
      },
    ],
  },
];

describe("session workout conversion", () => {
  it("uses session exercises for progress and PR data", () => {
    const workouts = flattenWorkoutSessions(sessions);

    expect(workouts.map((workout) => workout.id)).toEqual([
      "exercise-2",
      "exercise-1",
    ]);
    expect(workouts[0].personalRecord?.weightPR).toBe(true);
    expect(workouts[1].personalRecord?.weightPR).toBe(true);
  });

  it("attaches detected records back to workout log exercises", () => {
    const workouts = flattenWorkoutSessions(sessions);
    const sessionsWithRecords = attachPersonalRecordsToSessions(
      sessions,
      workouts,
    );

    expect(
      sessionsWithRecords[0].workout_exercises[0].personalRecord?.weightPR,
    ).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import type { WorkoutSession } from "../services/workoutSessionsApi";
import { calculateWorkoutStreak } from "./workoutStreak";

function session(id: string, workoutDate: string): WorkoutSession {
  return {
    id,
    title: "Workout",
    workout_date: workoutDate,
    created_at: `${workoutDate}T10:00:00Z`,
    workout_exercises: [],
  };
}

describe("calculateWorkoutStreak", () => {
  it("calculates current and longest daily streaks", () => {
    const sessions = [
      session("1", "2026-07-20"),
      session("2", "2026-07-21"),
      session("3", "2026-07-24"),
      session("4", "2026-07-25"),
      session("5", "2026-07-26"),
    ];

    expect(
      calculateWorkoutStreak(sessions, new Date("2026-07-26T12:00:00")),
    ).toEqual({ current: 3, longest: 3 });
  });

  it("counts only one workout per day and expires an old streak", () => {
    const sessions = [
      session("1", "2026-07-20"),
      session("2", "2026-07-20"),
      session("3", "2026-07-21"),
    ];

    expect(
      calculateWorkoutStreak(sessions, new Date("2026-07-26T12:00:00")),
    ).toEqual({ current: 0, longest: 2 });
  });
});

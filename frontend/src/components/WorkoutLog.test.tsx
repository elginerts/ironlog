import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import WorkoutLog from "./WorkoutLog";

describe("WorkoutLog", () => {
  const mockSessions = [
    {
      id: "session-1",
      title: "Upper Body",
      workout_date: "2026-07-23",
      created_at: "2026-07-23T10:00:00.000Z",
      workout_exercises: [
        {
          id: "exercise-1",
          exercise_name: "Bench Press",
          exercise_order: 1,
          sets: 3,
          reps: 8,
          weight: 60,
        },
        {
          id: "exercise-2",
          exercise_name: "Incline Bench Press",
          exercise_order: 2,
          sets: 3,
          reps: 10,
          weight: 50,
        },
      ],
    },
  ];

  it("renders a workout session", () => {
    render(
      <WorkoutLog
        sessions={mockSessions}
        isLoading={false}
        onShareSession={vi.fn()}
        onShareExercise={vi.fn()}
      />,
    );

    expect(screen.getByText("Upper Body")).toBeInTheDocument();
    expect(screen.getByText("2 exercises")).toBeInTheDocument();
  });

  it("expands the session and shows exercises", () => {
    render(
      <WorkoutLog
        sessions={mockSessions}
        isLoading={false}
        onShareSession={vi.fn()}
        onShareExercise={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /upper body/i }));

    expect(screen.getByText("Bench Press")).toBeInTheDocument();
    expect(
      screen.getByText("Incline Bench Press"),
    ).toBeInTheDocument();
  });

  it("shares the entire workout session", () => {
    const mockShareSession = vi.fn().mockResolvedValue(undefined);

    render(
      <WorkoutLog
        sessions={mockSessions}
        isLoading={false}
        onShareSession={mockShareSession}
        onShareExercise={vi.fn()}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Share Session" }),
    );

    expect(mockShareSession).toHaveBeenCalledWith(
      mockSessions[0],
    );
  });

  it("shares one exercise from the session", () => {
    const mockShareExercise = vi.fn().mockResolvedValue(undefined);

    render(
      <WorkoutLog
        sessions={mockSessions}
        isLoading={false}
        onShareSession={vi.fn()}
        onShareExercise={mockShareExercise}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /upper body/i }));

    const shareExerciseButtons = screen.getAllByRole("button", {
      name: "Share Exercise",
    });

    fireEvent.click(shareExerciseButtons[0]);

    expect(mockShareExercise).toHaveBeenCalledWith(
      mockSessions[0],
      mockSessions[0].workout_exercises[0],
    );
  });
});
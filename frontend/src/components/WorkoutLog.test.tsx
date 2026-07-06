import { render, screen } from "@testing-library/react";
import WorkoutLog from "./WorkoutLog";
import { describe, it, expect, vi } from "vitest";

describe("WorkoutLog", () => {
    const mockShareWorkout = vi.fn()

    it("renders workout details", () => {
        const mockDetails = [
            {
                exerciseName: "Bench Press",
                sets: 3,
                reps: 12,
                weight: 60,
                date: "2026-07-07",
            }
        ];
    

        render(<WorkoutLog workouts={mockDetails} onShareWorkout={mockShareWorkout} />);

        expect(screen.getByText(/Workout Log/i)).toBeInTheDocument();
        expect(screen.getByText(/Bench Press/i)).toBeInTheDocument();
        expect(screen.getByText(/2026-07-07/i)).toBeInTheDocument();
        expect(screen.getByText(/3 sets × 12 reps @ 60kg/i)).toBeInTheDocument();
        expect(screen.getByRole("button", {name:/Share to Feed/i})).toBeInTheDocument();
    
    });

});
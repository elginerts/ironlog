import { render, screen} from "@testing-library/react";
import WorkoutForm from "./WorkoutForm";
import { describe, it , expect } from "vitest";
import userEvent from "@testing-library/user-event";

describe("WorkoutForm", () => {
    it("renders the workout form's input fields", () => {
        render(<WorkoutForm onAddWorkout={() => {}} />);

        expect(screen.getByText(/Save Workout/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Exercise name")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Sets")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Reps")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Weight (kg)")).toBeInTheDocument();


    });

    it("allows the user to type in workout details into field", async() => {
        const user = userEvent.setup();
        render(<WorkoutForm onAddWorkout={() => {}} />);

        const exerciseInput = screen.getByPlaceholderText("Exercise name");
        const setsInput = screen.getByPlaceholderText("Sets");
        const repsInput = screen.getByPlaceholderText("Reps");
        const weightInput = screen.getByPlaceholderText("Weight (kg)");

        await user.type(exerciseInput, "Bench Press");
        await user.type(setsInput, "3");
        await user.type(repsInput, "12");
        await user.type(weightInput, "60");

        expect(exerciseInput).toHaveValue("Bench Press");
        expect(setsInput).toHaveValue(3);
        expect(repsInput).toHaveValue(12);
        expect(weightInput).toHaveValue(60);

    });

    it("calls onAddWorkout when the form is submitted", async() => {
        const user = userEvent.setup();
        const mockAddWorkout = vi.fn();

        render(<WorkoutForm onAddWorkout={mockAddWorkout} />);

        await user.type(screen.getByPlaceholderText("Exercise name"), "Bench Press");
        await user.type(screen.getByPlaceholderText("Sets"), "3");
        await user.type(screen.getByPlaceholderText("Reps"), "12");
        await user.type(screen.getByPlaceholderText("Weight (kg)"), "60");

        await user.click(screen.getByText("Save Workout"));

        expect(mockAddWorkout).toHaveBeenCalledTimes(1);

        expect(mockAddWorkout).toHaveBeenCalledWith(
            expect.objectContaining({
                exerciseName: "Bench Press",
                sets: 3,
                reps: 12,
                weight: 60,
            })
        )
    });
});
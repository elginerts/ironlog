import { render, screen} from "@testing-library/react";
import WorkoutForm from "./WorkoutForm";
import { describe, it , expect } from "vitest";

describe("WorkoutForm", () => {
    it("renders the workout form", () => {
        render(<WorkoutForm onAddWorkout={() => {}} />);

        expect(screen.getByText(/Save Workout/i)).toBeInTheDocument();

    });
})
import { describe, it, expect } from "vitest";
import { calculateWorkoutVolume, isValidWorkoutInput } from "./workoutUtils";

describe("calculateWorkoutVolume", () => {
    it("calculates workout volume correctly", () => {
        expect(calculateWorkoutVolume(3, 10, 50)).toBe(1500);
    });

    it("returns 0 when weight is 0", () => {
        expect(calculateWorkoutVolume(3, 10, 0)).toBe(0);
    });

});

describe("isValidWorkoutInput", () => {
    it("returns true for valid workout input", () => {
        expect(isValidWorkoutInput("Bench Press", 3, 12, 60)).toBe(true);
    });

    it("returns false if exercise name is empty", () => {
        expect(isValidWorkoutInput("", 3, 12, 60)).toBe(false);
    });

    it("returns false if exercise name only has spaces", () => {
        expect(isValidWorkoutInput("   ", 3, 12, 60)).toBe(false);
    });    

    it("returns false if no. of sets is zero", () => {
        expect(isValidWorkoutInput("Squat", 0, 12, 60)).toBe(false);
    });        

    it("returns false if reps are negative", () => {
        expect(isValidWorkoutInput("Squat", 3, -2, 60)).toBe(false);
    });

    it("returns true if weight is 0 for bodyweight exercises", () => {
        expect(isValidWorkoutInput("Push Ups", 1, 100, 0)).toBe(true);
    });     

});


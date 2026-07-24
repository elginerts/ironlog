import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

const mocks = vi.hoisted(() => ({
  firebaseAuth: {
    currentUser: null as null | { email: string | null },
  },
  onAuthStateChanged: vi.fn(),
  signOut: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
  supabaseGetUser: vi.fn(),
  supabaseFrom: vi.fn(),
  fetchWorkoutSessions: vi.fn(),
  createWorkoutThroughApi: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: mocks.onAuthStateChanged,
  signOut: mocks.signOut,
  signInWithEmailAndPassword: mocks.signInWithEmailAndPassword,
  createUserWithEmailAndPassword: mocks.createUserWithEmailAndPassword,
  updateProfile: mocks.updateProfile,
}));

vi.mock("./utils/firebase", () => ({
  firebaseAuth: mocks.firebaseAuth,
}));

vi.mock("./utils/supabase", () => ({
  supabase: {
    auth: {
      getUser: mocks.supabaseGetUser,
    },
    from: mocks.supabaseFrom,
  },
}));

vi.mock("./services/workoutSessionsApi", () => ({
  fetchWorkoutSessions: mocks.fetchWorkoutSessions,
}));

vi.mock("./pages/WorkoutsPage", () => ({
  default: () => (
    <section>
      <h2>Workouts Page</h2>
    </section>
  ),
}));

describe("App workout API auth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("alert", vi.fn());

    mocks.firebaseAuth.currentUser = { email: "athlete@example.com" };
    mocks.onAuthStateChanged.mockImplementation((_auth, callback) => {
      callback(mocks.firebaseAuth.currentUser);
      return vi.fn();
    });
    mocks.fetchWorkoutSessions.mockResolvedValue([
      {
        id: "session-1",
        title: "Leg Day",
        workout_date: "2026-07-22",
        created_at: "2026-07-22T00:00:00.000Z",
        workout_exercises: [
          {
            id: "workout-1",
            exercise_name: "Squat",
            exercise_order: 0,
            sets: 3,
            reps: 5,
            weight: 120,
          },
        ],
      },
    ]);
    mocks.createWorkoutThroughApi.mockResolvedValue({
      id: "workout-2",
      exercise_name: "Bench Press",
      sets: 3,
      reps: 5,
      weight: 100,
      workout_date: "2026-07-23",
    });
  });

  it("fetches workouts through the Firebase-authenticated API without Supabase getUser", async () => {
    render(<App />);

    await waitFor(() => {
      expect(mocks.fetchWorkoutSessions).toHaveBeenCalled();
    });

    expect(mocks.supabaseGetUser).not.toHaveBeenCalled();
  });

})

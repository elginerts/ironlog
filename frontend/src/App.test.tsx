import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

const mocks = vi.hoisted(() => ({
  supabaseGetSession: vi.fn(),
  supabaseOnAuthStateChange: vi.fn(),
  supabaseSignOut: vi.fn(),
  supabaseFrom: vi.fn(),
  fetchWorkoutsFromApi: vi.fn(),
  createWorkoutThroughApi: vi.fn(),
}));

vi.mock("./utils/supabase", () => ({
  supabase: {
    auth: {
      getSession: mocks.supabaseGetSession,
      onAuthStateChange: mocks.supabaseOnAuthStateChange,
      signOut: mocks.supabaseSignOut,
    },
    from: mocks.supabaseFrom,
  },
}));

vi.mock("./services/workoutApi", () => ({
  fetchWorkoutsFromApi: mocks.fetchWorkoutsFromApi,
  createWorkoutThroughApi: mocks.createWorkoutThroughApi,
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

    mocks.supabaseGetSession.mockResolvedValue({
      data: {
        session: {
          access_token: "test-token",
          user: { email: "athlete@example.com" },
        },
      },
      error: null,
    });
    mocks.supabaseOnAuthStateChange.mockReturnValue({
      data: {
        subscription: { unsubscribe: vi.fn() },
      },
    });
    mocks.fetchWorkoutsFromApi.mockResolvedValue([
      {
        id: "workout-1",
        exercise_name: "Squat",
        sets: 3,
        reps: 5,
        weight: 120,
        workout_date: "2026-07-22",
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

  it("fetches workouts through the Supabase-authenticated API", async () => {
    render(<App />);

    await waitFor(() => {
      expect(mocks.fetchWorkoutsFromApi).toHaveBeenCalled();
    });

    expect(mocks.supabaseGetSession).toHaveBeenCalled();
  });

})

import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

const mocks = vi.hoisted(() => ({
  supabaseGetSession: vi.fn(),
  supabaseOnAuthStateChange: vi.fn(),
  supabaseSignOut: vi.fn(),
  supabaseFrom: vi.fn(),
  fetchWorkoutSessions: vi.fn(),
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
    mocks.fetchWorkoutSessions.mockResolvedValue([
      {
        id: "session-1",
        title: "Leg Day",
        workout_date: "2026-07-22",
        created_at: "2026-07-22T10:00:00Z",
        workout_exercises: [
          {
            id: "exercise-1",
            exercise_name: "Squat",
            exercise_order: 1,
            sets: 3,
            reps: 5,
            weight: 120,
          },
        ],
      },
    ]);
  });

  it("fetches workout sessions through the authenticated API", async () => {
    render(<App />);

    await waitFor(() => {
      expect(mocks.fetchWorkoutSessions).toHaveBeenCalled();
    });

    expect(mocks.supabaseGetSession).toHaveBeenCalled();
  });

})

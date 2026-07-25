import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SocialFeed from "./SocialFeed";

const mocks = vi.hoisted(() => ({
  fetchFeedPosts: vi.fn(),
  togglePostLike: vi.fn(),
  addPostComment: vi.fn(),
  getUser: vi.fn(),
}));

vi.mock("../services/socialApi", () => ({
  fetchFeedPosts: mocks.fetchFeedPosts,
  togglePostLike: mocks.togglePostLike,
  addPostComment: mocks.addPostComment,
}));

vi.mock("../utils/supabase", () => ({
  supabase: {
    auth: {
      getUser: mocks.getUser,
    },
  },
}));

const post = {
  id: "post-1",
  user_id: "owner-1",
  session_id: "session-1",
  exercise_name: null,
  sets: null,
  reps: null,
  weight: null,
  workout_date: "2026-07-26",
  caption: "Strong session",
  has_personal_record: true,
  created_at: "2026-07-26T10:00:00Z",
  profiles: { username: "elgin" },
  workout_sessions: {
    title: "Upper Body",
    workout_exercises: [
      {
        id: "exercise-1",
        exercise_name: "Bench Press",
        exercise_order: 1,
        sets: 3,
        reps: 5,
        weight: 80,
      },
    ],
  },
  post_likes: [],
  post_comments: [],
};

describe("SocialFeed", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
    });
    mocks.fetchFeedPosts.mockResolvedValue([post]);
    mocks.togglePostLike.mockResolvedValue(undefined);
    mocks.addPostComment.mockResolvedValue(undefined);
  });

  it("shows a published session and allows likes", async () => {
    render(<SocialFeed />);

    expect(await screen.findByText("Upper Body")).toBeInTheDocument();
    expect(screen.getByText("Bench Press")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "♡ Like 0" }));

    await waitFor(() => {
      expect(mocks.togglePostLike).toHaveBeenCalledWith("post-1", false);
    });
  });

  it("submits a comment", async () => {
    render(<SocialFeed />);
    await screen.findByText("Upper Body");

    fireEvent.change(screen.getByPlaceholderText("Write a comment"), {
      target: { value: "Great work" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Comment" }));

    await waitFor(() => {
      expect(mocks.addPostComment).toHaveBeenCalledWith(
        "post-1",
        "Great work",
      );
    });
  });
});

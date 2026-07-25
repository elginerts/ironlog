import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import {
  addPostComment,
  fetchFeedPosts,
  togglePostLike,
  type FeedPost,
} from "../services/socialApi";

type FetchPostsOptions = {
  shouldUpdate?: () => boolean;
};

function SocialFeed() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [commentDrafts, setCommentDrafts] = useState<
    Record<string, string>
  >({});
  const [errorMessage, setErrorMessage] = useState("");

  async function fetchPosts({
    shouldUpdate = () => true,
  }: FetchPostsOptions = {}) {
    if (!shouldUpdate()) {
      return;
    }

    setLoading(true);

    try {
      const data = await fetchFeedPosts();

      if (shouldUpdate()) {
        setPosts(data);
      }
    } catch (error) {
      if (shouldUpdate()) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load the social feed.",
        );
      }
    } finally {
      if (shouldUpdate()) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    let isMounted = true;

    void supabase.auth.getUser().then(({ data }) => {
      if (isMounted) {
        setCurrentUserId(data.user?.id ?? null);
      }
    });

    void Promise.resolve().then(() => {
      if (!isMounted) {
        return;
      }

      void fetchPosts({ shouldUpdate: () => isMounted });
    });

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleLike(post: FeedPost) {
    const isLiked = post.post_likes.some(
      (like) => like.user_id === currentUserId,
    );

    try {
      await togglePostLike(post.id, isLiked);
      await fetchPosts();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to update like.",
      );
    }
  }

  async function handleComment(postId: string) {
    try {
      await addPostComment(postId, commentDrafts[postId] ?? "");
      setCommentDrafts((current) => ({ ...current, [postId]: "" }));
      await fetchPosts();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to add comment.",
      );
    }
  }

  if (loading) {
    return (
      <section className="card social-feed-card">
        <div className="feed-header">
          <div>
            <span className="feed-kicker">Community</span>
            <h2>Social Workout Feed</h2>
            <p>See workouts shared by the IRONLOG community.</p>
          </div>
        </div>
        <p>Loading posts...</p>
      </section>
    );
  }

  return (
    <section className="card social-feed-card">
      <div className="feed-header">
        <div>
          <span className="feed-kicker">Community</span>
          <h2>Social Workout Feed</h2>
          <p>See workouts shared by the IRONLOG community.</p>
        </div>
        <span className="feed-post-count">
          {posts.length} {posts.length === 1 ? "workout" : "workouts"}
        </span>
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {posts.length === 0 ? (
        <p>No shared workouts yet.</p>
      ) : (
        <div className="feed-list">
          {posts.map((post) => (
            <div className="feed-post" key={post.id}>
              <div className="feed-post-top">
                <div className="feed-user-info">
                  <div className="feed-avatar-placeholder">
                    {(post.profiles?.username || "U").charAt(0).toUpperCase()}
                  </div>

                  <p className="feed-user">
                    {post.profiles?.username || "Unknown User"}
                  </p>
                </div>

                <p className="feed-date">
                  {new Date(
                    `${post.workout_date}T00:00:00`,
                  ).toLocaleDateString("en-SG", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              
              {post.caption && <p className="feed-caption">{post.caption}</p>}

              {post.has_personal_record && (
                <span className="feed-pr-label">★ Personal Record</span>
              )}

              {post.workout_sessions ? (
                <>
                  <h3 className="feed-exercise">
                    {post.workout_sessions.title}
                  </h3>
                  <div className="feed-workout-list">
                    {post.workout_sessions.workout_exercises.map((exercise) => (
                      <div className="feed-details" key={exercise.id}>
                        <strong>{exercise.exercise_name}</strong>
                        <span>
                          {exercise.sets} × {exercise.reps} @{" "}
                          {exercise.weight}kg
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="feed-exercise">{post.exercise_name}</h3>
                  <p className="feed-details">
                    {post.sets} sets × {post.reps} reps @ {post.weight}kg
                  </p>
                </>
              )}

              <div className="feed-actions">
                <button
                  type="button"
                  className={
                    post.post_likes.some(
                      (like) => like.user_id === currentUserId,
                    )
                      ? "feed-like-button liked"
                      : "feed-like-button"
                  }
                  onClick={() => void handleLike(post)}
                  disabled={!currentUserId}
                >
                  {post.post_likes.some(
                    (like) => like.user_id === currentUserId,
                  )
                    ? "♥ Liked"
                    : "♡ Like"}{" "}
                  <span>{post.post_likes.length}</span>
                </button>
              </div>

              <div className="feed-comments">
                {post.post_comments.map((comment) => (
                  <div className="feed-comment" key={comment.id}>
                    <span className="comment-avatar">
                      {(comment.profiles?.username ?? "I")
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                    <p>
                      <strong>
                        {comment.profiles?.username ?? "IronLog User"}
                      </strong>
                      {comment.body}
                    </p>
                  </div>
                ))}

                {currentUserId ? (
                  <div className="feed-comment-form">
                    <input
                      type="text"
                      maxLength={500}
                      placeholder="Write a comment"
                      value={commentDrafts[post.id] ?? ""}
                      onChange={(event) =>
                        setCommentDrafts((current) => ({
                          ...current,
                          [post.id]: event.target.value,
                        }))
                      }
                    />
                    <button
                      type="button"
                      disabled={!(commentDrafts[post.id] ?? "").trim()}
                      onClick={() => void handleComment(post.id)}
                    >
                      Comment
                    </button>
                  </div>
                ) : (
                  <p>Log in to like or comment.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default SocialFeed;

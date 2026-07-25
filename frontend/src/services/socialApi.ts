import { supabase } from "../utils/supabase";

export type FeedComment = {
  id: string;
  user_id: string;
  body: string;
  created_at: string;
  profiles: {
    username: string;
  } | null;
};

export type FeedPost = {
  id: string;
  user_id: string;
  session_id: string | null;
  exercise_name: string | null;
  sets: number | null;
  reps: number | null;
  weight: number | null;
  workout_date: string;
  caption: string | null;
  has_personal_record: boolean;
  created_at: string;
  profiles: {
    username: string;
  } | null;
  workout_sessions: {
    title: string;
    workout_exercises: Array<{
      id: string;
      exercise_name: string;
      exercise_order: number;
      sets: number;
      reps: number;
      weight: number;
    }>;
  } | null;
  post_likes: Array<{
    user_id: string;
  }>;
  post_comments: FeedComment[];
};

async function requireUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    throw new Error("Please log in to use the social feed.");
  }
  return data.user;
}

export async function publishSession(
  sessionId: string,
  workoutDate: string,
  caption: string,
  hasPersonalRecord: boolean,
) {
  const user = await requireUser();
  const { error } = await supabase.from("workout_posts").insert({
    user_id: user.id,
    session_id: sessionId,
    workout_date: workoutDate,
    caption: caption.trim() || null,
    has_personal_record: hasPersonalRecord,
    visibility: "public",
  });

  if (error) {
    if (error.code === "23505") {
      throw new Error("This workout is already on the feed.");
    }
    throw new Error(error.message);
  }
}

export async function fetchFeedPosts(): Promise<FeedPost[]> {
  const { data, error } = await supabase
    .from("workout_posts")
    .select(`
      id,
      user_id,
      session_id,
      exercise_name,
      sets,
      reps,
      weight,
      workout_date,
      caption,
      has_personal_record,
      created_at,
      workout_sessions (
        title,
        workout_exercises (
          id,
          exercise_name,
          exercise_order,
          sets,
          reps,
          weight
        )
      ),
      post_likes ( user_id ),
      post_comments (
        id,
        user_id,
        body,
        created_at,
        profiles!post_comments_user_id_fkey ( username )
      )
    `)
    .eq("visibility", "public")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  const posts = (data ?? []) as unknown as Array<
    Omit<FeedPost, "profiles">
  >;
  const userIds = Array.from(new Set(posts.map((post) => post.user_id)));
  const { data: profileData, error: profileError } = userIds.length
    ? await supabase
        .from("profiles")
        .select("id, username")
        .in("id", userIds)
    : { data: [], error: null };

  if (profileError) throw new Error(profileError.message);

  const usernames = new Map(
    (profileData ?? []).map((profile) => [
      profile.id,
      { username: profile.username },
    ]),
  );

  return posts.map((post) => ({
    ...post,
    profiles: usernames.get(post.user_id) ?? null,
    workout_sessions: post.workout_sessions
      ? {
          ...post.workout_sessions,
          workout_exercises: [
            ...post.workout_sessions.workout_exercises,
          ].sort(
            (first, second) =>
              first.exercise_order - second.exercise_order,
          ),
        }
      : null,
    post_comments: [...post.post_comments].sort(
      (first, second) =>
        new Date(first.created_at).getTime() -
        new Date(second.created_at).getTime(),
    ),
  }));
}

export async function togglePostLike(postId: string, isLiked: boolean) {
  const user = await requireUser();
  const query = isLiked
    ? supabase
        .from("post_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id)
    : supabase.from("post_likes").insert({
        post_id: postId,
        user_id: user.id,
      });

  const { error } = await query;
  if (error) throw new Error(error.message);
}

export async function addPostComment(postId: string, body: string) {
  const user = await requireUser();
  const cleanedBody = body.trim();
  if (!cleanedBody) throw new Error("Comment cannot be empty.");

  const { error } = await supabase.from("post_comments").insert({
    post_id: postId,
    user_id: user.id,
    body: cleanedBody,
  });

  if (error) throw new Error(error.message);
}

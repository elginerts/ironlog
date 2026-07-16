import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

type WorkoutPost = {
  id: string;
  user_id: string;
  exercise_name: string;
  sets: number;
  reps: number;
  weight: number;
  workout_date: string;
  caption: string | null;
  visibility: string;
  created_at: string;
  profiles: {
    username: string; 
  } | null;   
};

type FetchPostsOptions = {
  shouldUpdate?: () => boolean;
};

function SocialFeed() {
  const [posts, setPosts] = useState<WorkoutPost[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchPosts({
    shouldUpdate = () => true,
  }: FetchPostsOptions = {}) {
    if (!shouldUpdate()) {
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("workout_posts")
      .select(`*, profiles ( username )`)
      .eq("visibility", "public")
      .order("created_at", { ascending: false });

    if (!shouldUpdate()) {
      return;
    }

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setPosts(data || []);
    setLoading(false);
  }

  useEffect(() => {
    let isMounted = true;

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

  if (loading) {
    return (
      <section className="card">
        <h2>Social Workout Feed</h2>
        <p>Loading posts...</p>
      </section>
    );
  }

  return (
    <section className="card">
      <div className="feed-header">
        <h2>Social Workout Feed</h2>
        <p>See workouts shared by the IRONLOG community.</p>
      </div>

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
                    User: {post.profiles?.username || "Unknown User"}
                  </p>
                </div>

                <p className="feed-date">{post.workout_date}</p>
              </div>
              
              {post.caption && <p className="feed-caption">{post.caption}</p>}

              <h3 className="feed-exercise">{post.exercise_name}</h3>

              <p className="feed-details">
                {post.sets} sets × {post.reps} reps @ {post.weight}kg
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default SocialFeed;

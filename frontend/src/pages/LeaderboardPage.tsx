import { useEffect, useMemo, useState } from "react";
import { supabase } from "../utils/supabase";

type LeaderboardMetric = "workouts" | "volume";

type LeaderboardEntry = {
  user_id: string;
  username: string;
  workout_count: number;
  total_volume: number;
};

type LeaderboardRpcRow = {
  user_id: string;
  username: string | null;
  workout_count: number | string;
  total_volume: number | string;
};

function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [selectedMetric, setSelectedMetric] =
    useState<LeaderboardMetric>("workouts");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadLeaderboard() {
      setIsLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase.rpc(
        "get_workout_leaderboard",
      );

      if (!isMounted) {
        return;
      }

      if (error) {
        console.error("Leaderboard error:", error);
        setErrorMessage("Unable to load the leaderboard.");
        setIsLoading(false);
        return;
      }

      const formattedEntries: LeaderboardEntry[] = 
        ((data ?? []) as LeaderboardRpcRow[]
      ).map((entry) => ({
          user_id: entry.user_id,
          username: entry.username ?? "IronLog User",
          workout_count: Number(entry.workout_count),
          total_volume: Number(entry.total_volume),
        }));

      setEntries(formattedEntries);
      setIsLoading(false);
    }

    void loadLeaderboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const rankedEntries = useMemo(() => {
    return [...entries].sort((firstEntry, secondEntry) => {
      if (selectedMetric === "volume") {
        return secondEntry.total_volume - firstEntry.total_volume;
      }

      return secondEntry.workout_count - firstEntry.workout_count;
    });
  }, [entries, selectedMetric]);

  function displayRank(rank: number) {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";

    return `#${rank}`;
  }

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-header">
        <div>
          <h1>Leaderboard</h1>
          <p>
            Community rankings based on workout consistency and total
            training volume.
          </p>
        </div>

        <div className="leaderboard-filter">
          <label htmlFor="leaderboard-metric">Rank by:</label>

          <select
            id="leaderboard-metric"
            value={selectedMetric}
            onChange={(event) =>
              setSelectedMetric(
                event.target.value as LeaderboardMetric,
              )
            }
          >
            <option value="workouts">Most Workouts</option>
            <option value="volume">Highest Training Volume</option>
          </select>
        </div>
      </div>

      {isLoading && <p>Loading leaderboard...</p>}

      {errorMessage && (
        <p className="error-message">{errorMessage}</p>
      )}

      {!isLoading &&
        !errorMessage &&
        rankedEntries.length === 0 && (
          <p>No leaderboard results yet.</p>
        )}

      {!isLoading &&
        !errorMessage &&
        rankedEntries.length > 0 && (
          <div className="leaderboard-card">
            <div className="leaderboard-row leaderboard-table-header">
              <span>Rank</span>
              <span>User</span>
              <span>Workouts</span>
              <span>Total Volume</span>
            </div>

            {rankedEntries.map((entry, index) => (
              <div
                className="leaderboard-row"
                key={entry.user_id}
              >
                <span className="leaderboard-rank">
                  {displayRank(index + 1)}
                </span>

                <strong>{entry.username}</strong>

                <span>{entry.workout_count}</span>

                <span>
                  {entry.total_volume.toLocaleString()} kg
                </span>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

export default LeaderboardPage;
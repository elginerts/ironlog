import { useState } from "react";
import type { WorkoutSession } from "../services/workoutSessionsApi";

type WorkoutLogProps = {
  sessions: WorkoutSession[];
  isLoading: boolean;
};

function WorkoutLog({
  sessions,
  isLoading,
}: WorkoutLogProps) {
  const [expandedSessionId, setExpandedSessionId] = useState<
    string | null
  >(null);

  function toggleSession(sessionId: string) {
    setExpandedSessionId((currentId) =>
      currentId === sessionId ? null : sessionId,
    );
  }

  if (isLoading) {
    return (
      <section className="card">
        <h2>Workout Log</h2>
        <p>Loading workout sessions...</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2>Workout Log</h2>

      {sessions.length === 0 ? (
        <p>No workout sessions logged yet.</p>
      ) : (
        <div className="workout-session-list">
          {sessions.map((session) => {
            const isExpanded =
              expandedSessionId === session.id;

            return (
              <div
                className="workout-session-log-card"
                key={session.id}
              >
                <button
                  type="button"
                  className="workout-session-header"
                  onClick={() => toggleSession(session.id)}
                  aria-expanded={isExpanded}
                >
                  <div>
                    <h3>{session.title}</h3>
                    <p>{session.workout_date}</p>
                  </div>

                  <div className="workout-session-summary">
                    <span>
                      {session.workout_exercises.length}{" "}
                      {session.workout_exercises.length === 1
                        ? "exercise"
                        : "exercises"}
                    </span>

                    <span>{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="workout-session-exercises">
                    {session.workout_exercises.map(
                      (exercise) => (
                        <div
                          className="session-log-exercise"
                          key={exercise.id}
                        >
                          <strong>
                            {exercise.exercise_name}
                          </strong>

                          <div className="session-log-stats">
                            <span>
                              {exercise.sets} sets
                            </span>
                            <span>
                              {exercise.reps} reps
                            </span>
                            <span>
                              {exercise.weight} kg
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default WorkoutLog;
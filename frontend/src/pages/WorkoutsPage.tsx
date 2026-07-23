import { useCallback, useEffect, useState } from "react";
import WorkoutLog from "../components/WorkoutLog";
import WorkoutSessionForm from "../components/WorkoutSessionForm";
import {
  fetchWorkoutSessions,
  type WorkoutSession,
} from "../services/workoutSessionsApi";

function WorkoutsPage() {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadSessions = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const loadedSessions = await fetchWorkoutSessions();
      setSessions(loadedSessions);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to load workout sessions.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  return (
    <div>
      <WorkoutSessionForm onSessionSaved={loadSessions} />

      {errorMessage && (
        <p className="error-message">{errorMessage}</p>
      )}

      <WorkoutLog
        sessions={sessions}
        isLoading={isLoading}
      />
    </div>
  );
}

export default WorkoutsPage;
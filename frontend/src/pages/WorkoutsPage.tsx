import { useCallback, useEffect, useState } from "react";
import WorkoutLog from "../components/WorkoutLog";
import WorkoutSessionForm from "../components/WorkoutSessionForm";
import {
  fetchWorkoutSessions,
  type WorkoutSession,
  type WorkoutSessionExercise,
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

  async function shareWorkoutSession(
    session: WorkoutSession,
  ): Promise<void> {
    const exerciseSummary = session.workout_exercises
      .map(
        (exercise) =>
          `${exercise.exercise_name}: ${exercise.sets} sets × ${exercise.reps} reps at ${exercise.weight} kg`,
      )
      .join("\n");

    const shareText = `${session.title}
    ${session.workout_date}
    
    ${exerciseSummary}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: session.title,
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert("Workout session copied to clipboard.");
      }
    } catch (error) {
      console.error("Unable to share workout session:", error);
    }
  }

  async function shareExerciseFromSession(
    session: WorkoutSession,
    exercise: WorkoutSessionExercise,
  ): Promise<void> {
    const shareText = `${session.title}
    ${session.workout_date}

    ${exercise.exercise_name}
    ${exercise.sets} sets × ${exercise.reps} reps
    ${exercise.weight} kg`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${session.title} - ${exercise.exercise_name}`,
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        alert("Exercise copied to clipboard.");
      }
    } catch (error) {
      console.error("Unable to share exercise:", error);
    }
  }

  return (
    <div>
      <WorkoutSessionForm onSessionSaved={loadSessions} />

      {errorMessage && (
        <p className="error-message">{errorMessage}</p>
      )}

      <WorkoutLog
        sessions={sessions}
        isLoading={isLoading}
        onShareSession={shareWorkoutSession}
        onShareExercise={shareExerciseFromSession}
      />
    </div>
  );
}

export default WorkoutsPage;
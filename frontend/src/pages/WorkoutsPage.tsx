import WorkoutLog from "../components/WorkoutLog";
import WorkoutSessionForm from "../components/WorkoutSessionForm";
import {
  type WorkoutSession,
  type WorkoutSessionExercise,
} from "../services/workoutSessionsApi";

type WorkoutsPageProps = {
  sessions: WorkoutSession[];
  isLoading: boolean;
  errorMessage: string;
  onReload: () => Promise<void>;
};

function WorkoutsPage({
  sessions,
  isLoading,
  errorMessage,
  onReload,
}: WorkoutsPageProps) {

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
      <WorkoutSessionForm onSessionSaved={onReload} />

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

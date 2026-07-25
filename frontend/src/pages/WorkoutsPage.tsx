import WorkoutLog from "../components/WorkoutLog";
import WorkoutSessionForm from "../components/WorkoutSessionForm";
import {
  type WorkoutSession,
  type WorkoutSessionExercise,
} from "../services/workoutSessionsApi";
import { publishSession } from "../services/socialApi";
import { isAnyPersonalRecord } from "../utils/personalRecord";

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
    const caption = window.prompt(
      "Add an optional caption for your workout:",
      "",
    );

    if (caption === null) return;

    try {
      const hasPersonalRecord = session.workout_exercises.some(
        (exercise) =>
          exercise.personalRecord &&
          isAnyPersonalRecord(exercise.personalRecord),
      );

      await publishSession(
        session.id,
        session.workout_date,
        caption,
        hasPersonalRecord,
      );
      alert("Workout posted to the social feed.");
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to post workout.",
      );
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
    <div className="workouts-page">
      <div className="page-heading">
        <span className="page-kicker">Training</span>
        <h1>Workout Sessions</h1>
        <p>Build today&apos;s session and review your recent training.</p>
      </div>

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

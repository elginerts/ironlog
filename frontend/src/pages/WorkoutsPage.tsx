import WorkoutForm from "../components/WorkoutForm";
import WorkoutLog from "../components/WorkoutLog";
import type { Workout } from "../components/types";

type WorkoutsPageProps = {
  workouts: Workout[];
  onAddWorkout: (workout: Workout) => Promise<boolean>;
  onShareWorkout: (workout: Workout) => Promise<boolean>;
};

function WorkoutsPage({
  workouts,
  onAddWorkout,
  onShareWorkout,
}: WorkoutsPageProps) {
  return (
    <div>
      <WorkoutForm onAddWorkout={onAddWorkout} />

      <WorkoutLog
        workouts={workouts}
        onShareWorkout={onShareWorkout}
      />
    </div>
  );
}

export default WorkoutsPage;
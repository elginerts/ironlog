import WorkoutForm from "../components/WorkoutForm";
import WorkoutLog from "../components/WorkoutLog";
import type { Workout } from "../components/types";

type WorkoutsPageProps = {
  workouts: Workout[];
  onAddWorkout: (workout: Workout) => Promise<boolean>;
};

function WorkoutsPage({ workouts, onAddWorkout }: WorkoutsPageProps) {
  return (
    <>
      <WorkoutForm onAddWorkout={onAddWorkout} />
      <WorkoutLog workouts={workouts} />
    </>
  );
}

export default WorkoutsPage;
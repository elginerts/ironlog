export type WorkoutSplit = {
  id: number;
  user_id: string;
  name: string;
};

export type WorkoutSplitDay = {
  id: number;
  workout_split_id: number;
  day_order: number;
  day_of_week: string;
};

export type WorkoutDayExercises = {
  id: number;
  workout_split_day_id: number;
  exercise_name: string;
  exercise_id: number;
  sets: number;
  reps: number;
  weight: number;
  exercise_order: number;
};

type WorkoutSplitProps = {
  userId?: string;
};

function WorkoutSplitSection({ userId }: WorkoutSplitProps) {
  return (
    <section className="card">
      <h2>Workout Split</h2>
      <p>
        {userId
          ? "Plan your weekly training split around your logged exercises."
          : "Log in to manage your weekly training split."}
      </p>
    </section>
  );
}

export default WorkoutSplitSection;

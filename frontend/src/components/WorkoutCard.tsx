type WorkoutCardProps = {
  name: string;
  date: string;
  exercise: string;
  sets: number;
  reps: number;
};

function WorkoutCard({ name, date, exercise, sets, reps }: WorkoutCardProps) {
  return (
    <div className="workout-card">
      <h3>{name}</h3>
      <p>{date}</p>
      <p>{exercise}</p>
      <p>
        {sets} sets × {reps} reps
      </p>
    </div>
  );
}

export default WorkoutCard;
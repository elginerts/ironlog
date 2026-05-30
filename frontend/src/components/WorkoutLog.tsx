type Workout = {
  exerciseName: string;
  sets: number;
  reps: number;
  weight: number;
  date: string;
};

type WorkoutLogProps = {
  workouts: Workout[];
};

function WorkoutLog({ workouts }: WorkoutLogProps) {
  return (
    <section className="card">
      <h2>Workout Log</h2>

      {workouts.length === 0 ? (
        <p>No workouts logged yet.</p>
      ) : (
        <div className="workout-list">
          {workouts.map((workout, index) => (
            <div className="workout-card" key={index}>
              <h3>{workout.exerciseName}</h3>
              <p>{workout.date}</p>
              <p>
                {workout.sets} sets × {workout.reps} reps @ {workout.weight}kg
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default WorkoutLog;
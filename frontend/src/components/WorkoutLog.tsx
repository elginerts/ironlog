import type { Workout } from "./types";

type WorkoutLogProps = {
  workouts: Workout[];
  onShareWorkout: (workout: Workout) => Promise<boolean>;
};

function WorkoutLog({ workouts, onShareWorkout}: WorkoutLogProps) {
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

              <button 
                type="button"
                onClick={() => {
                  onShareWorkout(workout);}}>
                Share to Feed
              </button>              
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default WorkoutLog;
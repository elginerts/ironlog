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
            <div className="workout-card" key={workout.id ?? index}>
              <h3>{workout.exerciseName}</h3>
              <p>{workout.date}</p>
              <p>
                {workout.sets} sets × {workout.reps} reps @ {workout.weight}kg
              </p>

              {workout.personalRecord &&
                (workout.personalRecord.weightPR ||
                  workout.personalRecord.repsPR ||
                  workout.personalRecord.estimated1RMPR) && (
                  <div className="personal-record-badge">
                    <strong>🏆 Personal Record</strong>

                    <div className="personal-record-details">
                      {workout.personalRecord.weightPR && (
                        <span>Weight PR</span>
                      )}

                      {workout.personalRecord.repsPR && (
                        <span>Repetition PR</span>
                      )}

                      {workout.personalRecord.estimated1RMPR && (
                        <span>
                          Estimated 1RM: {workout.personalRecord.estimated1RM} kg
                        </span>
                      )}
                    </div>
                  </div>
                )}

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
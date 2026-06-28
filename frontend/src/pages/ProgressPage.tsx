import { useState } from "react";
import type { Workout } from "../components/types";

type ProgressPageProps = {
  workouts: Workout[];
};

function ProgressPage({ workouts }: ProgressPageProps) {
  const [selectedExercise, setSelectedExercise] = useState("All");

  const exerciseOptions = [
    "All",
    ...Array.from(new Set(workouts.map((workout) => workout.exerciseName))),
  ];

  const filteredWorkouts =
    selectedExercise === "All"
      ? workouts
      : workouts.filter(
          (workout) => workout.exerciseName === selectedExercise
        );

  return (
    <div className="progress-page">
      <h1>Exercise History and Progress</h1>

      <div className="progress-filters">
        <label htmlFor="exercise-filter">Filter by exercise:</label>

        <select
          id="exercise-filter"
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
        >
          {exerciseOptions.map((exercise) => (
            <option key={exercise} value={exercise}>
              {exercise}
            </option>
          ))}
        </select>
      </div>

      {filteredWorkouts.length === 0 ? (
        <p>No workouts found.</p>
      ) : (
        <div className="history-list">
          {filteredWorkouts.map((workout, index) => (
            <div className="history-card" key={index}>
              <h3>{workout.exerciseName}</h3>

              <p>
                {workout.sets} sets × {workout.reps} reps @ {workout.weight}kg
              </p>

              <p>Date: {workout.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProgressPage;
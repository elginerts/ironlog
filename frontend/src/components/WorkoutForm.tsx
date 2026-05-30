import { useState } from "react";

type Workout = {
  exerciseName: string;
  sets: number;
  reps: number;
  weight: number;
  date: string;
};

type WorkoutFormProps = {
  onAddWorkout: (workout: Workout) => void;
};

function WorkoutForm({ onAddWorkout }: WorkoutFormProps) {
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!exerciseName || !sets || !reps || !weight) {
      alert("Please fill in all fields");
      return;
    }

    onAddWorkout({
      exerciseName,
      sets: Number(sets),
      reps: Number(reps),
      weight: Number(weight),
      date: new Date().toLocaleDateString(),
    });

    setExerciseName("");
    setSets("");
    setReps("");
    setWeight("");
  }

  return (
    <section className="card">
      <h2>Log a Workout</h2>

      <form onSubmit={handleSubmit} className="workout-form">
        <input
          type="text"
          placeholder="Exercise name"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Sets"
          value={sets}
          onChange={(e) => setSets(e.target.value)}
        />

        <input
          type="number"
          placeholder="Reps"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
        />

        <input
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />

        <button type="submit">Save Workout</button>
      </form>
    </section>
  );
}

export default WorkoutForm;
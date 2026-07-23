import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { isValidWorkoutInput } from "../utils/workoutUtils";
import type { Workout } from "./types";

type WorkoutFormProps = {
  onAddWorkout: (workout: Workout) => Promise<boolean>;
};

type ExerciseSuggestionRow = {
  name: string | null;
};

function WorkoutForm({ onAddWorkout }: WorkoutFormProps) {
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);

  useEffect(() => {
    let isMounted = true;

    async function loadSuggestions() {
      try {
        const { data, error } = await supabase
          .from("exercises")
          .select("name")
          .order("created_at", { ascending: false })
          .limit(50);

        if (!isMounted) {
          return;
        }

        if (error) {
          console.error("Error loading exercise suggestions:", error);
          return;
        }

        if (data) {
          const rows = data as ExerciseSuggestionRow[];
          const names = rows
            .map((row) => row.name)
            .filter((name): name is string => Boolean(name));
          setSuggestions(Array.from(new Set(names)));
        }
      } catch (err) {
        if (isMounted) {
          console.error(err);
        }
      }
    }

    loadSuggestions();

    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const setsNumber = Number(sets);
    const repsNumber = Number(reps);
    const weightNumber = Number(weight);

    if (!isValidWorkoutInput(exerciseName, setsNumber, repsNumber, weightNumber)) {
      alert("Please enter a valid workout.");
      return;
    }

    setIsSaving(true);

    try {
      const wasSaved = await onAddWorkout({
        exerciseName,
        sets: setsNumber,
        reps: repsNumber,
        weight: weightNumber,
        date,
      });

      if (!wasSaved) {
        return;
      }

      const { error } = await supabase
        .from("exercises")
        .upsert([{ name: exerciseName }], { onConflict: "name" });

      if (error) {
        console.error("Exercise save error:", error.message);
        return;
      }

      setSuggestions((prev) =>
        prev.includes(exerciseName) ? prev : [exerciseName, ...prev],
      );

      setExerciseName("");
      setSets("");
      setReps("");
      setWeight("");
      setDate(today);
    } catch (err) {
      console.error("Failed to save workout:", err);
    } finally {
      setIsSaving(false);
    }
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

        {suggestions.length > 0 && (
          <div className="suggestions">
            {suggestions.map((sugg) => (
              <button
                type="button"
                key={sugg}
                className="suggestion-btn"
                onClick={() => setExerciseName(sugg)}
              >
                {sugg}
              </button>
            ))}
          </div>
        )}

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

        <label htmlFor="workout-date">Workout date</label>
        <input
          id="workout-date"
          type="date"
          value={date}
          max={today}
          onChange={(event) => setDate(event.target.value)}
          required
        />

        <button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Workout"}
        </button>
      </form>
    </section>
  );
}

export default WorkoutForm;

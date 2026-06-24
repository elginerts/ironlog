import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import type { Workout } from "./types";

type ExerciseRow = {
  name: string;
};

type WorkoutFormProps = {
  onAddWorkout: (workout: Workout) => Promise<boolean>;
};

function WorkoutForm({ onAddWorkout }: WorkoutFormProps) {
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  // No manual templates: exercises are auto-saved and appear in suggestions

  useEffect(() => {
    async function loadSuggestions() {
      try {
        const { data, error } = await supabase
          .from("exercises")
          .select("name")
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) {
          console.error("Error loading exercise suggestions:", error);
          return;
        }

        if (data) {
          const names = data.map((row: ExerciseRow) => row.name).filter(Boolean);
          setSuggestions(Array.from(new Set(names)));
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadSuggestions();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
  event.preventDefault();

  if (!exerciseName || !sets || !reps || !weight) {
    alert("Please fill in all fields");
    return;
  }

  setIsSaving(true);

  try {
    const wasSaved = await onAddWorkout({
      exerciseName,
      sets: Number(sets),
      reps: Number(reps),
      weight: Number(weight),
      // convert local date (YYYY-MM-DD) to full ISO timestamp before sending
      date: new Date(date).toISOString(),
    });

    if (!wasSaved) {
      return;
    }

    const { error } = await supabase
      .from("exercises")
      .upsert([{ name: exerciseName }], { onConflict: "name" });

    if (error) {
      console.log("Exercise save error:", error.message);
      return;
    }

    // We auto-save exercise names (upsert above) so they appear in suggestions.

    setSuggestions((prev) =>
      prev.includes(exerciseName) ? prev : [exerciseName, ...prev]
    );

    setExerciseName("");
    setSets("");
    setReps("");
    setWeight("");
    // reset date to today after save
    setDate(new Date().toISOString().split('T')[0]);
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

        {/* Templates are auto-saved as exercise suggestions; no UI needed */}

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

        <label className="sr-only">Workout date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="date-input"
          max={new Date().toISOString().split('T')[0]}
        />

        <button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Workout"}
        </button>
      </form>
    </section>
  );
}

export default WorkoutForm;

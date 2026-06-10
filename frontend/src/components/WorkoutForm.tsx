import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

type Workout = {
  exerciseName: string;
  sets: number;
  reps: number;
  weight: number;
  date: string;
};

type WorkoutFormProps = {
  onAddWorkout: (workout: Workout) => Promise<boolean>;
};

function WorkoutForm({ onAddWorkout }: WorkoutFormProps) {
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

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
          const names = data.map((row: any) => row.name).filter(Boolean);
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
        date: new Date().toLocaleDateString(),
      });

      if (!wasSaved) {
        return;
      }

      try {
        await supabase.from("exercises").upsert([{ name: exerciseName }], { onConflict: "name" });
      } catch (err) {
        console.error("Failed to save exercise name:", err);
      }

      setExerciseName("");
      setSets("");
      setReps("");
      setWeight("");
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

        <button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Workout"}
        </button>
      </form>
    </section>
  );
}

export default WorkoutForm;

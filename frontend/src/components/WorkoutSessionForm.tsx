import { useState } from "react";
import {
  createWorkoutSession,
  type WorkoutSessionExerciseInput,
} from "../services/workoutSessionsApi";

type WorkoutSessionFormProps = {
  onSessionSaved: () => Promise<void>;
};

function createEmptyExercise(): WorkoutSessionExerciseInput {
  return {
    exerciseName: "",
    sets: 1,
    reps: 1,
    weight: 0,
  };
}

function WorkoutSessionForm({
  onSessionSaved,
}: WorkoutSessionFormProps) {
  const today = new Date().toISOString().split("T")[0];

  const [title, setTitle] = useState("Workout");
  const [workoutDate, setWorkoutDate] = useState(today);
  const [exercises, setExercises] = useState<
    WorkoutSessionExerciseInput[]
  >([createEmptyExercise()]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function updateExercise(
    index: number,
    field: keyof WorkoutSessionExerciseInput,
    value: string,
  ) {
    setExercises((currentExercises) =>
      currentExercises.map((exercise, exerciseIndex) => {
        if (exerciseIndex !== index) {
          return exercise;
        }

        return {
          ...exercise,
          [field]:
            field === "exerciseName" ? value : Number(value),
        };
      }),
    );
  }

  function addExercise() {
    setExercises((currentExercises) => [
      ...currentExercises,
      createEmptyExercise(),
    ]);
  }

  function removeExercise(index: number) {
    setExercises((currentExercises) =>
      currentExercises.filter(
        (_exercise, exerciseIndex) => exerciseIndex !== index,
      ),
    );
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setErrorMessage("");

    const hasInvalidExercise = exercises.some(
      (exercise) =>
        !exercise.exerciseName.trim() ||
        exercise.sets <= 0 ||
        exercise.reps <= 0 ||
        exercise.weight < 0,
    );

    if (hasInvalidExercise) {
      setErrorMessage("Please enter valid exercise details.");
      return;
    }

    setIsSaving(true);

    try {
      await createWorkoutSession({
        title: title.trim() || "Workout",
        workoutDate,
        exercises,
      });

      setTitle("Workout");
      setWorkoutDate(today);
      setExercises([createEmptyExercise()]);

      await onSessionSaved();
      alert("Workout session saved!");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to save workout session.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="card">
      <h2>Log a Workout Session</h2>

      <form
        className="workout-form"
        onSubmit={handleSubmit}
      >
        <div className="session-field">
          <label htmlFor="session-title">Workout title</label>
          <input
            id="session-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Upper Body Day"
          />
        </div>

        <div className="session-field">
          <label htmlFor="session-date">Workout date</label>
          <input
            id="session-date"
            type="date"
            value={workoutDate}
            max={today}
            onChange={(event) =>
              setWorkoutDate(event.target.value)
            }
            required
          />
        </div>

        {exercises.map((exercise, index) => (
          <div
            className="session-exercise-card"
            key={index}
          >
            <h3>Exercise {index + 1}</h3>

            <div className="session-exercise-fields">
              <div className="session-field">
                <label htmlFor={`exercise-name-${index}`}>
                  Exercise name
                </label>
                <input
                  id={`exercise-name-${index}`}
                  type="text"
                  placeholder="e.g. Bench Press"
                  value={exercise.exerciseName}
                  onChange={(event) =>
                    updateExercise(
                      index,
                      "exerciseName",
                      event.target.value,
                    )
                  }
                  required
                />
              </div>

              <div className="session-field">
                <label htmlFor={`sets-${index}`}>Sets</label>
                <input
                  id={`sets-${index}`}
                  type="number"
                  min="1"
                  value={exercise.sets}
                  onChange={(event) =>
                    updateExercise(
                      index,
                      "sets",
                      event.target.value,
                    )
                  }
                  required
                />
              </div>

              <div className="session-field">
                <label htmlFor={`reps-${index}`}>Reps</label>
                <input
                  id={`reps-${index}`}
                  type="number"
                  min="1"
                  value={exercise.reps}
                  onChange={(event) =>
                    updateExercise(
                      index,
                      "reps",
                      event.target.value,
                    )
                  }
                  required
                />
              </div>

              <div className="session-field">
                <label htmlFor={`weight-${index}`}>
                  Weight (kg)
                </label>
                <input
                  id={`weight-${index}`}
                  type="number"
                  min="0"
                  step="0.5"
                  value={exercise.weight}
                  onChange={(event) =>
                    updateExercise(
                      index,
                      "weight",
                      event.target.value,
                    )
                  }
                  required
                />
              </div>
            </div>

            {exercises.length > 1 && (
              <button
                type="button"
                onClick={() => removeExercise(index)}
              >
                Remove Exercise
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addExercise}>
          Add Another Exercise
        </button>

        {errorMessage && (
          <p className="error-message">{errorMessage}</p>
        )}

        <button type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Workout Session"}
        </button>
      </form>
    </section>
  );
}

export default WorkoutSessionForm;

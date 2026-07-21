import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Workout } from "../components/types";

type ProgressPageProps = {
  workouts: Workout[];
  userEmail: string | null;
};

function ProgressPage({ workouts, userEmail }: ProgressPageProps) {
  const exerciseOptions = useMemo(
    () =>
      Array.from(
        new Set(workouts.map((workout) => workout.exerciseName)),
      ).sort(),
    [workouts],
  );

  const [selectedExercise, setSelectedExercise] = useState("");

  const activeExercise =
    selectedExercise || exerciseOptions[0] || "";

  const exerciseWorkouts = useMemo(() => {
    return workouts
      .filter((workout) => workout.exerciseName === activeExercise)
      .sort(
        (firstWorkout, secondWorkout) =>
          new Date(firstWorkout.date).getTime() -
          new Date(secondWorkout.date).getTime(),
      );
  }, [workouts, activeExercise]);

  const chartData = exerciseWorkouts.map((workout) => ({
    date: new Date(workout.date).toLocaleDateString("en-SG", {
      day: "numeric",
      month: "short",
    }),
    weight: Number(workout.weight),
    volume:
      Number(workout.sets) *
      Number(workout.reps) *
      Number(workout.weight),
  }));

  const personalRecord =
    exerciseWorkouts.length > 0
      ? Math.max(...exerciseWorkouts.map((workout) => Number(workout.weight)))
      : 0;

  const latestWorkout =
    exerciseWorkouts.length > 0
      ? exerciseWorkouts[exerciseWorkouts.length - 1]
      : null;

  const firstWorkout =
    exerciseWorkouts.length > 0 ? exerciseWorkouts[0] : null;

  const weightImprovement =
    latestWorkout && firstWorkout
      ? Number(latestWorkout.weight) - Number(firstWorkout.weight)
      : 0;

  const totalVolume = exerciseWorkouts.reduce(
    (total, workout) =>
      total +
      Number(workout.sets) *
        Number(workout.reps) *
        Number(workout.weight),
    0,
  );

  if (!userEmail) {
    return (
      <div className="progress-page">
        <h1>Progress Analytics</h1>
        <p>Please log in to view your workout progress.</p>
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="progress-page">
        <h1>Progress Analytics</h1>
        <p>Log your first workout to start tracking your progress.</p>
      </div>
    );
  }

  return (
    <div className="progress-page">
      <h1>Progress Analytics</h1>
      <p>Track your performance and improvement over time.</p>

      <div className="progress-filters">
        <label htmlFor="exercise-filter">Select exercise:</label>

        <select
          id="exercise-filter"
          value={activeExercise}
          onChange={(event) => setSelectedExercise(event.target.value)}
        >
          {exerciseOptions.map((exercise) => (
            <option key={exercise} value={exercise}>
              {exercise}
            </option>
          ))}
        </select>
      </div>

      <div className="progress-summary">
        <div className="progress-stat-card">
          <p>Personal Record</p>
          <h2>{personalRecord} kg</h2>
        </div>

        <div className="progress-stat-card">
          <p>Sessions Logged</p>
          <h2>{exerciseWorkouts.length}</h2>
        </div>

        <div className="progress-stat-card">
          <p>Weight Improvement</p>
          <h2>
            {weightImprovement > 0 ? "+" : ""}
            {weightImprovement} kg
          </h2>
        </div>

        <div className="progress-stat-card">
          <p>Total Training Volume</p>
          <h2>{totalVolume.toLocaleString()} kg</h2>
        </div>
      </div>

      <div className="progress-chart-card">
        <h2>
          {activeExercise.charAt(0).toUpperCase() + activeExercise.slice(1)} Weight Progress
          </h2>

        {chartData.length < 2 && (
          <p>
            Add another {activeExercise} workout to see your progress trend.
          </p>
        )}

        <div className="progress-chart">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" />

              <YAxis
                unit="kg"
                domain={["dataMin - 5", "dataMax + 5"]}
              />

              <Tooltip
                formatter={(value) => [`${value} kg`, "Weight"]}
              />

              <Line
                type="monotone"
                dataKey="weight"
                strokeWidth={3}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="progress-history">
        <h2>
          {activeExercise.charAt(0).toUpperCase() + activeExercise.slice(1)} History
          </h2>

        <div className="history-list">
          {[...exerciseWorkouts].reverse().map((workout, index) => (
            <div
              className="history-card"
              key={`${workout.exerciseName}-${workout.date}-${index}`}
            >
              <h3>{workout.exerciseName}</h3>

              <p>
                {workout.sets} sets × {workout.reps} reps @{" "}
                {workout.weight} kg
              </p>

              <p>
                Volume:{" "}
                {(
                  Number(workout.sets) *
                  Number(workout.reps) *
                  Number(workout.weight)
                ).toLocaleString()}{" "}
                kg
              </p>

              <p>
                Date:{" "}
                {new Date(workout.date).toLocaleDateString("en-SG")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProgressPage;
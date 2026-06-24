import type { Workout } from './types';

type Props = {
  workouts: Workout[];
};

function buildExerciseSeries(workouts: Workout[]) {
  const map: Record<string, { date: string; weight: number }[]> = {};

  workouts.forEach((workout) => {
    const exerciseName = workout.exerciseName;
    const date = workout.dateIso ?? workout.date;

    if (!exerciseName || !date) return;

    map[exerciseName] = map[exerciseName] || [];
    map[exerciseName].push({
      date,
      weight: Number(workout.weight) || 0,
    });
  });

  Object.keys(map).forEach((exerciseName) => {
    map[exerciseName].sort((a, b) => (a.date > b.date ? 1 : -1));
  });

  return map;
}

function Sparkline({ points }: { points: number[] }) {
  const width = 120;
  const height = 32;

  if (points.length === 0) {
    return <svg width={width} height={height} />;
  }

  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const step = width / Math.max(1, points.length - 1);

  const coords = points
    .map((point, index) => {
      const x = index * step;
      const y = height - ((point - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg
      className="progress-sparkline"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <polyline
        className="progress-sparkline-line"
        fill="none"
        points={coords}
      />
    </svg>
  );
}

export default function ProgressSection({ workouts }: Props) {
  const series = buildExerciseSeries(workouts);
  const exercises = Object.keys(series).sort();

  return (
    <section className="card progress-section">
      <h2 className="progress-heading">Progress</h2>

      {exercises.length === 0 && (
        <p className="progress-empty">No data yet.</p>
      )}

      <div className="progress-list">
        {exercises.map((exerciseName) => {
          const points = series[exerciseName].map((session) => session.weight);
          const last = points[points.length - 1] ?? 0;
          const max = Math.max(...points, 0);

          return (
            <div key={exerciseName} className="progress-row">
              <div className="progress-info">
                <strong className="progress-exercise-name">
                  {exerciseName}
                </strong>

                <div className="progress-meta">
                  {points.length} sessions • max {max}kg
                </div>
              </div>

              <div className="progress-chart-area">
                <Sparkline points={points} />

                <div className="progress-last-weight">
                  {last}kg
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
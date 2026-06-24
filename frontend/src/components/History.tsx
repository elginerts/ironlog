import type { Workout } from './types';

type Props = {
  workouts: Workout[];
  onDelete?: (id: number) => Promise<boolean> | void;
  isLoading?: boolean;
};

export default function History({ workouts, onDelete, isLoading = false }: Props) {
  if (isLoading) return <div className="flex items-center justify-center h-64">Loading…</div>;

  if (!workouts || workouts.length === 0) {
    return (
      <div className="empty-state">
        <p>No workouts yet</p>
        <small>Start logging to build your history</small>
      </div>
    );
  }

  // group workouts by dateIso (YYYY-MM-DD) or fallback to date
  const groups: Record<string, Workout[]> = {};
  workouts.forEach((w) => {
    const key = w.dateIso ?? w.date ?? 'unknown';
    groups[key] = groups[key] || [];
    groups[key].push(w);
  });

  const keys = Object.keys(groups).sort((a, b) => (a < b ? 1 : -1));

  return (
    <div className="workout-list">
      {keys.map((key) => {
        const items = groups[key];
        const raw = items[0]?.dateIso ?? items[0]?.date ?? key;
        const headerLabel = raw ? String(raw).slice(0, 10) : key;

        return (
          <div key={key} className="workout-day">
            <h3 style={{ marginTop: 0 }}>{headerLabel}</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              {items.map((workout) => (
                <div className="workout-card" key={workout.id ?? workout.date}>
                  <h4 style={{ margin: '2px 0' }}>{workout.exerciseName}</h4>

                  <p style={{ margin: '4px 0' }}>
                    {workout.sets} sets × {workout.reps} reps @ {workout.weight}kg
                  </p>

                  <div style={{ marginTop: 8 }}>
                    {onDelete ? (
                      <button onClick={() => onDelete(workout.id as number)}>Delete</button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}






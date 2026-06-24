import { useState } from 'react';
import type { Workout } from './types';

type WorkoutLogProps = {
  workouts: Workout[];
  onEdit?: (id: number, changes: Partial<Workout>) => Promise<boolean>;
};

function WorkoutLog({ workouts, onEdit }: WorkoutLogProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<{ sets: number; reps: number; weight: number }>({ sets: 0, reps: 0, weight: 0 });

  function startEdit(workout: Workout) {
    setEditingId(workout.id ?? null);
    setDraft({ sets: workout.sets, reps: workout.reps, weight: workout.weight });
  }

  async function saveEdit(id?: number) {
    if (id == null) return;
    if (!onEdit) return;
    const success = await onEdit(id, { sets: draft.sets, reps: draft.reps, weight: draft.weight });
    if (success) {
      setEditingId(null);
    } else {
      alert('Could not save changes');
    }
  }

  return (
    <section className="card">
      <h2>Workout Log</h2>

      {workouts.length === 0 ? (
        <p>No workouts logged yet.</p>
      ) : (
        <div className="workout-list">
          {(() => {
            // group workouts by dateIso (YYYY-MM-DD) or fallback to date
            const groups: Record<string, Workout[]> = {};
            workouts.forEach((w) => {
              const key = w.dateIso ?? w.date;
              groups[key] = groups[key] || [];
              groups[key].push(w);
            });

            const keys = Object.keys(groups).sort((a, b) => (a < b ? 1 : -1));

            return keys.map((key) => {
              const items = groups[key];
              // prefer canonical ISO date stored in `dateIso`, fall back to raw `date` or group key
              const raw = items[0]?.dateIso ?? items[0]?.date ?? key;
              // show YYYY-MM-DD (first 10 chars) when possible
              const headerLabel = raw ? String(raw).slice(0, 10) : key;
              return (
                <div key={key} className="workout-day">
                  <h3 style={{ marginTop: 0 }}>{headerLabel}</h3>
                  <div style={{ display: 'grid', gap: 8 }}>
                    {items.map((workout) => (
                      <div className="workout-card" key={workout.id ?? workout.date}>
                        <h4 style={{ margin: '2px 0' }}>{workout.exerciseName}</h4>

                        {editingId === workout.id ? (
                          <div className="workout-edit">
                            <input
                              type="number"
                              value={draft.sets}
                              onChange={(e) => setDraft((d) => ({ ...d, sets: Number(e.target.value) }))}
                            />
                            <input
                              type="number"
                              value={draft.reps}
                              onChange={(e) => setDraft((d) => ({ ...d, reps: Number(e.target.value) }))}
                            />
                            <input
                              type="number"
                              value={draft.weight}
                              onChange={(e) => setDraft((d) => ({ ...d, weight: Number(e.target.value) }))}
                            />
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button onClick={() => void saveEdit(workout.id)}>Save</button>
                              <button onClick={() => setEditingId(null)}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p style={{ margin: '4px 0' }}>
                              {workout.sets} sets × {workout.reps} reps @ {workout.weight}kg
                            </p>
                            <div style={{ marginTop: 8 }}>
                              <button onClick={() => startEdit(workout)}>Edit</button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      )}
    </section>
  );
}

export default WorkoutLog;
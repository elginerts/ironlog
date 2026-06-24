export type Workout = {
  id?: number; // database id when available
  exerciseName: string;
  sets: number;
  reps: number;
  weight: number;
  date: string; // human-friendly display date
  dateIso?: string; // ISO date for sorting and grouping (YYYY-MM-DD)
};
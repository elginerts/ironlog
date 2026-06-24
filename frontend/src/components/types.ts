export type Workout = {
  id?: number; // database id when available
  exerciseName: string;
  sets: number;
  reps: number;
  weight: number;
  date: string;
};
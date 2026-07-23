export type PersonalRecord = {
  weightPR: boolean;
  repsPR: boolean;
  estimated1RMPR: boolean;
  estimated1RM: number;
};

export type Workout = {
  id?: string;
  exerciseName: string;
  sets: number;
  reps: number;
  weight: number;
  date: string;
  personalRecord?: PersonalRecord;
};
import type { WorkoutSession } from "../services/workoutSessionsApi";

export type WorkoutStreak = {
  current: number;
  longest: number;
};

function dayNumber(date: string) {
  return Math.floor(
    new Date(`${date}T00:00:00Z`).getTime() / 86_400_000,
  );
}

function localDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function calculateWorkoutStreak(
  sessions: WorkoutSession[],
  today = new Date(),
): WorkoutStreak {
  const workoutDates = Array.from(
    new Set(sessions.map((session) => session.workout_date)),
  ).sort();

  if (workoutDates.length === 0) {
    return { current: 0, longest: 0 };
  }

  let longest = 1;
  let running = 1;

  for (let index = 1; index < workoutDates.length; index += 1) {
    if (
      dayNumber(workoutDates[index]) -
        dayNumber(workoutDates[index - 1]) ===
      1
    ) {
      running += 1;
      longest = Math.max(longest, running);
    } else {
      running = 1;
    }
  }

  const latestDay = dayNumber(workoutDates.at(-1) ?? "");
  const todayDay = dayNumber(localDateKey(today));

  return {
    current: todayDay - latestDay <= 1 ? running : 0,
    longest,
  };
}

# IronLog

IronLog is a workout-tracking web application for logging workouts, monitoring progress and viewing workout activity shared by other users.

The application is built using React, TypeScript, Vite and Supabase.

## Features

### Workout Logging

Users can record workout details such as:

- Exercise name
- Number of sets
- Number of repetitions
- Weight used
- Workout date

### Workout History

Signed-in users can view their previous workout records retrieved from Supabase.

### Progress Tracking

Users can review workout progress over time, including:

- Exercise-specific progress charts
- Personal-record tracking
- Workout-volume calculations
- Performance comparisons over time

### Social Feed

Users can view workout activity shared through the social feed. Shared workout posts display the poster's username through the associated Supabase profile.

### Leaderboard

Users can compare workout consistency and total training volume using aggregated workout data.

## Technology Stack

- React
- TypeScript
- Vite
- Supabase
- Vitest
- React Testing Library

## Project Structure

```text
src/
├── components/
│   ├── WorkoutForm.tsx
│   ├── WorkoutLog.tsx
│   └── ...
├── utils/
│   ├── personalRecord.ts
│   ├── workoutUtils.ts
│   └── workoutUtils.test.ts
├── test/
│   └── setup.ts
└── App.tsx

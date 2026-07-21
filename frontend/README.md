# IronLog

IronLog is a workout-tracking web application designed to help users log workouts, monitor their progress and view workout activity shared by other users.

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

Users can review their workout progress over time.

Current improvements planned for this feature include:

- Exercise-specific progress charts
- Personal-record tracking
- Workout-volume calculations
- Performance comparisons over time

### Social Feed

Users can view workout activities shared through the social feed.

The feed will be improved to display usernames instead of raw user IDs.

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
│   ├── workoutUtils.ts
│   └── workoutUtils.test.ts
├── test/
│   └── setup.ts
└── App.tsx
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

## Setup Instructions

### Prerequisites

Before running the project, make sure you have installed:

- Node.js
- npm
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/elginerts/ironlog.git
```

2. Navigate into the frontend folder:

```bash
cd ironlog/frontend
```

3. Install the required dependencies:

```bash
npm install
```

4. Create a `.env` file inside the `frontend` folder and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Start the development server:

```bash
npm run dev
```

6. Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Testing

Run the automated tests once:

```bash
npm run test:run
```

Run the tests in watch mode:

```bash
npm run test
```

Check the project for linting issues:

```bash
npm run lint
```

Create a production build:

```bash
npm run build
```
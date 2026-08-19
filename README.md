# 🏋️ IRONLOG

**IRONLOG** is a full-stack workout tracking web application that helps gym users log their workouts, track their progress, and share training activity with others.

Built as part of **NUS Orbital 2026 — Apollo 11**.

- [Demo Video](https://drive.google.com/file/d/1DHwfDL4AK6wUsV8Glh6wO_0iSSd8WF60/view?usp=sharing) 
- [Full Project Report](https://drive.google.com/file/d/1sgauJx60HiPLCyNfEN2DfmseaXVtIdMU/view?usp=sharing)
- [POSTER](https://drive.google.com/file/d/1oZVfyerOvQ-JKvdZ4nDXbc-LLUoBAxJS/view?usp=sharing)

---

## ✨ Features

- **Workout Logging & History** — Record exercises, sets, repetitions, weights, and workout dates, with workouts grouped into sessions.
- **Progress Tracking** — Review previous workouts and filter workout history by exercise.
- **Personal Records** — Automatically detect new personal records based on weight, repetitions, and estimated 1RM.
- **Workout Streaks** — Track current and longest workout streaks.
- **Social Feed** — Publish completed workouts and interact with other users through likes and comments.
- **Leaderboard** — Compare workout activity and streaks with other users.

---

## 🛠️ Tech Stack

| Area | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | CSS |
| Backend | Supabase |
| Database | PostgreSQL |
| Authentication | Supabase Auth |
| Data Visualisation | Recharts |
| Testing | Vitest, React Testing Library |
| Version Control | Git, GitHub |

---

## 🏗️ Architecture

IRONLOG uses a client–backend architecture where the React frontend communicates directly with Supabase.

Supabase provides authentication and PostgreSQL database services, while **Row Level Security (RLS)** policies enforce access control at the database level.

---

## 🗄️ Database Design

The database uses a session-based structure to represent workouts.

The main tables include:

- `profiles` — stores user profile information
- `workout_sessions` — represents individual workout sessions
- `workout_exercises` — stores exercises belonging to each workout session
- `workout_posts` — stores workouts published to the social feed
- `post_likes` — stores likes on workout posts
- `post_comments` — stores comments on workout posts

---

## 🧪 Testing

IRONLOG includes **22 automated tests across 7 test files** using Vitest and React Testing Library.

Testing covers areas including:

- Workout validation
- Workout session transformations
- Personal record and estimated 1RM calculations
- Workout streak calculations
- Workout form rendering and behaviour
- Workout history components
- Social feed components

Manual integration testing was also performed using multiple user accounts to verify authentication, user-specific data access, social interactions, and Supabase Row Level Security behaviour.

---

## 🚀 Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/elginerts/ironlog.git
cd ironlog
```

### 2. Install dependencies

```bash
cd frontend
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `frontend` directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Start the development server

```bash
npm run dev
```

The application will then be available through the local URL shown by Vite.

### 5. Run automated tests

```bash
npm test
```

---

## 📁 Project Structure

```text
ironlog/
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Main application pages
│   │   ├── services/       # Database and application services
│   │   ├── utils/          # Utility functions
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Application entry point
│   │
│   ├── public/
│   └── package.json
│
├── docs/
│   ├── images/
│   └── final-report.pdf
│
└── README.md
```

---

## 📚 Documentation

For a detailed explanation of IRONLOG's motivation, user stories, system architecture, database design, features, software engineering practices, testing, and project development:

➡️ [View the Final Submission Report](https://drive.google.com/file/d/1sgauJx60HiPLCyNfEN2DfmseaXVtIdMU/view?usp=sharing)

---

## 👥 Authors

**Er Teng Sheng Elgin**  
**Raegan Chang**

NUS Orbital 2026 — Apollo 11
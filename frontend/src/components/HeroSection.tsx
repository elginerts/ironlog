import type { Workout } from "./types";
import type { WorkoutStreak } from "../utils/workoutStreak";

interface HeroSectionProps {
  userEmail: string | null;
  workouts: Workout[];
  workoutStreak: WorkoutStreak;
  onSignUpClick: () => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

function HeroSection({
  userEmail,
  workouts,
  workoutStreak,
  onSignUpClick,
  onLoginClick,
  onLogoutClick,
}: HeroSectionProps) {
  return (
    <section className="hero">
      <div className="hero-text">
        <p className="tagline">
          <span />
          Workout tracking made simple
        </p>
        <h1>
          Track your lifts.
          <span> Build your progress.</span>
        </h1>
        <p className="description">
          IRONLOG is a fitness tracking app that helps gym users record
          workouts, view exercise history, and monitor their strength progress
          over time.
        </p>

        <div className="hero-buttons">
          {userEmail ? (
            <>
              <p className="logged-in-text">Logged in as {userEmail}</p>
              <button className="secondary-button" onClick={onLogoutClick}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={onSignUpClick}>Sign Up</button>
              <button 
                className="secondary-button"
                onClick={onLoginClick}
              >
                Login
              </button>
            </>
          )}
        </div>

        <div className="hero-stats">
          <div>
            <strong>{workouts.length}</strong>
            <span>Exercise logs</span>
          </div>
          <div>
            <strong>
              {
                new Set(
                  workouts.map((workout) =>
                    workout.exerciseName.toLowerCase(),
                  ),
                ).size
              }
            </strong>
            <span>Exercises tracked</span>
          </div>
          <div>
            <strong>{workoutStreak.current}</strong>
            <span>Day streak</span>
          </div>
        </div>
      </div>

      <div className="hero-card">
        <div className="hero-card-heading">
          <div>
            <span className="section-kicker">Your training</span>
            <h3>Recent Workouts</h3>
          </div>
          <span className="status-pill">Live</span>
        </div>

        <div className="streak-summary">
          <div>
            <span>Current streak</span>
            <strong>{workoutStreak.current} days</strong>
          </div>
          <div>
            <span>Longest streak</span>
            <strong>{workoutStreak.longest} days</strong>
          </div>
        </div>

        {workouts.length === 0 ? (
          <div className="hero-empty-state">
            <strong>Ready for your first session?</strong>
            <p>Your latest exercises will appear here.</p>
          </div>
        ) : (
          workouts.slice(0, 3).map((workout) => (
            <div className="workout-item" key={workout.id}>
              <div>
                <span>{workout.exerciseName}</span>
                <small>
                  {new Date(`${workout.date}T00:00:00`).toLocaleDateString(
                    "en-SG",
                    { day: "numeric", month: "short" },
                  )}
                </small>
              </div>
              <strong>{workout.sets} × {workout.reps} @ {workout.weight}kg</strong>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default HeroSection;

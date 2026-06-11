import type { Workout } from "./types";

interface HeroSectionProps {
  userEmail: string | null;
  workouts: Workout[];
  onSignUpClick: () => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

function HeroSection({
  userEmail,
  workouts,
  onSignUpClick,
  onLoginClick,
  onLogoutClick,
}: HeroSectionProps) {
  return (
    <section className="hero">
      <div className="hero-text">
        <p className="tagline">Workout tracking made simple</p>
        <h1>Track your lifts. Build your progress.</h1>
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
      </div>

      <div className="hero-card">
        <h3>Today&apos;s Workout</h3>

        {workouts.length === 0 ? (
          <p>No workouts logged yet.</p>
        ) : (
          workouts.slice(0, 3).map((workout, index) => (
            <div className="workout-item" key={index}>
              <span>{workout.exerciseName}</span>
              <strong>
                {workout.sets} × {workout.reps}
              </strong>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default HeroSection;

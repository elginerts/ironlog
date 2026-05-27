interface HeroSectionProps {
  onSignUpClick: () => void;
}

function HeroSection({ onSignUpClick }: HeroSectionProps) {
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
          <button onClick={onSignUpClick}>Sign Up</button>
          <button className="secondary-button">Login</button>
        </div>
      </div>

      <div className="hero-card">
        <h3>Today&apos;s Workout</h3>

        <div className="workout-item">
          <span>Bench Press</span>
          <strong>3 × 8</strong>
        </div>

        <div className="workout-item">
          <span>Squat</span>
          <strong>4 × 6</strong>
        </div>

        <div className="workout-item">
          <span>Pull Ups</span>
          <strong>3 × 10</strong>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
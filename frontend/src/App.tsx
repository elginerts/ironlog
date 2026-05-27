import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">

      <header className="navbar">

        <h2>IRONLOG</h2>

        <nav>

          <a href="#">Home</a>

          <a href="#">Workouts</a>

          <a href="#">Progress</a>

        </nav>

      </header>

      <main>

        <section className="hero">

          <div className="hero-text">

            <p className="tagline">Workout tracking made simple</p>

            <h1>Track your lifts. Build your progress.</h1>

            <p className="description">

              IRONLOG is a fitness tracking app that helps gym users record

              workouts, view exercise history, and monitor their strength

              progress over time.

            </p>

            <div className="hero-buttons">

              <button>Login</button>

              <button className="secondary-button">Sign Up</button>

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

        <section className="features">

          <h2>Key Features</h2>

          <div className="feature-grid">

            <div className="feature-card">

              <h3>Workout Logging</h3>

              <p>Record exercises, sets, reps, and weights in one place.</p>

            </div>

            <div className="feature-card">

              <h3>Exercise History</h3>

              <p>View previous sessions and compare your past performance.</p>

            </div>

            <div className="feature-card">

              <h3>Progress Tracking</h3>

              <p>Track strength improvements across weeks and months.</p>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

export default App

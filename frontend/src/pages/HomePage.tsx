import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import type { Workout } from '../components/types';
import type { WorkoutStreak } from "../utils/workoutStreak";

type HomePageProps = {
  userEmail: string | null;
  workouts: Workout[];
  workoutStreak: WorkoutStreak;
  onSignUpClick: () => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
};

function HomePage({
  userEmail,
  workouts,
  workoutStreak,
  onSignUpClick,
  onLoginClick,
  onLogoutClick,
}: HomePageProps) {
  return (
    <>
      <HeroSection
        userEmail={userEmail}
        workouts={workouts}
        workoutStreak={workoutStreak}
        onSignUpClick={onSignUpClick}
        onLoginClick={onLoginClick}
        onLogoutClick={onLogoutClick}
      />

      <FeaturesSection />
    </>
  );
}

export default HomePage;

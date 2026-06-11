import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import type { Workout } from '../components/types';

type HomePageProps = {
  userEmail: string | null;
  workouts: Workout[];
  onSignUpClick: () => void;
  onLoginClick: () => void;
  onLogoutClick: () => void;
};

function HomePage({
  userEmail,
  workouts,
  onSignUpClick,
  onLoginClick,
  onLogoutClick,
}: HomePageProps) {
  return (
    <>
      <HeroSection
        userEmail={userEmail}
        workouts={workouts}
        onSignUpClick={onSignUpClick}
        onLoginClick={onLoginClick}
        onLogoutClick={onLogoutClick}
      />

      <FeaturesSection />
    </>
  );
}

export default HomePage;

import { useState } from 'react';
import "./App.css";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import SignUpModal from "./components/SignUpModal";

function App() {
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="app">
      <Navbar />

      <main>
        <HeroSection onSignUpClick={() => setShowSignUp(true)} />
        <FeaturesSection />
      </main>

      {showSignUp && (
          <SignUpModal onClose={() => setShowSignUp(false)} />
        )}
    </div>
  );
}

export default App;

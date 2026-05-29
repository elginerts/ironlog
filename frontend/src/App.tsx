import { useState } from 'react';
import "./App.css";
import { supabase } from "./utils/supabase";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import SignUpModal from "./components/SignUpModal";
import LoginModal from "./components/LoginModal";


function App() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.log("Logout error:", error.message);
      return;
    }

    setUserEmail(null);
  }

  return (
    <div className="app">
      <Navbar />

      <main>
        <HeroSection 
          userEmail={userEmail}          
          onSignUpClick={() => setShowSignUp(true)} 
          onLoginClick={() => setShowLogin(true)}
          onLogoutClick={handleLogout}
        />
        <FeaturesSection />
      </main>

      {showSignUp && (
          <SignUpModal onClose={() => setShowSignUp(false)} />
        )}
      
      {showLogin && (
          <LoginModal 
            onClose={() => setShowLogin(false)} 
            onLoginSuccess={(email) => {
              setUserEmail(email);
              setShowLogin(false);
            }}
          
          />
        )}        
    </div>
  );
}

export default App;

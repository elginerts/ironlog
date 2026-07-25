import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import SignUpModal from "./components/SignUpModal";
import LoginModal from "./components/LoginModal";
import HomePage from "./pages/HomePage";
import WorkoutsPage from "./pages/WorkoutsPage";
import ProgressPage from "./pages/ProgressPage";
import FeedPage from "./pages/FeedPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import {
  fetchWorkoutSessions,
  type WorkoutSession,
} from "./services/workoutSessionsApi";
import { supabase } from "./utils/supabase";
import {
  attachPersonalRecordsToSessions,
  flattenWorkoutSessions,
} from "./utils/sessionWorkouts";
import { calculateWorkoutStreak } from "./utils/workoutStreak";

type LoadSessionsOptions = {
  shouldUpdate?: () => boolean;
};

function App() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsError, setSessionsError] = useState("");
  const [currentPage, setCurrentPage] = useState<string>("home");
  const isMountedRef = useRef(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user.email ?? null);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user.email ?? null);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const loadSessions = useCallback(async ({
    shouldUpdate = () => isMountedRef.current,
  }: LoadSessionsOptions = {}) => {
    if (!shouldUpdate()) return;

    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      setSessions([]);
      return;
    }

    setSessionsLoading(true);
    setSessionsError("");

    try {
      const loadedSessions = await fetchWorkoutSessions();
      if (shouldUpdate()) setSessions(loadedSessions);
    } catch (error) {
      if (shouldUpdate()) {
        setSessionsError(
          error instanceof Error
            ? error.message
            : "Unable to retrieve workout sessions.",
        );
      }
    } finally {
      if (shouldUpdate()) setSessionsLoading(false);
    }
  }, []);

  const workouts = useMemo(
    () => flattenWorkoutSessions(sessions),
    [sessions],
  );
  const sessionsWithRecords = useMemo(
    () => attachPersonalRecordsToSessions(sessions, workouts),
    [sessions, workouts],
  );
  const workoutStreak = useMemo(
    () => calculateWorkoutStreak(sessions),
    [sessions],
  );

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    let isCurrentRequest = true;

    void Promise.resolve().then(() => {
      if (isCurrentRequest) {
        void loadSessions({
          shouldUpdate: () => isCurrentRequest && isMountedRef.current,
        });
      }
    });

    return () => {
      isCurrentRequest = false;
    };
  }, [userEmail, loadSessions]);

  async function handleLogout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUserEmail(null);
      setSessions([]);
      setCurrentPage("home");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to log out.");
    }
  }

  function renderPage() {
    if (currentPage === "workouts") {
      return (
        <WorkoutsPage
          sessions={sessionsWithRecords}
          isLoading={sessionsLoading}
          errorMessage={sessionsError}
          onReload={loadSessions}
        />
      );
    }
    if (currentPage === "progress") {
      return <ProgressPage workouts={workouts} userEmail={userEmail} />;
    }
    if (currentPage === "feed") return <FeedPage />;
    if (currentPage === "leaderboard") return <LeaderboardPage />;

    return (
      <HomePage
        userEmail={userEmail}
        workouts={workouts}
        workoutStreak={workoutStreak}
        onSignUpClick={() => setShowSignUp(true)}
        onLoginClick={() => setShowLogin(true)}
        onLogoutClick={handleLogout}
      />
    );
  }

  return (
    <div className="app">
      <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main>{renderPage()}</main>
      {showSignUp && <SignUpModal onClose={() => setShowSignUp(false)} />}
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

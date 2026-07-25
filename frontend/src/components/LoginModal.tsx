import { useState } from "react";
import { supabase } from "../utils/supabase";

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
}

function LoginModal({ onClose, onLoginSuccess }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;

      setSuccessMessage("Login successful!");

      if (data.user.email) {
        onLoginSuccess(data.user.email);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to log in.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordReset() {
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim()) {
      setErrorMessage("Enter your email address first.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin,
    });

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setSuccessMessage("Password reset instructions have been sent.");
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <h2>Login to your account</h2>
        <p>Welcome back to IRONLOG!</p>

        <form onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}

          <button className="modal-button" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <button type="button" onClick={handlePasswordReset} disabled={loading}>
            Forgot password?
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;

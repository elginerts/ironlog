import { useState } from 'react';
import { supabase } from "../utils/supabase";

interface SignUpModalProps {
  onClose: () => void;
}

function SignUpModal({ onClose }: SignUpModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [username, setUsername] = useState("");

  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {

    event.preventDefault();

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // creates supabase auth account
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert(
          {
            id: data.user.id,
            username: username.trim(),
          },
        );

      if (profileError) {
        setErrorMessage(profileError.message);
        setLoading(false);
        return;
    }
  }

    console.log("Signup data:", data);
    setSuccessMessage("Account created! You may proceed to Login.");
    setLoading(false);
  } 



  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <h2>Create your account</h2>
        <p>Sign up to start tracking your workouts with IRONLOG.</p>

        <form onSubmit={handleSignUp}>
          <label>Username</label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange = {(event) => setUsername(event.target.value)}
            required
          />

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
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default SignUpModal;
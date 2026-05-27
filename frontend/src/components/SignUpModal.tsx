interface SignUpModalProps {
  onClose: () => void;
}

function SignUpModal({ onClose }: SignUpModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <h2>Create your account</h2>
        <p>Sign up to start tracking your workouts with IRONLOG.</p>

        <label>Email</label>
        <input type="email" placeholder="Enter your email" />

        <label>Password</label>
        <input type="password" placeholder="Enter your password" />

        <button className="modal-button">Sign Up</button>
      </div>
    </div>
  );
}

export default SignUpModal;
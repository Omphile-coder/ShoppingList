import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { useState } from "react";
import { getUserByEmail } from "../services/authService";
import { decryptData } from "../utils/encryption";
import { login } from "../features/auth/authSlice";
import listIcon from "../assets/ListIcon.webp";
import { useToast } from "../components/ToastContext";

export const LoginPage = () => {
  // Initializes routing, Redux dispatch, and toast notifications, along with local state for form inputs
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handles the login process by validating credentials against the database and managing loading states
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Fetch the user from the database based on the provided email address
      const user = await getUserByEmail(email);

      if (!user) {
        showToast("Invalid email or password.", "error");
        return;
      }
      
      // Decrypt the password stored in the database to prepare for comparison
      if (!user.password) {
        showToast("Invalid email or password.", "error");
        return;
      }

      const decryptedPassword = decryptData(user.password);

      // Compare the decrypted database password to what the user just typed in the form
      if (decryptedPassword !== password) {
        showToast("Invalid email or password.", "error");
        return;
      }

      // If they match, securely strip the password from the object before saving the user to the Redux store
      const { password: _, ...safeUser } = user;
      dispatch(login(safeUser));

      // Redirect the authenticated user back to the homepage
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      showToast("Something went wrong while logging in. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-container">
      <div className="auth-icon-circle" aria-hidden="true">
        <img src={listIcon} alt="" />
      </div>
      <h1>Welcome Back</h1>

      {/* Renders the login form, disabling the submit button during API calls to prevent duplicate submissions */}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="input-group">
          <label htmlFor="email" className="input-label">
            Email:
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
          />
        </div>

        <div className="input-group">
          <label htmlFor="password" className="input-label">
            Password:
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
          />
        </div>

        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="auth-footer">
        Don't have an account? <Link to="/register">Sign up here</Link>
      </p>
    </main>
  );
};
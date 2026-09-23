import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { useState } from "react";
import { getUserByEmail } from "../services/authService";
import { decryptData } from "../utils/encryption";
import { login } from "../features/auth/authSlice";
import listIcon from "../assets/ListIcon.webp";
import { useToast } from "../components/ToastContext";

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      //   Fetch the user from the database
      const user = await getUserByEmail(email);

      if (!user) {
        showToast("Invalid email or password.", "error");
        return;
      }
      //   Decrypt the password stored in the database
      if (!user.password) {
        showToast("Invalid email or password.", "error");
        return;
      }

      const decryptedPassword = decryptData(user.password);

      //   Compare the encrypted password to what the user just typed
      if (decryptedPassword !== password) {
        showToast("Invalid email or password.", "error");
        return;
      }

      //   If they match, tell Redux that the user is logged in!
      const { password: _, ...safeUser } = user;
      dispatch(login(safeUser));

      //   Go back to the homepage
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

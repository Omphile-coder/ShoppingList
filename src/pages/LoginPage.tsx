import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { useState } from "react";
import { getUserByEmail } from "../services/authService";
import { decryptData } from "../utils/encryption";
import { login } from "../features/auth/authSlice";

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      //   Fetch the user from the database
      const user = await getUserByEmail(email);

      if (!user) {
        setError("Invalid email or password.");
        return;
      }
      //   Decrypt the password stored in the database
      const decryptedPassword = decryptData(user.password);

      //   Compare the encrypted password to what the user just typed
      if (decryptedPassword !== password) {
        setError("Invalid email or password.");
        return;
      }

      //   If they match, tell Redux that the user is logged in!
      const { password: _, ...safeUser } = user;
      dispatch(login(safeUser));

      //   Go back to the homepage
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong while logging in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-container">
      <h1>Welcome Back</h1>

      {error && <p className="alert-error">{error}</p>}

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

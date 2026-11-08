import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import { getUserByEmail, publicUser } from "../services/authService";
import { decryptData } from "../utils/encryption";
import { login } from "../features/auth/authSlice";
import { AuthLayout } from "../components/AuthLayout";
import { PasswordInput } from "../components/PasswordInput";

// Checks encrypted credentials and opens the signed-in user's list dashboard.
export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetches the account by email, verifies the password, then stores only its profile.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const user = await getUserByEmail(email);
      if (!user?.password || decryptData(user.password) !== password) {
        setError("The email or password is incorrect.");
        return;
      }
      dispatch(login(publicUser(user)));
      navigate("/", { replace: true });
    } catch {
      setError("Couldn't connect to WeShop. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to see your shopping lists.">
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="input-group" htmlFor="email">
          Email address
          <input id="email" type="email" autoComplete="email" className="auth-input" placeholder="you@example.com"
            value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <PasswordInput id="password" autoComplete="current-password" value={password}
            onChange={(event) => setPassword(event.target.value)} required />
        </div>
        {error && <p role="alert" className="alert-error">{error}</p>}
        <button type="submit" className="auth-button" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
      </form>
      <p className="auth-footer">New to WeShop? <Link to="/register">Create an account</Link></p>
    </AuthLayout>
  );
}

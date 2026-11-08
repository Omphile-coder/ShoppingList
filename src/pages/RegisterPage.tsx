import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { PasswordInput } from "../components/PasswordInput";
import { useToast } from "../components/useToast";
import { login } from "../features/auth/authSlice";
import { getUserByEmail, publicUser, registerUser, type RegisterData } from "../services/authService";
import { useAppDispatch } from "../store/hooks";

// Creates the required profile fields and takes the new user straight to My lists.
export function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const [form, setForm] = useState<RegisterData>({ name: "", surname: "", email: "", cellNumber: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Keeps the input name and the account field in sync.
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  // Checks for an existing email and stores the new session without its password.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    const name = form.name.trim();
    const surname = form.surname.trim();
    const cellNumber = form.cellNumber.trim();
    if (!name || !surname || !cellNumber) {
      setError("Enter your first name, surname, and cell number.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (await getUserByEmail(form.email)) {
        setError("An account with that email already exists.");
        return;
      }
      const user = await registerUser({ ...form, name, surname, cellNumber });
      dispatch(login(publicUser(user)));
      showToast("Your WeShop account is ready.");
      navigate("/", { replace: true });
    } catch {
      setError("Couldn't create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Create an account" subtitle="Make a space for all your shopping lists.">
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="field-row">
          <label className="input-group">First name
            <input name="name" className="auth-input" autoComplete="given-name" value={form.name} onChange={handleChange} required />
          </label>
          <label className="input-group">Surname
            <input name="surname" className="auth-input" autoComplete="family-name" value={form.surname} onChange={handleChange} required />
          </label>
        </div>
        <label className="input-group">Email address
          <input name="email" type="email" className="auth-input" autoComplete="email" value={form.email} onChange={handleChange} required />
        </label>
        <label className="input-group">Cell number
          <input name="cellNumber" type="tel" className="auth-input" autoComplete="tel" value={form.cellNumber} onChange={handleChange} required />
        </label>
        <div className="input-group">
          <label htmlFor="new-password">Password</label>
          <PasswordInput id="new-password" name="password" autoComplete="new-password" minLength={8}
            value={form.password} onChange={handleChange} required aria-describedby="password-hint" />
          <small className="muted" id="password-hint">Use at least 8 characters.</small>
        </div>
        {error && <p role="alert" className="alert-error">{error}</p>}
        <button type="submit" className="auth-button" disabled={loading}>{loading ? "Creating account…" : "Create account"}</button>
      </form>
      <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
    </AuthLayout>
  );
}

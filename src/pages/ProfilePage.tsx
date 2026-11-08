import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getUserByEmail, publicUser, updateUser } from "../services/authService";
import { login } from "../features/auth/authSlice";
import { encryptData, decryptData } from "../utils/encryption";
import { PasswordInput } from "../components/PasswordInput";
import { useToast } from "../components/useToast";

// Opens the profile for the current Redux session.
export function ProfilePage() {
  const user = useAppSelector((state) => state.auth.currentUser);
  return user ? <ProfileForm key={user.id} user={user} /> : null;
}

type Profile = ReturnType<typeof publicUser>;

// Lets the user update their contact details or change their password.
function ProfileForm({ user }: { user: Profile }) {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [details, setDetails] = useState({ name: user.name, surname: user.surname, email: user.email, cellNumber: user.cellNumber ?? "" });
  const [changingPassword, setChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Validates a changed email, saves the profile, and refreshes the local session.
  async function saveDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = details.name.trim();
    const surname = details.surname.trim();
    const email = details.email.trim().toLowerCase();
    const cellNumber = details.cellNumber.trim();
    if (!name || !surname || !cellNumber) {
      setError("Enter your first name, surname, and cell number.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (email !== user.email && await getUserByEmail(email)) {
        setError("That email is already in use.");
        return;
      }
      dispatch(login(publicUser(await updateUser(user.id, { name, surname, email, cellNumber }))));
      setEditing(false);
      showToast("Profile saved.");
    } catch {
      setError("Couldn't save your profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  // Clears the draft credentials whenever the password form closes.
  function closePasswordForm() {
    setOldPassword("");
    setPassword("");
    setConfirmation("");
    setChangingPassword(false);
    setError("");
  }

  // Verifies the old password before encrypting and saving the new one.
  async function savePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirmation) {
      setError("The new passwords don't match.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const account = await getUserByEmail(user.email);
      if (!account?.password || decryptData(account.password) !== oldPassword) {
        setError("The current password is incorrect.");
        return;
      }
      await updateUser(user.id, { password: encryptData(password) });
      closePasswordForm();
      showToast("Password updated.");
    } catch {
      setError("Couldn't change your password. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="dashboard-container">
      <Link to="/" className="back-link"><ArrowLeft size={16} /> My lists</Link>
      <header className="page-hero">
        <div><p className="eyebrow">YOUR ACCOUNT</p><h1>Profile</h1><p>Manage your WeShop details and password.</p></div>
      </header>
      <div className="profile-grid">
        <section className="list-card">
          <h2>Personal details</h2>
          {editing ? (
            <form className="auth-form" onSubmit={saveDetails}>
              <fieldset disabled={saving}>
                <label className="input-group">First name
                  <input className="auth-input" value={details.name} onChange={(event) => setDetails({ ...details, name: event.target.value })} required />
                </label>
                <label className="input-group">Surname
                  <input className="auth-input" value={details.surname} onChange={(event) => setDetails({ ...details, surname: event.target.value })} required />
                </label>
                <label className="input-group">Email address
                  <input className="auth-input" type="email" value={details.email} onChange={(event) => setDetails({ ...details, email: event.target.value })} required />
                </label>
                <label className="input-group">Cell number
                  <input className="auth-input" type="tel" value={details.cellNumber} onChange={(event) => setDetails({ ...details, cellNumber: event.target.value })} required />
                </label>
              </fieldset>
              {error && <p role="alert" className="alert-error">{error}</p>}
              <div className="card-actions">
                <button className="action-btn btn-primary" disabled={saving}>{saving ? "Saving…" : "Save details"}</button>
                <button type="button" className="action-btn edit-btn" disabled={saving} onClick={() => { setEditing(false); setError(""); }}>Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <dl className="profile-details">
                <dt>Name</dt><dd>{user.name} {user.surname}</dd>
                <dt>Email address</dt><dd>{user.email}</dd>
                <dt>Cell number</dt><dd>{user.cellNumber || "Not added"}</dd>
              </dl>
              <button className="action-btn edit-btn" disabled={changingPassword} onClick={() => {
                setDetails({ name: user.name, surname: user.surname, email: user.email, cellNumber: user.cellNumber ?? "" });
                setEditing(true);
              }}>Edit details</button>
            </>
          )}
        </section>
        <section className="list-card">
          <h2>Password</h2>
          {changingPassword ? (
            <form className="auth-form" onSubmit={savePassword}>
              <fieldset disabled={saving}>
                <div className="input-group"><label htmlFor="old-password">Current password</label>
                  <PasswordInput id="old-password" autoComplete="current-password" value={oldPassword} onChange={(event) => setOldPassword(event.target.value)} required />
                </div>
                <div className="input-group"><label htmlFor="new-password">New password</label>
                  <PasswordInput id="new-password" autoComplete="new-password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required />
                </div>
                <div className="input-group"><label htmlFor="confirm-password">Confirm new password</label>
                  <PasswordInput id="confirm-password" autoComplete="new-password" minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required />
                </div>
              </fieldset>
              {error && <p role="alert" className="alert-error">{error}</p>}
              <div className="card-actions">
                <button className="action-btn btn-primary" disabled={saving}>{saving ? "Saving…" : "Save password"}</button>
                <button type="button" className="action-btn edit-btn" disabled={saving} onClick={closePasswordForm}>Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <p className="muted">Use at least 8 characters for your new password.</p>
              <button className="action-btn edit-btn" disabled={editing} onClick={() => setChangingPassword(true)}>Change password</button>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

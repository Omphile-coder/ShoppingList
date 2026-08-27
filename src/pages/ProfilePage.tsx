import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getUserByEmail, updateUser } from "../services/authService";
import { login } from "../features/auth/authSlice";
import { encryptData } from "../utils/encryption";

export const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  // Personal info state
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [infoForm, setInfoForm] = useState({
    name: currentUser?.name || "",
    surname: currentUser?.surname || "",
    email: currentUser?.email || "",
    cellNumber: currentUser?.cellNumber || "",
  });

  // password states
  const [isEditingPassowrd, setIsEditingPassowrd] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!currentUser) return null;

  // Updating personal info
  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const normalizedEmail = infoForm.email.trim().toLowerCase();

      if (normalizedEmail !== currentUser.email) {
        const existing = await getUserByEmail(normalizedEmail);

        if (existing) {
          setError("That email is already in use by another account.");
          return;
        }
      }

      const updatedUser = await updateUser(currentUser.id, {
        ...infoForm,
        email: normalizedEmail,
      });

      //Update the redux state now
      dispatch(login(updatedUser));
      setMessage("Profile updated successfully!");
      setIsEditingInfo(false);
    } catch (err) {
      console.error(err);
      setError("Failed to update profile");
    }
  };

  // Updating password

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const encryptedPassword = encryptData(password);

      const updatedUser = await updateUser(currentUser.id, {
        password: encryptedPassword,
      });

      const { password: _, ...safeUser } = updatedUser;
      dispatch(login(safeUser));

      setMessage("Password updated securely!");
      setIsEditingPassowrd(false);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setError("Failed to update password.");
    }
  };

  return (
    <main className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Profile</h1>
      </div>

      {message && <p className="alert-success">{message}</p>}
      {error && <p className="alert-error">{error}</p>}

      {/* SECTION 1: Personal Information */}
      <div className="item-form-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h2>Personal Information</h2>
          {!isEditingInfo && (
            <button
              onClick={() => setIsEditingInfo(true)}
              className="action-btn edit-btn"
            >
              Edit Details
            </button>
          )}
        </div>

        {!isEditingInfo ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <p>
              <strong>Name:</strong> {currentUser.name}
            </p>
            <p>
              <strong>Surname:</strong> {currentUser.surname}
            </p>
            <p>
              <strong>Email:</strong> {currentUser.email}
            </p>
            <p>
              <strong>Cell Number:</strong> {currentUser.cellNumber}
            </p>
          </div>
        ) : (
          <form onSubmit={handleUpdateInfo} className="auth-form">
            <input
              type="text"
              value={infoForm.name}
              onChange={(e) =>
                setInfoForm({ ...infoForm, name: e.target.value })
              }
              className="auth-input"
              required
            />
            <input
              type="text"
              value={infoForm.surname}
              onChange={(e) =>
                setInfoForm({ ...infoForm, surname: e.target.value })
              }
              className="auth-input"
              required
            />
            <input
              type="email"
              value={infoForm.email}
              onChange={(e) =>
                setInfoForm({ ...infoForm, email: e.target.value })
              }
              className="auth-input"
              required
            />
            <input
              type="tel"
              value={infoForm.cellNumber}
              onChange={(e) =>
                setInfoForm({ ...infoForm, cellNumber: e.target.value })
              }
              className="auth-input"
              required
            />
            <div className="card-actions">
              <button type="submit" className="action-btn btn-primary">
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditingInfo(false)}
                className="action-btn delete-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* SECTION 2: Security & Credentials */}
      <div className="item-form-container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <h2>Login Credentials</h2>
          {!isEditingPassowrd && (
            <button
              onClick={() => setIsEditingPassowrd(true)}
              className="action-btn edit-btn"
            >
              Change Password
            </button>
          )}
        </div>

        {isEditingPassowrd && (
          <form onSubmit={handleUpdatePassword} className="auth-form">
            <input
              type="password"
              placeholder="New Password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="auth-input"
              required
            />
            <div className="card-actions">
              <button type="submit" className="action-btn btn-primary">
                Update Password
              </button>
              <button
                type="button"
                onClick={() => setIsEditingPassowrd(false)}
                className="action-btn delete-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
};

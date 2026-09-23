import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getUserByEmail, updateUser } from "../services/authService";
import { login } from "../features/auth/authSlice";
import { encryptData } from "../utils/encryption";
import { useToast } from "../components/ToastContext";

export const ProfilePage = () => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  
  // Retrieves the logged-in user from Redux to pre-fill the profile fields
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  // Manages the toggle state and form inputs for updating the user's personal details
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [infoForm, setInfoForm] = useState({
    name: currentUser?.name || "",
    surname: currentUser?.surname || "",
    email: currentUser?.email || "",
    cellNumber: currentUser?.cellNumber || "",
  });

  // Manages the toggle state and form inputs for the password change feature
  const [isEditingPassowrd, setIsEditingPassowrd] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!currentUser) return null;

  // Validates email uniqueness before updating the user's details in the database and syncing the Redux store
  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const normalizedEmail = infoForm.email.trim().toLowerCase();

      // Check if the user is trying to change their email to one that is already taken
      if (normalizedEmail !== currentUser.email) {
        const existing = await getUserByEmail(normalizedEmail);

        if (existing) {
          showToast("That email is already in use by another account.", "error");
          return;
        }
      }

      const updatedUser = await updateUser(currentUser.id, {
        ...infoForm,
        email: normalizedEmail,
      });

      // Update the Redux state with the fresh data and close the editing form
      dispatch(login(updatedUser));
      showToast("Profile updated successfully!", "success");
      setIsEditingInfo(false);
    } catch (err) {
      console.error(err);
      showToast("Failed to update profile. Please try again.", "error");
    }
  };

  // Verifies that the new passwords match, encrypts the input, and securely updates the database
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    try {
      const encryptedPassword = encryptData(password);

      const updatedUser = await updateUser(currentUser.id, {
        password: encryptedPassword,
      });

      // Securely strip the password from the payload before sending the updated user back to Redux
      const { password: _, ...safeUser } = updatedUser;
      dispatch(login(safeUser));

      showToast("Password updated securely!", "success");
      setIsEditingPassowrd(false);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      showToast("Failed to update password. Please try again.", "error");
    }
  };

  return (
    <main className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Profile</h1>
      </div>

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

        {/* Dynamically toggles between a read-only view of the user's info and an editable form */}
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
            <label htmlFor="profile-name" className="input-label">
              Name:
            </label>
            <input
              id="profile-name"
              type="text"
              value={infoForm.name}
              onChange={(e) =>
                setInfoForm({ ...infoForm, name: e.target.value })
              }
              className="auth-input"
              required
            />
            <label htmlFor="profile-surname" className="input-label">
              Surname:
            </label>
            <input
              id="profile-surname"
              type="text"
              value={infoForm.surname}
              onChange={(e) =>
                setInfoForm({ ...infoForm, surname: e.target.value })
              }
              className="auth-input"
              required
            />
            <label htmlFor="profile-email" className="input-label">
              Email:
            </label>
            <input
              id="profile-email"
              type="email"
              value={infoForm.email}
              onChange={(e) =>
                setInfoForm({ ...infoForm, email: e.target.value })
              }
              className="auth-input"
              required
            />
            <label htmlFor="profile-cell-number" className="input-label">
              Cell Number:
            </label>
            <input
              id="profile-cell-number"
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

        {/* Renders the password change form with strict minimum length requirements */}
        {isEditingPassowrd && (
          <form onSubmit={handleUpdatePassword} className="auth-form">
            <label htmlFor="new-password" className="input-label">
              New Password:
            </label>
            <input
              id="new-password"
              type="password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
            />
            <label htmlFor="confirm-password" className="input-label">
              Confirm New Password:
            </label>
            <input
              id="confirm-password"
              type="password"
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
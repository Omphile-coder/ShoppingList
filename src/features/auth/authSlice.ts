import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { publicUser, type PublicUser } from "../../services/authService";

const sessionKey = "shoppingListUser";

// Reads the saved profile on refresh and strips any credential left by an older version.
function readSession(): PublicUser | null {
  try {
    const stored = JSON.parse(localStorage.getItem(sessionKey) ?? "null");
    if (!stored || typeof stored.id !== "string" || typeof stored.email !== "string") return null;
    const profile = publicUser(stored);
    localStorage.setItem(sessionKey, JSON.stringify(profile));
    return profile;
  } catch {
    return null;
  }
}

const storedUser = readSession();
const initialState = { isAuthenticated: Boolean(storedUser), currentUser: storedUser as PublicUser | null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Updates the Redux session and persists only the fields used by the app.
    login(state, action: PayloadAction<PublicUser>) {
      state.isAuthenticated = true;
      state.currentUser = publicUser(action.payload);
      localStorage.setItem(sessionKey, JSON.stringify(state.currentUser));
    },
    // Removes the saved session and disables protected routes.
    logout(state) {
      state.isAuthenticated = false;
      state.currentUser = null;
      localStorage.removeItem(sessionKey);
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

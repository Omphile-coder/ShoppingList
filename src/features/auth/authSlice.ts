import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../services/authService";

// Defines the shape of the authentication state, explicitly excluding the password for security
interface AuthState {
  isAuthenticated: boolean;
  currentUser: Omit<User, "password"> | null;
}

// Safely attempts to retrieve the persisted user session from local storage to maintain login state across page reloads
const getStoredUser = (): Omit<User, "password"> | null => {
  try {
    return JSON.parse(localStorage.getItem("shoppingListUser") || "null");
  } catch {
    return null;
  }
};

const storedUser = getStoredUser();

const initialState: AuthState = {
  isAuthenticated: Boolean(storedUser),
  currentUser: storedUser,
};

// Creates the Redux slice for authentication, managing both memory state and local storage synchronization
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Updates the state with the user details and saves them to local storage upon successful login
    login: (state, action: PayloadAction<Omit<User, "password">>) => {
      state.isAuthenticated = true;
      state.currentUser = action.payload;
      localStorage.setItem("shoppingListUser", JSON.stringify(action.payload));
    },
    // Clears the user from both Redux state and local storage when logging out
    logout: (state) => {
      state.isAuthenticated = false;
      state.currentUser = null;
      localStorage.removeItem("shoppingListUser");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
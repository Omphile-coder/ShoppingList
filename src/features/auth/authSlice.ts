import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../services/authService";

interface AuthState {
  isAuthenticated: boolean;
  currentUser: Omit<User, "password"> | null;
}

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

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<Omit<User, "password">>) => {
      state.isAuthenticated = true;
      state.currentUser = action.payload;
      localStorage.setItem("shoppingListUser", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.currentUser = null;
      localStorage.removeItem("shoppingListUser");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

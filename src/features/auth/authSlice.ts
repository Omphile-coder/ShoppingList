import { createSlice, current } from "@reduxjs/toolkit";


interface AuthState { 
    isAuthenticated: boolean;
    currentUser: any | null;
}

const initialState: AuthState = {

    isAuthenticated: false,
    currentUser: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuthenticated = true;
            state.currentUser = action.payload
        },

        logout: (state) => {
            state.isAuthenticated = false;
            state.currentUser = null;
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
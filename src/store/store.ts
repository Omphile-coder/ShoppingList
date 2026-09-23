import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import authReducer from "../features/auth/authSlice";
import shoppingListReducer from "../features/shoppingLists/shoppingListsSlice";
import shoppingItemReducer from "../features/shoppingLists/shoppingItemSlice";
import { imageApi } from "../api/imageApi";

// Configures the central Redux store, combining standard state slices with the RTK Query API reducer
export const store = configureStore({
  reducer: {
    auth: authReducer,
    shoppingLists: shoppingListReducer,
    shoppingItems: shoppingItemReducer,
    [imageApi.reducerPath]: imageApi.reducer,
  },
  // Appends the RTK Query middleware required to handle automatic caching, background fetching, and polling
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(imageApi.middleware),
});

// Automatically infers the complete structure of the application state and dispatch functions directly from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Exports strongly-typed versions of the standard Redux hooks so components receive accurate autocomplete and type checking
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
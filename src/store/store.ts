import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import authReducer from "../features/auth/authSlice";
import shoppingListReducer from "../features/shoppingLists/shoppingListsSlice";
import shoppingItemReducer from "../features/shoppingLists/shoppingItemSlice";
import { imageApi } from "../api/imageApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shoppingLists: shoppingListReducer,
    shoppingItems: shoppingItemReducer,
    [imageApi.reducerPath]: imageApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(imageApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

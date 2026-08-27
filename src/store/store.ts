import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import shoppingListReducer from "../features/shoppingLists/shoppingListsSlice";
import shoppingItemReducer  from "../features/shoppingLists/shoppingItemSlice";

export const store = configureStore({
 
    reducer: {
        auth: authReducer, 
        shoppingLists: shoppingListReducer,
        shoppingItems: shoppingItemReducer,
    },
  
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
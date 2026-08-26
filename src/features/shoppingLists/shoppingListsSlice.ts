import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ShoppingList } from "../../services/shoppingListService";

interface ShoppingListState {
  lists: ShoppingList[];
}

const initialState: ShoppingListState = {
  lists: [],
};

const shoppingListSlice = createSlice({
  name: "shoppingLists",
  initialState,
  reducers: {
    setLists: (state, action: PayloadAction<ShoppingList[]>) => {
      state.lists = action.payload;
    },
    addList: (state, action: PayloadAction<ShoppingList>) => {
      state.lists.push(action.payload);
    },
  },
});

export const { setLists, addList } = shoppingListSlice.actions;
export default shoppingListSlice.reducer;
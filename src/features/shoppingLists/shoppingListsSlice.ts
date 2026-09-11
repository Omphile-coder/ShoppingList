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
    updateList: (state, action: PayloadAction<ShoppingList>) => {
      const index = state.lists.findIndex((list) => list.id === action.payload.id);
      if (index !== -1) state.lists[index] = action.payload;
    },
    deleteList: (state, action: PayloadAction<string>) => {
      state.lists = state.lists.filter((list) => list.id !== action.payload);
    },
  },
});

export const { setLists, addList, updateList, deleteList } = shoppingListSlice.actions;
export default shoppingListSlice.reducer;

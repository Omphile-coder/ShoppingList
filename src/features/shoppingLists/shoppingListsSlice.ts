import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ShoppingList } from "../../services/shoppingListService";

// Defines the structure for the shopping lists state and initializes it as an empty array
interface ShoppingListState {
  lists: ShoppingList[];
}

const initialState: ShoppingListState = {
  lists: [],
};

// Creates the Redux slice for managing shopping lists, allowing direct state mutation under the hood via RTK's Immer
const shoppingListSlice = createSlice({
  name: "shoppingLists",
  initialState,
  reducers: {
    // Replaces the entire array of shopping lists, typically used when loading initial data from a database
    setLists: (state, action: PayloadAction<ShoppingList[]>) => {
      state.lists = action.payload;
    },
    
    // Appends a newly created shopping list to the end of the state array
    addList: (state, action: PayloadAction<ShoppingList>) => {
      state.lists.push(action.payload);
    },
    
    // Finds an existing list by its ID and overwrites it with the updated payload data
    updateList: (state, action: PayloadAction<ShoppingList>) => {
      const index = state.lists.findIndex((list) => list.id === action.payload.id);
      if (index !== -1) state.lists[index] = action.payload;
    },
    
    // Removes a shopping list from the state by filtering out the one matching the provided ID
    deleteList: (state, action: PayloadAction<string>) => {
      state.lists = state.lists.filter((list) => list.id !== action.payload);
    },
  },
});

// Exports the generated action creators for component dispatching and the reducer for store configuration
export const { setLists, addList, updateList, deleteList } = shoppingListSlice.actions;
export default shoppingListSlice.reducer;
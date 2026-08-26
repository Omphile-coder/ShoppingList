import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ShoppingList } from "../../services/shoppingListService";
import api from "../../services/api";

interface ShoppingListState {
  lists: ShoppingList[];
}

const initialState: ShoppingListState = {
  lists: [],
};

//shopping list slice called 'shoppingLists'
const shoppingListSlice = createSlice({
  name: "shoppingLists",
  initialState,
  reducers: {

    // replace the shopping list
    setLists: (state, action: PayloadAction<ShoppingList[]>) => {
      state.lists = action.payload;
    },
    // adding to the shopping list
    addList: (state, action: PayloadAction<ShoppingList>) => {
      state.lists.push(action.payload);
    },

    // editing a shopping list
    updateList: (state, action: PayloadAction<ShoppingList>) => {
      const index = state.lists.findIndex((list) => list.id === action.payload.id);
      if (index !== 1) {
        state.lists[index] = action.payload;
       }
    },

    // remove list from the shopping list
    deleteList: (state, action: PayloadAction<string>) =>{ 
      state.lists = state.lists.filter((list) => list.id !== action.payload);
    }

  },
});


// Update an existing list
export const updateShoppingList = async (id: string, listData: Partial<ShoppingList>) => { 
  const response = await api.patch<ShoppingList>(`/shoppingLsts/${id}`, listData);
}

// Delete a list
export const deleteShoppingList = async (id: string) => { 
  await api.delete(`/shoppingLists/${id}`);
}

export const { setLists, addList, updateList, deleteList } = shoppingListSlice.actions;
export default shoppingListSlice.reducer;
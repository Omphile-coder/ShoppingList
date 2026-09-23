import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ShoppingItem } from "../../services/shoppingItemService";

// Defines the structure of the shopping list state and initializes it as an empty array
interface ShoppingItemState { 
    items: ShoppingItem[];
}

const initialState: ShoppingItemState = {
    items: [],
};

// Creates the Redux slice for managing shopping items, utilizing RTK's Immer library to safely mutate state directly
const shoppingItemSlice = createSlice({
    name: "shoppingItems",
    initialState,
    reducers: {
        // Overwrites the entire list of items, typically used when first loading data from an API or database
        setItems: (state, action: PayloadAction<ShoppingItem[]>) => { 
            state.items = action.payload;
        },

        // Appends a single new shopping item to the end of the current list
        addItem:(state, action: PayloadAction<ShoppingItem>) => { 
            state.items.push(action.payload);
        },
        
        // Locates an existing item by its ID and replaces it entirely with the updated payload data
        updateItem: (state, action: PayloadAction<ShoppingItem>) => { 
            const index = state.items.findIndex(item => item.id === action.payload.id);

            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },

        // Removes an item from the state by filtering out the one matching the provided ID
        deleteItem: (state, action: PayloadAction<string>) => { 
            state.items = state.items.filter(item => item.id !== action.payload);
        },
    },
});

// Exports the generated action creators for use in components and the reducer for the store setup
export const { setItems, addItem, updateItem, deleteItem } = shoppingItemSlice.actions;
export default shoppingItemSlice.reducer;
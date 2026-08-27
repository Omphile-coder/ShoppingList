import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ShoppingItem } from "../../services/shoppingItemService";


interface ShoppingItemState { 
    items: ShoppingItem[];
}

const initialState: ShoppingItemState = {
    items: [],
};

const shoppingItemSlice = createSlice({
    name: "shoppingItems",
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<ShoppingItem[]>) => { 
            state.items = action.payload;
        },

        addItem:(state, action: PayloadAction<ShoppingItem>) => { 
            state.items.push(action.payload);
        },
        updateItem: (state, action: PayloadAction<ShoppingItem>) => { 
            const index = state.items.findIndex(item => item.id === action.payload.id);

            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },

        deleteItem: (state, action: PayloadAction<string>) => { 
            state.items = state.items.filter(item => item.id !== action.payload);
        },


    },
});

export const { setItems, addItem, updateItem, deleteItem } = shoppingItemSlice.actions;
export default shoppingItemSlice.reducer;
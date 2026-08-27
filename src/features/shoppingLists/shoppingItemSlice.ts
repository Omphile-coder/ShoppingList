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
    },
});

export const { setItems, addItem } = shoppingItemSlice.actions;
export default shoppingItemSlice.reducer;
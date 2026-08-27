import api from "./api";

export interface ShoppingItem { 
    id: string;
    listId: string;
    name: string;
    quantity: number;
    category: string;
    notes?: string;
    image?: string;
    dateAdded: string;
}


export const getShoppingItems = async (listId: string) => {
    const response = await api.get<ShoppingItem[]>("/shoppingItems", {
        params: { listId },
    });
    return response.data;
};


export const createShoppingItem = async (item: Omit<ShoppingItem, "id">) => { 
    const response = await api.post<ShoppingItem>("/shoppingItems", item);
    return response.data;
}

// Update an existing item
export const updateShoppingItem = async (id: string, itemData: Partial<ShoppingItem>) => { 
    const response = await api.patch<ShoppingItem>(`/shoppingItems/${id}`, itemData);
    return response.data;
}

// Delete an Item
export const deleteShoppingItem = async (id: string) => { 
    await api.delete(`/shoppingItems/${id}`);
}

import api from "./api";

export interface ShoppingList { 
    id: string;
    userId: string;
    name: string;
    dateAdded: string;
}

// fetch only the lists that belong to the logged in user

export const getShoppingLists = async (userId: string) => {
    const response = await api.get<ShoppingList[]>("/shoppingLists", {
        params: { userId },

    });
    return response.data;
};

// create a new list
export const createShopppingList = async (listData: Omit<ShoppingList, "id">) => {
    const response = await api.post<ShoppingList>("/shoppingLists", listData);
    return response.data;
}
 
// Update an existing list
export const updateShoppingList = async (id: string, listData: Partial<ShoppingList>): Promise<ShoppingList> => { 
    const response = await api.patch<ShoppingList>(`/shoppingLists/${id}`, listData);
    return response.data;
}

// Delete a list
export const deleteShoppingList = async (id: string) => { 
  await api.delete(`/shoppingLists/${id}`);
}
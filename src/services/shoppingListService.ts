import api from "./api";

// Defines the structure of a shopping list, linking it directly to the specific user who created it
export interface ShoppingList {
  id: string;
  userId: string;
  name: string;
  dateAdded: string;
}

// Utility functions to manage local storage caching, allowing the app to display lists instantly on page load
const cacheKey = (userId: string) => `shoppingLists:${userId}`;

export const getCachedShoppingLists = (userId: string): ShoppingList[] => {
  try {
    return JSON.parse(localStorage.getItem(cacheKey(userId)) || "[]");
  } catch {
    return [];
  }
};

const saveCachedShoppingLists = (userId: string, lists: ShoppingList[]) => {
  localStorage.setItem(cacheKey(userId), JSON.stringify(lists));
};

// Fetches the user's latest shopping lists from the backend and synchronizes the local storage cache
export const getShoppingLists = async (userId: string) => {
  const response = await api.get<ShoppingList[]>("/shoppingLists", {
    params: { userId },
  });
  saveCachedShoppingLists(userId, response.data);
  return response.data;
};

// Submits a newly created shopping list to the API and safely appends the response to the existing local cache
export const createShopppingList = async (
  listData: Omit<ShoppingList, "id">,
) => {
  const response = await api.post<ShoppingList>("/shoppingLists", listData);
  const lists = getCachedShoppingLists(listData.userId);
  saveCachedShoppingLists(listData.userId, [...lists, response.data]);
  return response.data;
};

// Sends partial updates (such as renaming the list) for a specific shopping list to the backend
export const updateShoppingList = async (
  id: string,
  listData: Partial<ShoppingList>,
): Promise<ShoppingList> => {
  const response = await api.patch<ShoppingList>(`/shoppingLists/${id}`, listData);
  return response.data;
};

// Permanently removes a shopping list from the database using its unique ID
export const deleteShoppingList = async (id: string) => {
  await api.delete(`/shoppingLists/${id}`);
};
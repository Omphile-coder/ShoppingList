import api from "./api";

// Defines the data structure for an individual item, linking it to its parent list via listId
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

// Utility functions to manage local storage, ensuring data is instantly available on reload without waiting for the API
const cacheKey = (listId: string) => `shoppingItems:${listId}`;

export const getCachedShoppingItems = (listId: string): ShoppingItem[] => {
  try {
    return JSON.parse(localStorage.getItem(cacheKey(listId)) || "[]");
  } catch {
    return [];
  }
};

const saveCachedShoppingItems = (listId: string, items: ShoppingItem[]) => {
  localStorage.setItem(cacheKey(listId), JSON.stringify(items));
};

// Fetches the latest items for a specific list from the backend and immediately updates the local cache
export const getShoppingItems = async (listId: string) => {
  const response = await api.get<ShoppingItem[]>("/shoppingItems", {
    params: { listId },
  });
  saveCachedShoppingItems(listId, response.data);
  return response.data;
};

// Submits a newly created item to the API and safely appends the response to the existing local cache
export const createShoppingItem = async (
  item: Omit<ShoppingItem, "id">,
) => {
  const response = await api.post<ShoppingItem>("/shoppingItems", item);
  const items = getCachedShoppingItems(item.listId);
  saveCachedShoppingItems(item.listId, [...items, response.data]);
  return response.data;
};

// Sends partial updates (like name or quantity changes) for a specific item to the backend
export const updateShoppingItem = async (
  id: string,
  itemData: Partial<ShoppingItem>,
) => {
  const response = await api.patch<ShoppingItem>(`/shoppingItems/${id}`, itemData);
  return response.data;
};

// Removes an item from the database using its unique ID
export const deleteShoppingItem = async (id: string) => {
  await api.delete(`/shoppingItems/${id}`);
};
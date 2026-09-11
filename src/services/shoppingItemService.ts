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

export const getShoppingItems = async (listId: string) => {
  const response = await api.get<ShoppingItem[]>("/shoppingItems", {
    params: { listId },
  });
  saveCachedShoppingItems(listId, response.data);
  return response.data;
};

export const createShoppingItem = async (
  item: Omit<ShoppingItem, "id">,
) => {
  const response = await api.post<ShoppingItem>("/shoppingItems", item);
  const items = getCachedShoppingItems(item.listId);
  saveCachedShoppingItems(item.listId, [...items, response.data]);
  return response.data;
};

export const updateShoppingItem = async (
  id: string,
  itemData: Partial<ShoppingItem>,
) => {
  const response = await api.patch<ShoppingItem>(`/shoppingItems/${id}`, itemData);
  return response.data;
};

export const deleteShoppingItem = async (id: string) => {
  await api.delete(`/shoppingItems/${id}`);
};

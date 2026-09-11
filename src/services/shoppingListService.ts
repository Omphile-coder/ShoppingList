import api from "./api";

export interface ShoppingList {
  id: string;
  userId: string;
  name: string;
  dateAdded: string;
}

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

export const getShoppingLists = async (userId: string) => {
  const response = await api.get<ShoppingList[]>("/shoppingLists", {
    params: { userId },
  });
  saveCachedShoppingLists(userId, response.data);
  return response.data;
};

export const createShopppingList = async (
  listData: Omit<ShoppingList, "id">,
) => {
  const response = await api.post<ShoppingList>("/shoppingLists", listData);
  const lists = getCachedShoppingLists(listData.userId);
  saveCachedShoppingLists(listData.userId, [...lists, response.data]);
  return response.data;
};

export const updateShoppingList = async (
  id: string,
  listData: Partial<ShoppingList>,
): Promise<ShoppingList> => {
  const response = await api.patch<ShoppingList>(`/shoppingLists/${id}`, listData);
  return response.data;
};

export const deleteShoppingList = async (id: string) => {
  await api.delete(`/shoppingLists/${id}`);
};

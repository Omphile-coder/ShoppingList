import api from "./api";
import { deleteShoppingItem, getShoppingItems } from "./shoppingItemService";

export interface ShoppingList {
  id: string;
  userId: string;
  name: string;
  dateAdded: string;
}

// Loads the lists owned by the signed-in user for the dashboard.
export async function getShoppingLists(userId: string) {
  const response = await api.get<ShoppingList[]>("/shoppingLists", { params: { userId } });
  return response.data;
}

// Loads a single list on direct navigation or refresh.
export async function getShoppingList(id: string) {
  const response = await api.get<ShoppingList>(`/shoppingLists/${id}`, {
    validateStatus: (status) => status === 200 || status === 404,
  });
  return response.status === 404 ? null : response.data;
}

// Creates the named list before the dashboard opens its detail page.
export async function createShoppingList(list: Omit<ShoppingList, "id">) {
  const response = await api.post<ShoppingList>("/shoppingLists", list);
  return response.data;
}

// Saves a new name without changing the list's owner or items.
export async function renameShoppingList(id: string, name: string) {
  const response = await api.patch<ShoppingList>(`/shoppingLists/${id}`, { name });
  return response.data;
}

// Removes the items first because older records use listId, which JSON Server
// does not recognize as the automatic relationship for the shoppingLists collection.
export async function deleteShoppingList(id: string) {
  const items = await getShoppingItems(id);
  for (const item of items) {
    await deleteShoppingItem(item.id);
  }
  await api.delete(`/shoppingLists/${id}`);
}

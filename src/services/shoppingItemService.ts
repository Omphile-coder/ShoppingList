import api from "./api";

export interface ShoppingItem {
  id: string;
  listId: string;
  name: string;
  quantity: number;
  category: string;
  notes?: string;
  image?: string;
  completed?: boolean;
  dateAdded: string;
}

// Fetches just the items that belong to the open list.
export async function getShoppingItems(listId: string) {
  const response = await api.get<ShoppingItem[]>("/shoppingItems", { params: { listId } });
  return response.data;
}

// Creates an item and returns the record with its server-assigned ID.
export async function createShoppingItem(item: Omit<ShoppingItem, "id">) {
  const response = await api.post<ShoppingItem>("/shoppingItems", item);
  return response.data;
}

// Saves item edits or a change to its checked-off status.
export async function updateShoppingItem(id: string, changes: Partial<ShoppingItem>) {
  const response = await api.patch<ShoppingItem>(`/shoppingItems/${id}`, changes);
  return response.data;
}

// Removes an item from JSON Server before Redux drops its card.
export async function deleteShoppingItem(id: string) {
  await api.delete(`/shoppingItems/${id}`);
}

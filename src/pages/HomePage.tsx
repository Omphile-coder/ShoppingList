import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setLists,
  addList,
} from "../features/shoppingLists/shoppingListsSlice";
import {
  getShoppingLists,
  createShopppingList,
} from "../services/shoppingListService";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const lists = useAppSelector((state) => state.shoppingLists.lists);

  const [newListName, setNewListName] = useState("");

  // Fetch lists when the page loads
  useEffect(() => {
    if (currentUser) {
      getShoppingLists(currentUser.id).then((data) => {
        dispatch(setLists(data));
      });
    }
  }, [currentUser, dispatch]);

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim() || !currentUser) return;

    try {
      const newList = await createShopppingList({
        name: newListName,
        userId: currentUser.id,
        dateAdded: new Date().toISOString(),
      });

      dispatch(addList(newList)); // Update Redux so the UI refreshes instantly
      setNewListName(""); // Clear the input
    } catch (error) {
      console.error("Failed to create list", error);
    }
  };

  return (
    <main style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <h1>My Shopping Lists</h1>
      <p>Welcome back, {currentUser?.name}!</p>

      <form
        onSubmit={handleCreateList}
        style={{ display: "flex", gap: "10px", margin: "20px 0" }}
      >
        <input
          type="text"
          placeholder="New list name (e.g., Groceries)"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          className="auth-input"
        />
        <button type="submit" className="auth-button" style={{ marginTop: 0 }}>
          Add List
        </button>
      </form>

      <div style={{ display: "grid", gap: "16px" }}>
        {lists.length === 0 ? (
          <p>You don't have any lists yet. Create one above!</p>
        ) : (
          lists.map((list) => (
            <div
              key={list.id}
              style={{
                padding: "20px",
                background: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              <h3>{list.name}</h3>
              <p style={{ fontSize: "0.85rem", color: "gray" }}>
                Created: {new Date(list.dateAdded).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default HomePage;

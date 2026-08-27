import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  setLists,
  addList,
  updateList,
  deleteList,
} from "../features/shoppingLists/shoppingListsSlice";
import {
  getShoppingLists,
  createShopppingList,
  updateShoppingList,
  deleteShoppingList,
} from "../services/shoppingListService";
import { Link } from "react-router-dom";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const lists = useAppSelector((state) => state.shoppingLists.lists);

  const [newListName, setNewListName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

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

      dispatch(addList(newList));
      setNewListName("");
    } catch (error) {
      console.error("Failed to create list", error);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) {
      return;
    }
    try {
      const updated = await updateShoppingList(id, {
        name: editingName,
      });

      dispatch(updateList(updated));
      setEditingId(null);
    } catch (error) {
      console.error("failed to updae list", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this list?")) return;
    try {
      await deleteShoppingList(id);
      dispatch(deleteList(id));
    } catch (error) {
      console.error("Failed to delete list", error);
    }
  };
  return (
    <main className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Shopping Lists</h1>
        <p>Welcome back, {currentUser?.name}!</p>
      </div>

      <form onSubmit={handleCreateList} className="add-list-form">
        <input
          type="text"
          placeholder="New list name (e.g., Groceries)"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          className="auth-input"
        />
        <button type="submit" className="add-list-button">
          Add List
        </button>
      </form>

      <div className="lists-grid">
        {lists.length === 0 ? (
          <p>You don't have any lists yet.</p>
        ) : (
          lists.map((list) => (
            <div key={list.id} className="list-card">
              {editingId === list.id ? (
                <div>
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="edit-input"
                    autoFocus
                  />
                  <div className="card-actions">
                    <button
                      onClick={() => handleUpdate(list.id)}
                      className="action-btn edit-btn"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="action-btn delete-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3>{list.name}</h3>
                  <p className="list-card-date">
                    Created: {new Date(list.dateAdded).toLocaleDateString()}
                  </p>
                  <div className="card-actions">
                    <Link
                      to={`/lists/${list.id}`}
                      className="action-btn btn-primary"
                    >
                      View Items
                    </Link>
                    <button
                      onClick={() => {
                        setEditingId(list.id);
                        setEditingName(list.name);
                      }}
                      className="action-btn edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(list.id)}
                      className="action-btn delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
};

export default HomePage;

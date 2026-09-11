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
  getCachedShoppingLists,
  createShopppingList,
  updateShoppingList,
  deleteShoppingList,
} from "../services/shoppingListService";
import { Link } from "react-router-dom";
import Toast from "../components/Toast";
import ConfirmOverlay from "../components/ConfirmOverlay";
import emptyIcon from "../assets/EmptyState.webp";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const lists = useAppSelector((state) => state.shoppingLists.lists);

  const [newListName, setNewListName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch lists when the page loads
  useEffect(() => {
    if (!currentUser) return;

    // Clear data from a previous user, then render this user's cached data immediately.
    dispatch(setLists([]));
    const cachedLists = getCachedShoppingLists(currentUser.id);
    if (cachedLists.length > 0) dispatch(setLists(cachedLists));

    let cancelled = false;
    setIsLoading(cachedLists.length === 0);

    getShoppingLists(currentUser.id)
      .then((data) => {
        if (!cancelled) dispatch(setLists(data));
      })
      .catch((error) => console.error("Failed to load shopping lists", error))
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
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
      setToast("Shopping list added successfully!");
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
      if (currentUser) {
        const cached = getCachedShoppingLists(currentUser.id);
        localStorage.setItem(
          `shoppingLists:${currentUser.id}`,
          JSON.stringify(cached.map((item) => item.id === id ? updated : item)),
        );
      }
      setToast("Shopping list updated successfully!");
    } catch (error) {
      console.error("failed to update list", error);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await deleteShoppingList(deleteId);
      dispatch(deleteList(deleteId));
      if (currentUser) {
        const cached = getCachedShoppingLists(currentUser.id);
        localStorage.setItem(
          `shoppingLists:${currentUser.id}`,
          JSON.stringify(cached.filter((item) => item.id !== deleteId)),
        );
      }
      setDeleteId(null);
      setToast("Shopping list deleted successfully!");
    } catch (error) {
      console.error("Failed to delete list", error);
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <>
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
        {isLoading ? (
          <div className="emptyState-Cont"><h2>Loading your lists...</h2></div>
        ) : lists.length === 0 ? (
          <div className="emptyState-Cont">
            <div className="empty-Image-Cont">
              <img src={emptyIcon} alt="No items found" />
            </div>
            <h1>No Lists yet</h1>
            <span></span>
          </div>
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
                      onClick={() => setDeleteId(list.id)}
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

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {deleteId && (
        <ConfirmOverlay
          title="Delete shopping list?"
          message="This action cannot be undone. The list and its saved data will be removed."
          isLoading={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => !isDeleting && setDeleteId(null)}
        />
      )}
    </>
  );
};

export default HomePage;

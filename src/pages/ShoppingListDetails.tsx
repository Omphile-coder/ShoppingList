import { Link, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useEffect, useMemo, useState } from "react";
import {
  createShoppingItem,
  deleteShoppingItem,
  getShoppingItems,
  getCachedShoppingItems,
  updateShoppingItem,
} from "../services/shoppingItemService";
import {
  addItem,
  deleteItem,
  setItems,
  updateItem,
} from "../features/shoppingLists/shoppingItemSlice";
import emptyIcon from "../assets/EmptyState.webp";
import Toast from "../components/Toast";
import ConfirmOverlay from "../components/ConfirmOverlay";

export const ShoppingListDetails = () => {
  const { listId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.shoppingItems.items);
  const lists = useAppSelector((state) => state.shoppingLists.lists);

  const currentList = lists.find((list) => list.id === listId);

  // Overlay State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState("");

  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editQuantity, setEditQuantity] = useState(1);
  const [editCategory, setEditCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingItem, setIsSavingItem] = useState(false);

  // URL States
  const searchQuery = searchParams.get("search") || "";
  const sortValue = searchParams.get("sort") || "name";

  useEffect(() => {
    if (!listId) return;

    // Show cached items instantly while the latest data loads.
    const cachedItems = getCachedShoppingItems(listId);
    dispatch(setItems(cachedItems));
    setIsLoading(cachedItems.length === 0);

    let cancelled = false;
    getShoppingItems(listId)
      .then((data) => {
        if (!cancelled) dispatch(setItems(data));
      })
      .catch((error) => console.error("Failed to load shopping items", error))
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [listId, dispatch]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category || !listId) return;

    if (isSavingItem) return;

    setIsSavingItem(true);
    try {
      const newItem = await createShoppingItem({
        listId,
        name,
        quantity,
        category,
        dateAdded: new Date().toISOString(),
      });

      dispatch(addItem(newItem));
      setName("");
      setQuantity(1);
      setCategory("");
      setIsAddModalOpen(false);
      setToast("Shopping item added successfully!");
    } catch (error) {
      console.error("Failed to add item", error);
    } finally {
      setIsSavingItem(false);
    }
  };

  const handleUpdateItem = async (id: string) => {
    if (!editName.trim() || !editCategory) return;
    try {
      const updated = await updateShoppingItem(id, {
        name: editName,
        quantity: editQuantity,
        category: editCategory,
      });
      dispatch(updateItem(updated));
      setEditingId(null);
      const cached = getCachedShoppingItems(listId || updated.listId);
      localStorage.setItem(
        `shoppingItems:${listId || updated.listId}`,
        JSON.stringify(cached.map((item) => (item.id === id ? updated : item))),
      );
      setToast("Shopping item updated successfully!");
    } catch (error) {
      console.error("Failed to update item", error);
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await deleteShoppingItem(deleteId);
      dispatch(deleteItem(deleteId));
      if (listId) {
        const cached = getCachedShoppingItems(listId);
        localStorage.setItem(
          `shoppingItems:${listId}`,
          JSON.stringify(cached.filter((item) => item.id !== deleteId)),
        );
      }
      setDeleteId(null);
      setToast("Shopping item deleted successfully!");
    } catch (error) {
      console.error("Failed to delete item", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newParams = new URLSearchParams(searchParams);
    if (e.target.value) {
      newParams.set("search", e.target.value);
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", e.target.value);
    setSearchParams(newParams);
  };

  const displayedItems = useMemo(() => {
    let result = [...items];

    if (searchQuery) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    result.sort((a, b) => {
      if (sortValue === "name") return a.name.localeCompare(b.name);
      if (sortValue === "category") return a.category.localeCompare(b.category);
      if (sortValue === "date")
        return (
          new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
        );
      return 0;
    });

    return result;
  }, [items, searchQuery, sortValue]);

  return (
    <>
      <main className="dashboard-container">
        <Link to="/" className="back-link">
          ← Back to Dashboard
        </Link>

        {/* HEADER WITH ADD BUTTON */}
        <div
          className="dashboard-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ margin: 0 }}>
            {currentList ? currentList.name : "Shopping List"}
          </h1>
          <button
            className="action-btn btn-primary"
            onClick={() => setIsAddModalOpen(true)}
            style={{ padding: "10px 20px" }}
          >
            + Add New Item
          </button>
        </div>

        {/* SEARCH AND SORT CONTROLS */}
        <div className="controls-container">
          <div className="search-input">
            <label className="control-label">Search:</label>
            <input
              type="text"
              placeholder="Find an item..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="auth-input"
            />
          </div>
          <div className="sort-select">
            <label className="control-label">Sort By:</label>
            <select
              value={sortValue}
              onChange={handleSortChange}
              className="auth-input"
            >
              <option value="name">Name</option>
              <option value="category">Category</option>
              <option value="date">Date Added</option>
            </select>
          </div>
        </div>

        {/* MODAL OVERLAY FOR ADDING ITEMS */}
        {isAddModalOpen && (
          <div
            className="modal-overlay"
            onClick={() => setIsAddModalOpen(false)}
          >
            {/* stopPropagation prevents closing when clicking inside the white box */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add New Item</h3>
                <button
                  className="close-btn"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  &times;
                </button>
              </div>

              <form
                onSubmit={handleAddItem}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div>
                  <label className="control-label">Item Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Milk"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="auth-input"
                    required
                  />
                </div>

                <div style={{ display: "flex", gap: "16px" }}>
                  <div style={{ flex: 1 }}>
                    <label className="control-label">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="auth-input"
                      required
                    />
                  </div>
                  <div style={{ flex: 2 }}>
                    <label className="control-label">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="auth-input"
                      required
                    >
                      <option value="" disabled>
                        Select Category
                      </option>
                      <option value="Groceries">Groceries</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="auth-button"
                  style={{ marginTop: "8px" }}
                  disabled={isSavingItem}
                >
                  {isSavingItem ? "Saving..." : "Save Item"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ITEMS LIST & EMPTY STATE */}
        <div className="lists-grid">
          {isLoading ? (
            <div className="emptyState-Cont">
              <h2>Loading items...</h2>
            </div>
          ) : displayedItems.length === 0 ? (
            <div className="emptyState-Cont">
              <div className="empty-Image-Cont">
                <img src={emptyIcon} alt="No items found" />
              </div>
              <h1>No items yet</h1>
              <span>
                <button
                  className="action-btn btn-primary"
                  onClick={() => setIsAddModalOpen(true)}
                  style={{ padding: "10px 20px" }}
                >
                  + Add New Item
                </button>
              </span>
            </div>
          ) : (
            displayedItems.map((item) => (
              <div key={item.id} className="list-card">
                {editingId === item.id ? (
                  // EDIT MODE
                  <div>
                    <div
                      className="item-form-row"
                      style={{ marginTop: 0, marginBottom: "12px" }}
                    >
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="edit-input"
                        style={{ marginBottom: 0 }}
                      />
                      <input
                        type="number"
                        min="1"
                        value={editQuantity}
                        onChange={(e) =>
                          setEditQuantity(Number(e.target.value))
                        }
                        className="edit-input input-small"
                        style={{ marginBottom: 0 }}
                      />
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="edit-input"
                        style={{ marginBottom: 0 }}
                      >
                        <option value="Groceries">Groceries</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="card-actions">
                      <button
                        onClick={() => handleUpdateItem(item.id)}
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
                  // VIEW MODE
                  <div>
                    <div className="list-card-flex">
                      <div>
                        <h3 className="item-title">{item.name}</h3>
                        <p className="list-card-date">
                          Category: {item.category}
                        </p>
                      </div>
                      <div className="item-quantity">x{item.quantity}</div>
                    </div>
                    <div className="card-actions">
                      <button
                        onClick={() => {
                          setEditingId(item.id);
                          setEditName(item.name);
                          setEditQuantity(item.quantity);
                          setEditCategory(item.category);
                        }}
                        className="action-btn edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(item.id)}
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

      {toast !== null && (
        <Toast message={toast} onClose={() => setToast(null)} />
      )}

      {deleteId && (
        <ConfirmOverlay
          title="Delete shopping item?"
          message="This item will be permanently removed from this shopping list."
          isLoading={isDeleting}
          onConfirm={handleDeleteItem}
          onCancel={() => !isDeleting && setDeleteId(null)}
        />
      )}
    </>
  );
};

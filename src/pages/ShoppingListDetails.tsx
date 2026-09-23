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
import ConfirmOverlay from "../components/ConfirmOverlay";
import { UnsplashImagePicker } from "../components/UnsplashImagePicker";
import { useToast } from "../components/ToastContext";

// Defines keyword dictionaries for categories to help enforce logical item sorting
const categoryKeywords: Record<string, string[]> = {
  Groceries: [
    "milk", "bread", "cheese", "egg", "meat", "chicken", "beef", "fish", "fruit",
    "vegetable", "food", "rice", "pasta", "water", "juice", "snack",
  ],
  Electronics: [
    "phone", "laptop", "computer", "tablet", "charger", "cable", "headphone", "earbud",
    "camera", "speaker", "keyboard", "mouse", "monitor", "television", "tv", "battery",
  ],
  Clothing: [
    "shirt", "t-shirt", "jean", "pant", "dress", "skirt", "shoe", "sock", "coat",
    "jacket", "hat", "belt", "underwear",
  ],
};

// Validates that an item isn't accidentally placed in the wrong category based on the predefined keywords
const itemFitsCategory = (itemName: string, category: string) => {
  const normalizedName = itemName.trim().toLowerCase();
  const matchingKeywords = categoryKeywords[category];

  if (!matchingKeywords) return true;

  const belongsToAnotherCategory = Object.entries(categoryKeywords).some(
    ([otherCategory, keywords]) =>
      otherCategory !== category &&
      keywords.some((keyword) => normalizedName.includes(keyword)),
  );

  return !belongsToAnotherCategory;
};

export const ShoppingListDetails = () => {
  // Retrieves routing parameters, global Redux state, and toast notifications
  const { listId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const items = useAppSelector((state) => state.shoppingItems.items);
  const lists = useAppSelector((state) => state.shoppingLists.lists);

  const currentList = lists.find((list) => list.id === listId);

  // Manages local UI states for the add modal, forms, loading indicators, and delete confirmations
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editQuantity, setEditQuantity] = useState(1);
  const [editCategory, setEditCategory] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSavingItem, setIsSavingItem] = useState(false);
  const [itemValidationError, setItemValidationError] = useState<string | null>(null);

  // Syncs search and sort filters with the URL parameters so they survive page reloads and can be shared
  const searchQuery = searchParams.get("search") || "";
  const sortValue = searchParams.get("sort") || "name";

  // Fetches the items for this specific list on mount, instantly displaying cached data while fetching fresh data
  useEffect(() => {
    if (!listId) return;

    const cachedItems = getCachedShoppingItems(listId);
    dispatch(setItems(cachedItems));
    setIsLoading(cachedItems.length === 0);

    let cancelled = false;
    getShoppingItems(listId)
      .then((data) => {
        if (!cancelled) dispatch(setItems(data));
      })
      .catch((error) => {
        console.error("Failed to load shopping items", error);
        showToast("Failed to load shopping items. Please try again.", "error");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [listId, dispatch]);

  // Validates the category, saves the new item to the server, updates Redux, and resets the modal form
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category || !listId) return;

    if (!itemFitsCategory(name, category)) {
      setItemValidationError(
        `"${name.trim()}" does not fit the ${category} category.`,
      );
      return;
    }

    if (isSavingItem) return;

    setIsSavingItem(true);
    try {
      const newItem = await createShoppingItem({
        listId,
        name,
        quantity,
        category,
        image: image || undefined,
        dateAdded: new Date().toISOString(),
      });

      dispatch(addItem(newItem));
      setName("");
      setQuantity(1);
      setCategory("");
      setImage("");
      setItemValidationError(null);
      setIsAddModalOpen(false);
      showToast("Shopping item added successfully!", "success");
    } catch (error) {
      console.error("Failed to add item", error);
      showToast("Failed to add the shopping item. Please try again.", "error");
    } finally {
      setIsSavingItem(false);
    }
  };

  // Enforces category validation before updating an existing item in the database, Redux, and local cache
  const handleUpdateItem = async (id: string) => {
    if (!editName.trim() || !editCategory) return;

    if (!itemFitsCategory(editName, editCategory)) {
      showToast(
        `"${editName.trim()}" does not fit the ${editCategory} category.`,
        "error",
      );
      return;
    }

    try {
      const updated = await updateShoppingItem(id, {
        name: editName,
        quantity: editQuantity,
        category: editCategory,
      });
      dispatch(updateItem(updated));
      setEditingId(null);
      setItemValidationError(null);
      
      const cached = getCachedShoppingItems(listId || updated.listId);
      localStorage.setItem(
        `shoppingItems:${listId || updated.listId}`,
        JSON.stringify(cached.map((item) => (item.id === id ? updated : item))),
      );
      showToast("Shopping item updated successfully!", "success");
    } catch (error) {
      console.error("Failed to update item", error);
      showToast("Failed to update the shopping item. Please try again.", "error");
    }
  };

  // Removes the item globally and updates the local storage cache, utilizing loading states for the UI modal
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
      showToast("Shopping item deleted successfully!", "success");
    } catch (error) {
      console.error("Failed to delete item", error);
      showToast("Failed to delete the shopping item. Please try again.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  // Updates the URL search parameters whenever the user interacts with the search input or sort dropdown
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

  // Memoizes the filtered and sorted list of items locally to avoid unnecessary recalculations on re-renders
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

                {/* Reusable child component that fetches matching images from the Unsplash API */}
                <UnsplashImagePicker
                  label="Item image (optional)"
                  searchHint={name}
                  value={image}
                  onChange={setImage}
                  disabled={isSavingItem}
                />

                {itemValidationError && (
                  <p role="alert" style={{ color: "#b42318", margin: 0 }}>
                    {itemValidationError}
                  </p>
                )}

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
                {item.image && editingId !== item.id && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="item-card-image"
                  />
                )}
                
                {/* Dynamically toggles between the inline edit form and the standard item card view */}
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

      {/* Renders the global confirmation modal when an item delete action is triggered */}
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
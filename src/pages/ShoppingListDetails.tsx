import { Link, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useEffect, useMemo, useState } from "react";
import {
  createShoppingItem,
  deleteShoppingItem,
  getShoppingItems,
  updateShoppingItem,
} from "../services/shoppingItemService";
import {
  addItem,
  deleteItem,
  setItems,
  updateItem,
} from "../features/shoppingLists/shoppingItemSlice";

export const ShoppingListDetails = () => {
  const { listId } = useParams();

  //URL Parameter Hook!
  const [searchParams, setSearchParams] = useSearchParams();

  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.shoppingItems.items);
  const lists = useAppSelector((state) => state.shoppingLists.lists);

  // find the name of the current list so we can use it as the page title
  const currentList = lists.find((list) => list.id === listId);

  // For the form
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState("");

  // for updating/ editing the state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editQuantity, setEditQuantity] = useState(1);
  const [editCategory, setEditCategory] = useState("");

  //Now to read values directly from the URL
  const searchQuery = searchParams.get("search") || "";
  const sortValue = searchParams.get("sort") || "name";

  useEffect(() => {
    if (listId) {
      getShoppingItems(listId).then((data) => dispatch(setItems(data)));
    }
  }, [listId, dispatch]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !category || !listId) return;

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
    } catch (error) {
      console.error("Failed to add item", error);
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
    } catch (error) {
      console.error("Failed to update item", error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteShoppingItem(id);
      dispatch(deleteItem(id));
    } catch (error) {
      console.error("Failed to delete item", error);
    }
  };

  // functions to safely updae the url when the user types or selects
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

  // Now to use useMemo to filter and sort items array based on the URL
  const displayedItems = useMemo(() => {
    let result = [...items];

    //filter by search Query
    if (searchQuery) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    //Sort the result
    result.sort((a, b) => {
      if (sortValue === "name") {
        return a.name.localeCompare(b.name);
      }

      if (sortValue === "category") {
        return a.category.localeCompare(b.category);
      }

      if (sortValue === "date") {
        return (
          new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
        );
      }

      return 0;
    });

    return result;
  }, [items, searchQuery, sortValue]);

  return (
    <main className="dashnoard-container">
      <Link to="/" className="back-link">
        &larr; Back to Dashboard
      </Link>

      <div className="dashboard-header">
        <h1>{currentList ? currentList.name : "Shopping List"}</h1>
      </div>

      {/* Search bar */}

      <div className="controls-container">
        <div className="search-input">
          <label className="control-label">Search:</label>

          <input
            type="text"
            placeholder="find an item..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="auth-input"
          />
        </div>

        {/* Controls */}
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
      <form onSubmit={handleAddItem} className="item-form-container">
        <h3>Add New Item</h3>

        <div className="item-form-row">
          <input
            type="text"
            placeholder="Item (e.g.., Milk)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="authg-input"
            required
          />

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="auth-input input-small"
            required
          />

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

          <button
            type="submit"
            className="auth-button"
            style={{ marginTop: 0 }}
          >
            Add
          </button>
        </div>
      </form>

      <div className="lists-grid">
        {displayedItems.length === 0 ? (
          <p>No items found.</p>
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
                      onChange={(e) => setEditQuantity(Number(e.target.value))}
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
                      onClick={() => handleDeleteItem(item.id)}
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

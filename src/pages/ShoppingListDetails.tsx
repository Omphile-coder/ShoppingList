import { Link, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useEffect, useMemo, useState } from "react";
import {
  createShoppingItem,
  getShoppingItems,
} from "../services/shoppingItemService";
import { addItem, setItems } from "../features/shoppingLists/shoppingItemSlice";

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
        {items.length === 0 ? (
          <p>No items in this list yet.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="list-card list-card-flex">
              <div>
                <h3 className="item-title">{item.name}</h3>
                <p className="list-card-date">Category: {item.category}</p>
              </div>
              <div className="item-quantity">x{item.quantity}</div>
            </div>
          ))
        )}
      </div>
    </main>
  );
};

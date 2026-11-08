import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Share2 } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addItem, deleteItem, setItems, updateItem } from "../features/shoppingLists/shoppingItemSlice";
import { createShoppingItem, deleteShoppingItem, getShoppingItems, updateShoppingItem, type ShoppingItem } from "../services/shoppingItemService";
import { getShoppingList, type ShoppingList } from "../services/shoppingListService";
import ConfirmOverlay from "../components/ConfirmOverlay";
import { ItemForm, type ItemFields } from "../components/ItemForm";
import { ShareList } from "../components/ShareList";
import { useToast } from "../components/useToast";

// Remounts the list view when the URL changes to another list ID.
export function ShoppingListDetails() {
  const { listId } = useParams();
  return listId ? <ListView key={listId} listId={listId} /> : null;
}

// Loads one owned list and manages its item actions, filters, and sharing.
function ListView({ listId }: { listId: string }) {
  const [params, setParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const userId = useAppSelector((state) => state.auth.currentUser?.id);
  const items = useAppSelector((state) => state.shoppingItems.items);
  const [list, setList] = useState<ShoppingList | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "missing" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const [form, setForm] = useState<"new" | ShoppingItem | null>(null);
  const [removing, setRemoving] = useState<ShoppingItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [sharing, setSharing] = useState(false);

  // Verify the list owner before fetching items, including after a direct URL visit.
  useEffect(() => {
    let active = true;
    async function loadList() {
      try {
        const record = await getShoppingList(listId);
        if (!active) return;
        if (!record || record.userId !== userId) {
          setLoadState("missing");
          return;
        }
        const records = await getShoppingItems(listId);
        if (!active) return;
        dispatch(setItems(records));
        setList(record);
        setLoadState("ready");
      } catch {
        if (active) setLoadState("error");
      }
    }
    void loadList();
    return () => { active = false; };
  }, [listId, userId, attempt, dispatch]);

  // Saves the item first, then updates the open list's Redux state.
  async function handleSave(fields: ItemFields) {
    if (!form) return;
    if (form === "new") {
      dispatch(addItem(await createShoppingItem({ ...fields, listId, dateAdded: new Date().toISOString() })));
      showToast("Item added.");
    } else {
      dispatch(updateItem(await updateShoppingItem(form.id, fields)));
      showToast("Item updated.");
    }
    setForm(null);
  }

  // Persists checkmarks so they survive a refresh or another sign-in.
  async function handleToggle(item: ShoppingItem) {
    if (togglingId) return;
    setTogglingId(item.id);
    try {
      dispatch(updateItem(await updateShoppingItem(item.id, { completed: !item.completed })));
    } catch {
      showToast("Couldn't update the checkmark.", "error");
    } finally {
      setTogglingId(null);
    }
  }

  // Removes the confirmed item from both JSON Server and Redux.
  async function handleDelete() {
    if (!removing || deleting) return;
    setDeleting(true);
    try {
      await deleteShoppingItem(removing.id);
      dispatch(deleteItem(removing.id));
      showToast("Item deleted.");
    } catch {
      showToast("Couldn't delete this item. Please try again.", "error");
    } finally {
      setRemoving(null);
      setDeleting(false);
    }
  }

  // Keeps the visible search and sort settings in the URL.
  function changeFilter(key: "search" | "sort", value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: key === "search" });
  }

  const search = params.get("search") ?? "";
  const sortParam = params.get("sort");
  const sort = sortParam === "category" || sortParam === "date" ? sortParam : "name";
  const listItems = items.filter((item) => item.listId === listId);
  const completedCount = listItems.filter((item) => item.completed).length;
  const visibleItems = listItems.filter((item) => item.name.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a, b) => {
      if (sort === "category") return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
      if (sort === "date") return b.dateAdded.localeCompare(a.dateAdded);
      return a.name.localeCompare(b.name);
    });

  return (
    <main className="dashboard-container">
      <Link to="/" className="back-link"><ArrowLeft size={16} /> My lists</Link>
      {loadState === "loading" && <p className="status-panel" role="status">Loading this list…</p>}
      {loadState === "missing" && <p className="status-panel" role="status">This list isn't available in your account.</p>}
      {loadState === "error" && (
        <div className="status-panel">
          <p role="alert">Couldn't load this list.</p>
          <button className="action-btn edit-btn" onClick={() => { setLoadState("loading"); setAttempt(attempt + 1); }}>
            Try again
          </button>
        </div>
      )}
      {loadState === "ready" && list && (
        <>
          <header className="page-hero">
            <div>
              <p className="eyebrow">SHOPPING LIST</p>
              <h1>{list.name}</h1>
              <p>{completedCount} of {listItems.length} items checked off</p>
            </div>
            <div className="hero-actions">
              <button className="action-btn edit-btn" onClick={() => setSharing(true)}><Share2 size={17} /> Share list</button>
              <button className="action-btn btn-primary" onClick={() => setForm("new")}><Plus size={18} /> Add item</button>
            </div>
          </header>

          <div className="controls-container">
            <label className="search-input input-group">
              Search items
              <input className="auth-input" type="search" placeholder="Search by name" value={search}
                onChange={(event) => changeFilter("search", event.target.value)} />
            </label>
            <label className="sort-select input-group">
              Sort by
              <select className="auth-input" value={sort} onChange={(event) => changeFilter("sort", event.target.value)}>
                <option value="name">Name</option>
                <option value="category">Category</option>
                <option value="date">Date added</option>
              </select>
            </label>
          </div>

          {visibleItems.length ? (
            <div className="lists-grid">
              {visibleItems.map((item) => (
                <article className="list-card" key={item.id}>
                  {item.image && <img className="item-card-image" src={item.image} alt="" loading="lazy" />}
                  <p className="eyebrow">{item.category}</p>
                  <h2 className={item.completed ? "item-title is-complete" : "item-title"}>{item.name}</h2>
                  <p className="list-card-date">Quantity: {item.quantity}</p>
                  {item.notes && <p className="item-notes">{item.notes}</p>}
                  <label className="check-item">
                    <input type="checkbox" checked={Boolean(item.completed)} disabled={Boolean(togglingId)}
                      onChange={() => void handleToggle(item)} aria-label={`Checked off: ${item.name}`} />
                    Checked off
                  </label>
                  <div className="card-actions">
                    <button className="action-btn edit-btn" onClick={() => setForm(item)}>Edit</button>
                    <button className="action-btn delete-btn" onClick={() => setRemoving(item)}>Delete</button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <section className="emptyState-Cont">
              <h2>{search.trim() ? "No matching items" : "This list is empty"}</h2>
              <p>{search.trim() ? "Try another name or clear your search." : "Add what you need to buy, then check it off as you go."}</p>
              <button className="action-btn btn-primary" onClick={() => search.trim() ? changeFilter("search", "") : setForm("new")}>
                {search.trim() ? "Clear search" : "Add your first item"}
              </button>
            </section>
          )}
          {form && <ItemForm item={form === "new" ? undefined : form} onSave={handleSave} onClose={() => setForm(null)} />}
          {removing && <ConfirmOverlay title="Delete item?" message={`“${removing.name}” will be removed from this list.`}
            isLoading={deleting} onConfirm={handleDelete} onCancel={() => setRemoving(null)} />}
          {sharing && <ShareList title={list.name} items={listItems} onClose={() => setSharing(false)} />}
        </>
      )}
    </main>
  );
}

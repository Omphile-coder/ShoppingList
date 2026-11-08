import { useEffect, useState } from "react";
import { ArrowUpRight, ListChecks, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setLists, addList, updateList, deleteList } from "../features/shoppingLists/shoppingListsSlice";
import {
  getShoppingLists, createShoppingList, renameShoppingList, deleteShoppingList, type ShoppingList,
} from "../services/shoppingListService";
import ConfirmOverlay from "../components/ConfirmOverlay";
import { ListNameForm } from "../components/ListNameForm";
import { useToast } from "../components/useToast";

// Shows the user's saved lists and opens the add, rename, and delete flows.
export default function HomePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const user = useAppSelector((state) => state.auth.currentUser);
  const lists = useAppSelector((state) => state.shoppingLists.lists);
  const userId = user?.id;

  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  const [form, setForm] = useState<"new" | ShoppingList | null>(null);
  const [removing, setRemoving] = useState<ShoppingList | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Refresh the user's Redux lists from JSON Server when the dashboard opens.
  useEffect(() => {
    if (!userId) return;
    let active = true;
    getShoppingLists(userId)
      .then((records) => {
        if (!active) return;
        dispatch(setLists(records));
        setLoadState("ready");
      })
      .catch(() => { if (active) setLoadState("error"); });
    return () => { active = false; };
  }, [userId, attempt, dispatch]);

  // Updates Redux after a successful save and takes a new list straight to its items.
  async function handleSave(name: string) {
    if (!userId || !form) return;
    if (form === "new") {
      const list = await createShoppingList({ name, userId, dateAdded: new Date().toISOString() });
      dispatch(addList(list));
      showToast("List created.");
      navigate(`/lists/${list.id}`);
    } else {
      dispatch(updateList(await renameShoppingList(form.id, name)));
      showToast("List renamed.");
    }
    setForm(null);
  }

  // Deletes the confirmed list and only removes its card when the server succeeds.
  async function handleDelete() {
    if (!removing || deleting) return;
    setDeleting(true);
    try {
      await deleteShoppingList(removing.id);
      dispatch(deleteList(removing.id));
      setRemoving(null);
      showToast("List deleted.");
    } catch {
      setRemoving(null);
      showToast("Couldn't delete this list. Please try again.", "error");
    } finally {
      setDeleting(false);
    }
  }

  const orderedLists = lists.filter((list) => list.userId === userId)
    .sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));

  return (
    <main className="dashboard-container">
      <header className="page-hero">
        <div>
          <p className="eyebrow">YOUR SHOPPING SPACE</p>
          <h1>My lists</h1>
          <p>Hi, {user?.name}. What are we shopping for today?</p>
        </div>
        <button className="action-btn btn-primary" disabled={loadState !== "ready"} onClick={() => setForm("new")}>
          <Plus size={18} /> New list
        </button>
      </header>

      <h2 className="section-title">Shopping lists {loadState === "ready" && <span>{orderedLists.length}</span>}</h2>
      {loadState === "loading" && <p className="status-panel" role="status">Loading your lists…</p>}
      {loadState === "error" && (
        <div className="status-panel">
          <p role="alert">Couldn't load your lists. Check your connection and try again.</p>
          <button className="action-btn edit-btn" onClick={() => { setLoadState("loading"); setAttempt(attempt + 1); }}>
            Try again
          </button>
        </div>
      )}
      {loadState === "ready" && (orderedLists.length === 0 ? (
        <section className="emptyState-Cont">
          <span className="card-mark"><ListChecks aria-hidden="true" /></span>
          <h3>Start with a list</h3>
          <p>Give it a name, then add what you need.</p>
          <button className="action-btn btn-primary" onClick={() => setForm("new")}>Create your first list</button>
        </section>
      ) : (
        <div className="lists-grid">
          {orderedLists.map((list) => (
            <article key={list.id} className="list-card">
              <span className="card-mark"><ListChecks size={22} aria-hidden="true" /></span>
              <h3>{list.name}</h3>
              <p className="list-card-date">Created {new Date(list.dateAdded).toLocaleDateString()}</p>
              <div className="card-actions">
                <Link to={`/lists/${list.id}`} className="action-btn btn-primary">Open <ArrowUpRight size={16} /></Link>
                <button className="action-btn edit-btn" onClick={() => setForm(list)}>Rename</button>
                <button className="action-btn delete-btn" onClick={() => setRemoving(list)}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      ))}

      {form && <ListNameForm initialName={form === "new" ? undefined : form.name} onSave={handleSave} onClose={() => setForm(null)} />}
      {removing && <ConfirmOverlay title="Delete this list?" message={`“${removing.name}” and all its items will be deleted.`}
        isLoading={deleting} onConfirm={handleDelete} onCancel={() => setRemoving(null)} />}
    </main>
  );
}

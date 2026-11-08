import { useState, type FormEvent } from "react";
import { Modal } from "./Modal";
import { UnsplashImagePicker } from "./UnsplashImagePicker";
import type { ShoppingItem } from "../services/shoppingItemService";

export type ItemFields = Pick<ShoppingItem, "name" | "quantity" | "category" | "notes" | "image">;
const categories = ["Groceries", "Household", "Electronics", "Clothing", "Other"];

// Shares the same fields and validation between adding and editing an item.
export function ItemForm({ item, onSave, onClose }: {
  item?: ShoppingItem;
  onSave: (fields: ItemFields) => Promise<void>;
  onClose: () => void;
}) {
  const [name, setName] = useState(item?.name ?? "");
  const [quantity, setQuantity] = useState(item?.quantity ?? 1);
  const [category, setCategory] = useState(item?.category ?? "Groceries");
  const [notes, setNotes] = useState(item?.notes ?? "");
  const [image, setImage] = useState(item?.image ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Validates the fields, then leaves the draft in place if the API save fails.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || !name.trim() || !Number.isInteger(quantity) || quantity < 1) return;
    const photoUrl = image.trim();
    if (photoUrl && !/^https?:\/\/[^\s]+$/i.test(photoUrl)) {
      setError("Enter a full image URL that starts with https:// or http://.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave({ name: name.trim(), quantity, category, notes: notes.trim(), image: photoUrl });
    } catch {
      setError("Couldn't save the item. Please try again.");
      setSaving(false);
    }
  }

  return (
    <Modal title={item ? "Edit item" : "Add item"} onClose={onClose} busy={saving}>
      <form className="auth-form" onSubmit={handleSubmit}>
        <fieldset disabled={saving}>
          <label className="input-group">
            Item name
            <input autoFocus className="auth-input" value={name} onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Apples" maxLength={100} required />
          </label>
          <div className="field-row">
            <label className="input-group">
              Quantity
              <input className="auth-input" type="number" min={1} value={quantity || ""}
                onChange={(event) => setQuantity(Number(event.target.value))} required />
            </label>
            <label className="input-group">
              Category
              <select className="auth-input" value={category} onChange={(event) => setCategory(event.target.value)}>
                {!categories.includes(category) && <option>{category}</option>}
                {categories.map((value) => <option key={value}>{value}</option>)}
              </select>
            </label>
          </div>
          <label className="input-group">
            Notes (optional)
            <textarea className="auth-input" rows={2} value={notes} onChange={(event) => setNotes(event.target.value)} maxLength={500} />
          </label>
          <UnsplashImagePicker label="Find a photo on Unsplash" searchHint={name} value={image} onChange={setImage} disabled={saving} />
          <label className="input-group">
            Image URL (optional)
            <input className="auth-input" type="url" value={image} onChange={(event) => setImage(event.target.value)} placeholder="https://…" />
          </label>
        </fieldset>
        {error && <p role="alert" className="alert-error">{error}</p>}
        <button type="submit" className="auth-button" disabled={saving || !name.trim()}>
          {saving ? "Saving…" : item ? "Save changes" : "Add to list"}
        </button>
      </form>
    </Modal>
  );
}

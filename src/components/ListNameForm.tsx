import { useState, type FormEvent } from "react";
import { Modal } from "./Modal";

type Props = {
  initialName?: string;
  onSave: (name: string) => Promise<void>;
  onClose: () => void;
};

// Collects a name for either a new list or an existing list being renamed.
export function ListNameForm({ initialName, onSave, onClose }: Props) {
  const [name, setName] = useState(initialName ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Leaves the dialog open with the typed name if the server rejects the save.
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || !name.trim()) return;
    setSaving(true);
    setError("");
    try {
      await onSave(name.trim());
    } catch {
      setError("Couldn't save this list. Please try again.");
      setSaving(false);
    }
  }

  return (
    <Modal title={initialName === undefined ? "New shopping list" : "Rename list"} onClose={onClose} busy={saving}>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="input-group">
          <span>List name</span>
          <input autoFocus className="auth-input" placeholder="e.g. Weekend groceries" value={name}
            onChange={(event) => setName(event.target.value)} maxLength={80} required disabled={saving} />
        </label>
        {error && <p role="alert" className="alert-error">{error}</p>}
        <button type="submit" className="auth-button" disabled={saving || !name.trim()}>
          {saving ? "Saving…" : initialName === undefined ? "Create list" : "Save name"}
        </button>
      </form>
    </Modal>
  );
}

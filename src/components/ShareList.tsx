import { useState } from "react";
import { Modal } from "./Modal";
import type { ShoppingItem } from "../services/shoppingItemService";

// Shows exactly what recipients will receive, without including account details.
export function ShareList({ title, items, onClose }: { title: string; items: ShoppingItem[]; onClose: () => void }) {
  const [status, setStatus] = useState("");
  const text = [title, ...items.map((item) =>
    `[${item.completed ? "x" : " "}] ${item.quantity} × ${item.name} (${item.category})${item.notes ? ` — ${item.notes}` : ""}`,
  )].join("\n");

  // Copies the snapshot for desktop users; the text remains selectable if blocked.
  async function copyList() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("List copied.");
    } catch {
      setStatus("Select the text above and copy it manually.");
    }
  }

  // Opens the device's share sheet, with the same copy action as a fallback.
  async function shareList() {
    try {
      await navigator.share({ title, text });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) await copyList();
    }
  }

  return (
    <Modal title="Share list" onClose={onClose}>
      <p className="muted">Send a copy of this list. Anyone can read it without a WeShop account.</p>
      <textarea className="auth-input share-preview" rows={6} value={text} readOnly aria-label="List to share" />
      <div className="card-actions">
        {typeof navigator.share === "function" && (
          <button className="action-btn btn-primary" onClick={shareList}>Share via device</button>
        )}
        <button className="action-btn btn-primary" onClick={copyList}>Copy list</button>
      </div>
      <p role="status">{status}</p>
    </Modal>
  );
}

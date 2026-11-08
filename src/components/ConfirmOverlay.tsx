import { Modal } from "./Modal";

interface ConfirmOverlayProps {
  title: string;
  message: string;
  confirmText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// Reuses the same keyboard-accessible dialog for deletes and sign-out.
export default function ConfirmOverlay({
  title, message, confirmText = "Delete", isLoading, onConfirm, onCancel,
}: ConfirmOverlayProps) {
  return (
    <Modal title={title} onClose={onCancel} busy={isLoading}>
      <p>{message}</p>
      <div className="card-actions">
        <button type="button" className="action-btn edit-btn" autoFocus onClick={onCancel} disabled={isLoading}>
          Cancel
        </button>
        <button type="button" className="action-btn confirm-delete-btn" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? "Deleting…" : confirmText}
        </button>
      </div>
    </Modal>
  );
}

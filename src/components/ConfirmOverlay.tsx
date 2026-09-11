import { AlertTriangle, X } from "lucide-react";

interface ConfirmOverlayProps {
  title: string;
  message: string;
  confirmText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmOverlay = ({
  title,
  message,
  confirmText = "Delete",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmOverlayProps) => {
  return (
    <div className="confirm-overlay" role="presentation" onClick={onCancel}>
      <div
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="confirm-close" onClick={onCancel} aria-label="Close confirmation">
          <X size={20} />
        </button>

        <div className="confirm-icon">
          <AlertTriangle size={28} aria-hidden="true" />
        </div>
        <h2 id="confirm-title">{title}</h2>
        <p>{message}</p>

        <div className="confirm-actions">
          <button className="action-btn cancel-btn" onClick={onCancel} disabled={isLoading}>
            Cancel
          </button>
          <button className="action-btn confirm-delete-btn" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Deleting..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOverlay;

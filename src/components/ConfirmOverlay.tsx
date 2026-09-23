import { AlertTriangle, X } from "lucide-react";

// Defines the shape of the props for the modal, including text content, loading state, and action handlers
interface ConfirmOverlayProps {
  title: string;
  message: string;
  confirmText?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// A reusable confirmation modal component that defaults to a "Delete" action if no custom text is provided
const ConfirmOverlay = ({
  title,
  message,
  confirmText = "Delete",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmOverlayProps) => {
  return (
    // Renders the clickable background overlay that triggers onCancel if the user clicks outside the modal
    <div className="confirm-overlay" role="presentation" onClick={onCancel}>
      <div
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        // Prevents clicks inside the actual dialog box from bubbling up and accidentally closing the overlay
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

        {/* Action buttons that handle the user's choice and disable interactions while an action is loading */}
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
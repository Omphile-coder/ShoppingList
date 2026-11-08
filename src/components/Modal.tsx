import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

type ModalProps = {
  title: string;
  children: ReactNode;
  onClose: () => void;
  busy?: boolean;
  className?: string;
};

// Uses a native dialog to keep keyboard focus inside add, edit, and share forms.
export function Modal({ title, children, onClose, busy, className }: ModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  return (
    <dialog
      ref={dialog}
      className={className ? "modal-content " + className : "modal-content"}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
    >
      <div className="modal-header">
        <h2 id={titleId}>{title}</h2>
        <button type="button" className="icon-button" onClick={onClose} disabled={busy} aria-label="Close dialog">
          <X size={20} />
        </button>
      </div>
      {children}
    </dialog>
  );
}

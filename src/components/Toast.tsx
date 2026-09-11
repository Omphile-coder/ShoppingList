import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast = ({ message, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 3500);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className="toast" role="status" aria-live="polite">
      <CheckCircle2 size={20} aria-hidden="true" />
      <span>{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Close notification">
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;

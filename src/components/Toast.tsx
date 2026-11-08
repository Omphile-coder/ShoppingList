import { useEffect } from "react";
import { CheckCircle2, X, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

// Defines the allowed visual styles and the required properties, including the message and close handler
interface ToastProps {
  id: number;
  message: string;
  type?: ToastType;
  onClose: (id: number) => void;
}

// Shows the result of an action and dismisses it after a short delay.
const Toast = ({ id, message, type = "success", onClose }: ToastProps) => {
  // Automatically triggers the onClose callback after 3.5 seconds, cleaning up the timer if the component unmounts early
  useEffect(() => {
    const timer = window.setTimeout(() => onClose(id), 3500);
    return () => window.clearTimeout(timer);
  }, [id, onClose]);

  // Dynamically selects the appropriate Lucide icon to display based on the current toast type
  const Icon =
    type === "error" ? AlertCircle : type === "info" ? Info : CheckCircle2;

  return (
    // Renders the notification with dynamic styling and accessibility roles to ensure screen readers handle it correctly
    <div className={`toast toast-${type}`} role={type === "error" ? "alert" : "status"}>
      <Icon size={20} aria-hidden="true" />
      <span>{message}</span>
      <button className="toast-close" onClick={() => onClose(id)} aria-label="Close notification">
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;

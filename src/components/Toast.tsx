import { useEffect } from "react";
import { CheckCircle2, X, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
}

const Toast = ({ message, type = "success", onClose }: ToastProps) => {
  useEffect(() => {
    const timer = window.setTimeout(onClose, 3500);
    return () => window.clearTimeout(timer);
  }, [message, onClose]);

  const Icon =
    type === "error" ? AlertCircle : type === "info" ? Info : CheckCircle2;

  return (
    <div className={`toast toast-${type}`} role={type === "error" ? "alert" : "status"}>
      <Icon size={20} aria-hidden="true" />
      <span>{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Close notification">
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;

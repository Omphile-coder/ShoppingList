import { useCallback, useState, type ReactNode } from "react";
import Toast, { type ToastType } from "./Toast";
import { ToastContext } from "./useToast";

type ToastItem = { id: number; message: string; type: ToastType };
let nextId = 0;

// Keeps a single notification stack available to all WeShop pages.
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Adds the action's result to the notification stack.
  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = nextId++;
    setToasts((current) => [...current, { id, message, type }]);
  }, []);

  // Removes an individual message when it times out or is dismissed.
  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => <Toast key={toast.id} {...toast} onClose={dismiss} />)}
      </div>
    </ToastContext.Provider>
  );
}

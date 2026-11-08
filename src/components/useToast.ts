import { createContext, useContext } from "react";
import type { ToastType } from "./Toast";

type ToastActions = { showToast: (message: string, type?: ToastType) => void };
export const ToastContext = createContext<ToastActions | undefined>(undefined);

// Gives a page access to the app-wide notification action.
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside a ToastProvider.");
  return context;
}

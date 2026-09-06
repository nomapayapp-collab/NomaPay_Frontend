import { useContext } from "react";
import { ToastContext } from "../context/ToastContext";

/**
 * const { showToast } = useToast();
 * showToast("Tu moneda favorita ahora es USD", "success");
 */
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast debe usarse dentro de un <ToastProvider>");
  }
  return context;
}

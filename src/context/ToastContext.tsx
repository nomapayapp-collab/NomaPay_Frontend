import {
  createContext,
  useCallback,
  useState,
  type ComponentType,
  type ReactNode,
  type SVGProps,
} from "react";
import { IconCheck, IconX, IconClock, IconShield } from "../assets/icons/Icons";

export type ToastVariant = "success" | "error" | "warning" | "info";

type ToastIcon = ComponentType<SVGProps<SVGSVGElement>>;

type ToastItem = {
  id: number;
  message: string;
  variant: ToastVariant;
  icon: ToastIcon;
};

type ShowToastOptions = {
  /** ícono puntual para este toast, si no querés el default de la variante */
  icon?: ToastIcon;
};

type ToastContextValue = {
  showToast: (message: string, variant?: ToastVariant, options?: ShowToastOptions) => void;
};

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// ícono por defecto de cada variante — mismo criterio de color que
// .badge/.alert-note (turquesa=éxito, magenta=error, ámbar=advertencia,
// violeta=info).
const DEFAULT_ICONS: Record<ToastVariant, ToastIcon> = {
  success: IconCheck,
  error: IconX,
  warning: IconClock,
  info: IconShield,
};

const AUTO_DISMISS_MS = 4000;

let nextId = 0;

/**
 * Toasts globales de la app — se muestran arriba de todo (por encima de
 * cualquier Modal abierto) y se cierran solos a los 4s, o antes con la X.
 * Uso: const { showToast } = useToast(); showToast("Listo", "success");
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismissToast = useCallback((id: number) => {
    setToasts((previous) => previous.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "info", options?: ShowToastOptions) => {
      const id = nextId++;
      const icon = options?.icon ?? DEFAULT_ICONS[variant];

      setToasts((previous) => [...previous, { id, message, variant, icon }]);
      setTimeout(() => dismissToast(id), AUTO_DISMISS_MS);
    },
    [dismissToast],
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed top-4 inset-x-0 z-[110] flex flex-col items-center gap-2 px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`toast toast--${toast.variant} w-full max-w-sm pointer-events-auto`}
          >
            <span className="toast__content">
              <toast.icon className="toast__icon w-4 h-4" />
              <span className="truncate">{toast.message}</span>
            </span>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="toast__close"
              aria-label="Cerrar notificación"
            >
              <IconX className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

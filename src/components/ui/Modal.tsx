import { useEffect, type ReactNode } from "react";
import { IconX } from "../../assets/icons/Icons";

/**
 * el único modal que debería existir en toda la app.
 * - open: controla si se muestra o no
 * - onClose: se dispara al tocar el fondo, la X, o apretar Escape
 * - title: encabezado del modal
 */
type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
 };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-ink/70 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-sm bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-card shadow-elevation-lg p-6 max-h-[85vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-text-light-primary dark:text-text-dark-primary">{title}</h2>
          <button type="button" onClick={onClose} className="icon-btn" aria-label="Cerrar">
            <IconX className="w-4 h-4" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
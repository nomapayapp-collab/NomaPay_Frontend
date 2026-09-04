import type { ComponentType, SVGProps } from "react";
import { Button } from "./ui/Button";
import { IconCheck } from "../assets/icons/Icons";

export type ReceiptRow = { label: string; value: string; accent?: boolean };
export type ReceiptChecklistItem = { label: string; state: "done" | "active" | "pending"; meta?: string };
export type ReceiptNote = { variant: "warning" | "error" | "info"; title?: string; description: string };
export type ReceiptAction = {
  label: string;
  variant: "primary" | "outline" | "ghost";
  onClick: () => void;
  loading?: boolean;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
};

type ReceiptPanelProps = {
  checklist?: ReceiptChecklistItem[];
  rows?: ReceiptRow[];
  note?: ReceiptNote;
  actions: ReceiptAction[];
};

/**
 * Cuerpo del Comprobante (todo lo que va debajo del ícono/monto/badge).
 * Las 4 fases (pendiente/completada/rechazada/cancelada) tienen la misma
 * forma — opcionalmente un checklist, opcionalmente datos en filas,
 * opcionalmente una nota, siempre acciones — así que en vez de repetir
 * el markup 4 veces, Receipt.tsx arma estos props según la fase y llama
 * a este único componente.
 */
export function ReceiptPanel({ checklist, rows, note, actions }: ReceiptPanelProps) {
  return (
    <div className="flex flex-col gap-5">
      {checklist && (
        <ul className="rounded-card border border-border-light dark:border-border-dark p-4 flex flex-col gap-4">
          {checklist.map((item) => (
            <li key={item.label} className="flex items-center justify-between">
              <span className="flex items-center gap-2.5 text-[13.5px] font-medium text-text-light-primary dark:text-text-dark-primary">
                {item.state === "done" && (
                  <span className="w-5 h-5 rounded-full bg-turquoise-500 text-white flex items-center justify-center shrink-0">
                    <IconCheck className="w-3 h-3" />
                  </span>
                )}
                {item.state === "active" && <span className="w-5 h-5 rounded-full border-2 border-amber-500 shrink-0" />}
                {item.state === "pending" && (
                  <span className="w-5 h-5 rounded-full border-2 border-border-light dark:border-border-dark shrink-0" />
                )}
                {item.label}
              </span>
              {item.meta && (
                <span
                  className={`text-[12px] font-medium ${
                    item.state === "active" ? "text-amber-500" : "text-text-light-tertiary dark:text-text-dark-tertiary"
                  }`}
                >
                  {item.meta}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {rows && (
        <div className="rounded-card border border-border-light dark:border-border-dark divide-y divide-border-light dark:divide-border-dark overflow-hidden">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between px-4 py-3.5">
              <span className="text-[13.5px] text-text-light-tertiary dark:text-text-dark-tertiary">{row.label}</span>
              <span
                className={`font-semibold text-right truncate max-w-50 ${
                  row.accent ? "text-turquoise-500" : "text-text-light-primary dark:text-text-dark-primary"
                }`}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {note && (
        <div className={`alert-note alert-note--${note.variant}`}>
          {note.title && <p className="alert-note__title">{note.title}</p>}
          <p className="alert-note__description">{note.description}</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {actions.map((action) => (
          <Button
            key={action.label}
            type="button"
            variant={action.variant}
            fullWidth
            loading={action.loading}
            onClick={action.onClick}
          >
            {action.icon && <action.icon className="w-4 h-4" />}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
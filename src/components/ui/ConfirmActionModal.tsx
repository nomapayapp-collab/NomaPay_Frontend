import type { ComponentType, SVGProps } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { IconSend } from "../../assets/icons/Icons";

type ConfirmRow = { label: string; value: string; accent?: boolean };

type ConfirmActionModalProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  confirming?: boolean;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  rows: ConfirmRow[];
  confirmLabel?: string;
};

/**
 * "¿Estás seguro?" antes de una operación irreversible (transferir,
 * convertir). No es un modal nuevo — es contenido particular adentro del
 * único Modal de la app (ver Modal.tsx). Cerrar con la X o "Cancelar"
 * hacen lo mismo: no dispara la acción.
 */
export function ConfirmActionModal({
  open,
  onCancel,
  onConfirm,
  confirming,
  icon: Icon = IconSend,
  title,
  description,
  rows,
  confirmLabel = "Confirmar",
}: ConfirmActionModalProps) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <div className="flex flex-col gap-5">
        <div className="w-11 h-11 rounded-control bg-violet-500/15 flex items-center justify-center text-violet-300">
          <Icon className="w-5 h-5" />
        </div>

        <p className="text-[14.5px] text-text-light-secondary dark:text-text-dark-secondary">{description}</p>

        <div className="rounded-card border border-border-light dark:border-border-dark divide-y divide-border-light dark:divide-border-dark overflow-hidden">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between px-4 py-3">
              <span className="text-[13px] text-text-light-tertiary dark:text-text-dark-tertiary">{row.label}</span>
              <span
                className={`text-[13.5px] font-semibold ${
                  row.accent ? "text-turquoise-500" : "text-text-light-primary dark:text-text-dark-primary"
                }`}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="outline" fullWidth onClick={onCancel} disabled={confirming}>
            Cancelar
          </Button>
          <Button type="button" variant="primary" fullWidth loading={confirming} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
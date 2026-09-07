import {
  useRef,
  type ComponentType,
  type SVGProps,
} from "react";
import { IconSend } from "../../assets/icons/Icons";
import { Button } from "./Button";
import { Modal } from "./Modal";

type ConfirmRow = {
  label: string;
  value: string;
  accent?: boolean;
};

type ConfirmActionModalProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
  confirming?: boolean;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  rows: ConfirmRow[];
  confirmLabel?: string;
};

export function ConfirmActionModal({
  open,
  onCancel,
  onConfirm,
  confirming = false,
  icon: Icon = IconSend,
  title,
  description,
  rows,
  confirmLabel = "Confirmar",
}: ConfirmActionModalProps) {
  const confirmationLock = useRef(false);

  async function handleConfirm() {
    if (confirming || confirmationLock.current) {
      return;
    }

    confirmationLock.current = true;

    try {
      await onConfirm();
    } finally {
      confirmationLock.current = false;
    }
  }

  function handleCancel() {
    if (confirming || confirmationLock.current) {
      return;
    }

    onCancel();
  }

  return (
    <Modal
      open={open}
      onClose={handleCancel}
      title={title}
    >
      <div className="flex flex-col gap-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-control bg-violet-500/15 text-violet-300">
          <Icon className="h-5 w-5" />
        </div>

        <p className="text-[14.5px] text-text-light-secondary dark:text-text-dark-secondary">
          {description}
        </p>

        <div className="divide-y divide-border-light overflow-hidden rounded-card border border-border-light dark:divide-border-dark dark:border-border-dark">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <span className="text-[13px] text-text-light-tertiary dark:text-text-dark-tertiary">
                {row.label}
              </span>

              <span
                className={`text-right text-[13.5px] font-semibold ${
                  row.accent
                    ? "text-turquoise-500"
                    : "text-text-light-primary dark:text-text-dark-primary"
                }`}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={handleCancel}
            disabled={confirming}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="primary"
            fullWidth
            loading={confirming}
            disabled={confirming}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
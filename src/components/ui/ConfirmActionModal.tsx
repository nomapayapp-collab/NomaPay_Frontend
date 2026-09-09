import {
  useEffect,
  useRef,
  useState,
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

type ConfirmationInput = {
  label: string;
  expectedValue: string;
  placeholder?: string;
};

type ConfirmActionModalProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
  confirming?: boolean;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  variant?: "default" | "danger";
  title: string;
  description: string;
  rows: ConfirmRow[];
  confirmationInput?: ConfirmationInput;
  confirmLabel?: string;
};

export function ConfirmActionModal({
  open,
  onCancel,
  onConfirm,
  confirming = false,
  icon: Icon = IconSend,
  variant = "default",
  title,
  description,
  rows,
  confirmationInput,
  confirmLabel = "Confirmar",
}: ConfirmActionModalProps) {
  const confirmationLock = useRef(false);
  const [typedConfirmation, setTypedConfirmation] =
    useState("");

  useEffect(() => {
    if (open) {
      setTypedConfirmation("");
    }
  }, [open]);

  const normalizedTypedConfirmation =
    typedConfirmation.trim().toLowerCase();

  const normalizedExpectedValue =
    confirmationInput?.expectedValue.trim().toLowerCase() ?? "";

  const confirmationMismatch =
    !!confirmationInput &&
    normalizedTypedConfirmation !== normalizedExpectedValue;

  const showConfirmationError =
    !!confirmationInput &&
    typedConfirmation.length > 0 &&
    confirmationMismatch;

  async function handleConfirm() {
    if (
      confirming ||
      confirmationLock.current ||
      confirmationMismatch
    ) {
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
      borderClassName={
        variant === "danger"
          ? "border border-magenta-500"
          : undefined
      }
    >
      <div className="flex flex-col gap-5">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-control ${
            variant === "danger"
              ? "bg-magenta-500/15 text-magenta-500"
              : "bg-violet-500/15 text-violet-300"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <p
          className={
            variant === "danger"
              ? "text-[14.5px] font-bold text-text-light-primary dark:text-text-dark-primary"
              : "text-[14.5px] text-text-light-secondary dark:text-text-dark-secondary"
          }
        >
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
                    ? variant === "danger"
                      ? "text-magenta-500"
                      : "text-turquoise-500"
                    : "text-text-light-primary dark:text-text-dark-primary"
                }`}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {confirmationInput && (
          <div>
            <label
              htmlFor="confirm-action-input"
              className="input__label"
            >
              {confirmationInput.label}
            </label>

            <input
              id="confirm-action-input"
              type="email"
              className={`input ${
                showConfirmationError ? "input--error" : ""
              }`}
              value={typedConfirmation}
              onChange={(event) =>
                setTypedConfirmation(event.target.value)
              }
              placeholder={confirmationInput.placeholder}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-invalid={showConfirmationError}
              aria-describedby={
                showConfirmationError
                  ? "confirm-action-input-error"
                  : undefined
              }
            />

            {showConfirmationError && (
              <p
                id="confirm-action-input-error"
                role="alert"
                className="mt-1.5 text-[12px] font-medium text-magenta-500"
              >
                El email ingresado no coincide con el de tu
                cuenta.
              </p>
            )}
          </div>
        )}

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
            disabled={confirming || confirmationMismatch}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
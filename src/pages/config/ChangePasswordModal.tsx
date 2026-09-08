import { useEffect, useState } from "react";
import axios from "axios";

import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { IconCheck } from "../../assets/icons/Icons";
import * as authService from "../../services/authService";

function extractErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (
    axios.isAxiosError(error) &&
    typeof error.response?.data?.error === "string"
  ) {
    return error.response.data.error;
  }

  return fallback;
}

type ChangePasswordModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ChangePasswordModal({
  open,
  onClose,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError(null);
    }
  }, [open]);

  const minimumCharacters = 8;

  const checklist = {
    length: newPassword.length >= minimumCharacters,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    specialCharacter: /[^A-Za-z0-9\s]/.test(newPassword),
    matches:
      newPassword.length > 0 &&
      newPassword === confirmPassword,
  };

  const valid =
    currentPassword.length > 0 &&
    checklist.length &&
    checklist.uppercase &&
    checklist.lowercase &&
    checklist.number &&
    checklist.specialCharacter &&
    checklist.matches;

  const missingCharacters = Math.max(
    minimumCharacters - newPassword.length,
    0,
  );

  const pendingChecklist = [
    {
      key: "length",
      label:
        missingCharacters === 1
          ? "Falta 1 carácter"
          : `Faltan ${missingCharacters} caracteres`,
      met: checklist.length,
    },
    {
      key: "uppercase",
      label: "Falta una letra mayúscula",
      met: checklist.uppercase,
    },
    {
      key: "lowercase",
      label: "Falta una letra minúscula",
      met: checklist.lowercase,
    },
    {
      key: "number",
      label: "Falta un número",
      met: checklist.number,
    },
    {
      key: "specialCharacter",
      label: "Falta un carácter especial, por ejemplo: @, #, $ o !",
      met: checklist.specialCharacter,
    },
    {
      key: "matches",
      label:
        confirmPassword.length === 0
          ? "Confirmá la contraseña nueva"
          : "Las contraseñas no coinciden",
      met: checklist.matches,
    },
  ].filter((item) => !item.met);

  let strengthScore = 0;

  if (checklist.length) strengthScore++;
  if (checklist.uppercase && checklist.lowercase && checklist.number) {
    strengthScore++;
  }
  if (checklist.specialCharacter) strengthScore++;

  const strengthLabel =
    strengthScore <= 1
      ? "Débil"
      : strengthScore === 2
        ? "Media"
        : "Fuerte";

  const strengthColor =
    strengthScore <= 1
      ? "bg-magenta-500"
      : strengthScore === 2
        ? "bg-amber-500"
        : "bg-turquoise-500";

  async function handleSave() {
    if (!valid || saving) return;

    setSaving(true);
    setError(null);

    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
      });

      onClose();
    } catch (requestError) {
      setError(
        extractErrorMessage(
          requestError,
          "No pudimos cambiar tu contraseña.",
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Cambiar contraseña">
      <div className="flex flex-col gap-4">
        <Input
          label="Contraseña actual"
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
        />

        <Input
          label="Contraseña nueva"
          id="newPassword"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
        />

        <Input
          label="Confirmar contraseña nueva"
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />

        {newPassword.length > 0 && (
          <div>
            <div className="mb-1.5 flex gap-1.5">
              {[0, 1, 2].map((position) => (
                <div
                  key={position}
                  className={`h-1.5 flex-1 rounded-full ${
                    position < strengthScore
                      ? strengthColor
                      : "bg-black/10 dark:bg-white/10"
                  }`}
                />
              ))}
            </div>

            <p className="text-xs text-text-light-tertiary dark:text-text-dark-tertiary">
              Seguridad: {strengthLabel}
            </p>
          </div>
        )}

        {pendingChecklist.length > 0 && (
          <ul className="flex flex-col gap-1.5">
            {pendingChecklist.map((item) => (
              <li
                key={item.key}
                className="flex items-center gap-1.5 text-[12.5px] text-text-light-tertiary dark:text-text-dark-tertiary"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                {item.label}
              </li>
            ))}
          </ul>
        )}

        {valid && (
          <p className="flex items-center gap-1.5 text-[13px] font-medium text-turquoise-500">
            <IconCheck className="h-4 w-4" />
            La contraseña cumple todos los requisitos
          </p>
        )}

        {error && (
          <div role="alert" className="alert-note alert-note--error">
            <p className="alert-note__description">{error}</p>
          </div>
        )}

        <div className="mt-2 flex gap-3">
          <Button
            type="button"
            variant="outline"
            fullWidth
            disabled={saving}
            onClick={onClose}
          >
            Cancelar
          </Button>

          <Button
            type="button"
            variant="primary"
            fullWidth
            loading={saving}
            disabled={!valid || saving}
            onClick={handleSave}
          >
            Guardar contraseña
          </Button>
        </div>
      </div>
    </Modal>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";

import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import {
  PasswordRequirements,
  getPasswordChecks,
} from "../../components/auth/PasswordRequirements";
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
  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (open) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError(null);
    }
  }, [open]);

  const passwordChecks = getPasswordChecks(
    newPassword,
    confirmPassword,
  );

  const valid =
    currentPassword.length > 0 &&
    passwordChecks.allValid;

  async function handleSave() {
    if (!valid || saving) {
      return;
    }

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
    <Modal
      open={open}
      onClose={onClose}
      title="Cambiar contraseña"
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Contraseña actual"
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={(event) =>
            setCurrentPassword(event.target.value)
          }
        />

        <Input
          label="Contraseña nueva"
          id="newPassword"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(event) =>
            setNewPassword(event.target.value)
          }
        />

        <Input
          label="Confirmar contraseña nueva"
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(event) =>
            setConfirmPassword(event.target.value)
          }
        />

        <PasswordRequirements
          password={newPassword}
          confirmPassword={confirmPassword}
        />

        {valid && (
          <p className="flex items-center gap-1.5 text-[13px] font-medium text-turquoise-500">
            <IconCheck className="h-4 w-4 shrink-0" />

            <span>
              La contraseña cumple todos los requisitos
            </span>
          </p>
        )}

        {error && (
          <div
            role="alert"
            className="alert-note alert-note--error"
          >
            <p className="alert-note__description">
              {error}
            </p>
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
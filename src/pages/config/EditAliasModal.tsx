import { useEffect, useState } from "react";
import axios from "axios";

import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { IconCheck } from "../../assets/icons/Icons";
import * as authService from "../../services/authService";

import type { AuthUser } from "../../types/auth";

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

type EditAliasModalProps = {
  open: boolean;
  currentAlias: string;
  onClose: () => void;
  onSaved: (updatedUser: AuthUser) => void;
};

export function EditAliasModal({
  open,
  currentAlias,
  onClose,
  onSaved,
}: EditAliasModalProps) {
  const [newAlias, setNewAlias] = useState(currentAlias);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setNewAlias(currentAlias);
      setError(null);
    }
  }, [open, currentAlias]);

  const minimumCharacters = 8;
  const maximumCharacters = 32;

  const rules = {
    minimumLength: newAlias.length >= minimumCharacters,
    maximumLength: newAlias.length <= maximumCharacters,
    validCharacters: /^[a-zA-Z0-9.]*$/.test(newAlias),
  };

  const formatValid =
    rules.minimumLength &&
    rules.maximumLength &&
    rules.validCharacters;

  const changed =
    newAlias.trim() !== "" &&
    newAlias !== currentAlias;

  const missingCharacters = Math.max(
    minimumCharacters - newAlias.length,
    0,
  );

  const pendingRules = [
    {
      key: "minimumLength",
      label:
        missingCharacters > 0
          ? `Faltan ${missingCharacters} ${
              missingCharacters === 1
                ? "carácter"
                : "caracteres"
            }`
          : "",
      met: rules.minimumLength,
    },
    {
      key: "validCharacters",
      label: "Solo se permiten letras, números y puntos",
      met: rules.validCharacters,
    },
  ].filter((rule) => !rule.met);

  async function handleSave() {
    if (!formatValid || !changed || saving) return;

    setSaving(true);
    setError(null);

    try {
      const updatedUser =
        await authService.updateProfile({
          alias: newAlias,
        });

      onSaved(updatedUser);
    } catch (requestError) {
      setError(
        extractErrorMessage(
          requestError,
          "No pudimos actualizar tu alias.",
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
      title="Editar alias"
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Nuevo alias"
          id="newAlias"
          value={newAlias}
          maxLength={maximumCharacters}
          onChange={(event) =>
            setNewAlias(event.target.value)
          }
          autoFocus
        />

        <p className="text-right text-xs text-text-light-tertiary dark:text-text-dark-tertiary">
          {newAlias.length}/{maximumCharacters} caracteres
        </p>

        {formatValid && changed && (
          <p className="flex items-center gap-1.5 text-[13px] font-medium text-turquoise-500">
            <IconCheck className="h-4 w-4" />
            Formato válido
          </p>
        )}

        {pendingRules.length > 0 && (
          <ul className="flex flex-col gap-1.5">
            {pendingRules.map((rule) => (
              <li
                key={rule.key}
                className="flex items-center gap-1.5 text-[12.5px] text-text-light-tertiary dark:text-text-dark-tertiary"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />

                {rule.label}
              </li>
            ))}
          </ul>
        )}

        {formatValid && !changed && (
          <p className="text-[12.5px] text-text-light-tertiary dark:text-text-dark-tertiary">
            Ingresá un alias diferente al actual.
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
            disabled={!formatValid || !changed || saving}
            onClick={handleSave}
          >
            Guardar alias
          </Button>
        </div>
      </div>
    </Modal>
  );
}
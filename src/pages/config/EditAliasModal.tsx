import { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { IconCheck } from "../../assets/icons/Icons";
import * as authService from "../../services/authService";
import type { AuthUser } from "../../types/auth";

function extractErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err) && typeof err.response?.data?.error === "string") {
    return err.response.data.error;
  }
  return fallback;
}

type EditAliasModalProps = {
  open: boolean;
  currentAlias: string;
  onClose: () => void;
  onSaved: (updatedUser: AuthUser) => void;
};

/**
 * Modal "Editar alias" — se abre desde el lápiz en Config. Vive acá adentro
 * (no en Config.tsx) para no ensuciar esa pantalla con su propio estado de
 * formulario; Config solo le pasa open/onClose/onSaved.
 */
export function EditAliasModal({ open, currentAlias, onClose, onSaved }: EditAliasModalProps) {
  const [newAlias, setNewAlias] = useState(currentAlias);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setNewAlias(currentAlias);
      setError(null);
    }
  }, [open, currentAlias]);

  const rules = {
    length: newAlias.length >= 6 && newAlias.length <= 20,
    charset: /^[a-zA-Z0-9.]*$/.test(newAlias),
    noSpaces: !/\s/.test(newAlias),
  };
  const formatValid = rules.length && rules.charset && rules.noSpaces;
  const changed = newAlias.trim() !== "" && newAlias !== currentAlias;

  async function handleSave() {
    if (!formatValid || !changed) return;
    setSaving(true);
    setError(null);
    try {
      const updatedUser = await authService.updateProfile({ alias: newAlias });
      onSaved(updatedUser);
    } catch (err) {
      setError(extractErrorMessage(err, "No pudimos actualizar tu alias."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Editar alias">
      <div className="flex flex-col gap-4">
        <Input
          label="Nuevo alias"
          id="newAlias"
          value={newAlias}
          onChange={(e) => setNewAlias(e.target.value)}
          autoFocus
        />

        {formatValid && changed && (
          <p className="flex items-center gap-1.5 text-[13px] text-turquoise-500 font-medium">
            <IconCheck className="w-4 h-4" /> Formato válido
          </p>
        )}

        <ul className="flex flex-col gap-1.5">
          <li className={`text-[12.5px] flex items-center gap-1.5 ${rules.length ? "text-turquoise-500" : "text-text-dark-tertiary"}`}>
            <IconCheck className="w-3.5 h-3.5" /> Entre 6 y 20 caracteres
          </li>
          <li className={`text-[12.5px] flex items-center gap-1.5 ${rules.charset ? "text-turquoise-500" : "text-text-dark-tertiary"}`}>
            <IconCheck className="w-3.5 h-3.5" /> Solo letras, números y puntos
          </li>
          <li className={`text-[12.5px] flex items-center gap-1.5 ${rules.noSpaces ? "text-turquoise-500" : "text-text-dark-tertiary"}`}>
            <IconCheck className="w-3.5 h-3.5" /> Sin espacios ni caracteres especiales
          </li>
        </ul>

        {error && (
          <div className="alert-note alert-note--error">
            <p className="alert-note__description">{error}</p>
          </div>
        )}

        <div className="flex gap-3 mt-2">
          <Button type="button" variant="outline" fullWidth onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="primary"
            fullWidth
            loading={saving}
            disabled={!formatValid || !changed}
            onClick={handleSave}
          >
            Guardar alias
          </Button>
        </div>
      </div>
    </Modal>
  );
}
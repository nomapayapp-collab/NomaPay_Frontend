import { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { IconCheck } from "../../assets/icons/Icons";
import * as authService from "../../services/authService";

function extractErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err) && typeof err.response?.data?.error === "string") {
    return err.response.data.error;
  }
  return fallback;
}

type ChangePasswordModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ChangePasswordModal({ open, onClose }: ChangePasswordModalProps) {
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

  const checklist = {
    length: newPassword.length >= 8,
    upperAndNumber: /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword),
    matches: newPassword.length > 0 && newPassword === confirmPassword,
  };
  const valid = checklist.length && checklist.upperAndNumber && checklist.matches;

  // Igual que en EditAliasModal: solo se listan los requisitos pendientes,
  // así van desapareciendo a medida que se cumplen en vez de quedar fijos.
  const pendingChecklist = [
    { key: "length", label: "Mínimo 8 caracteres", met: checklist.length },
    { key: "upperAndNumber", label: "Al menos una mayúscula y un número", met: checklist.upperAndNumber },
    { key: "matches", label: "Coincide con la confirmación", met: checklist.matches },
  ].filter((item) => !item.met);

  let strengthScore = 0;
  if (checklist.length) strengthScore++;
  if (checklist.upperAndNumber) strengthScore++;
  if (newPassword.length >= 12 || /[^A-Za-z0-9]/.test(newPassword)) strengthScore++;

  const strengthLabel =
    newPassword.length === 0 ? "" : strengthScore <= 1 ? "Débil" : strengthScore === 2 ? "Media" : "Fuerte";
  const strengthColor =
    strengthScore <= 1 ? "bg-magenta-500" : strengthScore === 2 ? "bg-amber-500" : "bg-turquoise-500";

  async function handleSave() {
    if (!valid || !currentPassword) return;
    setSaving(true);
    setError(null);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      onClose();
    } catch (err) {
      setError(extractErrorMessage(err, "No pudimos cambiar tu contraseña."));
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
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <Input
          label="Contraseña nueva"
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          label="Confirmar contraseña nueva"
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {newPassword.length > 0 && (
          <div>
            <div className="flex gap-1.5 mb-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${i < strengthScore ? strengthColor : "bg-white/10"}`} />
              ))}
            </div>
            <p className="text-[12px] text-text-light-tertiary dark:text-text-dark-tertiary">{strengthLabel}</p>
          </div>
        )}

        {pendingChecklist.length > 0 && (
          <ul className="flex flex-col gap-1.5">
            {pendingChecklist.map((item) => (
              <li
                key={item.key}
                className="text-[12.5px] flex items-center gap-1.5 text-text-light-tertiary dark:text-text-dark-tertiary"
              >
                <IconCheck className="w-3.5 h-3.5" /> {item.label}
              </li>
            ))}
          </ul>
        )}

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
            disabled={!valid || !currentPassword}
            onClick={handleSave}
          >
            Guardar contraseña
          </Button>
        </div>
      </div>
    </Modal>
  );
}
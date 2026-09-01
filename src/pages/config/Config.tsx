import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Avatar } from "../../components/ui/Avatar";
import { EditAliasModal } from "./EditAliasModal";
import { ChangePasswordModal } from "./ChangePasswordModal";
import {
  IconCheck,
  IconChevronRight,
  IconCopy,
  IconBack,
  IconEdit,
} from "../../assets/icons/Icons";

import { useAuth } from "../../hooks/useAuth";
import * as authService from "../../services/authService";
import type { CurrencyCode } from "../../types/wallet";
import { COUNTRIES } from "../../constants/countries";
import { Select } from "../../components/ui/Select";
import { useWallet } from "../../hooks/useWallet";
import { useTheme } from "../../hooks/useTheme";

const CURRENCIES: CurrencyCode[] = ["ARS", "USD", "BRL"];

function extractErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err) && typeof err.response?.data?.error === "string") {
    return err.response.data.error;
  }
  return fallback;
}

export default function Config() {
  const { user, updateUser, logout } = useAuth();
  const { refetch: refetchWallet } = useWallet();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [name, setNameState] = useState(user?.name ?? "");
  const [surname, setSurnameState] = useState(user?.surname ?? "");
  const [country, setCountry] = useState(user?.country ?? COUNTRIES[0].code);
  const [alias, setAlias] = useState(user?.alias ?? "");
  const [preferredCurrency, setPreferredCurrency] = useState<CurrencyCode>("USD");

  const [copiedField, setCopiedField] = useState<"alias" | "cbu" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [aliasModalOpen, setAliasModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  useEffect(() => {
    authService
      .getMyProfile()
      .then((profile) => {
        setNameState(profile.name);
        setSurnameState(profile.surname);
        setCountry(profile.country ?? COUNTRIES[0].code);
        setAlias(profile.alias ?? "");
      })
      .catch(() => { });

    authService
      .getMyWallet()
      .then((wallet) => setPreferredCurrency(wallet.preferredCurrency))
      .catch(() => { });
  }, []);

  async function copyToClipboard(text: string, field: "alias" | "cbu") {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1500);
    } catch {
      // no se pudo copiar al portapapeles — no rompemos la UI por esto
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const errors: string[] = [];

    try {
      await authService.updatePreferredCurrency(preferredCurrency);
      refetchWallet();
    } catch (err) {
      errors.push(extractErrorMessage(err, "No pudimos actualizar la moneda preferida."));
    }

    try {
      await authService.updatePreferredCurrency(preferredCurrency);
    } catch (err) {
      errors.push(extractErrorMessage(err, "No pudimos actualizar la moneda preferida."));
    }

    setLoading(false);

    if (errors.length > 0) {
      setError(errors.join(" "));
    } else {
      navigate(-1);
    }
  }

  const displayName = [name, surname].filter(Boolean).join(" ");

  return (
    <div className="min-h-screen bg-surface-dark px-6 py-8">
      <div className="max-w-sm mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button type="button" onClick={() => navigate(-1)} className="icon-btn" aria-label="Volver">
            <IconBack className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold text-text-dark-primary">Mi perfil</h1>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <Avatar user={user} size="lg" />
          <div className="min-w-0">
            <p className="text-xl font-extrabold text-text-dark-primary truncate">
              {displayName || "Tu perfil"}
            </p>
            {alias && <p className="text-sm text-text-dark-tertiary truncate">@{alias}</p>}
          </div>
        </div>

        {error && (
          <div className="alert-note alert-note--error mb-4">
            <p className="alert-note__description">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <p className="text-xs tracking-[0.2em] uppercase text-text-dark-tertiary font-semibold">
              Datos personales
            </p>

            <Input label="Nombre" id="name" value={name} disabled hint="Por ahora no se puede editar desde acá." />
            <Input label="Apellido" id="surname" value={surname} disabled />

            <div>
              <label className="input__label" htmlFor="email">Email</label>
              <div className="relative">
                <input id="email" className="input pr-11 opacity-60 cursor-not-allowed" value={user?.email ?? ""} disabled />
                <IconCheck className="w-5 h-5 text-turquoise-500 absolute right-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <Select
              label="País de residencia"
              id="country"
              value={country}
              onChange={setCountry}
              options={COUNTRIES.map((c) => ({ value: c.code, label: c.name }))}
            />
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-xs tracking-[0.2em] uppercase text-text-dark-tertiary font-semibold mb-3">Cuenta</p>

            <div className="rounded-card border border-border-dark divide-y divide-border-dark overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3.5">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text-dark-tertiary mb-1">Alias</p>
                  <p className="font-semibold text-text-dark-primary truncate">{alias}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <button type="button" onClick={() => setAliasModalOpen(true)} className="text-text-dark-tertiary hover:text-text-dark-primary" aria-label="Editar alias">
                    <IconEdit className="w-5 h-5" />
                  </button>
                  <button type="button" onClick={() => copyToClipboard(alias, "alias")} className="text-text-dark-tertiary hover:text-text-dark-primary" aria-label="Copiar alias">
                    {copiedField === "alias" ? <IconCheck className="w-5 h-5 text-turquoise-500" /> : <IconCopy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between px-4 py-3.5">
                <div>
                  <p className="text-xs text-text-dark-tertiary mb-1">CBU</p>
                  <p className="font-semibold text-text-dark-primary tabular">{user?.cbu ?? ""}</p>
                </div>
                <button type="button" onClick={() => copyToClipboard(user?.cbu ?? "", "cbu")} className="text-text-dark-tertiary hover:text-text-dark-primary shrink-0 ml-3" aria-label="Copiar CBU">
                  {copiedField === "cbu" ? <IconCheck className="w-5 h-5 text-turquoise-500" /> : <IconCopy className="w-5 h-5" />}
                </button>
              </div>

              <button type="button" onClick={() => setPasswordModalOpen(true)} className="w-full flex items-center justify-between px-4 py-3.5">
                <span className="font-medium text-text-dark-primary">Cambiar contraseña</span>
                <IconChevronRight className="w-4 h-4 text-text-dark-tertiary" />
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-text-dark-tertiary font-semibold mb-3">Moneda favorita</p>
            <div className="flex gap-2 flex-wrap">
              {CURRENCIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setPreferredCurrency(c)}
                  className={[
                    "px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors",
                    preferredCurrency === c
                      ? "border-violet-500 text-violet-500 bg-violet-500/10"
                      : "border-border-dark text-text-dark-secondary bg-surface-dark-elevated",
                  ].join(" ")}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth loading={loading}>
            Guardar cambios
          </Button>
        </form>
<div className="mt-6">
          <p className="text-xs tracking-[0.2em] uppercase text-text-dark-tertiary font-semibold mb-3">
            Apariencia
          </p>
          <div className="flex items-center justify-between rounded-card border border-border-dark px-4 py-3.5">
            <div>
              <p className="font-medium text-text-dark-primary">Tema oscuro</p>
              <p className="text-xs text-text-dark-tertiary mt-0.5">Cambiá el aspecto de la app</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={theme === "dark"}
              onClick={toggleTheme}
              className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                theme === "dark" ? "bg-violet-500" : "bg-white/15"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  theme === "dark" ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
        <button type="button" onClick={() => logout()} className="text-magenta-500 text-sm font-medium text-center w-full mt-4 hover:opacity-80">
          Cerrar sesión
        </button>
      </div>

      <EditAliasModal
        open={aliasModalOpen}
        currentAlias={alias}
        onClose={() => setAliasModalOpen(false)}
        onSaved={(updatedUser) => {
          updateUser(updatedUser);
          setAlias(updatedUser.alias);
          setAliasModalOpen(false);
        }}
      />

      <ChangePasswordModal open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} />
    </div>
  );
}
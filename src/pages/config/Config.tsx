import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Avatar } from "../../components/ui/Avatar";
import { Sidebar } from "../../components/layout/Sidebar";
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
import { CURRENCY_CODES, CURRENCY_NAMES } from "../../constants/currencies";
import { Select } from "../../components/ui/Select";
import { useWallet } from "../../hooks/useWallet";

function extractErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err) && typeof err.response?.data?.error === "string") {
    return err.response.data.error;
  }
  return fallback;
}

export default function Config() {
  const { user, updateUser } = useAuth();
  const { refetch: refetchWallet } = useWallet();
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
      .catch(() => {});

    authService
      .getMyWallet()
      .then((wallet) => setPreferredCurrency(wallet.preferredCurrency))
      .catch(() => {});
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
      const updated = await authService.updateProfile({ country });
      updateUser(updated);
    } catch (err) {
      errors.push(extractErrorMessage(err, "No pudimos actualizar tus datos."));
    }

    try {
      await authService.updatePreferredCurrency(preferredCurrency);
      refetchWallet();
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
    <div className="min-h-screen flex bg-surface-light dark:bg-surface-dark">
      <Sidebar />

      <div className="flex-1 px-6 py-8 lg:px-10 lg:py-8">
        <div className="max-w-sm lg:max-w-none mx-auto lg:mx-0">
          {/* Header mobile — sin cambios */}
          <div className="flex items-center gap-3 mb-6 lg:hidden">
            <button type="button" onClick={() => navigate(-1)} className="icon-btn" aria-label="Volver">
              <IconBack className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-text-light-primary dark:text-text-dark-primary">Mi perfil</h1>
          </div>

          {/* Header desktop */}
          <div className="hidden lg:flex lg:items-center lg:justify-between mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-text-light-tertiary dark:text-text-dark-tertiary mb-1">
                Datos, cuenta y seguridad
              </p>
              <h1 className="text-2xl font-bold text-text-light-primary dark:text-text-dark-primary">Mi perfil</h1>
            </div>
            <Button type="submit" form="config-form" variant="primary" loading={loading}>
              Guardar cambios
            </Button>
            {/* TODO(desktop): campana de notificaciones del mockup — no hay
                sistema de notificaciones en el back todavía. */}
          </div>

          {error && (
            <div className="alert-note alert-note--error mb-4">
              <p className="alert-note__description">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-5 lg:grid lg:grid-cols-3 lg:gap-6 lg:items-start">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="flex items-center gap-4 lg:rounded-card lg:border lg:border-border-light dark:border-border-dark lg:p-5">
                <Avatar user={user} size="lg" />
                <div className="min-w-0 flex-1">
                  <p className="text-xl font-extrabold text-text-light-primary dark:text-text-dark-primary truncate">
                    {displayName || "Tu perfil"}
                  </p>
                  {alias && <p className="text-sm text-text-light-tertiary dark:text-text-dark-tertiary truncate">@{alias}</p>}
                </div>
                {/* TODO(desktop): "Cambiar foto" del mockup — no hay endpoint
                    para subir foto de perfil todavía. */}
              </div>

              <form id="config-form" onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-4">
                  <p className="text-xs tracking-[0.2em] uppercase text-text-light-tertiary dark:text-text-dark-tertiary font-semibold">
                    Datos personales
                  </p>

                  <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-4">
                    <Input label="Nombre" id="name" value={name} disabled hint="Por ahora no se puede editar desde acá." />
                    <Input label="Apellido" id="surname" value={surname} disabled />
                  </div>

                  <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-4">
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
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-xs tracking-[0.2em] uppercase text-text-light-tertiary dark:text-text-dark-tertiary font-semibold mb-3">Cuenta</p>

                  <div className="rounded-card border border-border-light dark:border-border-dark divide-y divide-border-light dark:divide-border-dark overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3.5">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-text-light-tertiary dark:text-text-dark-tertiary mb-1">Alias</p>
                        <p className="font-semibold text-text-light-primary dark:text-text-dark-primary truncate">{alias}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-3">
                        <button type="button" onClick={() => setAliasModalOpen(true)} className="text-text-light-tertiary dark:text-text-dark-tertiary hover:text-text-light-primary dark:hover:text-text-dark-primary" aria-label="Editar alias">
                          <IconEdit className="w-5 h-5" />
                        </button>
                        <button type="button" onClick={() => copyToClipboard(alias, "alias")} className="text-text-light-tertiary dark:text-text-dark-tertiary hover:text-text-light-primary dark:hover:text-text-dark-primary" aria-label="Copiar alias">
                          {copiedField === "alias" ? <IconCheck className="w-5 h-5 text-turquoise-500" /> : <IconCopy className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-4 py-3.5">
                      <div>
                        <p className="text-xs text-text-light-tertiary dark:text-text-dark-tertiary mb-1">CBU</p>
                        <p className="font-semibold text-text-light-primary dark:text-text-dark-primary tabular">{user?.cbu ?? ""}</p>
                      </div>
                      <button type="button" onClick={() => copyToClipboard(user?.cbu ?? "", "cbu")} className="text-text-light-tertiary dark:text-text-dark-tertiary hover:text-text-light-primary dark:hover:text-text-dark-primary shrink-0 ml-3" aria-label="Copiar CBU">
                        {copiedField === "cbu" ? <IconCheck className="w-5 h-5 text-turquoise-500" /> : <IconCopy className="w-5 h-5" />}
                      </button>
                    </div>

                    <button type="button" onClick={() => setPasswordModalOpen(true)} className="w-full flex items-center justify-between px-4 py-3.5">
                      <span className="font-medium text-text-light-primary dark:text-text-dark-primary">Cambiar contraseña</span>
                      <IconChevronRight className="w-4 h-4 text-text-light-tertiary dark:text-text-dark-tertiary" />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-text-light-tertiary dark:text-text-dark-tertiary font-semibold mb-3">Moneda favorita</p>
                  <div className="flex gap-2 flex-wrap">
                    {CURRENCY_CODES.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setPreferredCurrency(c)}
                        className={[
                          "px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors",
                          preferredCurrency === c
                            ? "border-violet-500 text-violet-500 bg-violet-500/10"
                            : "border-border-light dark:border-border-dark text-text-light-secondary dark:text-text-dark-secondary bg-surface-light-input dark:bg-surface-dark-elevated",
                        ].join(" ")}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <Button type="submit" variant="primary" fullWidth loading={loading} className="lg:hidden">
                  Guardar cambios
                </Button>
              </form>

              {/* TODO(desktop): "Cerrar mi cuenta" (eliminar cuenta) del mockup —
                  no hay endpoint de baja de cuenta en el back todavía, y es una
                  acción destructiva que necesita su propio diseño (¿bloquear si
                  el saldo no es 0? ¿doble confirmación?). Se agrega cuando esté
                  esa lógica del lado del back. */}
            </div>

            <div className="hidden lg:flex lg:flex-col lg:gap-6">
              <div className="rounded-card border border-border-light dark:border-border-dark p-5">
                <p className="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary mb-4">Tu cuenta</p>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-xs text-text-light-tertiary dark:text-text-dark-tertiary mb-1">Alias</p>
                    <p className="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary truncate">{alias}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-light-tertiary dark:text-text-dark-tertiary mb-1">CBU</p>
                    <p className="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary tabular truncate">{user?.cbu ?? ""}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-light-tertiary dark:text-text-dark-tertiary mb-1">Moneda favorita</p>
                    <p className="text-sm font-semibold text-text-light-primary dark:text-text-dark-primary">
                      {preferredCurrency} · {CURRENCY_NAMES[preferredCurrency]}
                    </p>
                  </div>
                </div>
              </div>
              {/* TODO(desktop): panel "Monedas activas" + "Gestionar" del
                  mockup — hoy las 3 monedas están siempre activas para todos
                  los usuarios, no existe un on/off por cuenta. Si arman esa
                  lógica en el back, va acá. */}
            </div>
          </div>
        </div>
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
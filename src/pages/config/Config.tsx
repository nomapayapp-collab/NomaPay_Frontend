import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Avatar } from "../../components/ui/Avatar";
import { Select } from "../../components/ui/Select";
import { ConfirmActionModal } from "../../components/ui/ConfirmActionModal";
import { Header } from "../../components/layout/Header";
import { EditAliasModal } from "./EditAliasModal";
import { ChangePasswordModal } from "./ChangePasswordModal";

import {
  IconCheck,
  IconChevronRight,
  IconCopy,
  IconEdit,
  IconAlertTriangle,
} from "../../assets/icons/Icons";

import { useAuth } from "../../hooks/useAuth";
import { useWallet } from "../../hooks/useWallet";
import * as authService from "../../services/authService";

import type { CurrencyCode } from "../../types/wallet";
import { COUNTRIES } from "../../constants/countries";
import { CURRENCY_CODES } from "../../constants/currencies";

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

export default function Config() {
  const { user, updateUser } = useAuth();
  const { refetch: refetchWallet } = useWallet();
  const navigate = useNavigate();

  const [name, setNameState] = useState(
    user?.name ?? "",
  );

  const [surname, setSurnameState] = useState(
    user?.surname ?? "",
  );

  const [country, setCountry] = useState(
    user?.country ?? COUNTRIES[0].code,
  );

  const [alias, setAlias] = useState(
    user?.alias ?? "",
  );

  const [preferredCurrency, setPreferredCurrency] =
    useState<CurrencyCode>("USD");

  const [copiedField, setCopiedField] = useState<
    "alias" | "cbu" | null
  >(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    null,
  );

  const [aliasModalOpen, setAliasModalOpen] =
    useState(false);

  const [passwordModalOpen, setPasswordModalOpen] =
    useState(false);

  const [deleteModalOpen, setDeleteModalOpen] =
    useState(false);

  const [deletingAccount, setDeletingAccount] =
    useState(false);

  const [deleteError, setDeleteError] = useState<
    string | null
  >(null);

  useEffect(() => {
    authService
      .getMyProfile()
      .then((profile) => {
        setNameState(profile.name);
        setSurnameState(profile.surname);

        setCountry(
          profile.country ?? COUNTRIES[0].code,
        );

        setAlias(profile.alias ?? "");
      })
      .catch(() => {
        // Se conservan los datos disponibles en AuthContext.
      });

    authService
      .getMyWallet()
      .then((wallet) => {
        setPreferredCurrency(
          wallet.preferredCurrency,
        );
      })
      .catch(() => {
        // Se conserva USD como valor inicial.
      });
  }, []);

  async function copyToClipboard(
    text: string,
    field: "alias" | "cbu",
  ) {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);

      setTimeout(() => {
        setCopiedField(null);
      }, 1500);
    } catch {
      // Si el portapapeles no está disponible,
      // no interrumpimos la pantalla.
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (loading) return;

    setError(null);
    setLoading(true);

    const errors: string[] = [];

    try {
      const updatedUser =
        await authService.updateProfile({
          country,
        });

      updateUser(updatedUser);
    } catch (requestError) {
      errors.push(
        extractErrorMessage(
          requestError,
          "No pudimos actualizar tus datos.",
        ),
      );
    }

    try {
      await authService.updatePreferredCurrency(
        preferredCurrency,
      );

      await refetchWallet();
    } catch (requestError) {
      errors.push(
        extractErrorMessage(
          requestError,
          "No pudimos actualizar la moneda preferida.",
        ),
      );
    }

    setLoading(false);

    if (errors.length > 0) {
      setError(errors.join(" "));
      return;
    }

    navigate(-1);
  }

  async function handleDeleteAccount() {
    if (deletingAccount) return;

    setDeletingAccount(true);
    setDeleteError(null);

    try {
      await authService.deleteMyAccount();

      setDeleteModalOpen(false);

      /*
       * El backend elimina la cookie de sesión.
       * Al recargar también se limpia el usuario
       * que se encuentra guardado en AuthContext.
       */
      window.location.replace("/login");
    } catch (requestError) {
      const message = extractErrorMessage(
        requestError,
        "No pudimos eliminar tu cuenta. Intentá nuevamente.",
      );

      setDeleteError(message);
      setDeleteModalOpen(false);
    } finally {
      setDeletingAccount(false);
    }
  }

  function openDeleteModal() {
    if (deletingAccount) return;

    setDeleteError(null);
    setDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    if (deletingAccount) return;

    setDeleteModalOpen(false);
  }

  const displayName = [name, surname]
    .filter(Boolean)
    .join(" ");

  // Mismo picker de moneda favorita en las dos posiciones donde aparece
  // (mobile, dentro del form; desktop, en la columna derecha) — se define acá
  // en vez de duplicar el JSX en los dos lugares.
  function renderCurrencyPicker() {
    return (
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-text-light-tertiary dark:text-text-dark-tertiary">
          Moneda favorita
        </p>

        <div className="flex flex-wrap gap-2">
          {CURRENCY_CODES.map((currencyCode) => (
            <button
              key={currencyCode}
              type="button"
              onClick={() => setPreferredCurrency(currencyCode)}
              className={[
                "rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors",
                preferredCurrency === currencyCode
                  ? "border-violet-500 bg-violet-500/10 text-violet-500"
                  : "border-border-light bg-surface-light-input text-text-light-secondary dark:border-border-dark dark:bg-surface-dark-elevated dark:text-text-dark-secondary",
              ].join(" ")}
            >
              {currencyCode}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 pt-8 pb-8 lg:px-10 lg:py-8 max-w-md lg:max-w-none w-full mx-auto">
      <Header title="Mi perfil" subtitle="Datos, cuenta y seguridad" />

      {error && (
            <div
              role="alert"
              className="alert-note alert-note--error mb-4"
            >
              <p className="alert-note__description">
                {error}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-5 lg:grid lg:grid-cols-3 lg:items-start lg:gap-6">
            {/* Columna principal */}
            <div className="flex flex-col gap-6 lg:col-span-2">
              {/* Perfil */}
              <div className="flex items-center gap-4 lg:rounded-card lg:border lg:border-border-light lg:bg-surface-light lg:p-5 dark:lg:border-border-dark dark:lg:bg-surface-dark-elevated">
                <Avatar user={user} size="lg" />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xl font-extrabold text-text-light-primary dark:text-text-dark-primary">
                    {displayName || "Tu perfil"}
                  </p>

                  {alias && (
                    <p className="truncate text-sm text-text-light-tertiary dark:text-text-dark-tertiary">
                      @{alias}
                    </p>
                  )}
                </div>
              </div>

              <form
                id="config-form"
                onSubmit={handleSubmit}
                className="flex flex-col gap-6"
              >
                {/* Datos personales */}
                <div className="flex flex-col gap-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-light-tertiary dark:text-text-dark-tertiary">
                    Datos personales
                  </p>

                  <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
                    <Input
                      label="Nombre"
                      id="name"
                      value={name}
                      disabled
                      className="cursor-not-allowed opacity-60"
                    />

                    <Input
                      label="Apellido"
                      id="surname"
                      value={surname}
                      disabled
                      className="cursor-not-allowed opacity-60"
                    />
                  </div>

                  <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2">
                    <div>
                      <label
                        className="input__label"
                        htmlFor="email"
                      >
                        Email
                      </label>

                      <div className="relative">
                        <input
                          id="email"
                          className="input cursor-not-allowed pr-11 opacity-60"
                          value={user?.email ?? ""}
                          disabled
                          readOnly
                        />

                        <IconCheck className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-turquoise-500" />
                      </div>
                    </div>

                    <Select
                      label="País de residencia"
                      id="country"
                      value={country}
                      onChange={setCountry}
                      options={COUNTRIES.map(
                        (countryOption) => ({
                          value: countryOption.code,
                          label: countryOption.name,
                        }),
                      )}
                    />
                  </div>
                </div>

                {/* Cuenta */}
                <div className="flex flex-col gap-1">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-text-light-tertiary dark:text-text-dark-tertiary">
                    Cuenta
                  </p>

                  <div className="divide-y divide-border-light overflow-hidden rounded-card border border-border-light bg-surface-light dark:divide-border-dark dark:border-border-dark dark:bg-surface-dark-elevated">
                    {/* Alias */}
                    <div className="flex items-center justify-between px-4 py-3.5">
                      <div className="min-w-0 flex-1">
                        <p className="mb-1 text-xs text-text-light-tertiary dark:text-text-dark-tertiary">
                          Alias
                        </p>

                        <p className="truncate font-semibold text-text-light-primary dark:text-text-dark-primary">
                          {alias}
                        </p>
                      </div>

                      <div className="ml-3 flex shrink-0 items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setAliasModalOpen(true)
                          }
                          className="text-text-light-tertiary transition hover:text-text-light-primary dark:text-text-dark-tertiary dark:hover:text-text-dark-primary"
                          aria-label="Editar alias"
                        >
                          <IconEdit className="h-5 w-5" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            copyToClipboard(
                              alias,
                              "alias",
                            )
                          }
                          className="text-text-light-tertiary transition hover:text-text-light-primary dark:text-text-dark-tertiary dark:hover:text-text-dark-primary"
                          aria-label="Copiar alias"
                        >
                          {copiedField === "alias" ? (
                            <IconCheck className="h-5 w-5 text-turquoise-500" />
                          ) : (
                            <IconCopy className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* CBU */}
                    <div className="flex items-center justify-between px-4 py-3.5">
                      <div className="min-w-0">
                        <p className="mb-1 text-xs text-text-light-tertiary dark:text-text-dark-tertiary">
                          CBU
                        </p>

                        <p className="truncate font-semibold tabular-nums text-text-light-primary dark:text-text-dark-primary">
                          {user?.cbu ?? ""}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          copyToClipboard(
                            user?.cbu ?? "",
                            "cbu",
                          )
                        }
                        className="ml-3 shrink-0 text-text-light-tertiary transition hover:text-text-light-primary dark:text-text-dark-tertiary dark:hover:text-text-dark-primary"
                        aria-label="Copiar CBU"
                      >
                        {copiedField === "cbu" ? (
                          <IconCheck className="h-5 w-5 text-turquoise-500" />
                        ) : (
                          <IconCopy className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    {/* Contraseña */}
                    <button
                      type="button"
                      onClick={() =>
                        setPasswordModalOpen(true)
                      }
                      className="flex w-full items-center justify-between px-4 py-3.5 text-left transition hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <span className="font-medium text-text-light-primary dark:text-text-dark-primary">
                        Cambiar contraseña
                      </span>

                      <IconChevronRight className="h-4 w-4 text-text-light-tertiary dark:text-text-dark-tertiary" />
                    </button>
                  </div>
                </div>

                {/* Moneda favorita — en desktop esta sección se muestra en la
                    columna derecha, debajo de "Tu cuenta" y arriba de
                    Guardar cambios; acá solo queda para mobile. */}
                <div className="lg:hidden">{renderCurrencyPicker()}</div>

                {/* Acciones mobile */}
                <div className="flex flex-col gap-3 lg:hidden">
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    loading={loading}
                  >
                    Guardar cambios
                  </Button>

                  <Button
                    type="button"
                    variant="destructiveOutline"
                    fullWidth
                    disabled={deletingAccount}
                    onClick={openDeleteModal}
                  >
                    Eliminar cuenta
                  </Button>

                  {deleteError && (
                    <div
                      role="alert"
                      className="alert-note alert-note--error"
                    >
                      <p className="alert-note__description">
                        {deleteError}
                      </p>
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Columna derecha desktop */}
            <div className="hidden flex-col gap-4 lg:flex">
              {/* Datos de la cuenta */}
              <div className="rounded-card border border-border-light bg-surface-light p-5 dark:border-border-dark dark:bg-surface-dark-elevated">
                <p className="mb-4 text-sm font-semibold text-text-light-primary dark:text-text-dark-primary">
                  Tu cuenta
                </p>

                <div className="flex flex-col gap-4">
                  <div>
                    <p className="mb-1 text-xs text-text-light-tertiary dark:text-text-dark-tertiary">
                      Alias
                    </p>

                    <p className="truncate text-sm font-semibold text-text-light-primary dark:text-text-dark-primary">
                      {alias}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-xs text-text-light-tertiary dark:text-text-dark-tertiary">
                      CBU
                    </p>

                    <p className="truncate text-sm font-semibold tabular-nums text-text-light-primary dark:text-text-dark-primary">
                      {user?.cbu ?? ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Moneda favorita — abajo de Tu cuenta, arriba de Guardar cambios */}
              {renderCurrencyPicker()}

              {/* Guardar debajo de los datos */}
              <Button
                type="submit"
                form="config-form"
                variant="primary"
                fullWidth
                loading={loading}
              >
                Guardar cambios
              </Button>

              {/* Eliminar debajo de guardar */}
              <Button
                type="button"
                variant="destructiveOutline"
                fullWidth
                disabled={deletingAccount}
                onClick={openDeleteModal}
              >
                Eliminar cuenta
              </Button>

              {deleteError && (
                <div
                  role="alert"
                  className="alert-note alert-note--error"
                >
                  <p className="alert-note__description">
                    {deleteError}
                  </p>
                </div>
              )}
            </div>
          </div>

      {/* Modal para editar alias */}
      <EditAliasModal
        open={aliasModalOpen}
        currentAlias={alias}
        onClose={() =>
          setAliasModalOpen(false)
        }
        onSaved={(updatedUser) => {
          updateUser(updatedUser);
          setAlias(updatedUser.alias);
          setAliasModalOpen(false);
        }}
      />

      {/* Modal para cambiar contraseña */}
      <ChangePasswordModal
        open={passwordModalOpen}
        onClose={() =>
          setPasswordModalOpen(false)
        }
      />

      {/* Confirmación para eliminar cuenta */}
      <ConfirmActionModal
        open={deleteModalOpen}
        onCancel={closeDeleteModal}
        onConfirm={handleDeleteAccount}
        confirming={deletingAccount}
        icon={IconAlertTriangle}
        variant="danger"
        title="¿Eliminar tu cuenta?"
        description="Esta acción es permanente y no se puede deshacer."
        rows={[
          {
            label: "Cuenta",
            value: user?.email ?? "Tu cuenta",
          },
          {
            label: "Requisito",
            value:
              "Todos los saldos deben estar en cero",
            accent: true,
          },
        ]}
        confirmationInput={
          user?.email
            ? {
                label: `Para confirmar, escribí tu email: ${user.email}`,
                expectedValue: user.email,
                placeholder: user.email,
              }
            : undefined
        }
        confirmLabel="Sí, eliminar cuenta"
      />
    </div>
  );
}
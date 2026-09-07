import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Button } from "../components/ui/Button";
import { ConfirmActionModal } from "../components/ui/ConfirmActionModal";
import {
  IconBack,
  IconSearch,
  IconCheck,
} from "../assets/icons/Icons";
import { useWallet } from "../hooks/useWallet";
import { formatCurrency } from "../utils/formatCurrency";
import { getFrequentContacts } from "../services/contactService";
import type { FrequentContact } from "../types/contact";
import { CURRENCY_NAMES } from "../constants/currencies";
import type { CurrencyCode } from "../types/wallet";

type Recipient = {
  alias: string;
  name?: string;
};

const STEP_LABELS = [
  "Destinatario",
  "Monto",
  "Confirmar",
];

const MESSAGE_MAX = 140;

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// Un contacto frecuente sin alias ni CBU no se puede usar como destinatario
// (no hay con qué identificarlo en /transfers) — no debería pasar, pero
// por las dudas lo filtramos en vez de romper.
function contactIdentifier(contact: FrequentContact): string | null {
  return contact.alias ?? contact.cbu ?? null;
}

function contactToRecipient(contact: FrequentContact): Recipient | null {
  const alias = contactIdentifier(contact);
  if (!alias) return null;
  return { alias, name: `${contact.name} ${contact.surname}`.trim() };
}

export default function Transfer() {
  const navigate = useNavigate();
  const { wallet } = useWallet();

  const [step, setStep] = useState(1);
  const [query, setQuery] = useState("");
  const [recipient, setRecipient] =
    useState<Recipient | null>(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sending, setSending] = useState(false);

  // Contactos frecuentes reales (GET /contacts) — los 3 destinatarios con
  // más transferencias completadas. Si falla, no rompemos la pantalla:
  // el usuario igual puede escribir un alias/CBU a mano.
  const [contacts, setContacts] = useState<FrequentContact[]>([]);
  const [contactsLoading, setContactsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getFrequentContacts()
      .then((data) => {
        if (!cancelled) setContacts(data);
      })
      .catch(() => {
        if (!cancelled) setContacts([]);
      })
      .finally(() => {
        if (!cancelled) setContactsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const usableContacts: (Recipient & { id: number })[] = contacts.flatMap((contact) => {
    const recipient = contactToRecipient(contact);
    return recipient ? [{ ...recipient, id: contact.id }] : [];
  });

  const transferableBalances = wallet.balances.filter(
    (balance) => balance.amount > 0,
  );

  const [currencyCode, setCurrencyCode] =
    useState<CurrencyCode>(
      wallet.balances.find(
        (balance) =>
          balance.isPrimary && balance.amount > 0,
      )?.currency.code ??
        transferableBalances[0]?.currency.code ??
        "ARS",
    );

  const balance = wallet.balances.find(
    (item) => item.currency.code === currencyCode,
  );

  const available = balance?.amount ?? 0;

  const numericAmount =
    Number(amount.replace(",", ".")) || 0;

  const amountValid =
    numericAmount > 0 && numericAmount <= available;

  const filteredContacts = usableContacts.filter(
    (contact) =>
      (contact.name ?? "")
        .toLowerCase()
        .includes(query.toLowerCase()) ||
      contact.alias
        .toLowerCase()
        .includes(query.toLowerCase()),
  );

  const exactMatch = usableContacts.some(
    (contact) =>
      contact.alias.toLowerCase() ===
      query.trim().toLowerCase(),
  );

  function selectRecipient(selectedRecipient: Recipient) {
    setRecipient(selectedRecipient);
    setQuery("");
  }

  function handleSubmitStep3(event: FormEvent) {
    event.preventDefault();

    if (!recipient || !amountValid || sending) {
      return;
    }

    setConfirmOpen(true);
  }

  function handleCancelConfirmation() {
    if (sending) {
      return;
    }

    setConfirmOpen(false);
  }

  function handleConfirmSend() {
    if (!recipient || !amountValid || sending) {
      return;
    }

    setSending(true);
    setConfirmOpen(false);

    navigate("/comprobante", {
      state: {
        amount: numericAmount,
        currency: currencyCode,
        aliasOrCbu: recipient.alias,
      },
    });
  }

  return (
    <div className="mx-auto w-full max-w-md px-5 pb-8 pt-8 lg:max-w-none lg:px-10 lg:py-8">
      <Header
        title="Transferir dinero"
        subtitle="A cualquier usuario al instante"
      />

      {step > 1 && (
        <button
          type="button"
          disabled={sending}
          onClick={() =>
            setStep((currentStep) => currentStep - 1)
          }
          className="-mt-2 mb-4 flex items-center gap-1.5 text-[13.5px] font-medium text-violet-300 hover:text-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <IconBack className="h-3.5 w-3.5" />
          Volver
        </button>
      )}

      {/* Progreso móvil */}
      <div className="mb-7 lg:hidden">
        <p className="mb-2 text-[12px] font-semibold uppercase tracking-widest text-text-light-tertiary dark:text-text-dark-tertiary">
          {step} DE 3 · {STEP_LABELS[step - 1]}
        </p>

        <div className="flex gap-1.5">
          {STEP_LABELS.map((label, index) => (
            <div
              key={label}
              className={`h-1.5 flex-1 rounded-full ${
                index < step
                  ? "bg-violet-500"
                  : "bg-black/8 dark:bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Progreso escritorio */}
      <div className="mb-8 hidden items-center gap-3 lg:flex">
        {STEP_LABELS.map((label, index) => {
          const number = index + 1;
          const done = number < step;
          const active = number === step;

          return (
            <div
              key={label}
              className="flex flex-1 items-center gap-3"
            >
              <div className="flex shrink-0 items-center gap-2.5">
                <span
                  className={[
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12.5px] font-bold",
                    done
                      ? "bg-violet-500 text-white"
                      : active
                        ? "border border-violet-500 bg-violet-500/15 text-violet-300"
                        : "bg-black/5 text-text-light-tertiary dark:bg-white/8 dark:text-text-dark-tertiary",
                  ].join(" ")}
                >
                  {done ? (
                    <IconCheck className="h-3.5 w-3.5" />
                  ) : (
                    number
                  )}
                </span>

                <span
                  className={`text-[13.5px] font-medium ${
                    active || done
                      ? "text-text-light-primary dark:text-text-dark-primary"
                      : "text-text-light-tertiary dark:text-text-dark-tertiary"
                  }`}
                >
                  {label}
                </span>
              </div>

              {number < 3 && (
                <div
                  className={`h-px flex-1 ${
                    done
                      ? "bg-violet-500"
                      : "bg-border-light dark:bg-border-dark"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="items-start lg:grid lg:grid-cols-3 lg:gap-6">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Paso 1: destinatario */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <Input
                icon={<IconSearch className="h-4 w-4" />}
                placeholder="Buscar alias, CBU o contacto"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setRecipient(null);
                }}
                autoFocus
              />

              {recipient && (
                <div className="flex items-center gap-3 rounded-card border border-violet-500 bg-violet-500/5 p-4">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
                    style={{
                      backgroundImage:
                        "var(--gradient-swoosh)",
                    }}
                  >
                    {recipient.name
                      ? initials(recipient.name)
                      : "?"}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-text-light-primary dark:text-text-dark-primary">
                      {recipient.name ?? recipient.alias}
                    </p>

                    <p className="truncate text-[12.5px] text-text-light-tertiary dark:text-text-dark-tertiary">
                      {recipient.name
                        ? recipient.alias
                        : "Verificamos este alias o CBU al confirmar"}
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setRecipient(null)}
                  >
                    Cambiar
                  </Button>
                </div>
              )}

              {!recipient &&
                query.trim().length > 0 &&
                !exactMatch && (
                  <button
                    type="button"
                    onClick={() =>
                      selectRecipient({
                        alias: query.trim(),
                      })
                    }
                    className="rounded-card border border-dashed border-border-light p-4 text-left hover:border-violet-500/40 dark:border-border-dark"
                  >
                    <p className="mb-1 text-[13px] text-text-light-tertiary dark:text-text-dark-tertiary">
                      Usar como destinatario
                    </p>

                    <p className="truncate font-semibold text-text-light-primary dark:text-text-dark-primary">
                      {query.trim()}
                    </p>
                  </button>
                )}

              {!recipient && (
                <div>
                  <p className="card__title mb-3">
                    Frecuentes
                  </p>

                  {contactsLoading ? (
                    <p className="text-[13.5px] text-text-light-tertiary dark:text-text-dark-tertiary">
                      Buscando tus contactos frecuentes...
                    </p>
                  ) : filteredContacts.length === 0 ? (
                    <p className="text-[13.5px] text-magenta-500">
                      {query.trim().length > 0
                        ? "No encontramos contactos con ese nombre o alias."
                        : "Todavía no tenés contactos frecuentes."}
                    </p>
                  ) : (
                    <ul className="flex flex-col gap-1">
                      {filteredContacts.map((contact) => (
                        <li key={contact.id}>
                          <button
                            type="button"
                            onClick={() =>
                              selectRecipient(contact)
                            }
                            className="flex w-full items-center gap-3 rounded-control px-3 py-2.5 text-left hover:bg-black/5 dark:hover:bg-white/5"
                          >
                            <span
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
                              style={{
                                backgroundImage:
                                  "var(--gradient-swoosh)",
                              }}
                            >
                              {initials(contact.name ?? contact.alias)}
                            </span>

                            <div className="min-w-0 flex-1">
                              <p className="truncate font-medium text-text-light-primary dark:text-text-dark-primary">
                                {contact.name ?? contact.alias}
                              </p>

                              <p className="truncate text-[12.5px] text-text-light-tertiary dark:text-text-dark-tertiary">
                                {contact.alias}
                              </p>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <Button
                type="button"
                variant="primary"
                fullWidth
                disabled={!recipient}
                onClick={() => setStep(2)}
              >
                Continuar
              </Button>
            </div>
          )}

          {/* Paso 2: monto */}
          {step === 2 && (
            <form
              className="flex flex-col gap-5"
              onSubmit={(event) => {
                event.preventDefault();

                if (amountValid) {
                  setStep(3);
                }
              }}
            >
              {transferableBalances.length === 0 ? (
                <div className="alert-note alert-note--warning">
                  <p className="alert-note__title">
                    No tenés saldo disponible
                  </p>

                  <p className="alert-note__description">
                    Todavía no tenés saldo en ninguna
                    moneda para transferir.
                  </p>
                </div>
              ) : (
                <Select
                  label="Moneda"
                  value={currencyCode}
                  onChange={(value) =>
                    setCurrencyCode(
                      value as CurrencyCode,
                    )
                  }
                  options={transferableBalances.map(
                    (item) => ({
                      value: item.currency.code,
                      label: `${item.currency.code} · ${
                        CURRENCY_NAMES[
                          item.currency.code
                        ]
                      }`,
                    }),
                  )}
                />
              )}

              <div>
                <p className="input__label">Monto</p>

                <div className="flex items-center gap-2 rounded-card border border-dashed border-border-light bg-surface-light-input px-5 py-6 focus-within:border-violet-500 dark:border-border-dark dark:bg-surface-dark-elevated">
                  <span className="text-[28px] font-bold text-text-light-tertiary dark:text-text-dark-tertiary">
                    {balance?.currency.symbol ?? ""}
                  </span>

                  <input
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={(event) =>
                      setAmount(
                        event.target.value.replace(
                          /[^0-9,]/g,
                          "",
                        ),
                      )
                    }
                    placeholder="0,00"
                    autoFocus
                    className="min-w-0 flex-1 border-0 bg-transparent text-[28px] font-bold text-text-light-primary outline-none ring-0 ring-offset-0 placeholder:text-text-light-tertiary focus:ring-0 focus:ring-offset-0 dark:text-text-dark-primary dark:placeholder:text-text-dark-tertiary"
                  />
                </div>

                <p
                  className={`mt-2 text-[12.5px] ${
                    numericAmount > available
                      ? "text-magenta-500"
                      : "text-text-light-tertiary dark:text-text-dark-tertiary"
                  }`}
                >
                  Disponible:{" "}
                  {formatCurrency(
                    available,
                    currencyCode,
                  )}{" "}
                  en tu billetera
                </p>
              </div>

              <div>
                <label
                  className="input__label"
                  htmlFor="transfer-message"
                >
                  Mensaje (opcional)
                </label>

                <textarea
                  id="transfer-message"
                  value={message}
                  onChange={(event) =>
                    setMessage(
                      event.target.value.slice(
                        0,
                        MESSAGE_MAX,
                      ),
                    )
                  }
                  rows={3}
                  className="input resize-none"
                  placeholder="Agregá un mensaje para el destinatario"
                />

                <p className="mt-1.5 text-right text-[12px] text-text-light-tertiary dark:text-text-dark-tertiary">
                  {message.length}/{MESSAGE_MAX}
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={!amountValid}
              >
                Continuar
              </Button>
            </form>
          )}

          {/* Paso 3: revisión */}
          {step === 3 && recipient && (
            <>
              <form
                onSubmit={handleSubmitStep3}
                className="flex flex-col gap-6"
              >
                <div className="divide-y divide-border-light overflow-hidden rounded-card border border-border-light dark:divide-border-dark dark:border-border-dark">
                  <div className="flex items-center justify-between gap-4 px-4 py-3.5">
                    <span className="text-[13.5px] text-text-light-tertiary dark:text-text-dark-tertiary">
                      Destinatario
                    </span>

                    <span className="max-w-50 truncate text-right font-semibold text-text-light-primary dark:text-text-dark-primary">
                      {recipient.name ?? recipient.alias}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 px-4 py-3.5">
                    <span className="text-[13.5px] text-text-light-tertiary dark:text-text-dark-tertiary">
                      Monto
                    </span>

                    <span className="tabular font-semibold text-text-light-primary dark:text-text-dark-primary">
                      {formatCurrency(
                        numericAmount,
                        currencyCode,
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 px-4 py-3.5">
                    <span className="text-[13.5px] text-text-light-tertiary dark:text-text-dark-tertiary">
                      Comisión
                    </span>

                    <span className="font-semibold text-text-light-primary dark:text-turquoise-500">
                      Sin cargo
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 px-4 py-3.5">
                    <span className="text-[13.5px] font-semibold text-text-light-primary dark:text-text-dark-primary">
                      Total a enviar
                    </span>

                    <span className="tabular font-bold text-text-light-primary dark:text-text-dark-primary">
                      {formatCurrency(
                        numericAmount,
                        currencyCode,
                      )}
                    </span>
                  </div>

                  {message && (
                    <div className="px-4 py-3.5">
                      <span className="mb-1 block text-[13.5px] text-text-light-tertiary dark:text-text-dark-tertiary">
                        Mensaje
                      </span>

                      <p className="text-[14px] text-text-light-primary dark:text-text-dark-primary">
                        {message}
                      </p>
                    </div>
                  )}
                </div>

                <div className="alert-note alert-note--info">
                  <p className="alert-note__title">
                    Verificá el alias antes de enviar
                  </p>

                  <p className="alert-note__description">
                    Las transferencias no se pueden
                    deshacer una vez confirmadas.
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={sending}
                  disabled={sending}
                >
                  {sending
                    ? "Procesando..."
                    : "Enviar dinero"}
                </Button>
              </form>

              <ConfirmActionModal
                open={confirmOpen}
                onCancel={handleCancelConfirmation}
                onConfirm={handleConfirmSend}
                confirming={sending}
                title="¿Confirmás el envío?"
                description={`Vas a enviar ${formatCurrency(
                  numericAmount,
                  currencyCode,
                )} a ${
                  recipient.name ?? recipient.alias
                }. Esta acción no se puede deshacer.`}
                rows={[
                  {
                    label: "Alias",
                    value: recipient.alias,
                  },
                  {
                    label: "Comisión",
                    value: "Sin cargo",
                    accent: true,
                  },
                  {
                    label: "Total a debitar",
                    value: formatCurrency(
                      numericAmount,
                      currencyCode,
                    ),
                  },
                ]}
                confirmLabel="Confirmar envío"
              />
            </>
          )}
        </div>

        {/* Columna lateral */}
        <div className="hidden lg:flex lg:flex-col lg:gap-6">
          <div className="rounded-card border border-border-light p-5 dark:border-border-dark">
            <p className="card__title mb-3">
              Frecuentes
            </p>

            {contactsLoading ? (
              <p className="text-[13.5px] text-text-light-tertiary dark:text-text-dark-tertiary">
                Buscando tus contactos frecuentes...
              </p>
            ) : usableContacts.length === 0 ? (
              <p className="text-[13.5px] text-text-light-tertiary dark:text-text-dark-tertiary">
                Todavía no tenés contactos frecuentes.
              </p>
            ) : (
              <ul className="flex flex-col gap-1">
                {usableContacts.map((contact) => (
                  <li key={contact.id}>
                    <button
                      type="button"
                      disabled={sending}
                      onClick={() => {
                        selectRecipient(contact);
                        setStep(1);
                      }}
                      className="flex w-full items-center gap-3 rounded-control px-2 py-2 text-left hover:bg-black/5 disabled:opacity-50 dark:hover:bg-white/5"
                    >
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                        style={{
                          backgroundImage:
                            "var(--gradient-swoosh)",
                        }}
                      >
                        {initials(contact.name ?? contact.alias)}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] font-medium text-text-light-primary dark:text-text-dark-primary">
                          {contact.name ?? contact.alias}
                        </p>

                        <p className="truncate text-[12px] text-text-light-tertiary dark:text-text-dark-tertiary">
                          {contact.alias}
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="alert-note alert-note--info">
            <p className="alert-note__title">
              Verificá el alias antes de enviar
            </p>

            <p className="alert-note__description">
              Fijate que el nombre coincida antes de
              confirmar la transferencia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

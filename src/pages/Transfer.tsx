import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Button } from "../components/ui/Button";
import { ConfirmActionModal } from "../components/ui/ConfirmActionModal";
import { IconBack, IconSearch, IconCheck } from "../assets/icons/Icons";
import { useWallet } from "../hooks/useWallet";
import { formatCurrency } from "../utils/formatCurrency";
import { MOCK_CONTACTS } from "../constants/mockContacts";
import type { CurrencyCode } from "../types/wallet";

type Recipient = { name: string; alias: string };

const STEP_LABELS = ["Destinatario", "Monto", "Confirmar"];
const MESSAGE_MAX = 140;

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Transferir dinero — 3 pasos (destinatario → monto → confirmar). Al
 * enviar se abre un modal de "¿confirmás?" y recién ahí se navega al
 * Comprobante (/comprobante), que es quien resuelve la operación
 * (pendiente → completada/rechazada). Ver Receipt.tsx.
 */
export default function Transfer() {
  const navigate = useNavigate();
  const { wallet } = useWallet();

  const [step, setStep] = useState(1);
  const [query, setQuery] = useState("");
  const [recipient, setRecipient] = useState<Recipient | null>(null);
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>(
    wallet.balances.find((b) => b.isPrimary)?.currency.code ?? "ARS"
  );
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const balance = wallet.balances.find((b) => b.currency.code === currencyCode);
  const available = balance?.amount ?? 0;
  const numericAmount = Number(amount.replace(",", "."));
  const amountValid = numericAmount > 0 && numericAmount <= available;

  const filteredContacts = MOCK_CONTACTS.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.alias.toLowerCase().includes(query.toLowerCase())
  );
  const exactMatch = MOCK_CONTACTS.some((c) => c.alias.toLowerCase() === query.trim().toLowerCase());

  function selectRecipient(r: Recipient) {
    setRecipient(r);
    setQuery("");
  }

  function handleSubmitStep3(e: FormEvent) {
    e.preventDefault();
    if (!recipient || !amountValid) return;
    setConfirmOpen(true);
  }

  function handleConfirmSend() {
    if (!recipient) return;
    const known = MOCK_CONTACTS.some((c) => c.alias === recipient.alias);
    navigate("/comprobante", {
      state: {
        amount: numericAmount,
        currency: currencyCode,
        recipientName: recipient.name,
        recipientAlias: recipient.alias,
        known,
      },
    });
  }

  return (
    <div className="px-5 pt-8 pb-8 lg:px-10 lg:py-8 max-w-md lg:max-w-none w-full mx-auto">
      <Header title="Transferir dinero" />

      {step > 1 && (
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          className="flex items-center gap-1.5 text-[13.5px] font-medium text-violet-300 hover:text-violet-500 mb-4 -mt-2"
        >
          <IconBack className="w-3.5 h-3.5" /> Volver
        </button>
      )}

      {/* progreso — mobile */}
      <div className="lg:hidden mb-7">
        <p className="text-[12px] font-semibold tracking-widest uppercase text-text-light-tertiary dark:text-text-dark-tertiary mb-2">
          {step} DE 3 · {STEP_LABELS[step - 1]}
        </p>
        <div className="flex gap-1.5">
          {STEP_LABELS.map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-violet-500" : "bg-black/8 dark:bg-white/10"}`} />
          ))}
        </div>
      </div>

      {/* progreso — desktop */}
      <div className="hidden lg:flex items-center gap-3 mb-8">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const done = n < step;
          const active = n === step;
          return (
            <div key={label} className="flex items-center gap-3 flex-1">
              <div className="flex items-center gap-2.5 shrink-0">
                <span
                  className={[
                    "w-7 h-7 rounded-full flex items-center justify-center text-[12.5px] font-bold shrink-0",
                    done
                      ? "bg-violet-500 text-white"
                      : active
                      ? "bg-violet-500/15 text-violet-300 border border-violet-500"
                      : "bg-black/5 dark:bg-white/8 text-text-light-tertiary dark:text-text-dark-tertiary",
                  ].join(" ")}
                >
                  {done ? <IconCheck className="w-3.5 h-3.5" /> : n}
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
              {n < 3 && <div className={`h-px flex-1 ${done ? "bg-violet-500" : "bg-border-light dark:bg-border-dark"}`} />}
            </div>
          );
        })}
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-6 lg:items-start">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <Input
                icon={<IconSearch className="w-4 h-4" />}
                placeholder="Buscar alias, CBU o contacto"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setRecipient(null);
                }}
                autoFocus
              />

              {recipient && (
                <div className="rounded-card border border-violet-500 bg-violet-500/5 p-4 flex items-center gap-3">
                  <span
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-white text-[13px]"
                    style={{ backgroundImage: "var(--gradient-swoosh)" }}
                  >
                    {initials(recipient.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-text-light-primary dark:text-text-dark-primary truncate">{recipient.name}</p>
                    <p className="text-[12.5px] text-text-light-tertiary dark:text-text-dark-tertiary truncate">{recipient.alias}</p>
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setRecipient(null)}>
                    Cambiar
                  </Button>
                </div>
              )}

              {!recipient && query.trim().length > 0 && !exactMatch && (
                <button
                  type="button"
                  onClick={() => selectRecipient({ name: query.trim(), alias: query.trim() })}
                  className="rounded-card border border-dashed border-border-light dark:border-border-dark p-4 text-left hover:border-violet-500/40"
                >
                  <p className="text-[13px] text-text-light-tertiary dark:text-text-dark-tertiary mb-1">Usar como destinatario</p>
                  <p className="font-semibold text-text-light-primary dark:text-text-dark-primary truncate">{query.trim()}</p>
                </button>
              )}

              {!recipient && (
                <div>
                  <p className="card__title mb-3">Frecuentes</p>
                  {filteredContacts.length === 0 ? (
                    <p className="text-[13.5px] text-text-light-tertiary dark:text-text-dark-tertiary">
                      No encontramos contactos con ese nombre o alias.
                    </p>
                  ) : (
                    <ul className="flex flex-col gap-1">
                      {filteredContacts.map((c) => (
                        <li key={c.id}>
                          <button
                            type="button"
                            onClick={() => selectRecipient(c)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-control hover:bg-black/5 dark:hover:bg-white/5 text-left"
                          >
                            <span
                              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-white text-[13px]"
                              style={{ backgroundImage: "var(--gradient-swoosh)" }}
                            >
                              {initials(c.name)}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-text-light-primary dark:text-text-dark-primary truncate">{c.name}</p>
                              <p className="text-[12.5px] text-text-light-tertiary dark:text-text-dark-tertiary truncate">{c.alias}</p>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <Button type="button" variant="primary" fullWidth disabled={!recipient} onClick={() => setStep(2)}>
                Continuar
              </Button>
            </div>
          )}

          {step === 2 && (
            <form
              className="flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault();
                if (amountValid) setStep(3);
              }}
            >
              <Select
                label="Moneda"
                value={currencyCode}
                onChange={(v) => setCurrencyCode(v as CurrencyCode)}
                options={wallet.balances.map((b) => ({
                  value: b.currency.code,
                  label: `${b.currency.code} · ${b.currency.name}`,
                }))}
              />

              <div>
                <p className="input__label">Monto</p>
                <div className="rounded-card border border-dashed border-border-light dark:border-border-dark bg-surface-light-input dark:bg-surface-dark-elevated px-5 py-6 flex items-center gap-2">
                  <span className="text-[28px] font-bold text-text-light-tertiary dark:text-text-dark-tertiary">
                    {balance?.currency.symbol ?? ""}
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9,]/g, ""))}
                    placeholder="0,00"
                    autoFocus
                    className="flex-1 min-w-0 bg-transparent text-[28px] font-bold text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-tertiary dark:placeholder:text-text-dark-tertiary outline-none"
                  />
                </div>
                <p
                  className={`text-[12.5px] mt-2 ${
                    numericAmount > available ? "text-magenta-500" : "text-text-light-tertiary dark:text-text-dark-tertiary"
                  }`}
                >
                  Disponible: {formatCurrency(available, currencyCode)} en tu billetera
                </p>
              </div>

              <div>
                <label className="input__label" htmlFor="transfer-message">
                  Mensaje (opcional)
                </label>
                <textarea
                  id="transfer-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, MESSAGE_MAX))}
                  rows={3}
                  className="input resize-none"
                  placeholder="Agregá un mensaje para el destinatario"
                />
                <p className="text-[12px] text-text-light-tertiary dark:text-text-dark-tertiary mt-1.5 text-right">
                  {message.length}/{MESSAGE_MAX}
                </p>
              </div>

              <Button type="submit" variant="primary" fullWidth disabled={!amountValid}>
                Continuar
              </Button>
            </form>
          )}

          {step === 3 && recipient && (
            <>
              <form onSubmit={handleSubmitStep3} className="flex flex-col gap-6">
                <div className="rounded-card border border-border-light dark:border-border-dark divide-y divide-border-light dark:divide-border-dark overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3.5">
                    <span className="text-[13.5px] text-text-light-tertiary dark:text-text-dark-tertiary">Destinatario</span>
                    <span className="font-semibold text-text-light-primary dark:text-text-dark-primary text-right truncate max-w-50">
                      {recipient.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3.5">
                    <span className="text-[13.5px] text-text-light-tertiary dark:text-text-dark-tertiary">Monto</span>
                    <span className="font-semibold tabular text-text-light-primary dark:text-text-dark-primary">
                      {formatCurrency(numericAmount, currencyCode)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3.5">
                    <span className="text-[13.5px] text-text-light-tertiary dark:text-text-dark-tertiary">Comisión</span>
                    <span className="font-semibold text-text-light-primary dark:text-text-dark-primary">Sin cargo</span>
                  </div>
                  <div className="flex items-center justify-between px-4 py-3.5">
                    <span className="text-[13.5px] font-semibold text-text-light-primary dark:text-text-dark-primary">
                      Total a enviar
                    </span>
                    <span className="font-bold tabular text-text-light-primary dark:text-text-dark-primary">
                      {formatCurrency(numericAmount, currencyCode)}
                    </span>
                  </div>
                  {message && (
                    <div className="px-4 py-3.5">
                      <span className="text-[13.5px] text-text-light-tertiary dark:text-text-dark-tertiary block mb-1">Mensaje</span>
                      <p className="text-[14px] text-text-light-primary dark:text-text-dark-primary">{message}</p>
                    </div>
                  )}
                </div>

                <div className="alert-note alert-note--info">
                  <p className="alert-note__title">Verificá el alias antes de enviar</p>
                  <p className="alert-note__description">Las transferencias no se pueden deshacer una vez confirmadas.</p>
                </div>

                <Button type="submit" variant="primary" fullWidth>
                  Enviar dinero
                </Button>
              </form>

              <ConfirmActionModal
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={handleConfirmSend}
                title="¿Confirmás el envío?"
                description={`Vas a enviar ${formatCurrency(numericAmount, currencyCode)} a ${recipient.name}. Esta acción no se puede deshacer.`}
                rows={[
                  { label: "Alias", value: recipient.alias },
                  { label: "Comisión", value: "Sin cargo", accent: true },
                  { label: "Total a debitar", value: formatCurrency(numericAmount, currencyCode) },
                ]}
                confirmLabel="Confirmar envío"
              />
            </>
          )}
        </div>

        <div className="hidden lg:flex lg:flex-col lg:gap-6">
          <div className="rounded-card border border-border-light dark:border-border-dark p-5">
            <p className="card__title mb-3">Frecuentes</p>
            <ul className="flex flex-col gap-1">
              {MOCK_CONTACTS.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      selectRecipient(c);
                      setStep(1);
                    }}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-control hover:bg-black/5 dark:hover:bg-white/5 text-left"
                  >
                    <span
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-white text-[12px]"
                      style={{ backgroundImage: "var(--gradient-swoosh)" }}
                    >
                      {initials(c.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] font-medium text-text-light-primary dark:text-text-dark-primary truncate">{c.name}</p>
                      <p className="text-[12px] text-text-light-tertiary dark:text-text-dark-tertiary truncate">{c.alias}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="alert-note alert-note--info">
            <p className="alert-note__title">Verificá el alias antes de enviar</p>
            <p className="alert-note__description">Fijate que el nombre coincida antes de confirmar la transferencia.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
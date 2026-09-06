import { useEffect, useState, type FormEvent } from "react";
import axios from "axios";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { ConfirmActionModal } from "../ui/ConfirmActionModal";
import { useWallet } from "../../hooks/useWallet";
import { useToast } from "../../hooks/useToast";
import { formatCurrency } from "../../utils/formatCurrency";
import { DEPOSIT_LIMITS } from "../../constants/depositLimits";
import { IconPlus } from "../../assets/icons/Icons";
import type { CurrencyCode } from "../../types/wallet";

const CURRENCIES: CurrencyCode[] = ["ARS", "USD", "BRL"];
const QUICK_AMOUNTS = [500, 1000, 5000];

type TopUpModalProps = {
  open: boolean;
  onClose: () => void;
  /** moneda con la que abrir el modal (ej. desde Billetera, la moneda seleccionada) */
  initialCurrency?: CurrencyCode;
};

export function TopUpModal({ open, onClose, initialCurrency }: TopUpModalProps) {
  const { wallet, deposit } = useWallet();
  const { showToast } = useToast();
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>(
    initialCurrency ?? wallet.balances.find((b) => b.isPrimary)?.currency.code ?? "ARS"
  );
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setCurrencyCode(initialCurrency ?? wallet.balances.find((b) => b.isPrimary)?.currency.code ?? "ARS");
    setAmount("");
    setError(null);
  }, [open, initialCurrency, wallet.balances]);

  const currency = wallet.balances.find((b) => b.currency.code === currencyCode)?.currency;
  const numericAmount = Number(amount.replace(",", "."));
  const depositLimit = DEPOSIT_LIMITS[currencyCode];
  const overLimit = numericAmount > depositLimit;
  const isValid = numericAmount > 0 && !overLimit;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setError(null);
    setConfirmOpen(true);
  }

  async function handleConfirmDeposit() {
    setSubmitting(true);
    setError(null);
    try {
      await deposit(currencyCode, numericAmount);
      setConfirmOpen(false);
      onClose();
      showToast("Transacción creada con éxito", "success");
    } catch (err) {
      // el back valida el límite máximo por moneda y devuelve el motivo
      // exacto en el mensaje (ej. "El monto máximo por carga en ARS es
      // 50000000.00") — lo mostramos tal cual en vez de duplicar el
      // límite acá, así nunca queda desactualizado.
      const message =
        axios.isAxiosError(err) && typeof err.response?.data?.error === "string"
          ? err.response.data.error
          : "No pudimos procesar la carga. Probá de nuevo en un rato.";
      setError(message);
      setConfirmOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Cargar saldo">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <p className="card__title mb-3">Elegí la moneda</p>
          <div className="flex gap-2">
            {CURRENCIES.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setCurrencyCode(code)}
                className={[
                  "px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors",
                  currencyCode === code
                    ? "border-violet-500 text-violet-500 bg-violet-500/10"
                    : "border-border-light dark:border-border-dark text-text-light-secondary dark:text-text-dark-secondary bg-surface-light-input dark:bg-surface-dark-elevated",
                ].join(" ")}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="card__title mb-3">Monto a cargar</p>
          <div className="rounded-card border border-dashed border-border-light dark:border-border-dark focus-within:border-violet-500 bg-surface-light-input dark:bg-surface-dark-elevated px-5 py-6 flex items-center gap-2">
            <span className="text-[28px] font-bold text-text-light-tertiary dark:text-text-dark-tertiary">
              {currency?.symbol ?? ""}
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value.replace(/[^0-9,]/g, ""));
                setError(null);
              }}
              placeholder="0,00"
              autoFocus
              className="flex-1 min-w-0 border-0 bg-transparent text-[28px] font-bold text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-tertiary dark:placeholder:text-text-dark-tertiary outline-none ring-0 ring-offset-0 focus:ring-0 focus:ring-offset-0"
            />
          </div>

          <div className="flex gap-2 mt-3">
            {QUICK_AMOUNTS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setAmount(String(value));
                  setError(null);
                }}
                className="chip"
              >
                {formatCurrency(value, currencyCode)}
              </button>
            ))}
          </div>

          <p
            className={`text-[12.5px] mt-3 ${
              overLimit
                ? "text-magenta-500"
                : "text-text-light-tertiary dark:text-text-dark-tertiary"
            }`}
          >
            {overLimit
              ? `El monto máximo por carga en ${currencyCode} es ${formatCurrency(depositLimit, currencyCode)}.`
              : `Máximo por carga en ${currencyCode}: ${formatCurrency(depositLimit, currencyCode)}`}
          </p>

          {error && <p className="text-[12.5px] text-magenta-500 mt-2">{error}</p>}
        </div>

        <Button type="submit" variant="primary" fullWidth disabled={!isValid}>
          Cargar saldo
        </Button>
      </form>

      <ConfirmActionModal
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDeposit}
        confirming={submitting}
        icon={IconPlus}
        title="¿Confirmás la carga?"
        description={`Vas a cargar ${formatCurrency(numericAmount, currencyCode)} a tu billetera. Verificá que el monto y la moneda sean correctos.`}
        rows={[
          { label: "Moneda", value: currencyCode },
          { label: "Monto", value: formatCurrency(numericAmount, currencyCode), accent: true },
        ]}
        confirmLabel="Sí, cargar saldo"
      />
    </Modal>
  );
}

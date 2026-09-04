import { useEffect, useState, type FormEvent } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { useWallet } from "../../hooks/useWallet";
import { formatCurrency } from "../../utils/formatCurrency";
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
  const { wallet, mockDeposit } = useWallet();
  const [currencyCode, setCurrencyCode] = useState<CurrencyCode>(
    initialCurrency ?? wallet.balances.find((b) => b.isPrimary)?.currency.code ?? "ARS"
  );
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setCurrencyCode(initialCurrency ?? wallet.balances.find((b) => b.isPrimary)?.currency.code ?? "ARS");
    setAmount("");
  }, [open, initialCurrency, wallet.balances]);

  const currency = wallet.balances.find((b) => b.currency.code === currencyCode)?.currency;
  const numericAmount = Number(amount.replace(",", "."));
  const isValid = numericAmount > 0;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isValid) return;

    setSubmitting(true);
    setTimeout(() => {
      mockDeposit(currencyCode, numericAmount);
      setSubmitting(false);
      onClose();
    }, 600);
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
          <div className="rounded-card border border-dashed border-border-light dark:border-border-dark bg-surface-light-input dark:bg-surface-dark-elevated px-5 py-6 flex items-center gap-2">
            <span className="text-[28px] font-bold text-text-light-tertiary dark:text-text-dark-tertiary">
              {currency?.symbol ?? ""}
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

          <div className="flex gap-2 mt-3">
            {QUICK_AMOUNTS.map((value) => (
              <button key={value} type="button" onClick={() => setAmount(String(value))} className="chip">
                {formatCurrency(value, currencyCode)}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" variant="primary" fullWidth loading={submitting} disabled={!isValid}>
          Cargar saldo
        </Button>
      </form>
    </Modal>
  );
}
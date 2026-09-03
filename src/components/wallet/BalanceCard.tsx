import { useState } from "react";
import { Card } from "../ui/Card";
import { IconEye, IconEyeOff } from "../../assets/icons/Icons";
import { formatCurrency } from "../../utils/formatCurrency";
import { useWallet } from "../../hooks/useWallet";

const HIDDEN = "••••••";

export function BalanceCard() {
  const { wallet, loading } = useWallet();
  const [showBalance, setShowBalance] = useState(true);
  const primary = wallet.balances.find((b) => b.isPrimary) ?? wallet.balances[0];
  const others = wallet.balances.filter((b) => b !== primary);

  if (loading) {
    return (
      <Card variant="aura">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-24 rounded-full bg-white/15 animate-pulse" />
          <span className="brand-mark bg-ink dark:bg-white w-9 h-9 opacity-90 shrink-0" aria-hidden="true" />
        </div>
        <div className="h-9 w-40 rounded-lg bg-white/15 animate-pulse mb-4" />
        <div className="flex gap-2 mb-5">
          <div className="h-6 w-20 rounded-full bg-white/15 animate-pulse" />
          <div className="h-6 w-20 rounded-full bg-white/15 animate-pulse" />
        </div>
        <div className="brand-rule" />
      </Card>
    );
  }

  return (
    <Card variant="aura">
      <div className="flex items-center justify-between mb-4">
        <p className="card__title">Saldo total</p>
        <span className="brand-mark bg-ink dark:bg-white w-9 h-9 opacity-90 shrink-0" aria-hidden="true" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="card__amount">
          {showBalance && primary ? formatCurrency(primary.amount, primary.currency.code) : HIDDEN}
        </p>
        <button
          type="button"
          onClick={() => setShowBalance((v) => !v)}
          className="text-text-light-primary/80 dark:text-text-dark-primary/80 hover:text-text-light-primary dark:hover:text-text-dark-primary shrink-0 ml-3"
          aria-label={showBalance ? "Ocultar saldo" : "Mostrar saldo"}
        >
          {showBalance ? <IconEye className="w-5 h-5" /> : <IconEyeOff className="w-5 h-5" />}
        </button>
      </div>

      {others.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {others.map(({ currency, amount }) => (
            <span key={currency.code} className="chip">
              {showBalance ? formatCurrency(amount, currency.code) : HIDDEN}
            </span>
          ))}
        </div>
      )}

      <div className="brand-rule" />
    </Card>
  );
}
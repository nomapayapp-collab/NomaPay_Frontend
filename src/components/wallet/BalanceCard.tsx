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

  // se muestran las monedas con saldo > 0, más la moneda por defecto aunque
  // esté en 0 (es la que ve el usuario recién registrado). El resto en 0 no
  // suma nada, así que no le ocupamos lugar en el scroll.
  const balances = wallet.balances
    .filter((b) => b.amount > 0 || b === primary)
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));

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

  if (balances.length === 0) return null;

  return (
    <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1">
      {balances.map((balance) => {
        const others = balances.filter((b) => b !== balance);
        return (
          <Card
            key={balance.currency.code}
            variant="aura"
            className="min-w-75 lg:min-w-85 shrink-0 snap-center"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="card__title">Saldo total</p>
              <span className="brand-mark bg-ink dark:bg-white w-9 h-9 opacity-90 shrink-0" aria-hidden="true" />
            </div>

            <div className="flex items-center justify-between mb-4">
              <p className="card__amount">
                {showBalance ? formatCurrency(balance.amount, balance.currency.code) : HIDDEN}
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
      })}
    </div>
  );
}
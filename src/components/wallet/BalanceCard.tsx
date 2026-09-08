import { useState } from "react";
import { Card } from "../ui/Card";
import { IconEye, IconEyeOff, IconStar } from "../../assets/icons/Icons";
import { formatCurrency } from "../../utils/formatCurrency";
import { useWallet } from "../../hooks/useWallet";

const HIDDEN = "••••••";

export function BalanceCard() {
  const { wallet } = useWallet();
  const [showBalance, setShowBalance] = useState(true);

  // Mostramos siempre las 3 monedas — así un usuario recién registrado
  // (todo en 0) ve las 3 tarjetas igual, no solo la primaria. Las monedas
  // con saldo van primero; las que están en 0 quedan al final (entre
  // ellas, la primaria/favorita rompe el empate).
  const balances = [...wallet.balances].sort((a, b) => {
    const aHasBalance = a.amount > 0;
    const bHasBalance = b.amount > 0;
    if (aHasBalance !== bHasBalance) return aHasBalance ? -1 : 1;
    return Number(b.isPrimary) - Number(a.isPrimary);
  });

  if (balances.length === 0) return null;

  return (
    // min-w-70 + flex-1 (en vez de un ancho fijo tipo 95%/w-75 que siempre
    // desbordaba) hace que las cards se repartan el ancho disponible y solo
    // se achiquen hasta ese mínimo — el scroll/snap solo aparece cuando la
    // suma de esos mínimos no entra en pantalla, no siempre.
    <div className="flex gap-4 overflow-x-auto scrollbar-app snap-x snap-mandatory pb-2 -mx-1 px-1">
      {balances.map((balance) => {
        const others = balances.filter((b) => b !== balance);
        return (
          <Card key={balance.currency.code} variant="aura" className="min-w-70 flex-1 snap-center">
            <div className="flex items-center justify-between mb-4">
              <p className="flex items-center gap-1.5 card__title">
                Saldo total
                {balance.isPrimary && <IconStar className="w-3.5 h-3.5 text-amber-500" />}
              </p>
              <span className="brand-mark bg-white w-9 h-9 opacity-90 shrink-0" aria-hidden="true" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <p className="card__amount">
                {showBalance ? formatCurrency(balance.amount, balance.currency.code) : HIDDEN}
              </p>
              <button
                type="button"
                onClick={() => setShowBalance((v) => !v)}
                className="text-text-dark-primary/80 hover:text-text-dark-primary shrink-0 ml-3"
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

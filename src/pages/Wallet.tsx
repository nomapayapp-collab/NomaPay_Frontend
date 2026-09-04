import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { Button } from "../components/ui/Button";
import { BalanceCard } from "../components/wallet/BalanceCard";
import { TopUpModal } from "../components/wallet/TopUpModal";
import { useWallet } from "../hooks/useWallet";
import { useAuth } from "../hooks/useAuth";
import { formatCurrency } from "../utils/formatCurrency";
import { IconSend, IconSwap, IconPlus, IconCopy, IconCheck, IconStar } from "../assets/icons/Icons";
import type { CurrencyBalance, CurrencyCode, ExchangeRate } from "../types/wallet";

const CURRENCY_NAMES: Record<CurrencyCode, string> = {
  ARS: "Peso argentino",
  USD: "Dólar estadounidense",
  BRL: "Real brasileño",
};

// Conversión aproximada a ARS con las cotizaciones mockeadas (mismo
// criterio que ExchangeRatesList) — no hay endpoint de conversión real.
function toArsEquivalent(balance: CurrencyBalance, rates: ExchangeRate[]) {
  if (balance.currency.code === "ARS") return null;
  const rate = rates.find((r) => r.from === "ARS" && r.to === balance.currency.code);
  if (!rate) return null;
  return balance.amount / rate.rate;
}

export default function Wallet() {
  const { wallet, loading } = useWallet();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<CurrencyCode | null>(null);

  if (loading) {
    return (
      <div className="px-5 pt-8 pb-8 lg:px-10 lg:py-8 max-w-md lg:max-w-none w-full mx-auto">
        <Header title="Billetera" />
        <div className="h-40 rounded-card bg-black/5 dark:bg-white/8 animate-pulse" />
      </div>
    );
  }

  const selected =
    wallet.balances.find((b) => b.currency.code === selectedCode) ??
    wallet.balances.find((b) => b.isPrimary) ??
    wallet.balances[0];

  async function handleCopyAlias() {
    if (!user?.alias) return;
    try {
      await navigator.clipboard.writeText(user.alias);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // portapapeles no disponible — no rompemos la UI por esto
    }
  }

  const rate = selected ? wallet.exchangeRates.find((r) => r.from === "ARS" && r.to === selected.currency.code) : undefined;
  const movements = selected ? wallet.recentMovements.filter((m) => m.currency === selected.currency.code) : [];

  return (
    <div className="px-5 pt-8 pb-8 lg:px-10 lg:py-8 max-w-md lg:max-w-none w-full mx-auto">
      <Header title="Billetera" />

      {/* ---------- Mobile ---------- */}
      <div className="lg:hidden flex flex-col gap-5">
        <BalanceCard />

        {user?.alias && (
          <div className="rounded-card border border-dashed border-border-light dark:border-border-dark p-4">
            <p className="card__title mb-2">Recibir dinero</p>
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-text-light-primary dark:text-text-dark-primary truncate">{user.alias}</p>
              <button type="button" onClick={handleCopyAlias} className="btn btn--outline btn--sm shrink-0">
                {copied ? <IconCheck className="w-4 h-4" /> : <IconCopy className="w-4 h-4" />}
                {copied ? "Copiado" : "Copiar"}
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="outline" fullWidth onClick={() => navigate("/transfer")}>
            <IconSend className="w-4 h-4" /> Transferir
          </Button>
          <Button type="button" variant="outline" fullWidth onClick={() => navigate("/exchange")}>
            <IconSwap className="w-4 h-4" /> Convertir
          </Button>
        </div>

        <div>
          <p className="card__title mb-3">Saldo por moneda</p>
          <div className="rounded-card border border-border-light dark:border-border-dark divide-y divide-border-light dark:divide-border-dark overflow-hidden">
            {wallet.balances.map((balance) => {
              const arsEquivalent = toArsEquivalent(balance, wallet.exchangeRates);
              return (
                <div key={balance.currency.code} className="flex items-center gap-3 px-4 py-3.5">
                  <span className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-black/5 dark:bg-white/8 font-bold text-[11px] text-text-light-primary dark:text-text-dark-primary">
                    {balance.currency.code}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 font-medium text-text-light-primary dark:text-text-dark-primary truncate">
                      {CURRENCY_NAMES[balance.currency.code]}
                      {balance.isPrimary && <IconStar className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                    </p>
                    {arsEquivalent !== null && (
                      <p className="text-[12.5px] text-text-light-tertiary dark:text-text-dark-tertiary">
                        ≈ {formatCurrency(arsEquivalent, "ARS")}
                      </p>
                    )}
                  </div>
                  <p className="font-semibold tabular text-text-light-primary dark:text-text-dark-primary shrink-0">
                    {formatCurrency(balance.amount, balance.currency.code)}
                  </p>
                </div>
              );
            })}

            <button
              type="button"
              onClick={() => setTopUpOpen(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 text-violet-300 hover:bg-black/5 dark:hover:bg-white/5"
            >
              <span className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-violet-500/10">
                <IconPlus className="w-4 h-4" />
              </span>
              <span className="font-medium">Agregar saldo</span>
            </button>
          </div>
        </div>
      </div>

      {/* ---------- Desktop ---------- */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6 lg:items-start">
        {/* antes iba a la derecha, ahora a la izquierda (estructura pedida) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {selected && (
            <>
              <div className="rounded-card border border-border-light dark:border-border-dark p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="card__title mb-1">{CURRENCY_NAMES[selected.currency.code]}</p>
                    <p className="card__amount">{formatCurrency(selected.amount, selected.currency.code)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => navigate("/transfer")}>
                      <IconSend className="w-4 h-4" /> Transferir
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => navigate("/exchange")}>
                      <IconSwap className="w-4 h-4" /> Convertir
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border-light dark:border-border-dark">
                  <div>
                    <p className="text-[12px] text-text-light-tertiary dark:text-text-dark-tertiary mb-1">Retenido</p>
                    {/* no hay feature de retenciones/holds en el back todavía — siempre 0 */}
                    <p className="font-semibold tabular text-text-light-primary dark:text-text-dark-primary">
                      {formatCurrency(0, selected.currency.code)}
                    </p>
                  </div>
                  <div>
                    <p className="text-[12px] text-text-light-tertiary dark:text-text-dark-tertiary mb-1">Comisión de conversión</p>
                    <p className="font-semibold text-text-light-primary dark:text-text-dark-primary">Sin cargo</p>
                  </div>
                  <div>
                    <p className="text-[12px] text-text-light-tertiary dark:text-text-dark-tertiary mb-1">Cotización de hoy</p>
                    <p className="font-semibold tabular text-text-light-primary dark:text-text-dark-primary">
                      {rate ? `1 ARS = ${rate.rate.toLocaleString("es-AR")} ${rate.to}` : "—"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-card border border-border-light dark:border-border-dark p-6">
                <p className="card__title mb-3">Movimientos en {selected.currency.code}</p>
                {movements.length === 0 ? (
                  <p className="text-[13.5px] text-text-light-tertiary dark:text-text-dark-tertiary py-4 text-center">
                    Todavía no tenés movimientos en {selected.currency.code}.
                  </p>
                ) : (
                  <ul className="divide-y divide-border-light dark:divide-border-dark">
                    {movements.map((m) => (
                      <li key={m.id} className="flex items-center justify-between py-3 text-[14px]">
                        <span className="text-text-light-primary dark:text-text-dark-primary">{m.description}</span>
                        <span
                          className={`tabular font-medium ${m.amount < 0
                              ? "text-text-light-secondary dark:text-text-dark-secondary"
                              : "text-turquoise-500"
                            }`}
                        >
                          {m.amount < 0 ? "-" : "+"}
                          {formatCurrency(Math.abs(m.amount), m.currency)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </>
          )}
        </div>

        {/* antes iba a la izquierda, ahora a la derecha */}
        <div className="flex flex-col gap-2">
          <p className="card__title px-1 mb-1">Tus monedas</p>
          {wallet.balances.map((balance) => (
            <button
              key={balance.currency.code}
              type="button"
              onClick={() => setSelectedCode(balance.currency.code)}
              className={[
                "flex items-center gap-3 px-4 py-3.5 rounded-card border text-left transition-colors",
                selected?.currency.code === balance.currency.code
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-border-light dark:border-border-dark hover:border-violet-500/40",
              ].join(" ")}
            >
              <span className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-black/5 dark:bg-white/8 font-bold text-[11px] text-text-light-primary dark:text-text-dark-primary">
                {balance.currency.code}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 font-medium text-text-light-primary dark:text-text-dark-primary truncate">
                  {CURRENCY_NAMES[balance.currency.code]}
                  {balance.isPrimary && <IconStar className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                </p>
                <p className="text-[12.5px] tabular text-text-light-tertiary dark:text-text-dark-tertiary">
                  {formatCurrency(balance.amount, balance.currency.code)}
                </p>
              </div>
            </button>
          ))}

          {user?.alias && (
            <div className="rounded-card border border-dashed border-border-light dark:border-border-dark p-4 mt-3">
              <p className="card__title mb-2">Recibir dinero</p>
              <p className="font-semibold text-text-light-primary dark:text-text-dark-primary truncate mb-2">{user.alias}</p>
              <button type="button" onClick={handleCopyAlias} className="btn btn--outline btn--sm w-full">
                {copied ? <IconCheck className="w-4 h-4" /> : <IconCopy className="w-4 h-4" />}
                {copied ? "Copiado" : "Copiar alias"}
              </button>
            </div>
          )}

          <Button type="button" variant="primary" onClick={() => setTopUpOpen(true)}>
            <IconPlus className="w-4 h-4" /> Cargar saldo
          </Button>
        </div>
      </div>

      <TopUpModal open={topUpOpen} onClose={() => setTopUpOpen(false)} initialCurrency={selected?.currency.code} />
    </div>
  );
}
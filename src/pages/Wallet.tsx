import { useState } from "react";
import { Header } from "../components/layout/Header";
import { Button } from "../components/ui/Button";
import { Switch } from "../components/ui/Switch";
import { TopUpModal } from "../components/wallet/TopUpModal";
import { BalanceCard } from "../components/wallet/BalanceCard";
import { useWallet } from "../hooks/useWallet";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { formatCurrency } from "../utils/formatCurrency";
import {
  IconPlus,
  IconCopy,
  IconCheck,
  IconStar,
  IconAlertTriangle,
} from "../assets/icons/Icons";
import type { CurrencyBalance, CurrencyCode } from "../types/wallet";
import { CURRENCY_NAMES } from "../constants/currencies";

export default function Wallet() {
  const { wallet, loading, setPreferredCurrency } = useWallet();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [copied, setCopied] = useState(false);
  const [topUpOpen, setTopUpOpen] = useState(false);

  // "activar/desactivar moneda" todavía no tiene endpoint en el back 
  const [activeOverrides, setActiveOverrides] = useState<Partial<Record<CurrencyCode, boolean>>>({});

  const [savingFavorite, setSavingFavorite] = useState<CurrencyCode | null>(null);
  const [favoriteError, setFavoriteError] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="px-5 pt-8 pb-8 lg:px-10 lg:py-8 max-w-md lg:max-w-none w-full mx-auto">
        <Header title="Billetera" subtitle="Tu saldo en cada moneda" />
        <div className="h-40 rounded-card bg-black/5 dark:bg-white/8 animate-pulse" />
      </div>
    );
  }

  const selected = wallet.balances.find((b) => b.isPrimary) ?? wallet.balances[0];
  const movements = selected ? wallet.recentMovements.filter((m) => m.currency === selected.currency.code) : [];

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

  async function handleSetFavorite(code: CurrencyCode) {
    if (code === selected?.currency.code) return;
    setSavingFavorite(code);
    setFavoriteError(null);
    try {
      await setPreferredCurrency(code);
      showToast(`Tu moneda favorita ahora es ${code}`, "success", { icon: IconStar });
    } catch {
      setFavoriteError("No pudimos actualizar tu moneda favorita. Probá de nuevo.");
    } finally {
      setSavingFavorite(null);
    }
  }

  function isCurrencyActive(balance: CurrencyBalance) {
    return activeOverrides[balance.currency.code] ?? true;
  }

  function handleToggleCurrency(balance: CurrencyBalance) {
    const active = isCurrencyActive(balance);
    if (active && balance.amount > 0) return; // no se puede desactivar una moneda con saldo
    setActiveOverrides((prev) => ({ ...prev, [balance.currency.code]: !active }));
  }

  

  function renderActiveCurrenciesList() {
    return (
      <div>
        <p className="card__title mb-3">Monedas activas</p>
        <div className="flex flex-wrap gap-2">
          {wallet.balances.map((balance) => {
            const active = isCurrencyActive(balance);
            const disableToggle = active && balance.amount > 0;
            return (
              <div
                key={balance.currency.code}
                className="w-full sm:w-75 lg:flex-1 lg:min-w-0 rounded-card border border-border-light dark:border-border-dark p-4 flex items-center gap-3"
              >
                <span className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-black/5 dark:bg-white/8 font-bold text-[11px] text-text-light-primary dark:text-text-dark-primary">
                  {balance.currency.code}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] text-text-light-tertiary dark:text-text-dark-tertiary">
                     {formatCurrency(balance.amount, balance.currency.code)}
                  </p>
                </div>
                <Switch
                  checked={active}
                  disabled={disableToggle}
                  onChange={() => handleToggleCurrency(balance)}
                  label={`${CURRENCY_NAMES[balance.currency.code]} ${active ? "activada" : "desactivada"}`}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderFavoriteCurrency() {
    return (
      <div className="rounded-card border border-border-light dark:border-border-dark p-5">
        <p className="font-semibold text-text-light-primary dark:text-text-dark-primary mb-1">Moneda favorita</p>
        <p className="text-[13px] text-text-light-tertiary dark:text-text-dark-tertiary mb-4">
          Es la moneda en la que ves tu saldo total y la que se propone por defecto al convertir.
        </p>
        <div className="flex flex-col gap-2">
          {wallet.balances.map((balance) => {
            const isFavorite = balance.currency.code === selected?.currency.code;
            return (
              <button
                key={balance.currency.code}
                type="button"
                disabled={isFavorite || savingFavorite !== null}
                onClick={() => handleSetFavorite(balance.currency.code)}
                className={[
                  "flex items-center gap-3 px-4 py-3.5 rounded-card border text-left transition-colors disabled:opacity-60",
                  isFavorite
                    ? "border-violet-500 bg-violet-500/10"
                    : "border-border-light dark:border-border-dark hover:border-violet-500/40",
                ].join(" ")}
              >
                <span
                  className={[
                    "w-5 h-5 rounded-full border flex items-center justify-center shrink-0",
                    isFavorite ? "bg-violet-500 border-violet-500" : "border-border-light dark:border-border-dark",
                  ].join(" ")}
                >
                  {isFavorite && <IconCheck className="w-3 h-3 text-white" />}
                </span>
                <span className="flex-1 font-medium text-text-light-primary dark:text-text-dark-primary truncate">
                  {balance.currency.code} · {CURRENCY_NAMES[balance.currency.code]}
                </span>
                {isFavorite && <IconStar className="w-4 h-4 text-amber-500 shrink-0" />}
              </button>
            );
          })}
        </div>
        {favoriteError && <p className="text-[12.5px] text-magenta-500 mt-3">{favoriteError}</p>}
      </div>
    );
  }

  function renderWarningNote() {
    return (
      <div className="alert-note alert-note--warning flex items-start gap-3">
        <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-amber-500/15 text-amber-500">
          <IconAlertTriangle className="w-4 h-4" />
        </span>
        <div>
          <p className="alert-note__title text-amber-500">No podés desactivar una moneda con saldo</p>
          <p className="alert-note__description">
            Convertí o transferí el saldo a cero y recién ahí vas a poder sacarla de tu billetera.
          </p>
        </div>
      </div>
    );
  }

  function renderCargarSaldoButton() {
    return (
      <Button type="button" variant="primary" fullWidth onClick={() => setTopUpOpen(true)}>
        <IconPlus className="w-4 h-4" /> Cargar saldo
      </Button>
    );
  }

  function renderRecibirDinero() {
    if (!user?.alias) return null;
    return (
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
    );
  }

  return (
    <div className="px-5 pt-8 pb-8 lg:px-10 lg:py-8 max-w-md lg:max-w-none w-full mx-auto">
      <Header title="Billetera" subtitle="Tu saldo en cada moneda" />

      {selected && (
        <>
          {/* ---------- Mobile ---------- */}
          <div className="lg:hidden flex flex-col gap-5">
            <BalanceCard />
            {renderActiveCurrenciesList()}
            {renderWarningNote()}
            {renderCargarSaldoButton()}
            {renderRecibirDinero()}
            {renderFavoriteCurrency()}
          </div>

          {/* ---------- Desktop ---------- */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6 lg:items-start">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <BalanceCard />
              {renderActiveCurrenciesList()}
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
                          className={`tabular font-medium ${
                            m.amount < 0
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
            </div>

            <div className="flex flex-col gap-4">
              {renderFavoriteCurrency()}
              {renderWarningNote()}
              {renderCargarSaldoButton()}
              {renderRecibirDinero()}
            </div>
          </div>
        </>
      )}

      <TopUpModal open={topUpOpen} onClose={() => setTopUpOpen(false)} initialCurrency={selected?.currency.code} />
    </div>
  );
}

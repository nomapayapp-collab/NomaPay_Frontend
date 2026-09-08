import { Card } from "../../components/ui/Card";
import { useWallet } from "../../hooks/useWallet";

/**
 * "Cotizaciones de hoy". Usa las tasas en vivo de WalletContext
 * (getCurrentExchangeRates en services/exchangeRates.ts) — solo cae a
 * FALLBACK_RATES si la API externa de cotizaciones falla.
 */
export function ExchangeRatesList() {
  const { wallet } = useWallet();

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <p className="card__title">Cotizaciones de hoy</p>
        <button type="button" className="text-[12.5px] font-medium text-violet-300 hover:text-violet-500">          
          Ver todos
        </button>
      </div>

      <ul className="divide-y divide-border-light dark:divide-border-dark">
        {wallet.exchangeRates.map(({ from, to, rate }) => (
          <li
            key={`${from}-${to}`}
            className="flex flex-col gap-0.5 py-3 text-[14px] lg:flex-row lg:items-center lg:justify-between"
          >
            <span className="text-text-light-secondary dark:text-text-dark-secondary">Cambio {from} → {to}</span>
            <span className="tabular font-medium text-text-light-primary dark:text-text-dark-primary">
              1 {from} = {rate.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {to}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

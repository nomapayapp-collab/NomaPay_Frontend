import { Card } from "../../components/ui/Card";
import { useWallet } from "../../hooks/useWallet";

/**
 * "Cotizaciones de hoy". Usa las tasas mockeadas de WalletContext.
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

      <ul className="divide-y divide-border-dark">
        {wallet.exchangeRates.map(({ from, to, rate }) => (
          <li key={`${from}-${to}`} className="flex items-center justify-between py-3 text-[14px]">
            <span className="text-text-dark-secondary">Cambio {from} → {to}</span>
            <span className="tabular font-medium text-text-dark-primary">
              1 {from} = {rate.toLocaleString("es-AR")} {to}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
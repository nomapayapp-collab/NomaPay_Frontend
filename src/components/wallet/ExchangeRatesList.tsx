import { Card } from "../ui/Card";
import { useWallet } from "../../hooks/useWallet";
import type { CurrencyCode } from "../../types/wallet";

type ExchangeRateItem = {
  from: CurrencyCode;
  to: CurrencyCode;
  rate: number;
};

function formatRate(value: number): string {
  const isSmallRate = Math.abs(value) < 1;

  return value.toLocaleString("es-AR", {
    minimumFractionDigits: isSmallRate ? 4 : 2,
    maximumFractionDigits: isSmallRate ? 6 : 2,
  });
}

export function ExchangeRatesList() {
  const { wallet } = useWallet();

  const allRates: ExchangeRateItem[] =
    wallet.exchangeRates.flatMap(
      ({ from, to, rate }) => {
        const directRate: ExchangeRateItem = {
          from,
          to,
          rate,
        };

        if (!Number.isFinite(rate) || rate <= 0) {
          return [directRate];
        }

        const inverseRate: ExchangeRateItem = {
          from: to,
          to: from,
          rate: 1 / rate,
        };

        return [directRate, inverseRate];
      },
    );

  const uniqueRates = allRates.filter(
    (currentRate, index, rates) =>
      rates.findIndex(
        (rate) =>
          rate.from === currentRate.from &&
          rate.to === currentRate.to,
      ) === index,
  );

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <p className="card__title">
          Cotizaciones de hoy
        </p>

        <button
          type="button"
          className="text-[12.5px] font-medium text-violet-300 hover:text-violet-500"
        >
          Ver todos
        </button>
      </div>

      <ul className="divide-y divide-border-light dark:divide-border-dark">
        {uniqueRates.map(({ from, to, rate }) => (
          <li
            key={`${from}-${to}`}
            className="flex flex-col gap-0.5 py-3 text-[14px] lg:flex-row lg:items-center lg:justify-between"
          >
            <span className="text-text-light-secondary dark:text-text-dark-secondary">
              Cambio {from} → {to}
            </span>

            <span className="tabular font-medium text-text-light-primary dark:text-text-dark-primary">
              1 {from} = {formatRate(rate)} {to}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
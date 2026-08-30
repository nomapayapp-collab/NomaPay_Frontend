import { useMemo, useState } from "react";
import type { CurrencyCode } from "../../types/wallet";
import { MOCK_WALLET } from "../../constants/mockWallet";
import { formatCurrency } from "../../utils/formatCurrency";
import chica from "../../assets/img/chica.png";

const COMMISSION_RATE = 0.005; // 0,5% — mismo valor que se muestra en LandingStats

const SENDER_CURRENCIES: CurrencyCode[] = ["USD", "BRL", "ARS"];

function formatNumber(n: number) {
  return new Intl.NumberFormat("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
}

export function LandingCalculator() {
  const [amount, setAmount] = useState(1000);
  const [senderCurrency, setSenderCurrency] = useState<CurrencyCode>("USD");

  const isLocal = senderCurrency === "ARS";

  const rate = useMemo(() => {
    if (isLocal) return 1; // ARS → ARS: transferencia local, sin conversión
    return MOCK_WALLET.exchangeRates.find((r) => r.from === "ARS" && r.to === senderCurrency)?.rate ?? 0;
  }, [senderCurrency, isLocal]);

  const commission = amount * COMMISSION_RATE;
  const net = amount - commission;
  const received = net * rate;

  return (
    <section className="border-t border-border-light px-6 md:px-12 py-16 bg-surface-light text-text-light-primary grid md:grid-cols-2 gap-10">
      <div>
        <p className="text-xs tracking-[0.2em] uppercase text-turquoise-700 font-semibold mb-3">
          Calculadora
        </p>
        <h3 className="text-2xl font-bold mb-6">¿Cuánto recibís?</h3>

        <div className="rounded-card border border-border-light bg-surface-light-input p-4 mb-4">
          <label className="block text-xs font-medium text-text-light-secondary mb-1.5">
            Tu cliente envía
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="bg-transparent text-2xl font-bold flex-1 outline-none text-text-light-primary"
            />
            <select
              value={senderCurrency}
              onChange={(e) => setSenderCurrency(e.target.value as CurrencyCode)}
              className="rounded-control bg-surface-light border border-border-light px-3 py-2 text-sm font-semibold text-text-light-primary"
            >
              {SENDER_CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="rounded-card border-2 border-violet-500 bg-surface-light p-4 mb-5">
          <p className="text-xs font-medium text-text-light-secondary mb-1.5">Vos recibís aprox.</p>
          <div className="flex items-center gap-3">
            <p className="text-2xl font-bold flex-1 tabular text-text-light-primary">{formatNumber(received)}</p>
            <span className="rounded-control bg-surface-light-input px-3 py-2 text-sm font-semibold text-text-light-primary">
              ARS
            </span>
          </div>
        </div>

        <dl className="text-sm space-y-2 text-text-light-secondary">
          <div className="flex justify-between">
            <dt>Tipo de cambio</dt>
            <dd className="font-medium text-text-light-primary">
              {isLocal ? "Transferencia local, sin conversión" : `1 ${senderCurrency} = ${formatNumber(rate)} ARS`}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt>Comisión NomaPay</dt>
            <dd className="font-medium text-text-light-primary">0,5% · {senderCurrency} {formatNumber(commission)}</dd>
          </div>
          <div className="flex justify-between font-semibold text-text-light-primary pt-2 border-t border-border-light">
            <dt>Vas a recibir</dt>
            <dd>{formatCurrency(received, "ARS")}</dd>
          </div>
        </dl>
      </div>

      <div>
        <p className="text-xs tracking-[0.2em] uppercase text-magenta-500 font-semibold mb-3">
          Global por defecto
        </p>
        <h3 className="text-2xl md:text-3xl font-extrabold leading-tight mb-4">
          Tu trabajo puede estar en cualquier lugar. Tu dinero también.
        </h3>
        <p className="text-sm text-text-light-secondary mb-6">
          Con NomaPay recibís pagos en múltiples divisas y los manejás desde
          una única cuenta, con la tasa siempre a la vista.
        </p>
        <div className="relative aspect-square h-80 w-full rounded-card overflow-hidden">
          <img
            src={chica}
            alt="Emprendedora trabajando desde Tulum"
            className="absolute inset-0 w-full h-80 object-cover grayscale"
          />
          <div className="absolute inset-0 bg-linear-to-t from-ink/90 via-ink/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <span className="brand-rule w-10 mb-3 block" />
            <p className="text-sm font-medium text-text-dark-primary">
              Tulum, 9:41.{" "}
              <span className="text-text-dark-tertiary">
                El cobro entró desde EE.UU.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
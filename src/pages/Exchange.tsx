import { useState } from "react";
import { Header } from "../components/layout/Header";
import { Select } from "../components/ui/Select";
import { ConfirmActionModal } from "../components/ui/ConfirmActionModal";
import { ExchangeRatesList } from "../components/wallet/ExchangeRatesList";
import { useExchangeForm } from "../hooks/useExchangeForm";
import { CURRENCIES, CURRENCY_CODES } from "../constants/currencies";
import type { CurrencyCode } from "../types/wallet";

export default function Exchange() {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const {
    walletLoading,
    walletError,
    fromCurrency,
    toCurrency,
    amount,
    balances,
    exchangeRate,
    convertedAmount,
    rateError,
    numericAmount,
    exchangeLoading,
    feePercentage,
    feeAmount,
    updateAmount,
    changeFromCurrency,
    changeToCurrency,
    swapCurrencies,
    selectPercentage,
    selectMaximum,
    handleExchange,
    formatMoney,
    formatRate,
  } = useExchangeForm();

  const cannotExchange =
    walletLoading ||
    exchangeLoading ||
    Boolean(walletError) ||
    Boolean(rateError) ||
    numericAmount <= 0 ||
    numericAmount > balances[fromCurrency];

  function openConfirmation() {
    if (cannotExchange) {
      return;
    }

    setConfirmOpen(true);
  }

  async function confirmExchange() {
    if (exchangeLoading) {
      return;
    }

    await handleExchange();
    setConfirmOpen(false);
  }

  return (
    <main className="w-full text-text-light-primary dark:text-text-dark-primary">
      <section className="px-5 pt-8 pb-8 lg:px-10 lg:py-8 max-w-md lg:max-w-none w-full mx-auto">
        <Header
          title="Convertir monedas"
          subtitle="Entre tus propias monedas"
        />

        {walletLoading && (
          <p className="mb-4 text-sm text-text-light-tertiary dark:text-text-dark-tertiary">
            Cargando saldos y cotizaciones...
          </p>
        )}

        {walletError && (
          <p className="mb-4 rounded-lg border border-magenta-500/30 bg-magenta-100/10 px-4 py-3 text-sm text-magenta-500">
            {walletError}
          </p>
        )}

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <div>
            {/* Conversor */}
            <section className="rounded-card border border-border-light bg-surface-light p-4 dark:border-border-dark dark:bg-surface-dark sm:p-5">
              {/* Moneda de origen */}
              <article className="rounded-card border border-border-light bg-surface-light-input p-4 dark:border-border-dark dark:bg-surface-dark-elevated">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <p className="text-xs font-bold tracking-widest text-text-light-tertiary dark:text-text-dark-tertiary">
                    DE
                  </p>

                  <p className="text-xs text-text-light-tertiary dark:text-text-dark-tertiary">
                    Disponible:
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${CURRENCIES[fromCurrency].color}`}
                    >
                      {fromCurrency}
                    </span>

                    <Select
                      value={fromCurrency}
                      onChange={(value) =>
                        changeFromCurrency(
                          value as CurrencyCode,
                        )
                      }
                      options={CURRENCY_CODES.map((code) => ({
                        value: code,
                        label: CURRENCIES[code].name,
                      }))}
                      className="w-auto border-0 bg-transparent p-0 font-bold text-text-light-primary dark:text-text-dark-primary"
                    />
                  </div>

                  <strong className="shrink-0 text-xl">
                    {formatMoney(balances[fromCurrency])}
                  </strong>
                </div>
              </article>

              {/* Invertir monedas */}
              <div className="relative z-10 -my-3 flex justify-end pr-5">
                <button
                  type="button"
                  onClick={swapCurrencies}
                  disabled={exchangeLoading}
                  aria-label="Intercambiar monedas"
                  className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#5b35e8] text-xl text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ⇅
                </button>
              </div>

              {/* Moneda de destino */}
              <article className="rounded-card border border-border-light bg-surface-light-input p-4 dark:border-border-dark dark:bg-surface-dark-elevated">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <p className="text-xs font-bold tracking-widest text-text-light-tertiary dark:text-text-dark-tertiary">
                    A
                  </p>

                  <p className="text-xs text-text-light-tertiary dark:text-text-dark-tertiary">
                    Disponible:
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${CURRENCIES[toCurrency].color}`}
                    >
                      {toCurrency}
                    </span>

                    <Select
                      value={toCurrency}
                      onChange={(value) =>
                        changeToCurrency(
                          value as CurrencyCode,
                        )
                      }
                      options={CURRENCY_CODES.filter(
                        (code) => code !== fromCurrency,
                      ).map((code) => ({
                        value: code,
                        label: CURRENCIES[code].name,
                      }))}
                      className="w-auto border-0 bg-transparent p-0 font-bold text-text-light-primary dark:text-text-dark-primary"
                    />
                  </div>

                  <strong className="shrink-0 text-xl">
                    {formatMoney(balances[toCurrency])}
                  </strong>
                </div>

              </article>

              {/* Monto */}
              <section className="mt-5">
                <label
                  htmlFor="exchange-amount"
                  className="mb-2 block text-xs font-bold tracking-widest text-text-light-tertiary dark:text-text-dark-tertiary"
                >
                  MONTO A CONVERTIR
                </label>

                <div className="flex items-center rounded-card border border-violet-500 bg-surface-light-input px-4 focus-within:border-violet-300 dark:bg-surface-dark-elevated">
                  <input
                    id="exchange-amount"
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={(event) =>
                      updateAmount(event.target.value)
                    }
                    disabled={exchangeLoading}
                    className="w-full border-0 bg-transparent py-4 font-bold text-text-light-primary outline-none ring-0 ring-offset-0 focus:ring-0 focus:ring-offset-0 disabled:opacity-60 dark:text-text-dark-primary"
                  />

                  <span className="text-sm text-text-light-tertiary dark:text-text-dark-tertiary">
                    {fromCurrency}
                  </span>
                </div>
                {numericAmount > balances[fromCurrency] && (
                  <p
                    role="alert"
                    className="mt-2 text-sm font-medium text-magenta-500"
                  >
                    No tenés saldo suficiente
                  </p>
                )}
                <div className="mt-3 flex justify-between flex-wrap gap-2">
                  <div >
                    <span className="flex flex-wrap gap-2">
                      {[10, 25, 50, 80].map((percentage) => (
                        <button
                          key={percentage}
                          type="button"
                          disabled={exchangeLoading}
                          onClick={() =>
                            selectPercentage(percentage / 100)
                          }
                          className="rounded-full border border-border-light px-4 py-1.5 text-xs disabled:opacity-50 dark:border-border-dark"
                        >
                          {percentage}%
                        </button>
                      ))}

                      <button
                        type="button"
                        disabled={exchangeLoading}
                        onClick={selectMaximum}
                        className="rounded-full border border-border-light px-4 py-1.5 text-xs disabled:opacity-50 dark:border-border-dark"
                      >
                        Máximo
                      </button>
                    </span>
                    <p className="text-xs text-text-light-tertiary py-2 dark:text-text-dark-tertiary">
                      Los porcentajes se calculan sobre tu saldo disponible
                    </p>
                  </div>
                  <p className="mt-2 text-right text-xs font-semibold text-turquoise-500">
                    Comisión 0,5%
                  </p>
                </div>
              </section>
            </section>

            {/* Resultado */}
            <section className="mt-5 flex flex-col gap-5 rounded-card border border-[#275070] bg-linear-to-r from-[#104b59] to-[#101431] p-5 text-white sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold tracking-widest text-[#aeb5d1]">
                  RECIBÍS
                </p>

                <p className="mt-1 text-2xl font-extrabold">
                  {formatMoney(convertedAmount)}{" "}
                  {toCurrency}
                </p>

                {walletLoading ? (
                  <p className="mt-2 text-xs text-[#aeb5d1]">
                    Actualizando tasa...
                  </p>
                ) : rateError ? (
                  <p className="mt-2 text-xs text-magenta-300">
                    {rateError}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-[#aeb5d1]">
                    1 {fromCurrency} ={" "}
                    {formatRate(exchangeRate)}{" "}
                    {toCurrency} · tasa actualizada
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={openConfirmation}
                disabled={cannotExchange}
                className="shrink-0 rounded-xl bg-linear-to-r from-[#6b2cff] to-[#5156e8] px-6 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {exchangeLoading
                  ? "Procesando..."
                  : "Continuar"}
              </button>
            </section>

          </div>

          {/* Cotizaciones compartidas */}
          <ExchangeRatesList />
        </div>
      </section>

      {/* Confirmación reutilizada de Billetera */}
      <ConfirmActionModal
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmExchange}
        confirming={exchangeLoading}
        title="¿Confirmás la conversión?"
        description="Verificá las monedas y los importes antes de confirmar la operación."
        rows={[
          {
            label: "Convertís",
            value: `${formatMoney(numericAmount)} ${fromCurrency}`,
          },
          {
            label: "Cotización",
            value: `1 ${fromCurrency} = ${formatRate(exchangeRate)} ${toCurrency}`,
          },
          {
            label: "Comisión",
            value: `${feePercentage.toString().replace(".", ",")}% · ${formatMoney(feeAmount)} ${fromCurrency}`,
          },
          {
            label: "Recibís",
            value: `${formatMoney(convertedAmount)} ${toCurrency}`,
            accent: true,
          },
        ]}
        confirmLabel="Sí, convertir"
      />
    </main>
  );
}
import { useEffect, useState } from "react";

import {
  exchangeCurrency,
  getMyWallet,
  type CurrencyCode,
  type WalletResponse,
} from "../../services/walletService";

const currencies = {
  ARS: {
    name: "Peso argentino",
    symbol: "$",
    color: "bg-[#6f42c1]",
  },
  USD: {
    name: "Dólar estadounidense",
    symbol: "US$",
    color: "bg-[#168c94]",
  },
  BRL: {
    name: "Real brasileño",
    symbol: "R$",
    color: "bg-[#19a463]",
  },
};

const currencyCodes = Object.keys(currencies) as CurrencyCode[];

const emptyBalances: Record<CurrencyCode, number> = {
  ARS: 0,
  USD: 0,
  BRL: 0,
};

export default function Exchange() {
  const [fromCurrency, setFromCurrency] =
    useState<CurrencyCode>("ARS");

  const [toCurrency, setToCurrency] =
    useState<CurrencyCode>("USD");

  const [amount, setAmount] = useState("0,00");

  const [balances, setBalances] =
    useState<Record<CurrencyCode, number>>(emptyBalances);

  const [walletLoading, setWalletLoading] = useState(true);
  const [walletError, setWalletError] = useState("");

  const [exchangeRate, setExchangeRate] = useState(0);
  const [rateLoading, setRateLoading] = useState(true);
  const [rateError, setRateError] = useState("");

  const [quotationRates, setQuotationRates] = useState({
    USD: 0,
    BRL: 0,
  });

  const [quotationsLoading, setQuotationsLoading] =
    useState(true);

  const [quotationsError, setQuotationsError] = useState("");

  const [exchangeLoading, setExchangeLoading] =
    useState(false);

  const [exchangeError, setExchangeError] = useState("");
  const [exchangeSuccess, setExchangeSuccess] = useState("");

  const numericAmount =
    Number(amount.replace(/\./g, "").replace(",", ".")) || 0;

  const convertedAmount = numericAmount * exchangeRate;

  const formatMoney = (value: number) =>
    new Intl.NumberFormat("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const formatRate = (value: number) =>
    new Intl.NumberFormat("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(value);

  const saveWalletBalances = (wallet: WalletResponse) => {
    const updatedBalances: Record<CurrencyCode, number> = {
      ARS: 0,
      USD: 0,
      BRL: 0,
    };

    wallet.balances.forEach((balance) => {
      updatedBalances[balance.currencyCode] = Number(
        balance.amount,
      );
    });

    setBalances(updatedBalances);
  };

  // Carga los saldos reales de la billetera.
  useEffect(() => {
    const loadWallet = async () => {
      setWalletLoading(true);
      setWalletError("");

      try {
        const wallet = await getMyWallet();

        saveWalletBalances(wallet);
        setFromCurrency(wallet.preferredCurrency);

        setToCurrency((currentCurrency) => {
          if (currentCurrency !== wallet.preferredCurrency) {
            return currentCurrency;
          }

          return wallet.preferredCurrency === "USD"
            ? "ARS"
            : "USD";
        });
      } catch {
        setWalletError("No pudimos cargar los saldos");
      } finally {
        setWalletLoading(false);
      }
    };

    loadWallet();
  }, []);

  // Consulta la tasa seleccionada en el conversor.
  useEffect(() => {
    const getExchangeRate = async () => {
      setRateLoading(true);
      setRateError("");

      try {
        const response = await fetch(
          `https://open.er-api.com/v6/latest/${fromCurrency}`,
        );

        if (!response.ok) {
          throw new Error("No se pudo obtener la tasa");
        }

        const data = await response.json();
        const newRate = data.rates?.[toCurrency];

        if (typeof newRate !== "number") {
          throw new Error("La tasa no está disponible");
        }

        setExchangeRate(newRate);
      } catch {
        setExchangeRate(0);
        setRateError(
          "No pudimos actualizar la tasa de cambio",
        );
      } finally {
        setRateLoading(false);
      }
    };

    getExchangeRate();
  }, [fromCurrency, toCurrency]);

  // Consulta las cotizaciones de ARS a USD y BRL.
  useEffect(() => {
    const getQuotations = async () => {
      setQuotationsLoading(true);
      setQuotationsError("");

      try {
        const response = await fetch(
          "https://open.er-api.com/v6/latest/ARS",
        );

        if (!response.ok) {
          throw new Error("No se pudieron obtener las cotizaciones");
        }

        const data = await response.json();

        const usdRate = data.rates?.USD;
        const brlRate = data.rates?.BRL;

        if (
          typeof usdRate !== "number" ||
          typeof brlRate !== "number"
        ) {
          throw new Error("Cotizaciones no disponibles");
        }

        setQuotationRates({
          USD: usdRate,
          BRL: brlRate,
        });
      } catch {
        setQuotationsError(
          "No pudimos cargar las cotizaciones",
        );
      } finally {
        setQuotationsLoading(false);
      }
    };

    getQuotations();
  }, []);

  const changeFromCurrency = (
    newCurrency: CurrencyCode,
  ) => {
    setFromCurrency(newCurrency);
    setExchangeError("");
    setExchangeSuccess("");

    if (newCurrency === toCurrency) {
      const alternativeCurrency = currencyCodes.find(
        (currency) => currency !== newCurrency,
      );

      if (alternativeCurrency) {
        setToCurrency(alternativeCurrency);
      }
    }
  };

  const changeToCurrency = (
    newCurrency: CurrencyCode,
  ) => {
    if (newCurrency !== fromCurrency) {
      setToCurrency(newCurrency);
      setExchangeError("");
      setExchangeSuccess("");
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setExchangeError("");
    setExchangeSuccess("");
  };

  const selectPercentage = (percentage: number) => {
    const balance = balances[fromCurrency];

    setAmount(formatMoney(balance * percentage));
    setExchangeError("");
    setExchangeSuccess("");
  };

  const selectMaximum = () => {
    setAmount(formatMoney(balances[fromCurrency]));
    setExchangeError("");
    setExchangeSuccess("");
  };

  const handleExchange = async () => {
    setExchangeError("");
    setExchangeSuccess("");

    if (numericAmount <= 0) {
      setExchangeError("Ingresá un monto mayor que cero");
      return;
    }

    if (numericAmount > balances[fromCurrency]) {
      setExchangeError("No tenés saldo suficiente");
      return;
    }

    setExchangeLoading(true);

    try {
      const result = await exchangeCurrency({
        fromCurrency,
        toCurrency,
        amount: numericAmount,
      });

      saveWalletBalances(result.wallet);
      setAmount("0,00");

      setExchangeSuccess(
        `Conversión aprobada: recibiste ${formatMoney(
          Number(result.transaction.finalAmount),
        )} ${toCurrency}`,
      );
    } catch {
      setExchangeError(
        "No pudimos realizar la conversión",
      );
    } finally {
      setExchangeLoading(false);
    }
  };

  return (
    <main className="w-full text-gray-900 dark:text-white">
      <section className="w-full px-4 pb-8 pt-6 sm:px-6 lg:px-10">
        {/* Título */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Convertir</h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-[#a9afca]">
              Entre tus propias monedas
            </p>
          </div>

          <button
            type="button"
            aria-label="Información"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-gray-500 dark:border-[#4b5275] dark:text-[#b5bbd4]"
          >
            ⓘ
          </button>
        </div>

        {walletLoading && (
          <p className="mb-4 text-sm text-gray-500 dark:text-[#a9afca]">
            Cargando saldos...
          </p>
        )}

        {walletError && (
          <p className="mb-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {walletError}
          </p>
        )}

        <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          {/* Columna del conversor */}
          <div>
            <section className="rounded-2xl border border-gray-300 bg-white p-4 dark:border-[#343956] dark:bg-[#0d112d] sm:p-5">
              {/* Moneda de origen */}
              <article className="rounded-xl border border-gray-300 bg-gray-50 p-4 dark:border-[#4b5275] dark:bg-[#151936]">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <p className="text-xs font-bold tracking-widest text-gray-500 dark:text-[#9da5c8]">
                    DE
                  </p>

                  <p className="text-xs text-gray-500 dark:text-[#9da5c8]">
                    Disponible:{" "}
                    {currencies[fromCurrency].symbol}{" "}
                    {formatMoney(balances[fromCurrency])}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${currencies[fromCurrency].color}`}
                    >
                      {fromCurrency}
                    </span>

                    <select
                      value={fromCurrency}
                      onChange={(event) =>
                        changeFromCurrency(
                          event.target
                            .value as CurrencyCode,
                        )
                      }
                      className="min-w-0 bg-transparent font-bold text-gray-900 outline-none dark:text-white"
                    >
                      {currencyCodes.map((currencyCode) => (
                        <option
                          key={currencyCode}
                          value={currencyCode}
                          className="bg-white text-gray-900 dark:bg-[#101431] dark:text-white"
                        >
                          {currencies[currencyCode].name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <strong className="shrink-0 text-xl">
                    {formatMoney(balances[fromCurrency])}
                  </strong>
                </div>
              </article>

              {/* Botón invertir */}
              <div className="relative z-10 -my-3 flex justify-end pr-5">
                <button
                  type="button"
                  onClick={swapCurrencies}
                  aria-label="Intercambiar monedas"
                  className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#5b35e8] text-xl text-white shadow-lg"
                >
                  ⇅
                </button>
              </div>

              {/* Moneda de destino */}
              <article className="rounded-xl border border-gray-300 bg-gray-50 p-4 dark:border-[#4b5275] dark:bg-[#151936]">
                <p className="mb-2 text-xs font-bold tracking-widest text-gray-500 dark:text-[#9da5c8]">
                  A
                </p>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${currencies[toCurrency].color}`}
                    >
                      {toCurrency}
                    </span>

                    <select
                      value={toCurrency}
                      onChange={(event) =>
                        changeToCurrency(
                          event.target
                            .value as CurrencyCode,
                        )
                      }
                      className="min-w-0 bg-transparent font-bold text-gray-900 outline-none dark:text-white"
                    >
                      {currencyCodes.map((currencyCode) => (
                        <option
                          key={currencyCode}
                          value={currencyCode}
                          disabled={
                            currencyCode === fromCurrency
                          }
                          className="bg-white text-gray-900 dark:bg-[#101431] dark:text-white"
                        >
                          {currencies[currencyCode].name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <strong className="shrink-0 text-xl">
                    {formatMoney(balances[toCurrency])}
                  </strong>
                </div>

                <p className="mt-2 text-right text-xs font-semibold text-emerald-500">
                  Comisión +0,5%
                </p>
              </article>

              {/* Monto */}
              <section className="mt-5">
                <label
                  htmlFor="exchange-amount"
                  className="mb-2 block text-xs font-bold tracking-widest text-gray-500 dark:text-[#9da5c8]"
                >
                  MONTO A CONVERTIR
                </label>

                <div className="flex items-center rounded-xl border border-[#7737f2] bg-white px-4 dark:bg-[#161936]">
                  <input
                    id="exchange-amount"
                    type="text"
                    inputMode="decimal"
                    value={amount}
                    onChange={(event) => {
                      setAmount(event.target.value);
                      setExchangeError("");
                      setExchangeSuccess("");
                    }}
                    className="w-full bg-transparent py-4 font-bold text-gray-900 outline-none dark:text-white"
                  />

                  <span className="text-sm text-gray-500 dark:text-[#9da5c8]">
                    {fromCurrency}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {[10, 25, 50, 80].map((percentage) => (
                    <button
                      key={percentage}
                      type="button"
                      onClick={() =>
                        selectPercentage(percentage / 100)
                      }
                      className="rounded-full border border-gray-400 px-4 py-1.5 text-xs dark:border-[#596080]"
                    >
                      {percentage}%
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={selectMaximum}
                    className="rounded-full border border-[#793aff] bg-[#ede9ff] px-4 py-1.5 text-xs text-[#5526c9] dark:bg-[#2c1765] dark:text-white"
                  >
                    Máximo
                  </button>
                </div>
              </section>
            </section>

            {/* Resultado */}
            <section className="mt-5 flex flex-col gap-5 rounded-2xl border border-[#275070] bg-linear-to-r from-[#104b59] to-[#101431] p-5 text-white sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold tracking-widest text-[#aeb5d1]">
                  RECIBÍS
                </p>

                <p className="mt-1 text-2xl font-extrabold">
                  {formatMoney(convertedAmount)}{" "}
                  {toCurrency}
                </p>

                {rateLoading ? (
                  <p className="mt-2 text-xs text-[#aeb5d1]">
                    Actualizando tasa de cambio...
                  </p>
                ) : rateError ? (
                  <p className="mt-2 text-xs text-red-300">
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
                onClick={handleExchange}
                disabled={
                  walletLoading ||
                  rateLoading ||
                  exchangeLoading ||
                  Boolean(walletError) ||
                  Boolean(rateError) ||
                  numericAmount <= 0
                }
                className="shrink-0 rounded-xl bg-linear-to-r from-[#6b2cff] to-[#5156e8] px-6 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {exchangeLoading
                  ? "Procesando..."
                  : "✓ Confirmar conversión"}
              </button>
            </section>

            {exchangeError && (
              <p className="mt-4 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
                {exchangeError}
              </p>
            )}

            {exchangeSuccess && (
              <p className="mt-4 rounded-lg bg-green-100 px-4 py-3 text-sm text-green-700 dark:bg-green-950 dark:text-green-300">
                {exchangeSuccess}
              </p>
            )}
          </div>

          {/* Cotizaciones */}
          <aside className="rounded-2xl border border-gray-300 bg-white p-5 dark:border-[#343956] dark:bg-[#0d112d]">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-[#8b99d1]">
                Cotizaciones de hoy
              </p>

              <button
                type="button"
                className="text-xs font-medium text-violet-500 dark:text-violet-300"
              >
                Ver todos
              </button>
            </div>

            {quotationsLoading ? (
              <p className="py-4 text-sm text-gray-500 dark:text-[#a9afca]">
                Cargando cotizaciones...
              </p>
            ) : quotationsError ? (
              <p className="py-4 text-sm text-red-500">
                {quotationsError}
              </p>
            ) : (
              <ul className="divide-y divide-gray-300 dark:divide-[#343956]">
                <li className="flex items-center justify-between gap-4 py-4 text-sm">
                  <span className="text-gray-600 dark:text-[#d8dcf0]">
                    Peso argentino → Dólar estadounidense
                  </span>

                  <strong className="text-right">
                    1 ARS ={" "}
                    {formatRate(quotationRates.USD)} USD
                  </strong>
                </li>

                <li className="flex items-center justify-between gap-4 py-4 text-sm">
                  <span className="text-gray-600 dark:text-[#d8dcf0]">
                    Peso argentino → Real brasileño
                  </span>

                  <strong className="text-right">
                    1 ARS ={" "}
                    {formatRate(quotationRates.BRL)} BRL
                  </strong>
                </li>
              </ul>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
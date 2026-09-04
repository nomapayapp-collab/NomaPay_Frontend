import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const currencies = {
  ARS: {
    name: "Peso arg.",
    symbol: "$",
    balance: 8192.3,
    color: "bg-[#6f42c1]",
  },
  USD: {
    name: "Dólar",
    symbol: "US$",
    balance: 312800,
    color: "bg-[#168c94]",
  },
  BRL: {
    name: "Real brasileño",
    symbol: "R$",
    balance: 2450.75,
    color: "bg-[#19a463]",
  },
};
 
type CurrencyCode = keyof typeof currencies;

export default function Exchange() {
  const navigate = useNavigate();

  const [fromCurrency, setFromCurrency] =
    useState<CurrencyCode>("ARS");

  const [toCurrency, setToCurrency] =
    useState<CurrencyCode>("USD");

  const [amount, setAmount] = useState("1240,50");

  const numericAmount =
    Number(amount.replace(/\./g, "").replace(",", ".")) || 0;

  // Valor temporal para mostrar el diseño.
  // Después se reemplaza por el valor que envíe el backend.
const [exchangeRate, setExchangeRate] = useState(0);
const [rateLoading, setRateLoading] = useState(true);
const [rateError, setRateError] = useState("");

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
      const newRate = data.rates[toCurrency];

      if (!newRate) {
        throw new Error("La tasa solicitada no está disponible");
      }

      setExchangeRate(newRate);
    } catch {
      setRateError("No pudimos actualizar la tasa de cambio");
    } finally {
      setRateLoading(false);
    }
  };

  getExchangeRate();
}, [fromCurrency, toCurrency]);

const convertedAmount = numericAmount * exchangeRate;
  const formatMoney = (value: number) =>
    new Intl.NumberFormat("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const selectPercentage = (percentage: number) => {
    const balance = currencies[fromCurrency].balance;
    setAmount(formatMoney(balance * percentage));
  };

  const selectMaximum = () => {
    setAmount(formatMoney(currencies[fromCurrency].balance));
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#080b24] text-white">
      <section className="mx-auto flex w-full max-w-md flex-1 flex-col px-6 pb-5 pt-8">
        {/* Encabezado */}
        

        {/* Título */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">Convertir</h1>

            <p className="mt-1 text-sm text-[#a9afca]">
              Entre tus propias monedas
            </p>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#4b5275] text-[#b5bbd4]"
            aria-label="Información"
          >
            ⓘ
          </button>
        </div>

        {/* Moneda de origen */}
        <article className="rounded-2xl border border-[#4b5275] bg-[#101431] p-4">
          <p className="mb-3 text-xs font-bold tracking-widest text-[#9da5c8]">
            DE
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${currencies[fromCurrency].color}`}
              >
                {fromCurrency}
              </span>

              <select
                value={fromCurrency}
                onChange={(event) =>
                  setFromCurrency(event.target.value as CurrencyCode)
                }
                className="bg-transparent font-bold text-white outline-none"
              >
               <option value="ARS" className="bg-[#101431]">
  Peso arg.
</option>

<option value="USD" className="bg-[#101431]">
  Dólar
</option>

<option value="BRL" className="bg-[#101431]">
  Real brasileño
</option>
              </select>
            </div>

            <strong className="text-xl">
              {formatMoney(currencies[fromCurrency].balance)}
            </strong>
          </div>

        <p className="mt-3 text-xs text-[#9da5c8]">
  Disponible: {currencies[fromCurrency].symbol}{" "}
  {formatMoney(currencies[fromCurrency].balance)}
</p>
        </article>

        {/* Botón para intercambiar monedas */}
        <div className="relative z-10 -my-3 flex justify-end pr-5">
          <button
            type="button"
            onClick={swapCurrencies}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5b35e8] text-xl shadow-lg"
            aria-label="Intercambiar monedas"
          >
            ⇅
          </button>
        </div>

        {/* Moneda de destino */}
        <article className="rounded-2xl border border-[#4b5275] bg-[#101431] p-4">
          <p className="mb-3 text-xs font-bold tracking-widest text-[#9da5c8]">
            A
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${currencies[toCurrency].color}`}
              >
                {toCurrency}
              </span>

              <select
  value={toCurrency}
  onChange={(event) =>
    setToCurrency(event.target.value as CurrencyCode)
  }
  className="bg-transparent font-bold text-white outline-none"
>
  <option value="USD" className="bg-[#101431]">
    Dólar
  </option>

  <option value="ARS" className="bg-[#101431]">
    Peso arg.
  </option>

  <option value="BRL" className="bg-[#101431]">
    Real brasileño
  </option>
</select>
            </div>

            <strong className="text-xl">
              {formatMoney(currencies[toCurrency].balance)}
            </strong>
          </div>

          <p className="mt-3 text-xs font-semibold text-[#ffd52a]">
            Comisión +0,5%
          </p>
        </article>

        {/* Monto */}
        <section className="mt-5">
          <label
            htmlFor="exchange-amount"
            className="mb-2 block text-xs font-bold tracking-widest text-[#9da5c8]"
          >
            MONTO A CONVERTIR
          </label>

          <div className="flex items-center rounded-xl border border-[#7737f2] bg-[#161936] px-4">
            <input
              id="exchange-amount"
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="w-full bg-transparent py-4 font-bold text-white outline-none"
            />

            <span className="text-sm text-[#9da5c8]">
              {fromCurrency}
            </span>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => selectPercentage(0.25)}
              className="rounded-full border border-[#596080] px-4 py-1.5 text-xs"
            >
              25%
            </button>

            <button
              type="button"
              onClick={() => selectPercentage(0.5)}
              className="rounded-full border border-[#596080] px-4 py-1.5 text-xs"
            >
              50%
            </button>

            <button
              type="button"
              onClick={selectMaximum}
              className="rounded-full border border-[#793aff] bg-[#2c1765] px-4 py-1.5 text-xs"
            >
              Máximo
            </button>
          </div>
        </section>

        {/* Resultado */}
        <section className="mt-5 rounded-2xl border border-[#275070] bg-linear-to-b from-[#104b59] to-[#101431] p-5">
          <p className="text-xs font-bold tracking-widest text-[#aeb5d1]">
            RECIBÍS
          </p>

          <p className="mt-1 text-2xl font-extrabold">
            {formatMoney(convertedAmount)} {toCurrency}
          </p>

         {rateLoading ? (
  <p className="mt-2 text-xs text-[#aeb5d1]">
    Actualizando tasa de cambio...
  </p>
) : rateError ? (
  <p className="mt-2 text-xs text-red-400">
    {rateError}
  </p>
) : (
  <p className="mt-2 text-xs text-[#aeb5d1]">
    1 {fromCurrency} = {formatMoney(exchangeRate)}{" "}
    {toCurrency} · tasa actualizada
  </p>
)}
        </section>

        {/* Botón principal */}
        <button
          type="button"
          className="mt-auto rounded-xl bg-linear-to-r from-[#6b2cff] to-[#5156e8] py-4 font-bold text-white"
          onClick={() => alert("Conversión confirmada")}
        >
          Confirmar conversión
        </button>
      </section>

      {/* Navegación inferior */}
      <nav className="border-t border-[#343956] bg-[#0d112d] px-3 py-3">
        <div className="mx-auto grid max-w-md grid-cols-6 gap-1 text-center text-[10px] text-[#aeb5d1]">
          <button type="button" onClick={() => navigate("/")}>
            <span className="block text-lg">⌂</span>
            Inicio
          </button>

          <button type="button">
            <span className="block text-lg">▣</span>
            Billetera
          </button>

          <button type="button" className="text-white">
            <span className="block text-lg text-[#8a67ff]">⇄</span>
            Convertir
          </button>

          <button type="button">
            <span className="block text-lg">↗</span>
            Transferir
          </button>

          <button type="button">
            <span className="block text-lg">◷</span>
            Historial
          </button>

          <button type="button">
            <span className="block text-lg">▦</span>
            Resumen
          </button>
        </div>
      </nav>
    </main>
  );
}
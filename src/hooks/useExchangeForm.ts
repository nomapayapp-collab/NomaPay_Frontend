import { useEffect, useMemo, useState } from "react";
import { useWallet } from "./useWallet";
import { exchangeCurrency } from "../services/walletService";
import { CURRENCY_CODES } from "../constants/currencies";
import type { CurrencyCode } from "../types/wallet";

const emptyBalances: Record<CurrencyCode, number> = Object.fromEntries(
  CURRENCY_CODES.map((code) => [code, 0]),
) as Record<CurrencyCode, number>;

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

/**
 * Toda la lógica del formulario de "Convertir monedas": estado, cálculo de
 * tasas, validaciones y el submit contra el back. Exchange.tsx se queda
 * solo con el JSX que consume esto — separado así porque era la mitad del
 * archivo y no tenía nada que ver con el render.
 */
export function useExchangeForm() {
  const { wallet, loading: walletLoading, error: walletError, refetch } = useWallet();

  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>("ARS");
  const [toCurrency, setToCurrency] = useState<CurrencyCode>("USD");
  const [amount, setAmount] = useState("0,00");
  const [exchangeLoading, setExchangeLoading] = useState(false);
  const [exchangeError, setExchangeError] = useState("");
  const [exchangeSuccess, setExchangeSuccess] = useState("");

  /*
   * Convierte los balances del WalletContext en un objeto fácil de
   * consultar: balances.USD, balances.ARS, etc.
   */
  const balances = useMemo(() => {
    const updatedBalances = { ...emptyBalances };

    wallet.balances.forEach((balance) => {
      const currencyCode = balance.currency.code as CurrencyCode;
      if (currencyCode in updatedBalances) {
        updatedBalances[currencyCode] = Number(balance.amount);
      }
    });

    return updatedBalances;
  }, [wallet.balances]);

  /*
   * Al cargar la billetera, selecciona como moneda de origen la moneda
   * principal del usuario.
   */
  useEffect(() => {
    const primaryBalance = wallet.balances.find((balance) => balance.isPrimary);
    if (!primaryBalance) return;

    const primaryCurrency = primaryBalance.currency.code as CurrencyCode;
    if (!CURRENCY_CODES.includes(primaryCurrency)) return;

    setFromCurrency(primaryCurrency);
    setToCurrency((currentCurrency) => {
      if (currentCurrency !== primaryCurrency) return currentCurrency;
      return primaryCurrency === "USD" ? "ARS" : "USD";
    });
  }, [wallet.balances]);

  /*
   * Busca el valor de una moneda expresado en ARS. WalletContext guarda:
   * 1 USD = X ARS
   * 1 BRL = X ARS
   */
  const getValueInArs = (currencyCode: CurrencyCode) => {
    if (currencyCode === "ARS") return 1;

    const directRate = wallet.exchangeRates.find(
      (rate) => rate.from === currencyCode && rate.to === "ARS",
    );
    if (directRate) return directRate.rate;

    const inverseRate = wallet.exchangeRates.find(
      (rate) => rate.from === "ARS" && rate.to === currencyCode,
    );
    if (inverseRate && inverseRate.rate > 0) return 1 / inverseRate.rate;

    return 0;
  };

  /* Calcula cualquier combinación usando ARS como moneda de referencia. */
  const exchangeRate = useMemo(() => {
    const fromValue = getValueInArs(fromCurrency);
    const toValue = getValueInArs(toCurrency);
    if (fromValue <= 0 || toValue <= 0) return 0;
    return fromValue / toValue;
  }, [fromCurrency, toCurrency, wallet.exchangeRates]);

  const usdToArs = getValueInArs("USD");
  const brlToArs = getValueInArs("BRL");

  const numericAmount = Number(amount.replace(/\./g, "").replace(",", ".")) || 0;
  const convertedAmount = numericAmount * exchangeRate;

  const rateError = !walletLoading && exchangeRate <= 0 ? "No pudimos obtener la tasa de cambio" : "";

  const clearMessages = () => {
    setExchangeError("");
    setExchangeSuccess("");
  };

  const changeFromCurrency = (newCurrency: CurrencyCode) => {
    setFromCurrency(newCurrency);
    clearMessages();

    if (newCurrency === toCurrency) {
      const alternativeCurrency = CURRENCY_CODES.find((currency) => currency !== newCurrency);
      if (alternativeCurrency) setToCurrency(alternativeCurrency);
    }
  };

  const changeToCurrency = (newCurrency: CurrencyCode) => {
    if (newCurrency === fromCurrency) return;
    setToCurrency(newCurrency);
    clearMessages();
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    clearMessages();
  };

  const selectPercentage = (percentage: number) => {
    setAmount(formatMoney(balances[fromCurrency] * percentage));
    clearMessages();
  };

  const selectMaximum = () => {
    setAmount(formatMoney(balances[fromCurrency]));
    clearMessages();
  };

  const updateAmount = (value: string) => {
    setAmount(value);
    clearMessages();
  };

  const handleExchange = async () => {
    clearMessages();

    if (numericAmount <= 0) {
      setExchangeError("Ingresá un monto mayor que cero");
      return;
    }

    if (numericAmount > balances[fromCurrency]) {
      setExchangeError("No tenés saldo suficiente");
      return;
    }

    if (exchangeRate <= 0) {
      setExchangeError("La tasa de cambio no está disponible");
      return;
    }

    setExchangeLoading(true);

    try {
      const result = await exchangeCurrency({ fromCurrency, toCurrency, amount: numericAmount });

      setAmount("0,00");
      setExchangeSuccess(
        `Conversión aprobada: recibiste ${formatMoney(Number(result.transaction.finalAmount))} ${toCurrency}`,
      );

      // Vuelve a consultar la billetera para actualizar también Dashboard,
      // Billetera y Exchange.
      refetch();
    } catch {
      setExchangeError("No pudimos realizar la conversión");
    } finally {
      setExchangeLoading(false);
    }
  };

  return {
    wallet,
    walletLoading,
    walletError,

    fromCurrency,
    toCurrency,
    amount,
    balances,
    exchangeRate,
    usdToArs,
    brlToArs,
    numericAmount,
    convertedAmount,
    rateError,

    exchangeLoading,
    exchangeError,
    exchangeSuccess,

    updateAmount,
    changeFromCurrency,
    changeToCurrency,
    swapCurrencies,
    selectPercentage,
    selectMaximum,
    handleExchange,

    formatMoney,
    formatRate,
  };
}

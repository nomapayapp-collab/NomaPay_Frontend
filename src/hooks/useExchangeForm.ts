import { useEffect, useMemo, useState } from "react";
import { useWallet } from "./useWallet";
import { useToast } from "./useToast";
import { exchangeCurrency } from "../services/walletService";
import { CURRENCY_CODES } from "../constants/currencies";
import type { CurrencyCode } from "../types/wallet";

const emptyBalances: Record<CurrencyCode, number> = Object.fromEntries(
  CURRENCY_CODES.map((code) => [code, 0]),
) as Record<CurrencyCode, number>;

const EXCHANGE_FEE_PERCENTAGE = 0.5;

const formatMoney = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

const formatRate = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export function useExchangeForm() {
  const { wallet, loading: walletLoading, error: walletError, refetch } = useWallet();
  const { showToast } = useToast();

  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>("ARS");
  const [toCurrency, setToCurrency] = useState<CurrencyCode>("USD");
  const [amount, setAmount] = useState("0,00");
  const [exchangeLoading, setExchangeLoading] = useState(false);

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

  // Misma cuenta que calculateConversion() en el back
  const feeAmount = numericAmount * (EXCHANGE_FEE_PERCENTAGE / 100);
  const amountAfterFee = numericAmount - feeAmount;
  const convertedAmount = amountAfterFee * exchangeRate;

  const rateError = !walletLoading && exchangeRate <= 0 ? "No pudimos obtener la tasa de cambio" : "";

  const changeFromCurrency = (newCurrency: CurrencyCode) => {
    setFromCurrency(newCurrency);

    if (newCurrency === toCurrency) {
      const alternativeCurrency = CURRENCY_CODES.find((currency) => currency !== newCurrency);
      if (alternativeCurrency) setToCurrency(alternativeCurrency);
    }
  };

  const changeToCurrency = (newCurrency: CurrencyCode) => {
    if (newCurrency === fromCurrency) return;
    setToCurrency(newCurrency);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const selectPercentage = (percentage: number) => {
    setAmount(formatMoney(balances[fromCurrency] * percentage));
  };

  const selectMaximum = () => {
    setAmount(formatMoney(balances[fromCurrency]));
  };

  const updateAmount = (value: string) => {
    setAmount(value);
  };

  // Errores/confirmación de la conversión van por toast (mismo criterio
  // que el resto de la app) en vez de un mensaje inline — así no hace
  // falta ir limpiando estado a mano en cada interacción del form.
  const handleExchange = async () => {
    if (numericAmount <= 0) {
      showToast("Ingresá un monto mayor que cero", "error");
      return;
    }

    if (numericAmount > balances[fromCurrency]) {
      showToast("No tenés saldo suficiente", "error");
      return;
    }

    if (exchangeRate <= 0) {
      showToast("La tasa de cambio no está disponible", "error");
      return;
    }

    setExchangeLoading(true);

    try {
      const result = await exchangeCurrency({ fromCurrency, toCurrency, amount: numericAmount });

      setAmount("0,00");
      showToast(
        `Conversión aprobada: recibiste ${formatMoney(Number(result.transaction.finalAmount))} ${toCurrency}`,
        "success",
      );

      // Vuelve a consultar la billetera para actualizar también Dashboard,
      // Billetera y Exchange.
      refetch();
    } catch {
      showToast("No pudimos realizar la conversión", "error");
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

    feePercentage: EXCHANGE_FEE_PERCENTAGE,
    feeAmount,

    exchangeLoading,

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

import type { CurrencyCode } from "../types/wallet";

export type CurrencyMeta = {
  name: string;
  symbol: string;
  /** clase de fondo para el círculo/badge de la moneda (BalanceCard, Exchange, etc.) */
  color: string;
};


export const CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  ARS: { name: "Peso argentino", symbol: "$", color: "bg-[#6f42c1]" },
  USD: { name: "Dólar estadounidense", symbol: "US$", color: "bg-[#168c94]" },
  BRL: { name: "Real brasileño", symbol: "R$", color: "bg-[#19a463]" },
};

export const CURRENCY_CODES = Object.keys(CURRENCIES) as CurrencyCode[];

export const CURRENCY_NAMES: Record<CurrencyCode, string> = Object.fromEntries(
  CURRENCY_CODES.map((code) => [code, CURRENCIES[code].name]),
) as Record<CurrencyCode, string>;

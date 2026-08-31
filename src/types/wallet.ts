export type CurrencyCode = "ARS" | "USD" | "BRL" ;

export type Currency = {
  code: CurrencyCode;
  name: string;
  symbol: string;
};

export type CurrencyBalance = {
  currency: Currency;
  amount: number;
  isPrimary?: boolean;
};

export type ExchangeRate = {
  from: CurrencyCode;
  to: CurrencyCode;
  rate: number;
};

export type RecentMovement = {
  id: string;
  description: string;
  /** negativo = egreso, positivo = ingreso */
  amount: number;
  currency: CurrencyCode;
  date: string; // ISO
};

export type Wallet = {
  balances: CurrencyBalance[];
  exchangeRates: ExchangeRate[];
  recentMovements: RecentMovement[];
};
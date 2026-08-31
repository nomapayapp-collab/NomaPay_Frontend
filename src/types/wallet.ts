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

// Balance individual tal como lo devuelve el back real (GET /api/wallets/me).
// amount viene como string porque es una columna DECIMAL en Postgres.
export type WalletBalanceDto = {
  currencyCode: CurrencyCode;
  currencyName: string;
  symbol: string | null;
  amount: string;
};

export type WalletSummary = {
  walletId: number;
  preferredCurrency: CurrencyCode;
  balances: WalletBalanceDto[];
};
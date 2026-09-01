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

export type MovementType = "cobro" | "cambio" | "pago" | "envio" | "carga";
export type MovementStatus = "acreditado" | "completado" | "rechazada" | "pendiente";

export type RecentMovement = {
  id: string;
  type: MovementType;
  description: string;
  /** texto secundario, ej. "Upwork", "Tasa 1.700,00", "Medellín" */
  detail?: string;
  status: MovementStatus;
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
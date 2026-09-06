import { api } from "./api";

export type CurrencyCode = "ARS" | "USD" | "BRL";

export interface WalletBalance {
  currencyCode: CurrencyCode;
  currencyName: string;
  symbol: string;
  amount: string;
}

export interface WalletResponse {
  walletId: number;
  preferredCurrency: CurrencyCode;
  balances: WalletBalance[];
}

export interface ExchangePayload {
  fromCurrency: CurrencyCode;
  toCurrency: CurrencyCode;
  amount: number;
}

export interface ExchangeTransaction {
  id: number;
  type: "exchange";
  status: string;
  currencyOrigin: CurrencyCode;
  currencyDestination: CurrencyCode;
  amount: string;
  fee: string;
  finalAmount: string;
  exchangeRate: string;
  transactionDate: string;
}

export interface ExchangeResponse {
  transaction: ExchangeTransaction;
  wallet: WalletResponse;
}

export async function getMyWallet(): Promise<WalletResponse> {
  const response = await api.get<WalletResponse>("/wallets/me");
  return response.data;
}

export async function exchangeCurrency(
  payload: ExchangePayload,
): Promise<ExchangeResponse> {
  const response = await api.post<ExchangeResponse>(
    "/wallets/me/exchange",
    payload,
  );

  return response.data;
}
import type { CurrencyCode } from "./wallet";


export type HistoryOperationType = "carga" | "pago" | "cobro" | "cambio";
export type HistoryStatus = "pending" | "completed" | "cancelled" | "rejected";

export type HistoryExchangeData = {
  currencyOrigin: CurrencyCode;
  currencyDestination: CurrencyCode;
  finalAmount: number;
};


export type HistoryCounterparty = {
  name: string;
  alias: string;
};

export type HistoryItem = {
  id: number;
  operationType: HistoryOperationType;
  status: HistoryStatus;
  transactionDate: string; // ISO
  amount: number;
  currencyCode: CurrencyCode;
  exchangeData?: HistoryExchangeData;

  fee?: number;
  counterparty?: HistoryCounterparty;
};

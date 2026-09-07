import type { CurrencyCode } from "./wallet";

// Coincide con HistoryItem del back (GET /history) — ver
// src/services/history.service.ts del repo de back.
export type HistoryOperationType = "carga" | "pago" | "cobro" | "cambio";
export type HistoryStatus = "pending" | "completed" | "cancelled" | "rejected";

export type HistoryExchangeData = {
  currencyOrigin: CurrencyCode;
  currencyDestination: CurrencyCode;
  finalAmount: number;
};

// Contraparte de una transferencia (quién envió / quién recibió). El back
// todavía no la manda en GET /history (sí la tiene disponible — Gastón
// confirmó que sale de wallet -> user, igual que en POST /transfers), así
// que queda opcional: mientras no venga, el front cae al título genérico.
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
  // Comisión ya cobrada en esa transacción, en currencyCode — 0 en
  // transferencias, ~0.5% del monto en cambios (TRANSACTION_FEE_PERCENTAGE
  // del back). Opcional por el mismo motivo que counterparty.
  fee?: number;
  counterparty?: HistoryCounterparty;
};

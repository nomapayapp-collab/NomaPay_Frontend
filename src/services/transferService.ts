import { api } from "./api";
import type { CurrencyCode } from "../types/wallet";

export interface TransferPayload {
  aliasOrCbu: string;
  currencyCode: CurrencyCode;
  amount: number;
}

export interface TransferTransaction {
  id: number;
  receiverName: string;
  receiverAlias: string;
  amount: number;
  currencyCode: CurrencyCode;
  transactionDate: string;
}

export interface TransferResponse {
  message: string;
  transaction: TransferTransaction;
}

export async function transferFunds(payload: TransferPayload): Promise<TransferResponse> {
  const response = await api.post<TransferResponse>("/transfers", payload);
  return response.data;
}
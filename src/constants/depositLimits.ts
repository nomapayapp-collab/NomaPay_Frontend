import type { CurrencyCode } from "../types/wallet";


export const DEPOSIT_LIMITS: Record<CurrencyCode, number> = {
  ARS: 50_000_000,
  USD: 10_000,
  BRL: 170_000,
};

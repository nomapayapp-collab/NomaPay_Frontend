import type { CurrencyCode } from "../types/wallet";

/**
 * Límite máximo por carga (POST /wallets/deposit), por moneda.
 *
 * OJO: esto tiene que reflejar los valores de DEPOSIT_LIMITS en
 * deposit.service.ts del back — que a su vez se pueden pisar con las env
 * vars MAX_DEPOSIT_USD / MAX_DEPOSIT_ARS / MAX_DEPOSIT_BRL en Railway. No
 * hay un endpoint que devuelva estos límites, así que si Gastón cambia
 * alguna de esas env vars en producción, hay que actualizar esto a mano
 * para que la validación en tiempo real del front no quede desactualizada
 * (igual, el back siempre valida de nuevo del lado suyo — esto es solo
 * para avisar antes de que el usuario intente cargar).
 */
export const DEPOSIT_LIMITS: Record<CurrencyCode, number> = {
  ARS: 50_000_000,
  USD: 10_000,
  BRL: 170_000,
};

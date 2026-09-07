import type { Wallet } from "../types/wallet";

/*
 * Se usan solamente si la API externa de cotizaciones falla (sin conexión,
 * rate limit, etc.) — no son datos mockeados que se muestren como si
 * fueran reales: es el último recurso para no dejar la pantalla sin
 * ninguna cotización. Las direcciones están expresadas correctamente:
 *
 * 1 USD = cierta cantidad de ARS.
 * 1 BRL = cierta cantidad de ARS.
 */
export const FALLBACK_RATES: Wallet["exchangeRates"] = [
  {
    from: "USD",
    to: "ARS",
    rate: 1700,
  },
  {
    from: "BRL",
    to: "ARS",
    rate: 300,
  },
];

/*
 * Cotizaciones en vivo, compartidas por cualquier pantalla que las
 * necesite — WalletContext (Dashboard, Exchange, Wallet, etc., ya
 * autenticado) y LandingCalculator (pública, sin login, en la landing).
 */
export async function getCurrentExchangeRates(): Promise<Wallet["exchangeRates"]> {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD");

    if (!response.ok) {
      throw new Error("No se pudieron obtener las cotizaciones");
    }

    const data = await response.json();

    // La API tiene base fija en USD: data.rates[X] siempre significa
    // "1 USD = X unidades de esa moneda". Con estos dos valores alcanza
    // para derivar las 6 combinaciones ARS/USD/BRL.
    const usdToArs = data.rates?.ARS;
    const usdToBrl = data.rates?.BRL;

    if (
      typeof usdToArs !== "number" ||
      typeof usdToBrl !== "number" ||
      usdToArs <= 0 ||
      usdToBrl <= 0
    ) {
      throw new Error("Cotizaciones inválidas");
    }

    const arsToUsd = 1 / usdToArs;
    const brlToUsd = 1 / usdToBrl;
    const brlToArs = usdToArs / usdToBrl;
    const arsToBrl = usdToBrl / usdToArs;

    return [
      { from: "USD", to: "ARS", rate: usdToArs },
      { from: "USD", to: "BRL", rate: usdToBrl },
      { from: "BRL", to: "ARS", rate: brlToArs },
      { from: "BRL", to: "USD", rate: brlToUsd },
      { from: "ARS", to: "BRL", rate: arsToBrl },
      { from: "ARS", to: "USD", rate: arsToUsd },
    ];
  } catch {
    return FALLBACK_RATES;
  }
}

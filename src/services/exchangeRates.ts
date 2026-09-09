import type { Wallet } from "../types/wallet";


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


export async function getCurrentExchangeRates(): Promise<Wallet["exchangeRates"]> {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD");

    if (!response.ok) {
      throw new Error("No se pudieron obtener las cotizaciones");
    }

    const data = await response.json();

   
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

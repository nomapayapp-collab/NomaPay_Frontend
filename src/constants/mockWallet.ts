/**
 * datos mockeados para el maquetado del dashboard, cuando tengamos endpoint
 * esto se reemplaza en WalletContext con la llamada al service, los 
 * componentes que consumen useWallet() no deberían tener que cambiar.
 */
import type { Wallet } from "../types/wallet";

export const MOCK_WALLET: Wallet = {
  balances: [
    { currency: { code: "ARS", name: "Peso argentino", symbol: "$" }, amount: 1982.3, isPrimary: true },
    { currency: { code: "BRL", name: "Real brasileño", symbol: "R$" }, amount: 1240.5 },
    { currency: { code: "USD", name: "Dólar estadounidense", symbol: "US$" }, amount: 312800 },
  ],
  exchangeRates: [
    { from: "ARS", to: "USD", rate: 1700 },
    { from: "ARS", to: "BRL", rate: 700 },
  ],
  recentMovements: [
    {
      id: "1",
      type: "cobro",
      description: "Cobro freelance",
      detail: "Upwork",
      status: "acreditado",
      amount: 680,
      currency: "USD",
      date: "2026-08-22T12:00:00.000Z",
    },
    {
      id: "2",
      type: "cambio",
      description: "Cambio USD → ARS",
      detail: "Tasa 1.700,00",
      status: "completado",
      amount: -150,
      currency: "USD",
      date: "2026-08-25T12:00:00.000Z",
    },
    {
      id: "3",
      type: "pago",
      description: "Hostal Route 66",
      detail: "Medellín",
      status: "completado",
      amount: -42,
      currency: "USD",
      date: "2026-08-24T12:00:00.000Z",
    },
    {
      id: "4",
      type: "envio",
      description: "Envío a Julián Torres",
      detail: "julian.torres.nomapay",
      status: "rechazada",
      amount: 1000,
      currency: "ARS",
      date: "2026-08-22T12:00:00.000Z",
    },
    {
      id: "5",
      type: "carga",
      description: "Carga de saldo",
      detail: "Transferencia bancaria",
      status: "acreditado",
      amount: 200,
      currency: "USD",
      date: "2026-08-17T12:00:00.000Z",
    },
  ],
};
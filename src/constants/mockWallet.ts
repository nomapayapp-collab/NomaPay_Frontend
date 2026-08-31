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
    { id: "1", description: "Cambio USD → ARS", amount: -150, currency: "USD", date: new Date().toISOString() },
    { id: "2", description: "Hostal Route 66", amount: -42, currency: "USD", date: new Date().toISOString() },
  ],
};
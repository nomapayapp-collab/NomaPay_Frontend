import { createContext, useState, type ReactNode } from "react";
import type { Wallet } from "../types/wallet";
import { MOCK_WALLET } from "../constants/mockWallet";

/**
 * saldo, monedas y movimientos del usuario.
 * No se usa directo: los componentes consumen esto a través del hook useWallet().
 */
type WalletContextValue = {
  wallet: Wallet;
  loading: boolean;
};

export const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  // TODO(Sprint 2): reemplazar por fetch real cuando el backend tenga /wallet, /balances y /exchange-rates.
  const [wallet] = useState<Wallet>(MOCK_WALLET);
  const [loading] = useState(false);

  return <WalletContext.Provider value={{ wallet, loading }}>{children}</WalletContext.Provider>;
}
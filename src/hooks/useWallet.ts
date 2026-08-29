import { useContext } from "react";
import { WalletContext } from "../context/WalletContext";

/**
 *  así se consume el saldo desde cualquier componente:
 *  const { wallet, loading } = useWallet();
 * Tira un error claro si alguien lo usa fuera de <WalletProvider>.
 */
export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet debe usarse dentro de un <WalletProvider>");
  }
  return context;
}
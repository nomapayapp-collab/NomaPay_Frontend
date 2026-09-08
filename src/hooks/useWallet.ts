import { useContext } from "react";
import { WalletContext } from "../context/WalletContext";


export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet debe usarse dentro de un <WalletProvider>");
  }
  return context;
}
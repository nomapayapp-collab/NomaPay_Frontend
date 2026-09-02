import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";
import type { Wallet } from "../types/wallet";
import * as authService from "../services/authService";
import { MOCK_WALLET } from "../constants/mockWallet";
import { useAuth } from "../hooks/useAuth";

type WalletContextValue = {
  wallet: Wallet;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export const WalletContext = createContext<WalletContextValue | undefined>(undefined);

// Estado inicial para un usuario logueado mientras carga su saldo real.
// NO usa MOCK_WALLET para balances (esos ya son reales) — solo toma
// prestadas las cotizaciones mockeadas, que siguen sin endpoint propio.
const EMPTY_AUTH_WALLET: Wallet = {
  balances: [],
  exchangeRates: MOCK_WALLET.exchangeRates,
  recentMovements: [],
};

export function WalletProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [wallet, setWallet] = useState<Wallet>(EMPTY_AUTH_WALLET);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const summary = await authService.getMyWallet();

      const balances = summary.balances.map((b) => ({
        currency: {
          code: b.currencyCode,
          name: b.currencyName,
          symbol: b.symbol ?? "",
        },
        amount: Number(b.amount),
        isPrimary: b.currencyCode === summary.preferredCurrency,
      }));

      setWallet({
        balances,
        exchangeRates: MOCK_WALLET.exchangeRates,
        recentMovements: [], // antes: MOCK_WALLET.recentMovements — ya no hay endpoint, no mostramos mock
      });
    } catch {
      setError("No pudimos cargar tu saldo. Probá de nuevo en un rato.");
      setWallet(EMPTY_AUTH_WALLET);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      // no hay sesión (ej: landing pública): ahí sí mostramos el ejemplo completo
      setWallet(MOCK_WALLET);
      setError(null);
      setLoading(false);
      return;
    }

    fetchWallet();
  }, [authLoading, isAuthenticated, fetchWallet]);

  return (
    <WalletContext.Provider value={{ wallet, loading, error, refetch: fetchWallet }}>
      {children}
    </WalletContext.Provider>
  );
}
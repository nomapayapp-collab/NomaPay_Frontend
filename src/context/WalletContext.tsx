import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";
import type { Wallet } from "../types/wallet";
import * as authService from "../services/authService";
import { MOCK_WALLET } from "../constants/mockWallet";

/**
 * saldo, monedas y movimientos del usuario.
 * No se usa directo: los componentes consumen esto a través del hook useWallet().
 *
 * El saldo (balances) ya sale del back real (GET /api/wallets/me). Las
 * cotizaciones y los movimientos recientes todavía NO tienen endpoint en el
 * back, así que por ahora siguen mockeados — se reemplazan acá mismo cuando
 * exista /exchange-rates y /movements (Sprint 2), sin que BalanceCard,
 * ExchangeRatesList ni RecentMovements tengan que cambiar.
 */
type WalletContextValue = {
  wallet: Wallet;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export const WalletContext = createContext<WalletContextValue | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<Wallet>(MOCK_WALLET);
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
        balances: balances.length > 0 ? balances : MOCK_WALLET.balances,
        exchangeRates: MOCK_WALLET.exchangeRates,
        recentMovements: MOCK_WALLET.recentMovements,
      });
    } catch {
      setError("No pudimos cargar tu saldo. Mostrando datos de ejemplo.");
      setWallet(MOCK_WALLET);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  return (
    <WalletContext.Provider value={{ wallet, loading, error, refetch: fetchWallet }}>
      {children}
    </WalletContext.Provider>
  );
}
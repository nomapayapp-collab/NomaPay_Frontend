import { createContext, useCallback, useEffect, useState, type ReactNode } from "react";
import type { CurrencyCode, Wallet } from "../types/wallet";
import * as authService from "../services/authService";
import { MOCK_WALLET } from "../constants/mockWallet";
import { useAuth } from "../hooks/useAuth";

type WalletContextValue = {
  wallet: Wallet;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  mockDeposit: (currencyCode: CurrencyCode, amount: number) => void;
  mockTransfer: (params: { currencyCode: CurrencyCode; amount: number; recipientLabel: string }) => void;
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

      setWallet((prev) => ({
        balances,
        exchangeRates: MOCK_WALLET.exchangeRates,
        // antes esto se reseteaba a [] en cada refetch ("ya no hay endpoint,
        // no mostramos mock real"). Ahora conservamos los movimientos
        // ficticios (carga/transferencia) para que no desaparezcan cuando
        // algo dispara un refetch (ej. cambiar moneda favorita en Config).
        recentMovements: prev.recentMovements,
      }));
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

  // Carga de saldo ficticia: todavía no hay endpoint de depósito en el
  // back, así que esto solo acredita el monto en el estado local del
  // front (y le agrega su movimiento a la lista, para que Billetera /
  // Movimientos recientes lo puedan mostrar). Cuando exista el endpoint
  // real, esto se reemplaza por la llamada al service + refetch().
  const mockDeposit = useCallback((currencyCode: CurrencyCode, amount: number) => {
    setWallet((prev) => ({
      ...prev,
      balances: prev.balances.map((b) =>
        b.currency.code === currencyCode ? { ...b, amount: b.amount + amount } : b
      ),
      recentMovements: [
        {
          id: `local-carga-${Date.now()}`,
          type: "carga",
          description: "Carga de saldo",
          status: "acreditado",
          amount,
          currency: currencyCode,
          date: new Date().toISOString(),
        },
        ...prev.recentMovements,
      ],
    }));
  }, []);

  // Transferencia ficticia: mismo criterio que mockDeposit — no hay
  // endpoint de transferencias en el back todavía. Descuenta el monto de
  // la moneda elegida y agrega el movimiento correspondiente.
  const mockTransfer = useCallback(
    ({
      currencyCode,
      amount,
      recipientLabel,
    }: {
      currencyCode: CurrencyCode;
      amount: number;
      recipientLabel: string;
    }) => {
      setWallet((prev) => ({
        ...prev,
        balances: prev.balances.map((b) =>
          b.currency.code === currencyCode ? { ...b, amount: b.amount - amount } : b
        ),
        recentMovements: [
          {
            id: `local-envio-${Date.now()}`,
            type: "envio",
            description: `Envío a ${recipientLabel}`,
            status: "completado",
            amount: -amount,
            currency: currencyCode,
            date: new Date().toISOString(),
          },
          ...prev.recentMovements,
        ],
      }));
    },
    []
  );

  return (
    <WalletContext.Provider value={{ wallet, loading, error, refetch: fetchWallet, mockDeposit, mockTransfer }}>
      {children}
    </WalletContext.Provider>
  );
}
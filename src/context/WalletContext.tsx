import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type {
  CurrencyCode,
  Wallet,
} from "../types/wallet";

import * as authService from "../services/authService";
import { MOCK_WALLET } from "../constants/mockWallet";
import { useAuth } from "../hooks/useAuth";

type WalletContextValue = {
  wallet: Wallet;
  loading: boolean;
  error: string | null;
  refetch: () => void;

  mockDeposit: (
    currencyCode: CurrencyCode,
    amount: number,
  ) => void;

  mockTransfer: (params: {
    currencyCode: CurrencyCode;
    amount: number;
    recipientLabel: string;
  }) => void;
};

export const WalletContext = createContext<
  WalletContextValue | undefined
>(undefined);

/*
 * Se utilizan solamente si la API externa de cotizaciones falla.
 * Las direcciones están expresadas correctamente:
 *
 * 1 USD = cierta cantidad de ARS.
 * 1 BRL = cierta cantidad de ARS.
 */
const FALLBACK_RATES: Wallet["exchangeRates"] = [
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

const EMPTY_AUTH_WALLET: Wallet = {
  balances: [],
  exchangeRates: FALLBACK_RATES,
  recentMovements: [],
};

/*
 * Obtiene las cotizaciones una sola vez.
 * Estas cotizaciones serán compartidas por Dashboard,
 * Exchange y cualquier componente que utilice useWallet().
 */
async function getCurrentExchangeRates(): Promise<
  Wallet["exchangeRates"]
> {
  try {
    const response = await fetch(
      "https://open.er-api.com/v6/latest/USD",
    );

    if (!response.ok) {
      throw new Error(
        "No se pudieron obtener las cotizaciones",
      );
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

    const brlToArs = usdToArs / usdToBrl;

    return [
      {
        from: "USD",
        to: "ARS",
        rate: usdToArs,
      },
      {
        from: "BRL",
        to: "ARS",
        rate: brlToArs,
      },
    ];
  } catch {
    return FALLBACK_RATES;
  }
}

export function WalletProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  const [wallet, setWallet] =
    useState<Wallet>(EMPTY_AUTH_WALLET);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [summary, exchangeRates] = await Promise.all([
        authService.getMyWallet(),
        getCurrentExchangeRates(),
      ]);

      const balances = summary.balances.map((balance) => ({
        currency: {
          code: balance.currencyCode,
          name: balance.currencyName,
          symbol: balance.symbol ?? "",
        },
        amount: Number(balance.amount),
        isPrimary:
          balance.currencyCode === summary.preferredCurrency,
      }));

      setWallet((previousWallet) => ({
        balances,
        exchangeRates,

        /*
         * Conservamos los movimientos ficticios para que
         * no desaparezcan después de un refetch.
         */
        recentMovements:
          previousWallet.recentMovements,
      }));
    } catch {
      setError(
        "No pudimos cargar tu saldo. Probá de nuevo en un rato.",
      );

      setWallet(EMPTY_AUTH_WALLET);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      setWallet({
        ...MOCK_WALLET,
        exchangeRates: FALLBACK_RATES,
      });

      setError(null);
      setLoading(false);
      return;
    }

    fetchWallet();
  }, [authLoading, isAuthenticated, fetchWallet]);

  const mockDeposit = useCallback(
    (
      currencyCode: CurrencyCode,
      amount: number,
    ) => {
      setWallet((previousWallet) => ({
        ...previousWallet,

        balances: previousWallet.balances.map(
          (balance) =>
            balance.currency.code === currencyCode
              ? {
                  ...balance,
                  amount: balance.amount + amount,
                }
              : balance,
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
          ...previousWallet.recentMovements,
        ],
      }));
    },
    [],
  );

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
      setWallet((previousWallet) => ({
        ...previousWallet,

        balances: previousWallet.balances.map(
          (balance) =>
            balance.currency.code === currencyCode
              ? {
                  ...balance,
                  amount: balance.amount - amount,
                }
              : balance,
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
          ...previousWallet.recentMovements,
        ],
      }));
    },
    [],
  );

  return (
    <WalletContext.Provider
      value={{
        wallet,
        loading,
        error,
        refetch: fetchWallet,
        mockDeposit,
        mockTransfer,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
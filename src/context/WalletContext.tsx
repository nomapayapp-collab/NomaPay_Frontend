import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type {
  CurrencyCode,
  MovementStatus,
  MovementType,
  RecentMovement,
  Wallet,
  WalletSummary,
} from "../types/wallet";
import type { HistoryItem, HistoryOperationType } from "../types/history";

import * as authService from "../services/authService";
import { getHistory } from "../services/historyService";
import { FALLBACK_RATES, getCurrentExchangeRates } from "../services/exchangeRates";
import { isPositive } from "../hooks/useHistory";
import { useAuth } from "../hooks/useAuth";

type WalletContextValue = {
  wallet: Wallet;
  loading: boolean;
  error: string | null;
  refetch: () => void;

  // pega al PATCH /wallets/me/preferred-currency real y actualiza el
  // wallet en memoria con la respuesta del back (sin pisar exchangeRates
  // ni recentMovements, que esa ruta no devuelve).
  setPreferredCurrency: (currencyCode: CurrencyCode) => Promise<void>;

  // pega al POST /wallets/deposit real: el back valida el límite máximo
  // por moneda y devuelve la transacción creada + el wallet actualizado.
  // recentMovements se refresca del historial real (GET /history) después,
  // en vez de agregar una fila inventada localmente.
  deposit: (currencyCode: CurrencyCode, amount: number) => Promise<void>;
};

export const WalletContext = createContext<
  WalletContextValue | undefined
>(undefined);

const EMPTY_WALLET: Wallet = {
  balances: [],
  exchangeRates: FALLBACK_RATES,
  recentMovements: [],
};

// misma conversión "balances del back -> balances del front" que usaba
// fetchWallet, ahora reutilizable también por setPreferredCurrency (esa
// ruta devuelve el mismo shape de WalletSummary).
function mapBalances(summary: WalletSummary): Wallet["balances"] {
  return summary.balances.map((balance) => ({
    currency: {
      code: balance.currencyCode,
      name: balance.currencyName,
      symbol: balance.symbol ?? "",
    },
    amount: Number(balance.amount),
    isPrimary: balance.currencyCode === summary.preferredCurrency,
  }));
}

// GET /history usa "pago" para una transferencia enviada; el resto de esta
// pantalla (RecentMovements/Wallet) todavía habla de "envio" — mismo
// concepto, dos nombres históricos.
const MOVEMENT_TYPE: Record<HistoryOperationType, MovementType> = {
  carga: "carga",
  cobro: "cobro",
  pago: "envio",
  cambio: "cambio",
};

function movementDescription(item: HistoryItem): string {
  switch (item.operationType) {
    case "cambio":
      return item.exchangeData
        ? `Cambio ${item.exchangeData.currencyOrigin} → ${item.exchangeData.currencyDestination}`
        : "Cambio de moneda";
    case "pago":
      return item.counterparty ? `Envío a ${item.counterparty.name}` : "Transferencia enviada";
    case "cobro":
      return item.counterparty ? `Recibido de ${item.counterparty.name}` : "Transferencia recibida";
    case "carga":
      return "Carga de saldo";
  }
}

function movementDetail(item: HistoryItem): string | undefined {
  if ((item.operationType === "pago" || item.operationType === "cobro") && item.counterparty) {
    return item.counterparty.alias;
  }
  if (item.operationType === "cambio" && item.exchangeData && item.amount > 0) {
    const rate = item.exchangeData.finalAmount / item.amount;
    return `Tasa ${rate.toLocaleString("es-AR", { maximumFractionDigits: 4 })}`;
  }
  return undefined;
}

function movementStatus(item: HistoryItem): MovementStatus {
  switch (item.status) {
    case "pending":
      return "pendiente";
    case "cancelled":
      return "cancelada";
    case "rejected":
      return "rechazada";
    case "completed":
      // mismo criterio que History.tsx: una entrada de plata "completed" se
      // etiqueta Acreditado, el resto Completado.
      return isPositive(item) ? "acreditado" : "completado";
  }
}


function mapHistoryToMovements(items: HistoryItem[]): RecentMovement[] {
  return items.map((item) => ({
    id: `history-${item.id}`,
    type: MOVEMENT_TYPE[item.operationType],
    description: movementDescription(item),
    detail: movementDetail(item),
    status: movementStatus(item),
    amount: isPositive(item) ? item.amount : -item.amount,
    currency: item.currencyCode,
    date: item.transactionDate,
  }));
}


async function fetchRecentMovements(): Promise<RecentMovement[]> {
  try {
    return mapHistoryToMovements(await getHistory());
  } catch {
    return [];
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
    useState<Wallet>(EMPTY_WALLET);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallet = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [summary, exchangeRates, recentMovements] = await Promise.all([
        authService.getMyWallet(),
        getCurrentExchangeRates(),
        fetchRecentMovements(),
      ]);

      setWallet({
        balances: mapBalances(summary),
        exchangeRates,
        recentMovements,
      });
    } catch {
      setError(
        "No pudimos cargar tu saldo. Probá de nuevo en un rato.",
      );

      setWallet(EMPTY_WALLET);
    } finally {
      setLoading(false);
    }
  }, []);

  const setPreferredCurrency = useCallback(
    async (currencyCode: CurrencyCode) => {
      const summary = await authService.updatePreferredCurrency(currencyCode);

      setWallet((previousWallet) => ({
        ...previousWallet,
        balances: mapBalances(summary),
      }));
    },
    [],
  );

  const deposit = useCallback(
    async (currencyCode: CurrencyCode, amount: number) => {
      const result = await authService.depositFunds(currencyCode, amount);

      // el saldo lo tenemos de una en la respuesta del POST; el historial
      // lo volvemos a pedir para que la fila nueva salga con sus datos
      // reales (id, fecha, estado) en vez de armarla nosotros.
      const recentMovements = await fetchRecentMovements();

      setWallet((previousWallet) => ({
        ...previousWallet,
        balances: mapBalances(result.wallet),
        recentMovements,
      }));
    },
    [],
  );

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      setWallet(EMPTY_WALLET);
      setError(null);
      setLoading(false);
      return;
    }

    fetchWallet();
  }, [authLoading, isAuthenticated, fetchWallet]);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        loading,
        error,
        refetch: fetchWallet,
        setPreferredCurrency,
        deposit,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

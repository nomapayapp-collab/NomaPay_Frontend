import { useEffect, useMemo, useState } from "react";
import { getHistory } from "../services/historyService";
import { monthKey } from "../utils/formatDate";
import type { HistoryItem, HistoryOperationType } from "../types/history";
import type { CurrencyCode } from "../types/wallet";

export type HistoryTypeFilterKey = "todos" | "cargas" | "transferencias" | "cambios";

export const HISTORY_TYPE_FILTERS: { key: HistoryTypeFilterKey; label: string; types?: HistoryOperationType[] }[] = [
  { key: "todos", label: "Todos" },
  { key: "cargas", label: "Cargas", types: ["carga"] },
  { key: "transferencias", label: "Transferencias", types: ["pago", "cobro"] },
  { key: "cambios", label: "Cambios", types: ["cambio"] },
];

// Monedas que soporta la cuenta — fijas (no se derivan de los items) porque
// el usuario tiene que poder elegir "mostrame mi resumen en ARS" en el
// panel de Resumen aunque no haya tenido ningún movimiento en ARS en el
// período filtrado (esa moneda simplemente se ve en $0 / 0 mov.).
export const SUMMARY_CURRENCIES: CurrencyCode[] = ["USD", "ARS", "BRL"];

const PAGE_SIZE = 8;

/** entra plata (carga/cobro) vs sale plata (pago/cambio) — lo usan tanto el resumen acá como los colores/signos en History.tsx. */
export function isPositive(item: HistoryItem): boolean {
  return item.operationType === "carga" || item.operationType === "cobro";
}

function searchableText(item: HistoryItem): string {
  const parts = [item.operationType, String(item.id), item.currencyCode];
  if (item.counterparty) parts.push(item.counterparty.name);
  if (item.exchangeData) parts.push(item.exchangeData.currencyOrigin, item.exchangeData.currencyDestination);
  return parts.join(" ").toLowerCase();
}

/** cantidad de movimientos + monto acumulado de una moneda dentro de una sección del resumen (Entradas/Salidas/Cambios). */
export type CurrencySummaryEntry = { count: number; total: number };

function addEntry(map: Map<CurrencyCode, CurrencySummaryEntry>, code: CurrencyCode, amount: number) {
  const current = map.get(code) ?? { count: 0, total: 0 };
  map.set(code, { count: current.count + 1, total: current.total + amount });
}

/**
 * Todo el estado y la lógica de la pantalla de Historial: fetch, filtros
 * (tipo/mes/búsqueda), paginado, expandir/colapsar fila y los cálculos del
 * panel de Resumen. History.tsx se queda solo con el JSX — mismo criterio
 * que useExchangeForm con Exchange.tsx.
 *
 * Es un hook, no un Context: nadie más que la pantalla de Historial
 * necesita este estado — a diferencia de useAuth/useWallet, que sí viven
 * en Context porque Header, Sidebar, TopTabBar, Wallet, Transfer, etc.
 * leen todos el mismo user/wallet al mismo tiempo. Un Context acá sería
 * indirección de más sin ningún consumidor extra que la justifique.
 *
 * `defaultSummaryCurrency` es la moneda con la que arranca seleccionado el
 * panel de Resumen (los filtros USD/ARS/BRL de ahí) — la pantalla le pasa
 * la moneda favorita del usuario (useWallet) para que abra ya mostrando
 * "su" resumen, sin forzar al usuario a elegirla la primera vez.
 */
export function useHistory(defaultSummaryCurrency: CurrencyCode = "USD") {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [typeFilter, setTypeFilter] = useState<HistoryTypeFilterKey>("todos");
  const [monthFilter, setMonthFilter] = useState<string>("todos");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [summaryCurrency, setSummaryCurrency] = useState<CurrencyCode>(defaultSummaryCurrency);

  useEffect(() => {
    let cancelled = false;
    getHistory()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch(() => {
        if (!cancelled) setError("No pudimos cargar tu historial. Probá de nuevo en un rato.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Si cambia cualquier filtro, volvemos a la página 1 — si no, se podría
  // quedar en una página que ya no existe para el nuevo resultado filtrado.
  useEffect(() => {
    setPage(1);
  }, [typeFilter, monthFilter, search]);

  const availableMonths = useMemo(
    () => Array.from(new Set(items.map((item) => monthKey(item.transactionDate)))).sort().reverse(),
    [items],
  );

  const filteredItems = useMemo(() => {
    const activeTypeFilter = HISTORY_TYPE_FILTERS.find((f) => f.key === typeFilter)!;
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      if (activeTypeFilter.types && !activeTypeFilter.types.includes(item.operationType)) return false;
      if (monthFilter !== "todos" && monthKey(item.transactionDate) !== monthFilter) return false;
      if (query && !searchableText(item).includes(query)) return false;
      return true;
    });
  }, [items, typeFilter, monthFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  // Ojo acá: pageItems tiene que estar memoizado (y no ser un simple
  // .slice() suelto en el render) porque summary/byType más abajo no
  // dependen de él, pero si alguna otra parte llegara a depender de
  // pageItems con su propio useMemo, un array nuevo en cada render rompe
  // esa memoización — siempre "cambió" aunque el contenido sea el mismo.
  const pageItems = useMemo(
    () => filteredItems.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filteredItems, currentPage],
  );

  // Un Map por moneda (no un total convertido/sumado) en cada sección: cada
  // moneda de la cuenta se muestra por separado, nunca mezclada ni
  // convertida con la cotización del día — mostraría un total que no
  // representa lo que realmente pasó. History.tsx elige qué moneda mostrar
  // con summaryCurrency (los filtros USD/ARS/BRL de la card).
  const summary = useMemo(() => {
    const entradas = new Map<CurrencyCode, CurrencySummaryEntry>();
    const salidas = new Map<CurrencyCode, CurrencySummaryEntry>();
    const cambios = new Map<CurrencyCode, CurrencySummaryEntry>();
    const comisiones = new Map<CurrencyCode, number>();
    let hasFeeData = false; // el back todavía no manda `fee` en todos los items

    for (const item of filteredItems) {
      if (item.status === "rejected" || item.status === "cancelled") continue; // no impactan el saldo real

      if (item.operationType === "cambio") {
        addEntry(cambios, item.currencyCode, item.amount);
      }

      if (isPositive(item)) {
        addEntry(entradas, item.currencyCode, item.amount);
      } else {
        addEntry(salidas, item.currencyCode, item.amount);
      }

      if (item.fee !== undefined) {
        hasFeeData = true;
        comisiones.set(item.currencyCode, (comisiones.get(item.currencyCode) ?? 0) + item.fee);
      }
    }

    return {
      entradas,
      salidas,
      cambios,
      // null (no la fila) hasta que el back mande fee en al menos un item —
      // mismo criterio que counterparty/fee en el resto de la pantalla.
      comisiones: hasFeeData ? comisiones : null,
    };
  }, [filteredItems]);

  const byType = useMemo(() => {
    const counts: Record<HistoryOperationType, number> = { carga: 0, pago: 0, cobro: 0, cambio: 0 };
    for (const item of filteredItems) counts[item.operationType] += 1;
    const total = filteredItems.length || 1;
    return (["cobro", "pago", "carga", "cambio"] as HistoryOperationType[])
      .filter((type) => counts[type] > 0)
      .map((type) => ({ type, count: counts[type], pct: Math.round((counts[type] / total) * 100) }));
  }, [filteredItems]);

  function toggleExpanded(id: number) {
    setExpandedId((current) => (current === id ? null : id));
  }

  return {
    loading,
    error,
    hasAnyItems: items.length > 0,
    hasResults: filteredItems.length > 0,

    typeFilter,
    setTypeFilter,
    monthFilter,
    setMonthFilter,
    availableMonths,
    search,
    setSearch,

    pageItems,
    totalFilteredCount: filteredItems.length,
    currentPage,
    totalPages,
    setPage,

    expandedId,
    toggleExpanded,

    summary,
    summaryCurrency,
    setSummaryCurrency,
    byType,
  };
}

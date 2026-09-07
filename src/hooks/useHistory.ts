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
 */
export function useHistory() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [typeFilter, setTypeFilter] = useState<HistoryTypeFilterKey>("todos");
  const [monthFilter, setMonthFilter] = useState<string>("todos");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [page, setPage] = useState(1);

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

  const summary = useMemo(() => {
    const entradas = new Map<CurrencyCode, number>();
    const salidas = new Map<CurrencyCode, number>();
    const cambios = new Map<CurrencyCode, number>();
    const comisiones = new Map<CurrencyCode, number>();
    let entradasCount = 0;
    let salidasCount = 0;
    let cambiosCount = 0;
    let hasFeeData = false; // el back todavía no manda `fee` en todos los items

    for (const item of filteredItems) {
      if (item.status === "rejected" || item.status === "cancelled") continue; // no impactan el saldo real

      if (item.operationType === "cambio") {
        cambiosCount += 1;
        cambios.set(item.currencyCode, (cambios.get(item.currencyCode) ?? 0) + item.amount);
      }

      if (isPositive(item)) {
        entradasCount += 1;
        entradas.set(item.currencyCode, (entradas.get(item.currencyCode) ?? 0) + item.amount);
      } else {
        salidasCount += 1;
        salidas.set(item.currencyCode, (salidas.get(item.currencyCode) ?? 0) + item.amount);
      }

      if (item.fee !== undefined) {
        hasFeeData = true;
        comisiones.set(item.currencyCode, (comisiones.get(item.currencyCode) ?? 0) + item.fee);
      }
    }

    return {
      entradas: { count: entradasCount, totals: entradas },
      salidas: { count: salidasCount, totals: salidas },
      cambios: { count: cambiosCount, totals: cambios },
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
    byType,
  };
}

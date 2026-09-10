import { useEffect, useMemo, useState } from "react";
import { getHistory } from "../services/historyService";
import type { HistoryItem } from "../types/history";
import type { CurrencyCode } from "../types/wallet";

export type SummaryCategory = "entradas" | "salidas" | "cambios";

export type CategoryTotal = { count: number; total: number };

export type DaySummary = {
  key: string; // "2026-09-01"
  label: string; // "Lun"
  entradas: number;
  salidas: number;
  cambios: number;
  entradasCount: number;
};

export type BestDay = {
  label: string; // "jueves"
  total: number;
  count: number;
} | null;

export type SummaryComparison = {
  // null = la semana pasada no tuvo movimientos de esa categoría, así que
  // no hay con qué comparar (mostrar "%" ahí sería inventar un número).
  entradasPct: number | null;
  salidasPct: number | null;
  cambiosDelta: number;
};

// Resumen semanal ya calculado para UNA moneda puntual.
export type CurrencySummary = {
  days: DaySummary[];
  thisWeek: Record<SummaryCategory, CategoryTotal>;
  bestDay: BestDay;
  comparison: SummaryComparison;
  netThisWeek: number;
  hasMovementsThisWeek: boolean;
};

// Las 3 monedas que maneja la cuenta. Mismo orden en el que se muestran en
// Billetera/Dashboard.
export const CURRENCIES: CurrencyCode[] = ["ARS", "USD", "BRL"];

const DAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const FULL_DAY_NAMES = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 = domingo
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}


function dayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function pctChange(current: number, previous: number): number | null {
  if (previous <= 0) return null;
  return ((current - previous) / previous) * 100;
}

type CurrencyEffect = { category: SummaryCategory; amount: number; balanceDelta: number };

// Traduce un movimiento del historial al efecto que tuvo sobre UNA moneda
// puntual. Antes esto se llamaba "primaryEffect" y solo se evaluaba contra
// la moneda favorita del usuario; ahora se evalúa una vez por cada una de
// las 3 monedas para poder armar el resumen completo.
function currencyEffect(item: HistoryItem, currency: CurrencyCode): CurrencyEffect | null {
  if (item.status === "rejected" || item.status === "cancelled") return null; // no impactan el saldo real

  if (item.operationType === "cambio") {
    if (item.currencyCode === currency) {
      return { category: "cambios", amount: item.amount, balanceDelta: -item.amount };
    }
    if (item.exchangeData?.currencyDestination === currency) {
      return { category: "cambios", amount: item.exchangeData.finalAmount, balanceDelta: item.exchangeData.finalAmount };
    }
    return null; // cambio entre otras dos monedas, no toca esta
  }

  if (item.currencyCode !== currency) return null;

  if (item.operationType === "carga" || item.operationType === "cobro") {
    return { category: "entradas", amount: item.amount, balanceDelta: item.amount };
  }
  return { category: "salidas", amount: item.amount, balanceDelta: -item.amount }; // pago
}

function summarizeCurrency(
  items: HistoryItem[],
  currency: CurrencyCode,
  weekStart: Date,
  prevWeekStart: Date,
): CurrencySummary {
  const days: DaySummary[] = Array.from({ length: 7 }, (_, i) => ({
    key: dayKey(addDays(weekStart, i)),
    label: DAY_LABELS[i],
    entradas: 0,
    salidas: 0,
    cambios: 0,
    entradasCount: 0,
  }));
  const daysByKey = new Map(days.map((d) => [d.key, d]));

  const thisWeek: Record<SummaryCategory, CategoryTotal> = {
    entradas: { count: 0, total: 0 },
    salidas: { count: 0, total: 0 },
    cambios: { count: 0, total: 0 },
  };
  const lastWeek: Record<SummaryCategory, CategoryTotal> = {
    entradas: { count: 0, total: 0 },
    salidas: { count: 0, total: 0 },
    cambios: { count: 0, total: 0 },
  };

  let netThisWeek = 0;

  for (const item of items) {
    const effect = currencyEffect(item, currency);
    if (!effect) continue;

    const date = new Date(item.transactionDate);
    const isThisWeek = date >= weekStart;
    const isLastWeek = !isThisWeek && date >= prevWeekStart && date < weekStart;
    if (!isThisWeek && !isLastWeek) continue;

    const bucket = isThisWeek ? thisWeek[effect.category] : lastWeek[effect.category];
    bucket.count += 1;
    bucket.total += effect.amount;

    if (isThisWeek) {
      netThisWeek += effect.balanceDelta;
      const day = daysByKey.get(dayKey(date));
      if (day) {
        day[effect.category] += effect.amount;
        if (effect.category === "entradas") day.entradasCount += 1;
      }
    }
  }

  let bestDay: BestDay = null;
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    if (day.entradas > 0 && (!bestDay || day.entradas > bestDay.total)) {
      bestDay = { label: FULL_DAY_NAMES[i], total: day.entradas, count: day.entradasCount };
    }
  }

  const comparison: SummaryComparison = {
    entradasPct: pctChange(thisWeek.entradas.total, lastWeek.entradas.total),
    salidasPct: pctChange(thisWeek.salidas.total, lastWeek.salidas.total),
    cambiosDelta: thisWeek.cambios.count - lastWeek.cambios.count,
  };

  const hasMovementsThisWeek = thisWeek.entradas.count + thisWeek.salidas.count + thisWeek.cambios.count > 0;

  return { days, thisWeek, bestDay, comparison, netThisWeek, hasMovementsThisWeek };
}

// Trae el historial una sola vez y arma el resumen semanal para las 3
// monedas de la cuenta (antes se armaba solo para la moneda favorita). El
// componente que consuma esto elige con qué moneda de `summaries` quedarse.
export function useSummary() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getHistory()
      .then((data) => {
        if (!cancelled) setItems(data);
      })
      .catch(() => {
        if (!cancelled) setError("No pudimos cargar tu resumen. Probá de nuevo en un rato.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const { weekStart, summaries } = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const prevWeekStart = addDays(weekStart, -7);

    const summaries = Object.fromEntries(
      CURRENCIES.map((code) => [code, summarizeCurrency(items, code, weekStart, prevWeekStart)]),
    ) as Record<CurrencyCode, CurrencySummary>;

    return { weekStart, summaries };
  }, [items]);

  return { loading, error, weekStart, summaries };
}

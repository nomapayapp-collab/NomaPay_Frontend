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

// Fecha local (no UTC): weekStart/addDays de arriba ya trabajan en hora
// local, así que agrupar acá con toISOString() (UTC) desalinearía cualquier
// movimiento de la noche — en ART, un movimiento de las 22:00 es "01:00 UTC
// del día siguiente", y terminaría en el día (o hasta la semana) que no es.
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

type PrimaryEffect = { category: SummaryCategory; amount: number; balanceDelta: number };

/**
 * Traduce un HistoryItem crudo a su efecto sobre la moneda primaria del
 * usuario. Ojo con "cambio": GET /history solo manda currencyCode/amount
 * del lado ORIGEN (currencyOrigin) — el lado destino vive en
 * exchangeData.currencyDestination/finalAmount. Si no miramos las dos
 * puntas por separado, un cambio que convierte HACIA la moneda primaria
 * (ej. USD → ARS con ARS de primaria) nunca se contaría como entrada, y
 * el "balance de hace una semana" quedaría mal calculado.
 */
function primaryEffect(item: HistoryItem, primary: CurrencyCode): PrimaryEffect | null {
  if (item.status === "rejected" || item.status === "cancelled") return null; // no impactan el saldo real

  if (item.operationType === "cambio") {
    if (item.currencyCode === primary) {
      return { category: "cambios", amount: item.amount, balanceDelta: -item.amount };
    }
    if (item.exchangeData?.currencyDestination === primary) {
      return { category: "cambios", amount: item.exchangeData.finalAmount, balanceDelta: item.exchangeData.finalAmount };
    }
    return null; // cambio entre otras dos monedas, no toca la primaria
  }

  if (item.currencyCode !== primary) return null;

  if (item.operationType === "carga" || item.operationType === "cobro") {
    return { category: "entradas", amount: item.amount, balanceDelta: item.amount };
  }
  return { category: "salidas", amount: item.amount, balanceDelta: -item.amount }; // pago
}

/**
 * Todo el cálculo real de la pantalla de Resumen (balance semanal, entradas/
 * salidas/cambios, gráfico por día, mejor día, comparación con la semana
 * pasada) a partir de GET /history — mismo patrón que useHistory.ts, pero
 * agrupado por semana calendario (lunes a domingo) en vez de por filtros.
 *
 * `primaryCurrency` la pasa Summary.tsx (la moneda favorita del wallet),
 * igual que History.tsx le pasa la suya a useHistory(). Todo se calcula en
 * esa única moneda — no se convierte ni se mezcla con otras, mismo criterio
 * que el resumen de Historial.
 */
export function useSummary(primaryCurrency: CurrencyCode) {
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

  const computed = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const prevWeekStart = addDays(weekStart, -7);

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
      const effect = primaryEffect(item, primaryCurrency);
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

    return { weekStart, days, thisWeek, bestDay, comparison, netThisWeek, hasMovementsThisWeek };
  }, [items, primaryCurrency]);

  return { loading, error, ...computed };
}

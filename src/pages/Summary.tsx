import { Header } from "../components/layout/Header";
import { Card } from "../components/ui/Card";
import { useWallet } from "../hooks/useWallet";
import { useSummary, type DaySummary, type SummaryCategory } from "../hooks/useSummary";
import { formatCurrency } from "../utils/formatCurrency";

const balanceFormatter = new Intl.NumberFormat("es-AR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural;
}

function formatWeekRange(start: Date): string {
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString("es-AR", { day: "2-digit", month: "short" }).replace(".", "");
  return `Semana del ${fmt(start)} al ${fmt(end)}`;
}

function formatPct(pct: number): { label: string; positive: boolean } {
  const rounded = Math.round(pct);
  return { label: `${rounded > 0 ? "+" : rounded < 0 ? "−" : ""}${Math.abs(rounded)}%`, positive: rounded >= 0 };
}

export default function Summary() {
  const { wallet, loading: walletLoading } = useWallet();

  const primaryBalance = wallet.balances.find((balance) => balance.isPrimary);
  const balanceCode = primaryBalance?.currency.code ?? "ARS";

  const {
    loading: summaryLoading,
    error,
    weekStart,
    days,
    thisWeek,
    bestDay,
    comparison,
    netThisWeek,
    hasMovementsThisWeek,
  } = useSummary(balanceCode);

  const loading = walletLoading || summaryLoading;
  const currentBalance = primaryBalance?.amount ?? 0;
  const balanceAtWeekStart = currentBalance - netThisWeek;
  const balancePct = balanceAtWeekStart > 0 ? ((currentBalance - balanceAtWeekStart) / balanceAtWeekStart) * 100 : null;

  const maxDayValue = Math.max(1, ...days.flatMap((day) => [day.entradas, day.salidas, day.cambios]));
  const maxCategoryTotal = Math.max(1, thisWeek.entradas.total, thisWeek.salidas.total, thisWeek.cambios.total);

  return (
    <main className=" px-5 pt-8 pb-8 sm:px-6 lg:px-10 lg:py-8 max-w-md lg:max-w-none w-full mx-auto
        text-text-light-primary dark:text-text-dark-primary
        xl:grid xl:min-h-dvh xl:grid-rows-[auto_auto_minmax(0,1fr)]
        xl:gap-4
      "
    >
      {/* Encabezado */}
      <div className="mb-5 xl:mb-0">
        <Header title="Resumen" subtitle={formatWeekRange(weekStart)} />
      </div>

      {/* Balance general */}
      <Card variant="aura" className="mb-5 overflow-hidden p-0 xl:mb-0">
        <div className="grid grid-cols-1 xl:h-33.5 xl:grid-cols-[1.1fr_2fr]">
          <div className="flex flex-col justify-center p-5 xl:border-r xl:border-white/10 xl:px-8 xl:py-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-text-light-tertiary dark:text-violet-200">
              Balance total
            </p>

            <p aria-live="polite" className="mt-2 text-3xl font-extrabold tracking-tight">
              {loading ? "Cargando..." : `${balanceCode} ${balanceFormatter.format(currentBalance)}`}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              {!loading &&
                (balancePct === null ? (
                  <span className="text-text-light-tertiary dark:text-slate-300">Sin datos de la semana pasada</span>
                ) : (
                  <>
                    <span
                      className={`font-bold ${formatPct(balancePct).positive ? "text-cyan-500 dark:text-cyan-300" : "text-magenta-500"
                        }`}
                    >
                      {formatPct(balancePct).positive ? "↗" : "↘"} {formatPct(balancePct).label}
                    </span>
                    <span className="text-text-light-tertiary dark:text-slate-300">vs semana pasada</span>
                  </>
                ))}
            </div>
          </div>

          <div className="grid grid-cols-1 bg-white/20 dark:bg-[#0d122e]/75 sm:grid-cols-3">
            <BalanceDetail
              title="Entradas"
              value={loading ? "—" : `+${balanceFormatter.format(thisWeek.entradas.total)}`}
              detail={
                loading
                  ? ""
                  : `${thisWeek.entradas.count} ${pluralize(thisWeek.entradas.count, "movimiento", "movimientos")}`
              }
              color="#22d8d2"
            />

            <BalanceDetail
              title="Salidas"
              value={loading ? "—" : `-${balanceFormatter.format(thisWeek.salidas.total)}`}
              detail={
                loading
                  ? ""
                  : `${thisWeek.salidas.count} ${pluralize(thisWeek.salidas.count, "movimiento", "movimientos")}`
              }
              color="#ff3b8d"
            />

            <BalanceDetail
              title="Cambios"
              value={loading ? "—" : balanceFormatter.format(thisWeek.cambios.total)}
              detail={
                loading
                  ? ""
                  : `${thisWeek.cambios.count} ${pluralize(thisWeek.cambios.count, "operación", "operaciones")}`
              }
              color="#cba7ff"
            />
          </div>
        </div>
      </Card>

      {/* Contenido principal */}
      <div
        className="
          grid min-h-0 grid-cols-1 gap-5
          xl:grid-cols-[minmax(0,4.2fr)_minmax(240px,1fr)]
          xl:grid-rows-[minmax(0,1fr)_auto]
        "
      >
        {/* Gráfico */}
        <Card variant="elevated" className="min-h-0 min-w-0 p-5 xl:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-bold">Entradas, salidas y cambios por día</h2>

            <div className="flex flex-wrap gap-4 text-xs text-text-light-secondary dark:text-text-dark-secondary">
              <ChartLegend color="#22d8d2" label="Entradas" />
              <ChartLegend color="#ff2d85" label="Salidas" />
              <ChartLegend color="#7937ff" label="Cambios" />
            </div>
          </div>

          {loading ? (
            <div className="mt-5 flex h-85 items-center justify-center text-sm text-text-light-tertiary dark:text-text-dark-tertiary xl:h-[calc(100%-44px)]">
              Cargando...
            </div>
          ) : error ? (
            <div className="mt-5 flex h-85 items-center justify-center text-center text-sm text-magenta-500 xl:h-[calc(100%-44px)]">
              {error}
            </div>
          ) : !hasMovementsThisWeek ? (
            <div className="mt-5 flex h-85 items-center justify-center text-center text-sm text-text-light-tertiary dark:text-text-dark-tertiary xl:h-[calc(100%-44px)]">
              Todavía no tenés movimientos esta semana.
            </div>
          ) : (
            <div
              className="
                mt-5 flex h-85 items-end justify-between gap-2
                sm:gap-4
                xl:h-[calc(100%-44px)] xl:min-h-0
              "
              aria-label="Gráfico semanal de movimientos"
            >
              {days.map((day) => (
                <DayColumn key={day.key} day={day} maxValue={maxDayValue} />
              ))}
            </div>
          )}
        </Card>

        {/* Mejor día y aviso semanal */}
        <div className="flex min-h-0 flex-col gap-4">
          <Card
            variant="default"
            className="
              flex min-h-60 flex-1 items-center
              border-cyan-500 bg-linear-to-br
              from-[#21155e] via-[#342380] to-[#16295d]
              p-6 text-white xl:min-h-0
            "
          >
            {loading ? (
              <p className="text-sm text-slate-200">Cargando...</p>
            ) : bestDay ? (
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-4 py-2 text-[11px] font-extrabold uppercase tracking-wider text-[#071329]">
                  ↗ Mejor día
                </span>

                <p className="mt-5 text-2xl font-extrabold leading-tight">
                  Tu mejor día fue el <span className="text-cyan-300">{bestDay.label}</span>
                </p>

                <p className="mt-4 text-sm leading-relaxed text-slate-100">
                  Entraron {formatCurrency(bestDay.total, balanceCode)} por {bestDay.count}{" "}
                  {pluralize(bestDay.count, "movimiento de entrada", "movimientos de entrada")}.
                </p>
              </div>
            ) : (
              <div>
                <p className="text-2xl font-extrabold leading-tight">Todavía sin entradas esta semana</p>
                <p className="mt-4 text-sm leading-relaxed text-slate-100">
                  Apenas recibas un ingreso o hagas una carga, vas a ver acá cuál fue tu mejor día.
                </p>
              </div>
            )}
          </Card>

          {/* Solo informativo: no envía correos */}
          <div className="shrink-0 rounded-xl border border-violet-400/50 bg-violet-500/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <MailIcon />

              <div>
                <p className="text-sm font-bold text-text-light-primary dark:text-text-dark-primary">Resumen semanal por correo</p>

                <p className="mt-1 text-xs leading-relaxed text-text-light-secondary dark:text-text-dark-secondary">
                  Recibirás automáticamente tu resumen todos los domingos en tu correo electrónico registrado.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Desglose */}
        <Card variant="elevated" className="min-h-0 p-4">
          <h2 className="text-sm font-bold text-text-light-primary dark:text-text-dark-primary">Desglose por tipo</h2>

          <div className="mt-3 space-y-2.5">
            <SummaryRow
              title="Entradas"
              detail={loading ? "" : `${thisWeek.entradas.count} ${pluralize(thisWeek.entradas.count, "movimiento", "movimientos")}`}
              value={loading ? "—" : `+${balanceFormatter.format(thisWeek.entradas.total)}`}
              color="#22d8d2"
              percentage={loading ? 0 : Math.round((thisWeek.entradas.total / maxCategoryTotal) * 100)}
            />

            <SummaryRow
              title="Salidas"
              detail={loading ? "" : `${thisWeek.salidas.count} ${pluralize(thisWeek.salidas.count, "movimiento", "movimientos")}`}
              value={loading ? "—" : `-${balanceFormatter.format(thisWeek.salidas.total)}`}
              color="#ff2d85"
              percentage={loading ? 0 : Math.round((thisWeek.salidas.total / maxCategoryTotal) * 100)}
            />

            <SummaryRow
              title="Cambios"
              detail={loading ? "" : `${thisWeek.cambios.count} ${pluralize(thisWeek.cambios.count, "operación", "operaciones")}`}
              value={loading ? "—" : balanceFormatter.format(thisWeek.cambios.total)}
              color="#7937ff"
              percentage={loading ? 0 : Math.round((thisWeek.cambios.total / maxCategoryTotal) * 100)}
            />
          </div>
        </Card>

        {/* Comparación */}
        <Card variant="elevated" className="min-h-0 p-4">
          <h2 className="text-sm font-bold text-text-light-primary dark:text-text-dark-primary">Comparado con la semana pasada</h2>

          <div className="mt-2 divide-y divide-border-light dark:divide-border-dark">
            <ComparisonRow
              label="Entradas"
              value={comparison.entradasPct === null ? "Sin datos" : formatPct(comparison.entradasPct).label}
              color={comparison.entradasPct !== null && !formatPct(comparison.entradasPct).positive ? "#ff2d85" : "#22d8d2"}
            />

            <ComparisonRow
              label="Salidas"
              value={comparison.salidasPct === null ? "Sin datos" : formatPct(comparison.salidasPct).label}
              color={comparison.salidasPct !== null && !formatPct(comparison.salidasPct).positive ? "#22d8d2" : "#ff2d85"}
            />

            <ComparisonRow
              label="Cambios"
              value={
                comparison.cambiosDelta === 0
                  ? "Sin cambios"
                  : `${comparison.cambiosDelta > 0 ? "+" : "−"}${Math.abs(comparison.cambiosDelta)} ${pluralize(
                    Math.abs(comparison.cambiosDelta),
                    "operación",
                    "operaciones",
                  )}`
              }
              color="#cba7ff"
            />
          </div>
        </Card>
      </div>
    </main>
  );
}

type DayColumnProps = {
  day: DaySummary;
  maxValue: number;
};

const CATEGORY_COLOR: Record<SummaryCategory, string> = {
  entradas: "#22d8d2",
  salidas: "#ff2d85",
  cambios: "#7937ff",
};

function DayColumn({ day, maxValue }: DayColumnProps) {
  const today = new Date();
  const isToday = day.key === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col justify-end">
      <div className="flex min-h-0 flex-1 items-end justify-center gap-1 sm:gap-2">
        <ChartBar
          label={`${day.label}: entradas ${balanceFormatter.format(day.entradas)}`}
          height={(day.entradas / maxValue) * 100}
          color={CATEGORY_COLOR.entradas}
        />

        <ChartBar
          label={`${day.label}: salidas ${balanceFormatter.format(day.salidas)}`}
          height={(day.salidas / maxValue) * 100}
          color={CATEGORY_COLOR.salidas}
        />

        <ChartBar
          label={`${day.label}: cambios ${balanceFormatter.format(day.cambios)}`}
          height={(day.cambios / maxValue) * 100}
          color={CATEGORY_COLOR.cambios}
        />
      </div>

      <div
        className={`mt-3 border-t border-border-light dark:border-border-dark pt-2 text-center text-xs font-semibold ${isToday ? "text-text-light-primary dark:text-text-dark-primary" : "text-text-light-tertiary dark:text-text-dark-tertiary"
          }`}
      >
        {/* Mobile: solo la inicial (L, M, M, J...) para que las 7 columnas
            entren sin apretarse. Desktop (sm+): abreviatura completa. */}
        <span className="sm:hidden">{day.label.charAt(0)}</span>
        <span className="hidden sm:inline">{day.label}</span>
      </div>
    </div>
  );
}

type BalanceDetailProps = {
  title: string;
  value: string;
  detail: string;
  color: string;
};

function BalanceDetail({ title, value, detail, color }: BalanceDetailProps) {
  return (
    <div className="flex flex-col justify-center border-t border-border-light dark:border-white/10 p-5 sm:border-l sm:border-t-0 xl:px-6 xl:py-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em]" style={{ color }}>
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold">{value}</p>

      <p className="mt-1 text-xs text-text-light-tertiary dark:text-slate-400">{detail}</p>
    </div>
  );
}

type SummaryRowProps = {
  title: string;
  detail: string;
  value: string;
  color: string;
  percentage: number;
};

function SummaryRow({ title, detail, value, color, percentage }: SummaryRowProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 text-xs">
          <span className="font-bold text-text-light-primary dark:text-text-dark-primary">{title}</span>

          <span className="ml-1 text-text-light-tertiary dark:text-text-dark-tertiary">· {detail}</span>
        </p>

        <span className="shrink-0 text-xs font-extrabold" style={{ color }}>
          {value}
        </span>
      </div>

      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/8">
        <div
          role="progressbar"
          aria-label={title}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percentage}
          className="h-full rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

type ComparisonRowProps = {
  label: string;
  value: string;
  color: string;
};

function ComparisonRow({ label, value, color }: ComparisonRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 text-xs">
      <span className="font-medium text-text-light-secondary dark:text-text-dark-secondary">{label}</span>

      <span className="font-extrabold" style={{ color }}>
        {value}
      </span>
    </div>
  );
}

type ChartBarProps = {
  label: string;
  height: number;
  color: string;
};

function ChartBar({ label, height, color }: ChartBarProps) {
  return (
    <div
      role="img"
      aria-label={label}
      title={label}
      className="w-2 rounded-t sm:w-4 lg:w-7"
      style={{
        height: `${Math.max(height, height > 0 ? 2 : 0)}%`,
        backgroundColor: color,
      }}
    />
  );
}

type ChartLegendProps = {
  color: string;
  label: string;
};

function ChartLegend({ color, label }: ChartLegendProps) {
  return (
    <span className="flex items-center gap-2">
      <span aria-hidden="true" className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />

      {label}
    </span>
  );
}

function MailIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6 shrink-0 text-violet-500 dark:text-violet-300"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />

      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

import { Header } from "../../components/layout/Header";
import { Card } from "../../components/ui/Card";
import { useWallet } from "../../hooks/useWallet";

const weeklyData = [
  { day: "Lun", entries: 22, exits: 37, exchanges: 15 },
  { day: "Mar", entries: 24, exits: 52, exchanges: 11 },
  { day: "Mié", entries: 54, exits: 17, exchanges: 30 },
  { day: "Jue", entries: 100, exits: 33, exchanges: 22 },
  { day: "Vie", entries: 31, exits: 58, exchanges: 43 },
  { day: "Sáb", entries: 15, exits: 29, exchanges: 8 },
  { day: "Dom", entries: 10, exits: 22, exchanges: 6 },
];

const balanceFormatter = new Intl.NumberFormat("es-AR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function Summary() {
  const { wallet, loading } = useWallet();

  const primaryBalance = wallet.balances.find(
    (balance) => balance.isPrimary,
  );

  const balanceCode = primaryBalance?.currency.code ?? "ARS";

  const formattedBalance = balanceFormatter.format(
    primaryBalance?.amount ?? 0,
  );

  return (
    <main
      className="
        w-full px-4 py-5 text-slate-900 dark:text-white
        sm:px-6
        lg:px-8
        xl:grid xl:h-dvh xl:grid-rows-[auto_auto_minmax(0,1fr)]
        xl:gap-4 xl:overflow-hidden xl:py-4
      "
    >
      {/* Encabezado */}
      <div className="mb-5 xl:mb-0">
        <Header
          title="Resumen"
          subtitle="Semana del 31 ago al 6 sep"
        />
      </div>

      {/* Balance general */}
      <Card
        variant="aura"
        className="mb-5 overflow-hidden p-0 xl:mb-0"
      >
        <div className="grid grid-cols-1 xl:h-33.5 xl:grid-cols-[1.1fr_3fr]">
          <div className="flex flex-col justify-center p-5 xl:border-r xl:border-white/10 xl:px-8 xl:py-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-violet-200">
              Balance total
            </p>

            <p
              aria-live="polite"
              className="mt-2 text-3xl font-extrabold tracking-tight"
            >
              {loading
                ? "Cargando..."
                : `${balanceCode} ${formattedBalance}`}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="font-bold text-cyan-500 dark:text-cyan-300">
                ↗ +12%
              </span>

              <span className="text-slate-500 dark:text-slate-300">
                vs semana pasada
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 bg-white/20 dark:bg-[#0d122e]/75 sm:grid-cols-3">
            <BalanceDetail
              title="Entradas"
              value="+680,00"
              detail="2 movimientos"
              color="#22d8d2"
            />

            <BalanceDetail
              title="Salidas"
              value="-198,50"
              detail="4 movimientos"
              color="#ff3b8d"
            />

            <BalanceDetail
              title="Cambios"
              value="450,00"
              detail="3 operaciones"
              color="#cba7ff"
            />
          </div>
        </div>
      </Card>

      {/* Contenido principal */}
      <div
        className="
          grid min-h-0 grid-cols-1 gap-5
          xl:grid-cols-[minmax(0,4.4fr)_minmax(240px,1fr)]
          xl:grid-rows-[minmax(0,1fr)_150px]
        "
      >
        {/* Gráfico */}
        <Card
          variant="elevated"
          className="min-h-0 min-w-0 p-5 xl:overflow-hidden xl:p-6"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-bold">
              Entradas, salidas y cambios por día
            </h2>

            <div className="flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-300">
              <ChartLegend color="#22d8d2" label="Entradas" />
              <ChartLegend color="#ff2d85" label="Salidas" />
              <ChartLegend color="#7937ff" label="Cambios" />
            </div>
          </div>

          <div
            className="
              mt-5 flex h-85 items-end justify-between gap-2
              sm:gap-4
              xl:h-[calc(100%-44px)] xl:min-h-0
            "
            aria-label="Gráfico semanal de movimientos"
          >
            {weeklyData.map((item) => (
              <div
                key={item.day}
                className="flex h-full min-w-0 flex-1 flex-col justify-end"
              >
                <div className="flex min-h-0 flex-1 items-end justify-center gap-1 sm:gap-2">
                  <ChartBar
                    label={`${item.day}: entradas ${item.entries}%`}
                    height={item.entries}
                    color="#22d8d2"
                  />

                  <ChartBar
                    label={`${item.day}: salidas ${item.exits}%`}
                    height={item.exits}
                    color="#ff2d85"
                  />

                  <ChartBar
                    label={`${item.day}: cambios ${item.exchanges}%`}
                    height={item.exchanges}
                    color="#7937ff"
                  />
                </div>

                <div
                  className={`mt-3 border-t border-slate-300 pt-2 text-center text-xs font-semibold dark:border-[#30385d] ${
                    item.day === "Jue"
                      ? "text-slate-900 dark:text-white"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {item.day}
                </div>
              </div>
            ))}
          </div>
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
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-4 py-2 text-[11px] font-extrabold uppercase tracking-wider text-[#071329]">
                ↗ Mejor día
              </span>

              <p className="mt-5 text-2xl font-extrabold leading-tight">
                Tu mejor día fue el{" "}
                <span className="text-cyan-300">
                  jueves
                </span>
              </p>

              <p className="mt-4 text-sm leading-relaxed text-slate-100">
                Entraron ARS 520,00 por dos transferencias
                recibidas.
              </p>
            </div>
          </Card>

          {/* Solo informativo: no envía correos */}
          <div className="shrink-0 rounded-xl border border-violet-400/50 bg-violet-500/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <MailIcon />

              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Resumen semanal por correo
                </p>

                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-200">
                  Recibirás automáticamente tu resumen todos los
                  domingos en tu correo electrónico registrado.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Desglose */}
        <Card
          variant="elevated"
          className="min-h-0 p-4 xl:overflow-hidden"
        >
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Desglose por tipo
          </h2>

          <div className="mt-3 space-y-2.5">
            <SummaryRow
              title="Entradas"
              detail="2 movimientos"
              value="+680,00"
              color="#22d8d2"
              percentage={78}
            />

            <SummaryRow
              title="Salidas"
              detail="4 movimientos"
              value="-198,50"
              color="#ff2d85"
              percentage={32}
            />

            <SummaryRow
              title="Cambios"
              detail="3 operaciones"
              value="450,00"
              color="#7937ff"
              percentage={52}
            />
          </div>
        </Card>

        {/* Comparación */}
        <Card
          variant="elevated"
          className="min-h-0 p-4 xl:overflow-hidden"
        >
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Comparado con la semana pasada
          </h2>

          <div className="mt-2 divide-y divide-slate-200 dark:divide-[#343c61]">
            <ComparisonRow
              label="Entradas"
              value="+12%"
              color="#22d8d2"
            />

            <ComparisonRow
              label="Salidas"
              value="−4%"
              color="#22d8d2"
            />

            <ComparisonRow
              label="Cambios"
              value="+2 operaciones"
              color="#cba7ff"
            />
          </div>
        </Card>
      </div>
    </main>
  );
}

type BalanceDetailProps = {
  title: string;
  value: string;
  detail: string;
  color: string;
};

function BalanceDetail({
  title,
  value,
  detail,
  color,
}: BalanceDetailProps) {
  return (
    <div className="flex flex-col justify-center border-t border-slate-200 p-5 dark:border-white/10 sm:border-l sm:border-t-0 xl:px-6 xl:py-4">
      <p
        className="text-xs font-bold uppercase tracking-[0.14em]"
        style={{ color }}
      >
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {detail}
      </p>
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

function SummaryRow({
  title,
  detail,
  value,
  color,
  percentage,
}: SummaryRowProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 text-xs">
          <span className="font-bold text-slate-900 dark:text-white">
            {title}
          </span>

          <span className="ml-1 text-slate-500 dark:text-slate-300">
            · {detail}
          </span>
        </p>

        <span
          className="shrink-0 text-xs font-extrabold"
          style={{ color }}
        >
          {value}
        </span>
      </div>

      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-[#252c4b]">
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

function ComparisonRow({
  label,
  value,
  color,
}: ComparisonRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 text-xs">
      <span className="font-medium text-slate-600 dark:text-slate-300">
        {label}
      </span>

      <span
        className="font-extrabold"
        style={{ color }}
      >
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

function ChartBar({
  label,
  height,
  color,
}: ChartBarProps) {
  return (
    <div
      role="img"
      aria-label={label}
      title={label}
      className="w-2 rounded-t sm:w-4 lg:w-7"
      style={{
        height: `${height}%`,
        backgroundColor: color,
      }}
    />
  );
}

type ChartLegendProps = {
  color: string;
  label: string;
};

function ChartLegend({
  color,
  label,
}: ChartLegendProps) {
  return (
    <span className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="h-3 w-3 rounded-sm"
        style={{ backgroundColor: color }}
      />

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
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
      />

      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}
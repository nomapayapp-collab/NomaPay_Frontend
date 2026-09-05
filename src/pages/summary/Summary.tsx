import { Header } from "../../components/layout/Header";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { useWallet } from "../../hooks/useWallet";

const weeklyData = [
  { day: "L", entries: 35, exits: 20, exchanges: 12 },
  { day: "M", entries: 22, exits: 48, exchanges: 14 },
  { day: "M", entries: 50, exits: 16, exchanges: 18 },
  { day: "J", entries: 100, exits: 30, exchanges: 22 },
  { day: "V", entries: 28, exits: 55, exchanges: 42 },
  { day: "S", entries: 20, exits: 28, exchanges: 10 },
  { day: "D", entries: 10, exits: 18, exchanges: 8 },
];

export default function Summary() {
  const { wallet, loading } = useWallet();

  const primaryBalance = wallet.balances.find(
    (balance) => balance.isPrimary,
  );

  const formattedBalance = (primaryBalance?.amount ?? 0).toLocaleString(
    "es-AR",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  );

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 text-slate-900 dark:text-white">
      <Header
        title="Resumen"
        subtitle="Cómo se movió tu plata esta semana"
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          {/* Balance total */}
          <Card variant="aura" className="p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Balance total
            </p>

            <p className="mt-2 text-3xl font-bold">
              {loading
                ? "Cargando..."
                : `${primaryBalance?.currency.code ?? "ARS"} ${formattedBalance}`}
            </p>

            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="font-semibold text-teal-500">↗ +12%</span>

              <span className="text-slate-500 dark:text-slate-400">
                vs semana pasada
              </span>
            </div>
          </Card>

          {/* Gráfico semanal */}
          <Card variant="elevated" className="p-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Entradas, salidas y cambios por día
            </h2>

            <div className="mt-6 flex h-40 items-end justify-between gap-3">
              {weeklyData.map((item, index) => (
                <div
                  key={`${item.day}-${index}`}
                  className="flex h-full flex-1 flex-col items-center justify-end"
                >
                  <div className="flex h-32 items-end gap-1">
                    <div
                      className="w-2 rounded-t bg-[#4de3d2]"
                      style={{ height: `${item.entries}%` }}
                    />

                    <div
                      className="w-2 rounded-t bg-[#f52f91]"
                      style={{ height: `${item.exits}%` }}
                    />

                    <div
                      className="w-2 rounded-t bg-[#7c3aed]"
                      style={{ height: `${item.exchanges}%` }}
                    />
                  </div>

                  <span className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {item.day}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap justify-center gap-4 text-xs text-slate-600 dark:text-slate-300">
              <ChartLegend color="#4de3d2" label="Entradas" />
              <ChartLegend color="#f52f91" label="Salidas" />
              <ChartLegend color="#7c3aed" label="Cambios" />
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Desglose por tipo */}
          <Card variant="elevated" className="p-5">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Desglose por tipo
            </h2>

            <div className="mt-5 space-y-5">
              <SummaryRow
                title="Entradas"
                detail="2 movimientos"
                value="+680,00"
                color="#4de3d2"
                width="78%"
              />

              <SummaryRow
                title="Salidas"
                detail="4 movimientos"
                value="-198,50"
                color="#f52f91"
                width="32%"
              />

              <SummaryRow
                title="Cambios"
                detail="3 operaciones"
                value="450,00"
                color="#7c3aed"
                width="52%"
              />
            </div>
          </Card>

          {/* Enviar resumen */}
          <div>
            <Button
              type="button"
              variant="outline"
              fullWidth
              className="flex items-center justify-center gap-3 py-4"
            >
              <EnvelopeIcon />
              Enviarme este resumen
            </Button>

            <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
              Se envía automáticamente cada 7 días
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

type SummaryRowProps = {
  title: string;
  detail: string;
  value: string;
  color: string;
  width: string;
};

function SummaryRow({
  title,
  detail,
  value,
  color,
  width,
}: SummaryRowProps) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <p>
          <span className="font-semibold">{title}</span>

          <span className="ml-1 text-xs text-slate-500 dark:text-slate-400">
            · {detail}
          </span>
        </p>

        <span className="font-semibold" style={{ color }}>
          {value}
        </span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-[#242943]">
        <div
          className="h-full rounded-full"
          style={{ width, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

type ChartLegendProps = {
  color: string;
  label: string;
};

function ChartLegend({ color, label }: ChartLegendProps) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="h-2.5 w-2.5 rounded-sm"
        style={{ backgroundColor: color }}
      />

      {label}
    </span>
  );
}

function EnvelopeIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}
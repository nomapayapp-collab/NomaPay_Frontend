import { useState, type ComponentType, type SVGProps } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { formatCurrency } from "../../utils/formatCurrency";
import { useWallet } from "../../hooks/useWallet";
import { IconClock, IconTrend, IconSwap, IconPin, IconSend, IconPlus } from "../../assets/icons/Icons";
import type { MovementType, MovementStatus } from "../../types/wallet";

const TYPE_ICON: Record<MovementType, ComponentType<SVGProps<SVGSVGElement>>> = {
  cobro: IconTrend,
  cambio: IconSwap,
  pago: IconPin,
  envio: IconSend,
  carga: IconPlus,
};

const STATUS_BADGE: Record<MovementStatus, string> = {
  acreditado: "badge--success",
  completado: "badge--success",
  rechazada: "badge--error",
  pendiente: "badge--warning",
  cancelada: "badge--neutral",
};

const STATUS_LABEL: Record<MovementStatus, string> = {
  acreditado: "Acreditado",
  completado: "Completado",
  rechazada: "Rechazada",
  pendiente: "Pendiente",
  cancelada: "Cancelada",
};

type Filter = "todos" | "ingresos" | "transferencias" | "cambios";

const FILTERS: { key: Filter; label: string; types?: MovementType[] }[] = [
  { key: "todos", label: "Todos" },
  { key: "ingresos", label: "Ingresos", types: ["cobro"] },
  { key: "transferencias", label: "Transferencias", types: ["envio"] },
  { key: "cambios", label: "Cambios", types: ["cambio"] },
];


const MAX_VISIBLE_MOVEMENTS = 10;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" }).replace(".", "");
}

type RecentMovementsProps = {
  maxHeight?: number | null;
};


export function RecentMovements({ maxHeight }: RecentMovementsProps) {
  const { wallet } = useWallet();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("todos");

  const hasMovements = wallet.recentMovements.length > 0;
  const activeFilter = FILTERS.find((f) => f.key === filter)!;
  const filteredMovements = activeFilter.types
    ? wallet.recentMovements.filter((m) => activeFilter.types!.includes(m.type))
    : wallet.recentMovements;
  const movements = filteredMovements.slice(0, MAX_VISIBLE_MOVEMENTS);

  return (
    <Card className="lg:flex lg:flex-col" style={maxHeight != null ? { height: maxHeight } : undefined}>
      <div className="flex items-center justify-between mb-3 gap-3 flex-wrap lg:shrink-0">
        <p className="card__title">Movimientos recientes</p>

        {hasMovements && (
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-1">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={`px-3 py-1.5 rounded-control text-[12.5px] font-medium transition-colors ${
                    filter === f.key
                      ? "bg-violet-500/15 text-violet-300"
                      : "text-text-light-tertiary dark:text-text-dark-tertiary hover:text-text-light-primary dark:hover:text-text-dark-primary"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => navigate("/history")}
              className="text-[12.5px] font-medium text-violet-300 hover:text-violet-500"
            >
              Ver todos
            </button>
          </div>
        )}
      </div>

      {!hasMovements ? (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center lg:flex-1 lg:min-h-0">
          <IconClock className="w-7 h-7 text-text-light-tertiary dark:text-text-dark-tertiary" />
          <p className="text-[14px] text-text-light-secondary dark:text-text-dark-secondary">Todavía no tenés movimientos</p>
          <p className="text-[12.5px] text-text-light-tertiary dark:text-text-dark-tertiary">Cuando hagas tu primera operación, la vas a ver acá.</p>
        </div>
      ) : (
        <div className="lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
          <div className="hidden lg:grid grid-cols-[1fr_120px_120px_120px] gap-4 px-1 pb-2 mb-1 text-[11px] font-semibold tracking-widest uppercase text-text-light-tertiary dark:text-text-dark-tertiary border-b border-border-light dark:border-border-dark lg:shrink-0">
            <span>Detalle</span>
            <span>Fecha</span>
            <span>Estado</span>
            <span className="text-right">Monto</span>
          </div>

          <ul className="divide-y divide-border-light dark:divide-border-dark scrollbar-app lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
            {movements.map(({ id, type, description, detail, status, amount, currency, date }) => {
              const Icon = TYPE_ICON[type];
              // ni rechazada ni cancelada movieron plata de verdad — mismo
              // tratamiento visual apagado para las dos.
              const voided = status === "rechazada" || status === "cancelada";
              return (
                <li
                  key={id}
                  className="flex flex-col gap-1 py-3 text-[14px] lg:grid lg:grid-cols-[1fr_120px_120px_120px] lg:gap-4 lg:items-center"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`hidden lg:flex w-9 h-9 rounded-full items-center justify-center shrink-0 ${
                        voided ? "bg-magenta-500/15 text-magenta-500" : "bg-black/5 dark:bg-white/8 text-text-light-secondary dark:text-text-dark-secondary"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-text-light-primary dark:text-text-dark-primary truncate">{description}</p>
                      {detail && <p className="hidden lg:block text-[12.5px] text-text-light-tertiary dark:text-text-dark-tertiary truncate">{detail}</p>}
                    </div>
                  </div>

                  <span className="hidden lg:block text-[13px] text-text-light-secondary dark:text-text-dark-secondary">{formatDate(date)}</span>

                  <span className="hidden lg:block">
                    <span className={`badge ${STATUS_BADGE[status]}`}>{STATUS_LABEL[status]}</span>
                  </span>

                  <span
                    className={`tabular font-medium lg:text-right ${
                      voided ? "text-text-light-tertiary dark:text-text-dark-tertiary" : amount < 0 ? "text-text-light-secondary dark:text-text-dark-secondary" : "text-turquoise-500"
                    }`}
                  >
                    {voided ? "" : amount < 0 ? "-" : "+"}
                    {formatCurrency(Math.abs(amount), currency)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Card>
  );
}

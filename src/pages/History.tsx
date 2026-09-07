import type { ComponentType, SVGProps } from "react";
import { Header } from "../components/layout/Header";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { DataTable, type DataTableColumn } from "../components/ui/DataTable";
import {
  IconPlus,
  IconTrend,
  IconSend,
  IconSwap,
  IconSearch,
  IconClock,
  IconChevronLeft,
  IconChevronRight,
} from "../assets/icons/Icons";
import { formatCurrency } from "../utils/formatCurrency";
import { formatShortDate, formatDateTime, formatDayHeader, monthLabel } from "../utils/formatDate";
import { useHistory, HISTORY_TYPE_FILTERS, isPositive } from "../hooks/useHistory";
import type { HistoryItem, HistoryOperationType } from "../types/history";

/**
 * `iconClass` es el círculo de la fila (tinte suave, como en el resto de la
 * app — Receipt.tsx, Wallet.tsx). `barClass` es un color sólido aparte,
 * solo para la barra de "Por tipo": no puede ser el mismo tinte al 15%
 * del ícono porque ahí se ve lavado — necesita un color fuerte de verdad.
 * Los 4 tipos usan los 4 acentos de la paleta para que cada barra se
 * distinga de las demás (magenta queda libre para "Envíos" acá porque en
 * la barra es solo color de gráfico, no un estado — el rojo de "Rechazada"
 * sigue siendo el único lugar donde magenta significa error).
 */
const TYPE_META: Record<
  HistoryOperationType,
  { icon: ComponentType<SVGProps<SVGSVGElement>>; iconClass: string; barClass: string; title: string; labelPlural: string }
> = {
  carga: { icon: IconPlus, iconClass: "bg-turquoise-500/20 text-turquoise-500", barClass: "bg-amber-500", title: "Carga de saldo", labelPlural: "Cargas" },
  cobro: {
    icon: IconTrend,
    iconClass: "bg-turquoise-500/20 text-turquoise-500",
    barClass: "bg-turquoise-500",
    title: "Transferencia recibida",
    labelPlural: "Cobros",
  },
  pago: {
    icon: IconSend,
    iconClass: "bg-black/5 dark:bg-white/8 text-text-light-secondary dark:text-text-dark-secondary",
    barClass: "bg-magenta-500",
    title: "Transferencia enviada",
    labelPlural: "Envíos",
  },
  cambio: {
    icon: IconSwap,
    iconClass: "bg-violet-500/20 text-violet-500",
    barClass: "bg-violet-500",
    title: "Cambio de moneda",
    labelPlural: "Cambios",
  },
};

function getTitle(item: HistoryItem): string {
  if (item.operationType === "cambio" && item.exchangeData) {
    return `Cambio ${item.exchangeData.currencyOrigin} → ${item.exchangeData.currencyDestination}`;
  }
  if (item.operationType === "pago" && item.counterparty) {
    return `Envío a ${item.counterparty.name}`;
  }
  if (item.operationType === "cobro" && item.counterparty) {
    return `Recibido de ${item.counterparty.name}`;
  }
  return TYPE_META[item.operationType].title;
}

/** "0,5%", redondeado — evita mostrar basura de punto flotante. */
function getFeePercentLabel(item: HistoryItem): string | null {
  if (item.fee === undefined || item.amount <= 0) return null;
  const pct = Math.round((item.fee / item.amount) * 100 * 100) / 100;
  return `${pct.toLocaleString("es-AR", { maximumFractionDigits: 2 })}%`;
}

function getCommissionLabel(item: HistoryItem): string | null {
  if (item.fee === undefined) return null;
  if (item.fee === 0) return "Sin cargo";
  return formatCurrency(item.fee, item.currencyCode);
}

function getAmountLabel(item: HistoryItem): string {
  const sign = isPositive(item) ? "+" : "−";
  return `${sign}${formatCurrency(item.amount, item.currencyCode)}`;
}

function getAmountClass(item: HistoryItem): string {
  if (item.status === "rejected" || item.status === "cancelled") {
    return "text-text-light-tertiary dark:text-text-dark-tertiary";
  }
  return isPositive(item) ? "text-turquoise-500" : "text-text-light-primary dark:text-text-dark-primary";
}

function getStatusMeta(item: HistoryItem): { label: string; badgeClass: string } {
  switch (item.status) {
    case "pending":
      return { label: "Pendiente", badgeClass: "badge--warning" };
    case "completed":
      // Acreditado y Completada son ambos "completed" pero antes compartían
      // el mismo verde y se confundían en la lista — Acreditado (entrada de
      // plata) ahora usa el violeta de badge--info para diferenciarse.
      return isPositive(item)
        ? { label: "Acreditado", badgeClass: "badge--info" }
        : { label: "Completada", badgeClass: "badge--success" };
    case "cancelled":
      return { label: "Cancelada", badgeClass: "badge--neutral" };
    case "rejected":
      return { label: "Rechazada", badgeClass: "badge--error" };
  }
}

type DetailRow = { label: string; value: string; accent?: boolean };

function getDetailRows(item: HistoryItem): DetailRow[] {
  const status = getStatusMeta(item);
  const common: DetailRow[] = [
    { label: "Estado", value: status.label },
    { label: "Fecha y hora", value: formatDateTime(item.transactionDate) },
    { label: "N° de operación", value: `NP-${item.id}` },
  ];

  if (item.operationType === "cambio" && item.exchangeData) {
    const rate = item.amount > 0 ? item.exchangeData.finalAmount / item.amount : 0;
    const rows: DetailRow[] = [
      { label: "Convertiste", value: formatCurrency(item.amount, item.currencyCode) },
      { label: "Recibiste", value: formatCurrency(item.exchangeData.finalAmount, item.exchangeData.currencyDestination), accent: true },
      {
        label: "Tipo de cambio",
        value: `1 ${item.currencyCode} = ${rate.toLocaleString("es-AR", { maximumFractionDigits: 4 })} ${item.exchangeData.currencyDestination}`,
      },
    ];
    if (item.fee !== undefined) {
      const pctLabel = getFeePercentLabel(item);
      rows.push({ label: pctLabel ? `Comisión (${pctLabel})` : "Comisión", value: getCommissionLabel(item) ?? "—" });
    }
    return [...rows, ...common];
  }

  const rows: DetailRow[] = [{ label: "Monto", value: getAmountLabel(item), accent: true }];
  if (item.counterparty) {
    rows.push({ label: item.operationType === "pago" ? "Para" : "De", value: item.counterparty.name });
    rows.push({ label: "Alias", value: item.counterparty.alias });
  }
  if (item.fee !== undefined) {
    rows.push({ label: "Comisión", value: getCommissionLabel(item) ?? "—" });
  }
  return [...rows, ...common];
}

const COLUMNS: DataTableColumn<HistoryItem>[] = [
  {
    key: "detalle",
    header: "Detalle",
    width: "1fr",
    render: (item) => {
      const meta = TYPE_META[item.operationType];
      const Icon = meta.icon;
      return (
        <span className="flex items-center gap-3 min-w-0">
          <span className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${meta.iconClass}`}>
            <Icon className="w-4 h-4" />
          </span>
          <span className="block truncate font-medium text-[14px] text-text-light-primary dark:text-text-dark-primary">
            {getTitle(item)}
          </span>
        </span>
      );
    },
  },
  {
    key: "fecha",
    header: "Fecha",
    width: "110px",
    hideOnMobile: true,
    render: (item) => (
      <span className="text-[13px] text-text-light-secondary dark:text-text-dark-secondary">{formatShortDate(item.transactionDate)}</span>
    ),
  },
  {
    key: "estado",
    header: "Estado",
    width: "130px",
    hideOnMobile: true,
    render: (item) => {
      const status = getStatusMeta(item);
      return <span className={`badge ${status.badgeClass}`}>{status.label}</span>;
    },
  },
  {
    key: "monto",
    header: "Monto",
    width: "130px",
    align: "right",
    render: (item) => <span className={`tabular font-semibold text-[14px] ${getAmountClass(item)}`}>{getAmountLabel(item)}</span>,
  },
];

function renderDetail(item: HistoryItem) {
  return (
    <div className="px-4 pb-4 lg:px-5 lg:pb-5 pt-1 grid grid-cols-2 gap-x-6 gap-y-3">
      {getDetailRows(item).map((row) => (
        <div key={row.label}>
          <p className="text-[11.5px] text-text-light-tertiary dark:text-text-dark-tertiary mb-0.5">{row.label}</p>
          <p
            className={`text-[13.5px] font-medium ${
              row.accent ? "text-text-light-primary dark:text-text-dark-primary" : "text-text-light-secondary dark:text-text-dark-secondary"
            }`}
          >
            {row.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function groupByDay(item: HistoryItem) {
  return { key: new Date(item.transactionDate).toDateString(), label: formatDayHeader(item.transactionDate) };
}

/**
 * Historial de transacciones — GET /history (real, ya conectado). Toda la
 * lógica (fetch, filtros, paginado, resumen) vive en useHistory(); acá solo
 * queda el mapeo de HistoryItem a columnas/detalle y el layout. La
 * tabla/lista en sí es <DataTable> (components/ui/DataTable.tsx), genérica
 * y reusable — pensada para el panel de administrador más adelante.
 *
 * `counterparty` (quién envió/recibió) y `fee` (comisión — 0 en
 * transferencias, ~0.5% en cambios) son opcionales en HistoryItem: el back
 * los tiene disponibles pero GET /history todavía no los manda. Mientras no
 * lleguen, el título cae al genérico y esas filas del detalle no se
 * muestran — apenas el back los sume, aparecen solos sin tocar nada acá.
 */
export default function History() {
  const {
    loading,
    error,
    hasAnyItems,
    hasResults,
    typeFilter,
    setTypeFilter,
    monthFilter,
    setMonthFilter,
    availableMonths,
    search,
    setSearch,
    pageItems,
    totalFilteredCount,
    currentPage,
    totalPages,
    setPage,
    expandedId,
    toggleExpanded,
    summary,
    byType,
  } = useHistory();

  const emptyState = (
    <div className="rounded-card border border-dashed border-border-light dark:border-border-dark flex flex-col items-center justify-center gap-3 py-14 text-center">
      <span className="w-12 h-12 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/8 text-text-light-tertiary dark:text-text-dark-tertiary">
        <IconClock className="w-5 h-5" />
      </span>
      <div>
        <p className="font-semibold text-text-light-primary dark:text-text-dark-primary mb-1">
          {hasAnyItems ? "No encontramos movimientos" : "Todavía no tenés transacciones"}
        </p>
        <p className="text-[13px] text-text-light-tertiary dark:text-text-dark-tertiary max-w-xs">
          {hasAnyItems
            ? "Probá con otro filtro, mes o búsqueda."
            : "Cuando cargues, cambies o transfieras dinero, cada movimiento va a aparecer acá."}
        </p>
      </div>
      {!hasAnyItems && (
        <Button to="/wallet" variant="primary" size="sm">
          Cargar saldo
        </Button>
      )}
    </div>
  );

  return (
    <div className="px-5 pt-8 pb-8 lg:px-10 lg:py-8 max-w-md lg:max-w-none w-full mx-auto">
      <Header title="Historial de transacciones" subtitle="Todos tus movimientos" />

      <div className="lg:grid lg:grid-cols-3 lg:gap-6 lg:items-start">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
              {HISTORY_TYPE_FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setTypeFilter(f.key)}
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12.5px] font-medium transition-colors ${
                    typeFilter === f.key
                      ? "bg-violet-500 text-white"
                      : "bg-black/5 dark:bg-white/8 text-text-light-secondary dark:text-text-dark-secondary hover:text-text-light-primary dark:hover:text-text-dark-primary"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {availableMonths.length > 0 && (
                <select
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  aria-label="Filtrar por mes"
                  className="rounded-control border border-border-light dark:border-border-dark bg-transparent px-3 py-2 text-[12.5px] text-text-light-primary dark:text-text-dark-primary"
                >
                  <option value="todos">Todos los meses</option>
                  {availableMonths.map((m) => (
                    <option key={m} value={m}>
                      {monthLabel(m)}
                    </option>
                  ))}
                </select>
              )}
              <div className="relative flex-1 lg:flex-none">
                <IconSearch className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-light-tertiary dark:text-text-dark-tertiary" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar"
                  aria-label="Buscar en el historial"
                  className="w-full lg:w-44 rounded-control border border-border-light dark:border-border-dark bg-transparent pl-9 pr-3 py-2 text-[12.5px] text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-tertiary dark:placeholder:text-text-dark-tertiary"
                />
              </div>
            </div>
          </div>

          <DataTable
            items={pageItems}
            columns={COLUMNS}
            getRowKey={(item) => item.id}
            renderDetail={renderDetail}
            expandedKey={expandedId}
            onToggleExpand={(key) => toggleExpanded(Number(key))}
            groupBy={groupByDay}
            loading={loading}
            error={error}
            emptyState={emptyState}
          />

          {!loading && !error && hasResults && totalPages > 1 && (
            <div className="flex items-center justify-between px-1">
              <p className="text-[12.5px] text-text-light-tertiary dark:text-text-dark-tertiary">
                Mostrando {pageItems.length} de {totalFilteredCount} movimientos
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  aria-label="Página anterior"
                  className="icon-btn disabled:opacity-40 disabled:pointer-events-none"
                >
                  <IconChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Página siguiente"
                  className="icon-btn disabled:opacity-40 disabled:pointer-events-none"
                >
                  <IconChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ---------- Sidebar desktop ---------- */}
        {!loading && !error && hasResults && (
          <div className="hidden lg:flex flex-col gap-6 mt-[52px]">
            <Card>
              <p className="card__title mb-3">Resumen del período</p>
              <div className="flex flex-col gap-3 text-[13.5px]">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-text-light-tertiary dark:text-text-dark-tertiary">Entradas · {summary.entradas.count} mov.</p>
                  <div className="text-right">
                    {summary.entradas.totals.size === 0 ? (
                      <p className="text-text-light-secondary dark:text-text-dark-secondary">—</p>
                    ) : (
                      Array.from(summary.entradas.totals.entries()).map(([code, amount]) => (
                        <p key={code} className="text-turquoise-500 font-medium tabular">
                          +{formatCurrency(amount, code)}
                        </p>
                      ))
                    )}
                  </div>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-text-light-tertiary dark:text-text-dark-tertiary">Salidas · {summary.salidas.count} mov.</p>
                  <div className="text-right">
                    {summary.salidas.totals.size === 0 ? (
                      <p className="text-text-light-secondary dark:text-text-dark-secondary">—</p>
                    ) : (
                      Array.from(summary.salidas.totals.entries()).map(([code, amount]) => (
                        <p key={code} className="text-text-light-primary dark:text-text-dark-primary font-medium tabular">
                          −{formatCurrency(amount, code)}
                        </p>
                      ))
                    )}
                  </div>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <p className="text-text-light-tertiary dark:text-text-dark-tertiary">Cambios · {summary.cambios.count} op.</p>
                  <div className="text-right">
                    {summary.cambios.totals.size === 0 ? (
                      <p className="text-text-light-secondary dark:text-text-dark-secondary">—</p>
                    ) : (
                      Array.from(summary.cambios.totals.entries()).map(([code, amount]) => (
                        <p key={code} className="text-text-light-primary dark:text-text-dark-primary font-medium tabular">
                          {formatCurrency(amount, code)}
                        </p>
                      ))
                    )}
                  </div>
                </div>
                {summary.comisiones && (
                  <div className="flex items-start justify-between gap-3 pt-2 border-t border-border-light dark:border-border-dark">
                    <p className="text-text-light-tertiary dark:text-text-dark-tertiary">Comisiones pagadas</p>
                    <div className="text-right">
                      {Array.from(summary.comisiones.entries()).map(([code, amount]) => (
                        <p key={code} className="text-text-light-primary dark:text-text-dark-primary font-medium tabular">
                          {formatCurrency(amount, code)}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {byType.length > 0 && (
              <Card>
                <p className="card__title mb-3">Por tipo</p>
                <div className="flex flex-col gap-3">
                  {byType.map((row) => (
                    <div key={row.type}>
                      <div className="flex items-center justify-between text-[12.5px] mb-1.5">
                        <span className="text-text-light-secondary dark:text-text-dark-secondary">{TYPE_META[row.type].labelPlural}</span>
                        <span className="font-medium text-text-light-primary dark:text-text-dark-primary">{row.pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-black/5 dark:bg-white/8 overflow-hidden">
                        <div className={`h-full rounded-full ${TYPE_META[row.type].barClass}`} style={{ width: `${row.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

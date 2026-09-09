import type { ReactNode } from "react";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  /** ancho de la columna en el grid de desktop (ej. "1fr", "110px"). */
  width: string;
  align?: "left" | "right";
  /** si es true, esta columna no aparece en la card compacta de mobile. */
  hideOnMobile?: boolean;
  render: (item: T) => ReactNode;
};

export type DataTableGroup = { key: string; label: string };

export type DataTableProps<T> = {
  items: T[];
  columns: DataTableColumn<T>[];
  getRowKey: (item: T) => string | number;
  /** si se pasa (junto con onToggleExpand), la fila es clickeable y esto se despliega debajo — acordeón en la misma página, nunca modal. */
  renderDetail?: (item: T) => ReactNode;
  expandedKey?: string | number | null;
  onToggleExpand?: (key: string | number) => void;
  /** agrupa las cards de mobile (ej. por día) — no afecta el desktop, que sigue siendo una sola tabla. */
  groupBy?: (item: T) => DataTableGroup;
  loading?: boolean;
  skeletonRows?: number;
  error?: ReactNode;
  emptyState?: ReactNode;
  /** se renderiza como pie de la card de desktop, separado por un borde superior (ej. paginación) — no aparece en la vista mobile. */
  footer?: ReactNode;
};


export function DataTable<T>({
  items,
  columns,
  getRowKey,
  renderDetail,
  expandedKey = null,
  onToggleExpand,
  groupBy,
  loading = false,
  skeletonRows = 4,
  error = null,
  emptyState,
  footer,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="rounded-card border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark-elevated divide-y divide-border-light dark:divide-border-dark overflow-hidden">
        {Array.from({ length: skeletonRows }).map((_, i) => (
          <div key={i} className="h-16 bg-black/5 dark:bg-white/8 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert-note alert-note--error">
        <p className="alert-note__description">{error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return <>{emptyState ?? null}</>;
  }

  const gridStyle = { gridTemplateColumns: columns.map((c) => c.width).join(" ") };
  const mobileColumns = columns.filter((c) => !c.hideOnMobile);
  const clickable = Boolean(renderDetail && onToggleExpand);

  function renderDesktopRow(item: T) {
    const key = getRowKey(item);
    const expanded = expandedKey === key;
    const cells = columns.map((col) => (
      <span key={col.key} className={col.align === "right" ? "text-right" : "min-w-0"}>
        {col.render(item)}
      </span>
    ));

    return (
      <div key={key}>
        {clickable ? (
          <button
            type="button"
            onClick={() => onToggleExpand!(key)}
            aria-expanded={expanded}
            style={gridStyle}
            className="w-full grid gap-4 items-center px-5 py-4 text-left hover:bg-black/3 dark:hover:bg-white/3 transition-colors"
          >
            {cells}
          </button>
        ) : (
          <div style={gridStyle} className="grid gap-4 items-center px-5 py-4">
            {cells}
          </div>
        )}
        {expanded && renderDetail?.(item)}
      </div>
    );
  }

  function renderMobileRow(item: T) {
    const key = getRowKey(item);
    const expanded = expandedKey === key;
    const cells = mobileColumns.map((col) => (
      <span key={col.key} className={col.align === "right" ? "shrink-0" : "min-w-0 flex-1"}>
        {col.render(item)}
      </span>
    ));

    return (
      <div key={key}>
        {clickable ? (
          <button
            type="button"
            onClick={() => onToggleExpand!(key)}
            aria-expanded={expanded}
            className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left hover:bg-black/3 dark:hover:bg-white/3 transition-colors"
          >
            {cells}
          </button>
        ) : (
          <div className="flex items-center justify-between gap-3 px-4 py-3.5">{cells}</div>
        )}
        {expanded && renderDetail?.(item)}
      </div>
    );
  }

  const mobileGroups: (DataTableGroup & { items: T[] })[] = [];
  if (groupBy) {
    for (const item of items) {
      const g = groupBy(item);
      let group = mobileGroups.find((existing) => existing.key === g.key);
      if (!group) {
        group = { ...g, items: [] };
        mobileGroups.push(group);
      }
      group.items.push(item);
    }
  } else {
    mobileGroups.push({ key: "__all__", label: "", items });
  }

  return (
    <>
      {/* ---------- Desktop ---------- */}
      <div className="hidden lg:block rounded-card border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark-elevated overflow-hidden">
        <div
          style={gridStyle}
          className="grid gap-4 px-5 py-3 text-[11px] font-semibold tracking-widest uppercase text-text-light-tertiary dark:text-text-dark-tertiary border-b border-border-light dark:border-border-dark"
        >
          {columns.map((col) => (
            <span key={col.key} className={col.align === "right" ? "text-right" : ""}>
              {col.header}
            </span>
          ))}
        </div>
        <div className="divide-y divide-border-light dark:divide-border-dark">{items.map(renderDesktopRow)}</div>
        {footer && <div className="border-t border-border-light dark:border-border-dark px-5 py-3">{footer}</div>}
      </div>

      {/* ---------- Mobile ---------- */}
      <div className="lg:hidden flex flex-col gap-4">
        {mobileGroups.map((group) => (
          <div key={group.key}>
            {group.label && (
              <p className="text-[11px] font-semibold tracking-widest uppercase text-text-light-tertiary dark:text-text-dark-tertiary mb-2 px-1">
                {group.label}
              </p>
            )}
            <div className="rounded-card border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark-elevated divide-y divide-border-light dark:divide-border-dark overflow-hidden">
              {group.items.map(renderMobileRow)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

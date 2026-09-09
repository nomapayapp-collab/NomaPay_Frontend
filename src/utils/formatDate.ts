
export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "short" }).replace(".", "");
}

/** formatDateTime("2026-08-25T13:24:00.000Z") → "25 ago 2026, 10:24" */
export function formatDateTime(iso: string): string {
  return new Date(iso)
    .toLocaleString("es-AR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
    .replace(".", "");
}

/** formatDayHeader("2026-08-25T13:24:00.000Z") → "25 DE AGOSTO" (encabezado de grupo en mobile) */
export function formatDayHeader(iso: string): string {
  const label = new Date(iso).toLocaleDateString("es-AR", { day: "2-digit", month: "long" }).replace(".", "");
  return label.toUpperCase();
}

/** monthKey("2026-08-25T13:24:00.000Z") → "2026-08" — clave estable para agrupar/filtrar por mes. */
export function monthKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/** monthLabel("2026-08") → "Agosto 2026" */
export function monthLabel(key: string): string {
  const [year, month] = key.split("-").map(Number);
  const label = new Date(year, month - 1, 1).toLocaleDateString("es-AR", { month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

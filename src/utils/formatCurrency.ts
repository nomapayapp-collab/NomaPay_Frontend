/**
 * formatea montos de forma consistente en toda la
 * app (separador de miles, 2 decimales, código de moneda adelante).
 * formatCurrency(1982.3, "ARS") → "ARS 1.982,30"
 */
export function formatCurrency(amount: number, currencyCode: string): string {
  const formatted = new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${currencyCode} ${formatted}`;
}
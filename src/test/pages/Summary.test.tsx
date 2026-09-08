import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Summary from "../../pages/Summary";
import type { HistoryItem } from "../../types/history";

const mocks = vi.hoisted(() => ({
  useWallet: vi.fn(),
  getHistory: vi.fn(),
}));

vi.mock("../../hooks/useWallet", () => ({
  useWallet: mocks.useWallet,
}));

vi.mock("../../services/historyService", () => ({
  getHistory: mocks.getHistory,
}));

vi.mock("../../components/layout/Header", () => ({
  Header: ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <header>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </header>
  ),
}));

// useSummary agrupa por semana calendario REAL (lunes a domingo, hora local),
// así que las fechas de prueba se generan relativas a "ahora" en vez de
// hardcodeadas — un HistoryItem con una fecha fija de 2026 dejaría de caer
// en "esta semana"/"la semana pasada" apenas pase esa semana.
function mondayOfCurrentWeek(): Date {
  const d = new Date();
  d.setHours(12, 0, 0, 0); // mediodía: evita que un huso horario raro corra la fecha al día siguiente/anterior
  const day = d.getDay(); // 0 = domingo
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  return d;
}

function isoThisWeek(dayOffset: number): string {
  const d = mondayOfCurrentWeek();
  d.setDate(d.getDate() + dayOffset);
  return d.toISOString();
}

function isoLastWeek(dayOffset: number): string {
  const d = mondayOfCurrentWeek();
  d.setDate(d.getDate() - 7 + dayOffset);
  return d.toISOString();
}

// Moneda primaria del wallet de prueba: USD.
// Esta semana: entradas (cobro lun 200 + cobro jue 300 = 500, mejor día jueves),
// salidas (pago mar 50), cambios (USD→ARS mié, lado origen = 100).
// Un pago rechazado no debe sumar a nada.
// Semana pasada: entradas (carga lun 150), salidas (pago mar 100), sin cambios
// — así comparison.entradasPct/salidasPct/cambiosDelta salen de datos reales.
const ITEMS: HistoryItem[] = [
  { id: 1, operationType: "cobro", status: "completed", transactionDate: isoThisWeek(0), amount: 200, currencyCode: "USD" },
  { id: 2, operationType: "cobro", status: "completed", transactionDate: isoThisWeek(3), amount: 300, currencyCode: "USD" },
  { id: 3, operationType: "pago", status: "completed", transactionDate: isoThisWeek(1), amount: 50, currencyCode: "USD" },
  {
    id: 4,
    operationType: "cambio",
    status: "completed",
    transactionDate: isoThisWeek(2),
    amount: 100,
    currencyCode: "USD",
    exchangeData: { currencyOrigin: "USD", currencyDestination: "ARS", finalAmount: 170000 },
  },
  { id: 5, operationType: "pago", status: "rejected", transactionDate: isoThisWeek(1), amount: 9999, currencyCode: "USD" },
  { id: 6, operationType: "carga", status: "completed", transactionDate: isoLastWeek(0), amount: 150, currencyCode: "USD" },
  { id: 7, operationType: "pago", status: "completed", transactionDate: isoLastWeek(1), amount: 100, currencyCode: "USD" },
];

function setup() {
  mocks.useWallet.mockReturnValue({
    wallet: {
      // saldo actual 850: balance de arranque de la semana = 850 - netThisWeek(350) = 500 (> 0),
      // así que la variación semanal del balance también sale de un cálculo real, no de "Sin datos".
      balances: [
        { currency: { code: "USD", name: "Dólar estadounidense", symbol: "US$" }, amount: 850, isPrimary: true },
        { currency: { code: "ARS", name: "Peso argentino", symbol: "$" }, amount: 0 },
      ],
      exchangeRates: [],
      recentMovements: [],
    },
    loading: false,
    error: null,
    refetch: vi.fn(),
  });
  return render(<Summary />);
}

describe("Summary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra el título y el período semanal calculado (no hardcodeado)", async () => {
    mocks.getHistory.mockResolvedValue(ITEMS);

    setup();

    expect(screen.getByRole("heading", { name: "Resumen" })).toBeInTheDocument();

    const monday = mondayOfCurrentWeek();
    const sunday = new Date(monday);
    sunday.setDate(sunday.getDate() + 6);
    const fmt = (d: Date) => d.toLocaleDateString("es-AR", { day: "2-digit", month: "short" }).replace(".", "");
    expect(await screen.findByText(`Semana del ${fmt(monday)} al ${fmt(sunday)}`)).toBeInTheDocument();
  });

  it("muestra el estado de carga mientras obtiene la billetera y el historial", () => {
    mocks.useWallet.mockReturnValue({
      wallet: { balances: [], exchangeRates: [], recentMovements: [] },
      loading: true,
      error: null,
      refetch: vi.fn(),
    });
    mocks.getHistory.mockReturnValue(new Promise(() => {})); // nunca resuelve

    render(<Summary />);

    expect(screen.getAllByText("Cargando...").length).toBeGreaterThan(0);
  });

  it("muestra el saldo actual real de la moneda principal", async () => {
    mocks.getHistory.mockResolvedValue(ITEMS);

    setup();

    expect(screen.getByText("Balance total")).toBeInTheDocument();
    expect(await screen.findByText("USD 850,00")).toBeInTheDocument();
  });

  it("calcula entradas, salidas y cambios de la semana a partir del historial real (ignorando transacciones rechazadas)", async () => {
    mocks.getHistory.mockResolvedValue(ITEMS);

    setup();

    expect((await screen.findAllByText("+500,00")).length).toBeGreaterThan(0); // entradas: 200 (lun) + 300 (jue)
    expect(screen.getAllByText("2 movimientos").length).toBeGreaterThan(0);

    expect(screen.getAllByText("-50,00").length).toBeGreaterThan(0); // salidas: solo el pago completado, no el rechazado
    expect(screen.getAllByText("1 movimiento").length).toBeGreaterThan(0);

    expect(screen.getAllByText("100,00").length).toBeGreaterThan(0); // cambios: lado origen (USD) del cambio USD→ARS
    expect(screen.getAllByText("1 operación").length).toBeGreaterThan(0);
  });

  it("muestra el mejor día de la semana (el de más entradas)", async () => {
    mocks.getHistory.mockResolvedValue(ITEMS);

    setup();

    expect(await screen.findByText("jueves")).toBeInTheDocument();
    expect(screen.getByText(/Entraron USD 300,00 por 1 movimiento de entrada\./)).toBeInTheDocument();
  });

  it("compara los totales de esta semana con los de la semana pasada", async () => {
    mocks.getHistory.mockResolvedValue(ITEMS);

    setup();

    // entradas: 500 vs 150 la semana pasada → +233%
    expect(await screen.findByText("+233%")).toBeInTheDocument();
    // salidas: 50 vs 100 la semana pasada → -50% (el signo real es el carácter "−", no un guion)
    expect(screen.getByText("−50%")).toBeInTheDocument();
    // cambios: 1 esta semana vs 0 la semana pasada → +1 operación
    expect(screen.getByText("+1 operación")).toBeInTheDocument();
  });

  it("muestra un estado vacío en el gráfico cuando no hay movimientos esta semana", async () => {
    mocks.getHistory.mockResolvedValue([
      { id: 6, operationType: "carga", status: "completed", transactionDate: isoLastWeek(0), amount: 150, currencyCode: "USD" },
    ]);

    setup();

    expect(await screen.findByText("Todavía no tenés movimientos esta semana.")).toBeInTheDocument();
  });

  it("muestra un error si falla la carga del historial", async () => {
    mocks.getHistory.mockRejectedValue(new Error("network error"));

    setup();

    expect(await screen.findByText("No pudimos cargar tu resumen. Probá de nuevo en un rato.")).toBeInTheDocument();
  });

  it("muestra el aviso informativo del resumen semanal por correo", async () => {
    mocks.getHistory.mockResolvedValue(ITEMS);

    setup();

    expect(screen.getByText("Resumen semanal por correo")).toBeInTheDocument();
    expect(
      screen.getByText("Recibirás automáticamente tu resumen todos los domingos en tu correo electrónico registrado."),
    ).toBeInTheDocument();
  });
});

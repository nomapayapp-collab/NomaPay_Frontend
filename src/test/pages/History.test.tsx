import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import History from "../../pages/History";
import type { HistoryItem } from "../../types/history";

const mocks = vi.hoisted(() => ({
  useAuth: vi.fn(),
  getHistory: vi.fn(),
}));

vi.mock("../../hooks/useAuth", () => ({
  useAuth: mocks.useAuth,
}));

vi.mock("../../services/historyService", () => ({
  getHistory: mocks.getHistory,
}));

const ITEMS: HistoryItem[] = [
  {
    id: 1,
    operationType: "cambio",
    status: "completed",
    transactionDate: "2026-08-25T13:24:00.000Z",
    amount: 150,
    currencyCode: "USD",
    exchangeData: { currencyOrigin: "USD", currencyDestination: "ARS", finalAmount: 254775 },
  },
  {
    id: 2,
    operationType: "cobro",
    status: "completed",
    transactionDate: "2026-08-22T12:10:00.000Z",
    amount: 680,
    currencyCode: "USD",
  },
  {
    id: 3,
    operationType: "pago",
    status: "rejected",
    transactionDate: "2026-08-22T15:00:00.000Z",
    amount: 1000,
    currencyCode: "ARS",
  },
  {
    id: 4,
    operationType: "carga",
    status: "pending",
    transactionDate: "2026-08-17T14:00:00.000Z",
    amount: 200,
    currencyCode: "USD",
  },
];

function setup() {
  mocks.useAuth.mockReturnValue({ user: { name: "Cande", surname: "Pérez", alias: "cande.viajera.ar" } });
  return render(<History />);
}

describe("History", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra el esqueleto mientras carga", () => {
    mocks.getHistory.mockReturnValue(new Promise(() => {})); // nunca resuelve

    const { container } = setup();

    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("muestra el estado vacío cuando no hay transacciones", async () => {
    mocks.getHistory.mockResolvedValue([]);

    setup();

    expect(await screen.findByText("Todavía no tenés transacciones")).toBeInTheDocument();
  });

  it("muestra un error si falla la carga del historial", async () => {
    mocks.getHistory.mockRejectedValue(new Error("network error"));

    setup();

    expect(await screen.findByText("No pudimos cargar tu historial. Probá de nuevo en un rato.")).toBeInTheDocument();
  });

  it("lista las transacciones reales del back", async () => {
    mocks.getHistory.mockResolvedValue(ITEMS);

    setup();

    expect(await screen.findAllByText("Cambio USD → ARS")).not.toHaveLength(0);
    expect(screen.getAllByText("Transferencia recibida").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Transferencia enviada").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Carga de saldo").length).toBeGreaterThan(0);
  });

  it("al clickear una fila despliega el detalle ahí mismo, sin modal ni navegación", async () => {
    const user = userEvent.setup();
    mocks.getHistory.mockResolvedValue(ITEMS);

    setup();

    const row = (await screen.findAllByText("Cambio USD → ARS"))[0].closest("button")!;
    expect(row).toHaveAttribute("aria-expanded", "false");

    // el detalle no está en el DOM antes de clickear
    expect(screen.queryByText("Tipo de cambio")).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(row);

    expect(row).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByText("Tipo de cambio").length).toBeGreaterThan(0);
    expect(screen.getAllByText("NP-1").length).toBeGreaterThan(0);
    // sigue sin haber ningún modal — el detalle se abrió en la misma página
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // clickear de nuevo lo colapsa
    await user.click(row);
    expect(row).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Tipo de cambio")).not.toBeInTheDocument();
  });

  it("filtra por tipo (Cambios)", async () => {
    const user = userEvent.setup();
    mocks.getHistory.mockResolvedValue(ITEMS);

    setup();
    await screen.findAllByText("Cambio USD → ARS");

    await user.click(screen.getByRole("button", { name: "Cambios" }));

    expect(screen.getAllByText("Cambio USD → ARS").length).toBeGreaterThan(0);
    expect(screen.queryByText("Carga de saldo")).not.toBeInTheDocument();
    expect(screen.queryByText("Transferencia recibida")).not.toBeInTheDocument();
  });

  it("busca por texto", async () => {
    const user = userEvent.setup();
    mocks.getHistory.mockResolvedValue(ITEMS);

    setup();
    await screen.findAllByText("Cambio USD → ARS");

    await user.type(screen.getByPlaceholderText("Buscar"), "Carga");

    expect(screen.getAllByText("Carga de saldo").length).toBeGreaterThan(0);
    expect(screen.queryByText("Cambio USD → ARS")).not.toBeInTheDocument();
  });

  it("una transacción rechazada no se cuenta en el resumen de entradas/salidas", async () => {
    mocks.getHistory.mockResolvedValue(ITEMS);

    setup();
    await screen.findAllByText("Cambio USD → ARS");

    const resumen = screen.getByText("Resumen del período").closest(".card") as HTMLElement;
    // ARS 1.000,00 (la transferencia rechazada) no debería sumarse a Salidas
    expect(within(resumen).queryByText(/1\.000,00 ARS/)).not.toBeInTheDocument();
  });

  it("indica el estado de cada operación con su badge", async () => {
    mocks.getHistory.mockResolvedValue(ITEMS);

    setup();
    await screen.findAllByText("Cambio USD → ARS");

    await waitFor(() => {
      expect(screen.getAllByText("Pendiente").length).toBeGreaterThan(0);
      expect(screen.getAllByText("Rechazada").length).toBeGreaterThan(0);
    });
  });

  it("sin counterparty/fee (back todavía no los manda) usa el título genérico y no muestra esas filas", async () => {
    const user = userEvent.setup();
    mocks.getHistory.mockResolvedValue(ITEMS); // ninguno trae counterparty ni fee

    setup();

    const row = (await screen.findAllByText("Transferencia enviada"))[0].closest("button")!;
    await user.click(row);

    expect(screen.queryByText("Para")).not.toBeInTheDocument();
    expect(screen.queryByText("Alias")).not.toBeInTheDocument();
    expect(screen.queryByText("Comisión")).not.toBeInTheDocument();
  });

  it("cuando el back manda counterparty y fee, los muestra: título con el nombre y comisión del 0,5% en un cambio", async () => {
    const user = userEvent.setup();
    const itemsWithExtras: HistoryItem[] = [
      {
        id: 5,
        operationType: "pago",
        status: "completed",
        transactionDate: "2026-08-15T16:20:00.000Z",
        amount: 30,
        currencyCode: "USD",
        counterparty: { name: "Julián Torres", alias: "julian.torres.nomapay" },
        fee: 0,
      },
      {
        id: 6,
        operationType: "cambio",
        status: "completed",
        transactionDate: "2026-08-25T13:24:00.000Z",
        amount: 150,
        currencyCode: "USD",
        exchangeData: { currencyOrigin: "USD", currencyDestination: "ARS", finalAmount: 254775 },
        fee: 0.75,
      },
    ];
    mocks.getHistory.mockResolvedValue(itemsWithExtras);

    setup();

    // pago: título usa el nombre real, y el detalle muestra Para/Alias y "Sin cargo"
    const pagoRow = (await screen.findAllByText("Envío a Julián Torres"))[0].closest("button")!;
    await user.click(pagoRow);
    expect(screen.getAllByText("Julián Torres").length).toBeGreaterThan(0);
    expect(screen.getAllByText("julian.torres.nomapay").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Sin cargo").length).toBeGreaterThan(0);

    // cambio: la comisión se calcula del fee real (0.75 / 150 = 0.5%)
    const cambioRow = (await screen.findAllByText("Cambio USD → ARS"))[0].closest("button")!;
    await user.click(cambioRow);
    expect(screen.getAllByText("Comisión (0,5%)").length).toBeGreaterThan(0);
    expect(screen.getAllByText("USD 0,75").length).toBeGreaterThan(0);
  });
});

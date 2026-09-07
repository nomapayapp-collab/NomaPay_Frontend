import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Summary from "../../pages/summary/Summary";

const mocks = vi.hoisted(() => ({
  useWallet: vi.fn(),
}));

vi.mock("../../hooks/useWallet", () => ({
  useWallet: mocks.useWallet,
}));

vi.mock("../../components/layout/Header", () => ({
  Header: ({
    title,
    subtitle,
  }: {
    title: string;
    subtitle?: string;
  }) => (
    <header>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </header>
  ),
}));

const wallet = {
  balances: [
    {
      currency: {
        code: "ARS" as const,
        name: "Peso argentino",
        symbol: "$",
      },
      amount: 1982.3,
      isPrimary: true,
    },
    {
      currency: {
        code: "USD" as const,
        name: "Dólar estadounidense",
        symbol: "US$",
      },
      amount: 100,
    },
  ],
  exchangeRates: [],
  recentMovements: [],
};

describe("Summary", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.useWallet.mockReturnValue({
      wallet,
      loading: false,
      error: null,
      refetch: vi.fn(),
      mockDeposit: vi.fn(),
      mockTransfer: vi.fn(),
    });
  });

  it("muestra el título y el período semanal", () => {
    render(<Summary />);

    expect(
      screen.getByRole("heading", { name: "Resumen" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Semana del 31 ago al 6 sep"),
    ).toBeInTheDocument();
  });

  it("muestra el saldo actual de la moneda principal", () => {
    render(<Summary />);

    expect(screen.getByText("Balance total")).toBeInTheDocument();
    expect(screen.getByText("ARS 1.982,30")).toBeInTheDocument();
  });

  it("muestra el gráfico, el desglose y el aviso semanal", () => {
    render(<Summary />);

    expect(
      screen.getByText("Entradas, salidas y cambios por día"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Desglose por tipo"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Comparado con la semana pasada"),
    ).toBeInTheDocument();

    expect(
      screen.getAllByText("Entradas").length,
    ).toBeGreaterThan(0);

    expect(
      screen.getAllByText("Salidas").length,
    ).toBeGreaterThan(0);

    expect(
      screen.getAllByText("Cambios").length,
    ).toBeGreaterThan(0);

    expect(
      screen.getByText("Resumen semanal por correo"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /Recibirás automáticamente tu resumen todos los domingos/,
      ),
    ).toBeInTheDocument();
  });

  it("muestra el estado de carga mientras obtiene la billetera", () => {
    mocks.useWallet.mockReturnValue({
      wallet,
      loading: true,
      error: null,
      refetch: vi.fn(),
      mockDeposit: vi.fn(),
      mockTransfer: vi.fn(),
    });

    render(<Summary />);

    expect(screen.getByText("Cargando...")).toBeInTheDocument();
  });
});
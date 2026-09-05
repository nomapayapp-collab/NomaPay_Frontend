import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BalanceCard } from "../../components/wallet/BalanceCard";
import type { Wallet } from "../../types/wallet";

const mocks = vi.hoisted(() => ({
  useWallet: vi.fn(),
}));

vi.mock("../../hooks/useWallet", () => ({
  useWallet: mocks.useWallet,
}));

const ARS = { code: "ARS" as const, name: "Peso argentino", symbol: "$" };
const USD = { code: "USD" as const, name: "Dólar estadounidense", symbol: "US$" };
const BRL = { code: "BRL" as const, name: "Real brasileño", symbol: "R$" };

function makeWallet(balances: Wallet["balances"]): Wallet {
  return { balances, exchangeRates: [], recentMovements: [] };
}

function mockWallet(wallet: Wallet, loading = false) {
  mocks.useWallet.mockReturnValue({
    wallet,
    loading,
    error: null,
    refetch: vi.fn(),
    mockDeposit: vi.fn(),
    mockTransfer: vi.fn(),
  });
}

describe("BalanceCard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("no muestra las monedas en 0, salvo la moneda por defecto", () => {
    mockWallet(
      makeWallet([
        { currency: ARS, amount: 0, isPrimary: true },
        { currency: USD, amount: 100 },
        { currency: BRL, amount: 0 },
      ]),
    );

    render(<BalanceCard />);

    expect(screen.getAllByText("ARS 0,00").length).toBeGreaterThan(0);
    expect(screen.getAllByText("USD 100,00").length).toBeGreaterThan(0);
    expect(screen.queryByText(/BRL/)).not.toBeInTheDocument();
  });

  it("con 2 monedas no arma el carrusel con scroll (se reparten el ancho)", () => {
    mockWallet(
      makeWallet([
        { currency: ARS, amount: 100, isPrimary: true },
        { currency: USD, amount: 50 },
      ]),
    );

    const { container } = render(<BalanceCard />);
    const wrapper = container.firstElementChild as HTMLElement;

    expect(wrapper.className).not.toContain("overflow-x-auto");
  });

  it("con 3 monedas activa el carrusel con scroll horizontal", () => {
    mockWallet(
      makeWallet([
        { currency: ARS, amount: 100, isPrimary: true },
        { currency: USD, amount: 50 },
        { currency: BRL, amount: 20 },
      ]),
    );

    const { container } = render(<BalanceCard />);
    const wrapper = container.firstElementChild as HTMLElement;

    expect(wrapper.className).toContain("overflow-x-auto");
  });

  it("el botón del ojo oculta y muestra el saldo", async () => {
    const user = userEvent.setup();
    mockWallet(makeWallet([{ currency: ARS, amount: 1234.5, isPrimary: true }]));

    render(<BalanceCard />);

    expect(screen.getByText("ARS 1.234,50")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Ocultar saldo" }));

    expect(screen.queryByText("ARS 1.234,50")).not.toBeInTheDocument();
    expect(screen.getByText("••••••")).toBeInTheDocument();
  });

  it("no renderiza nada si no hay saldos y ya terminó de cargar", () => {
    mockWallet(makeWallet([]));

    const { container } = render(<BalanceCard />);

    expect(container).toBeEmptyDOMElement();
  });

  it("muestra el esqueleto mientras carga", () => {
    mockWallet(makeWallet([]), true);

    const { container } = render(<BalanceCard />);

    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });
});
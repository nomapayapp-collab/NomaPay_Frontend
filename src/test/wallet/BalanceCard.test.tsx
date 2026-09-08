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

const ARS = {
  code: "ARS" as const,
  name: "Peso argentino",
  symbol: "$",
};

const USD = {
  code: "USD" as const,
  name: "Dólar estadounidense",
  symbol: "US$",
};

const BRL = {
  code: "BRL" as const,
  name: "Real brasileño",
  symbol: "R$",
};

function makeWallet(balances: Wallet["balances"]): Wallet {
  return {
    balances,
    exchangeRates: [],
    recentMovements: [],
  };
}

function mockWallet(wallet: Wallet) {
  mocks.useWallet.mockReturnValue({
    wallet,
    loading: false,
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

  it("muestra todas las monedas, incluso las que tienen saldo en 0", () => {
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
    expect(screen.getAllByText("BRL 0,00").length).toBeGreaterThan(0);
  });

  it("reparte el ancho disponible entre las tarjetas", () => {
    mockWallet(
      makeWallet([
        { currency: ARS, amount: 100, isPrimary: true },
        { currency: USD, amount: 50 },
      ]),
    );

    const { container } = render(<BalanceCard />);
    const wrapper = container.firstElementChild as HTMLElement;
    const cards = Array.from(wrapper.children) as HTMLElement[];

    expect(wrapper.className).toContain("overflow-x-auto");
    expect(cards).toHaveLength(2);

    cards.forEach((card) => {
      expect(card.className).toContain("min-w-70");
      expect(card.className).toContain("flex-1");
    });
  });

  it("con 3 monedas permite desplazamiento horizontal", () => {
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
    expect(wrapper.className).toContain("snap-x");
  });

  it("el botón del ojo oculta y muestra el saldo", async () => {
    const user = userEvent.setup();

    mockWallet(
      makeWallet([
        { currency: ARS, amount: 1234.5, isPrimary: true },
      ]),
    );

    render(<BalanceCard />);

    expect(screen.getByText("ARS 1.234,50")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Ocultar saldo" }),
    );

    expect(screen.queryByText("ARS 1.234,50")).not.toBeInTheDocument();
    expect(screen.getByText("••••••")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Mostrar saldo" }),
    );

    expect(screen.getByText("ARS 1.234,50")).toBeInTheDocument();
  });

  it("no renderiza nada cuando no existen balances", () => {
    mockWallet(makeWallet([]));

    const { container } = render(<BalanceCard />);

    expect(container).toBeEmptyDOMElement();
  });
});
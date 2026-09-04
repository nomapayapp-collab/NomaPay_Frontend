import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TopUpModal } from "../../../components/wallet/TopUpModal";

const mocks = vi.hoisted(() => ({
  useWallet: vi.fn(),
}));

vi.mock("../../../hooks/useWallet", () => ({
  useWallet: mocks.useWallet,
}));

const BALANCES = [
  { currency: { code: "ARS" as const, name: "Peso argentino", symbol: "$" }, amount: 1000, isPrimary: true },
  { currency: { code: "USD" as const, name: "Dólar estadounidense", symbol: "US$" }, amount: 50 },
  { currency: { code: "BRL" as const, name: "Real brasileño", symbol: "R$" }, amount: 0 },
];

describe("TopUpModal", () => {
  const mockDeposit = vi.fn();
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useWallet.mockReturnValue({
      wallet: { balances: BALANCES, exchangeRates: [], recentMovements: [] },
      loading: false,
      error: null,
      refetch: vi.fn(),
      mockDeposit,
      mockTransfer: vi.fn(),
    });
  });

  it("no renderiza nada si open es false", () => {
    const { container } = render(<TopUpModal open={false} onClose={onClose} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("arranca con la moneda primaria seleccionada y el botón deshabilitado sin monto", () => {
    render(<TopUpModal open onClose={onClose} />);

    expect(screen.getByRole("button", { name: "ARS" })).toHaveClass("border-violet-500");
    expect(screen.getByRole("button", { name: "Cargar saldo" })).toBeDisabled();
  });

  it("abre con la moneda que le pasás por initialCurrency", () => {
    render(<TopUpModal open onClose={onClose} initialCurrency="BRL" />);

    expect(screen.getByRole("button", { name: "BRL" })).toHaveClass("border-violet-500");
  });

  it("carga un monto rápido y confirma: acredita en la moneda elegida y cierra el modal", async () => {
    const user = userEvent.setup();
    render(<TopUpModal open onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "USD" }));
    await user.click(screen.getByRole("button", { name: "USD 500,00" }));
    await user.click(screen.getByRole("button", { name: "Cargar saldo" }));

    await waitFor(() => {
      expect(mockDeposit).toHaveBeenCalledWith("USD", 500);
    });
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });
});
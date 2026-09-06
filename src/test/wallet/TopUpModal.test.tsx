import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TopUpModal } from "../../components/wallet/TopUpModal";

const mocks = vi.hoisted(() => ({
  useWallet: vi.fn(),
}));

vi.mock("../../hooks/useWallet", () => ({
  useWallet: mocks.useWallet,
}));

vi.mock("../../../hooks/useToast", () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));

const BALANCES = [
  { currency: { code: "ARS" as const, name: "Peso argentino", symbol: "$" }, amount: 1000, isPrimary: true },
  { currency: { code: "USD" as const, name: "Dólar estadounidense", symbol: "US$" }, amount: 50 },
  { currency: { code: "BRL" as const, name: "Real brasileño", symbol: "R$" }, amount: 0 },
];

describe("TopUpModal", () => {
  const deposit = vi.fn();
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useWallet.mockReturnValue({
      wallet: { balances: BALANCES, exchangeRates: [], recentMovements: [] },
      loading: false,
      error: null,
      refetch: vi.fn(),
      setPreferredCurrency: vi.fn(),
      deposit,
      mockDeposit: vi.fn(),
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

  it("carga un monto rápido, pide confirmación y recién ahí acredita en la moneda elegida y cierra el modal", async () => {
    const user = userEvent.setup();
    render(<TopUpModal open onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "USD" }));
    await user.click(screen.getByRole("button", { name: "USD 500,00" }));
    await user.click(screen.getByRole("button", { name: "Cargar saldo" }));

    // todavía no debería haber depositado: falta confirmar en el modal
    expect(deposit).not.toHaveBeenCalled();

    await user.click(await screen.findByRole("button", { name: "Sí, cargar saldo" }));

    await waitFor(() => {
      expect(deposit).toHaveBeenCalledWith("USD", 500);
    });
    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("si el back rechaza la carga (ej. supera el límite por moneda), muestra el error y no cierra el modal", async () => {
    deposit.mockRejectedValueOnce(new Error("falló"));
    const user = userEvent.setup();
    render(<TopUpModal open onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "USD" }));
    await user.click(screen.getByRole("button", { name: "USD 5.000,00" }));
    await user.click(screen.getByRole("button", { name: "Cargar saldo" }));
    await user.click(await screen.findByRole("button", { name: "Sí, cargar saldo" }));

    expect(await screen.findByText("No pudimos procesar la carga. Probá de nuevo en un rato.")).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("muestra el máximo por moneda y avisa en el momento si lo superás, sin llegar a pegarle al back", async () => {
    const user = userEvent.setup();
    render(<TopUpModal open onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "USD" }));

    expect(screen.getByText("Máximo por carga en USD: USD 10.000,00")).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText("0,00"), "15000");

    expect(screen.getByText("El monto máximo por carga en USD es USD 10.000,00.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cargar saldo" })).toBeDisabled();
    expect(deposit).not.toHaveBeenCalled();
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Wallet from "../../pages/Wallet";

const mocks = vi.hoisted(() => ({
  useWallet: vi.fn(),
  useAuth: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock("../../hooks/useWallet", () => ({
  useWallet: mocks.useWallet,
}));

vi.mock("../../hooks/useAuth", () => ({
  useAuth: mocks.useAuth,
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => mocks.navigate };
});

const BALANCES = [
  { currency: { code: "ARS" as const, name: "Peso argentino", symbol: "$" }, amount: 1000, isPrimary: true },
  { currency: { code: "USD" as const, name: "Dólar estadounidense", symbol: "US$" }, amount: 50 },
  { currency: { code: "BRL" as const, name: "Real brasileño", symbol: "R$" }, amount: 0 },
];

function setup() {
  mocks.useWallet.mockReturnValue({
    wallet: {
      balances: BALANCES,
      exchangeRates: [{ from: "ARS", to: "USD", rate: 1700 }],
      recentMovements: [],
    },
    loading: false,
    error: null,
    refetch: vi.fn(),
    mockDeposit: vi.fn(),
    mockTransfer: vi.fn(),
  });
  mocks.useAuth.mockReturnValue({ user: { alias: "cande.viajera.ar" } });
  return render(<Wallet />);
}

describe("Wallet", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra el esqueleto mientras carga", () => {
    mocks.useWallet.mockReturnValue({
      wallet: { balances: [], exchangeRates: [], recentMovements: [] },
      loading: true,
      error: null,
      refetch: vi.fn(),
      mockDeposit: vi.fn(),
      mockTransfer: vi.fn(),
    });
    mocks.useAuth.mockReturnValue({ user: null });

    const { container } = render(<Wallet />);

    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("lista todas las monedas activas en Saldo por moneda, incluida la que está en 0", () => {
    setup();

    // a diferencia de BalanceCard (que oculta las de saldo 0), acá se
    // listan todas las monedas activas del usuario.
    expect(screen.getAllByText("Real brasileño").length).toBeGreaterThan(0);
  });

  it("copia el alias al portapapeles", async () => {
    const user = userEvent.setup();
    setup();

    // navigator.clipboard en este jsdom no existe todavia antes del
    // primer render (es undefined), asi que no se puede stubear en un
    // beforeEach global — recien despues de renderizar el objeto real
    // esta disponible y se puede espiar su metodo writeText.
    const writeTextSpy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);

    await user.click(screen.getAllByRole("button", { name: /Copiar/ })[0]);

    expect(writeTextSpy).toHaveBeenCalledWith("cande.viajera.ar");
  });

  it("navega a Transferir", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getAllByRole("button", { name: /Transferir/ })[0]);

    expect(mocks.navigate).toHaveBeenCalledWith("/transfer");
  });

  it("abre el modal de Cargar saldo", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getAllByRole("button", { name: /Cargar saldo|Agregar saldo/ })[0]);

    expect(screen.getByRole("dialog", { name: "Cargar saldo" })).toBeInTheDocument();
  });
});

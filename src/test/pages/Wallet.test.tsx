import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Wallet from "../../pages/Wallet";

const mocks = vi.hoisted(() => ({
  useWallet: vi.fn(),
  useAuth: vi.fn(),
  navigate: vi.fn(),
  showToast: vi.fn(),
}));

vi.mock("../../hooks/useWallet", () => ({
  useWallet: mocks.useWallet,
}));

vi.mock("../../hooks/useAuth", () => ({
  useAuth: mocks.useAuth,
}));

vi.mock("../../hooks/useToast", () => ({
  useToast: () => ({ showToast: mocks.showToast }),
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

function setup(overrides: { setPreferredCurrency?: ReturnType<typeof vi.fn> } = {}) {
  mocks.useWallet.mockReturnValue({
    wallet: {
      balances: BALANCES,
      exchangeRates: [{ from: "ARS", to: "USD", rate: 1700 }],
      recentMovements: [],
    },
    loading: false,
    error: null,
    refetch: vi.fn(),
    setPreferredCurrency: overrides.setPreferredCurrency ?? vi.fn().mockResolvedValue(undefined),
    deposit: vi.fn(),
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

  it("lista todas las monedas en Monedas activas, incluida la que está en 0", () => {
    setup();

    // a diferencia de BalanceCard (que oculta las de saldo 0), acá se
    // listan todas las monedas del usuario — incluida la que está en 0
    // (Cande sacó el nombre completo de la moneda de esta lista, así que
    // ahora se identifica por el saldo formateado con su código).
    expect(screen.getAllByText("BRL 0,00").length).toBeGreaterThan(0);
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


  it("abre el modal de Cargar saldo", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getAllByRole("button", { name: /Cargar saldo|Agregar saldo/ })[0]);

    expect(screen.getByRole("dialog", { name: "Cargar saldo" })).toBeInTheDocument();
  });

  it("elige una moneda favorita y muestra el toast de confirmación", async () => {
    const user = userEvent.setup();
    const setPreferredCurrency = vi.fn().mockResolvedValue(undefined);
    setup({ setPreferredCurrency });

    await user.click(screen.getAllByRole("button", { name: /USD · Dólar estadounidense/ })[0]);

    expect(setPreferredCurrency).toHaveBeenCalledWith("USD");
    await waitFor(() => {
      expect(mocks.showToast).toHaveBeenCalledWith(
        "Tu moneda favorita ahora es USD",
        "success",
        expect.anything(),
      );
    });
  });

  it("muestra un error si falla al elegir la moneda favorita", async () => {
    const user = userEvent.setup();
    const setPreferredCurrency = vi.fn().mockRejectedValue(new Error("falló"));
    setup({ setPreferredCurrency });

    await user.click(screen.getAllByRole("button", { name: /USD · Dólar estadounidense/ })[0]);

    const errors = await screen.findAllByText("No pudimos actualizar tu moneda favorita. Probá de nuevo.");
    expect(errors.length).toBeGreaterThan(0);
    expect(mocks.showToast).not.toHaveBeenCalled();
  });

  it("en Monedas activas permite desactivar una moneda sin saldo, pero no una con saldo", async () => {
    const user = userEvent.setup();
    setup();

    // BalanceCard, "Monedas activas", etc. se renderizan una vez para
    // mobile y otra para desktop (ocultas con clases de Tailwind, no
    // sacadas del DOM), así que hay que agarrar el primero de cada uno.
    const usdSwitch = screen.getAllByRole("switch", { name: "Dólar estadounidense activada" })[0];
    const brlSwitch = screen.getAllByRole("switch", { name: "Real brasileño activada" })[0];

    // USD tiene saldo > 0: no se puede desactivar.
    expect(usdSwitch).toBeDisabled();
    // BRL está en 0: sí se puede.
    expect(brlSwitch).not.toBeDisabled();

    await user.click(brlSwitch);

    expect(screen.getAllByRole("switch", { name: "Real brasileño desactivada" }).length).toBeGreaterThan(0);
  });

  it("muestra la advertencia de que no se puede desactivar una moneda con saldo", () => {
    setup();

    expect(screen.getAllByText("No podés desactivar una moneda con saldo").length).toBeGreaterThan(0);
  });
});

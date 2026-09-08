import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
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
  useToast: () => ({
    showToast: mocks.showToast,
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useNavigate: () => mocks.navigate,
  };
});

const BALANCES = [
  {
    currency: {
      code: "ARS" as const,
      name: "Peso argentino",
      symbol: "$",
    },
    amount: 1000,
    isPrimary: true,
  },
  {
    currency: {
      code: "USD" as const,
      name: "Dólar estadounidense",
      symbol: "US$",
    },
    amount: 50,
  },
  {
    currency: {
      code: "BRL" as const,
      name: "Real brasileño",
      symbol: "R$",
    },
    amount: 0,
  },
];

type SetupOverrides = {
  setPreferredCurrency?: ReturnType<typeof vi.fn>;
};

function setup(overrides: SetupOverrides = {}) {
  mocks.useWallet.mockReturnValue({
    wallet: {
      balances: BALANCES,
      exchangeRates: [
        {
          from: "ARS",
          to: "USD",
          rate: 1700,
        },
      ],
      recentMovements: [],
    },
    loading: false,
    error: null,
    refetch: vi.fn(),
    setPreferredCurrency:
      overrides.setPreferredCurrency ??
      vi.fn().mockResolvedValue(undefined),
    deposit: vi.fn(),
    mockDeposit: vi.fn(),
    mockTransfer: vi.fn(),
  });

  mocks.useAuth.mockReturnValue({
    user: {
      name: "Cande",
      surname: "Ferrari",
      alias: "cande.viajera.ar",
    },
  });

  return render(<Wallet />);
}

describe("Wallet", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra el esqueleto mientras carga", () => {
    mocks.useWallet.mockReturnValue({
      wallet: {
        balances: [],
        exchangeRates: [],
        recentMovements: [],
      },
      loading: true,
      error: null,
      refetch: vi.fn(),
      setPreferredCurrency: vi.fn(),
      deposit: vi.fn(),
      mockDeposit: vi.fn(),
      mockTransfer: vi.fn(),
    });

    mocks.useAuth.mockReturnValue({
      user: null,
    });

    const { container } = render(<Wallet />);

    expect(
      container.querySelector(".animate-pulse"),
    ).toBeInTheDocument();
  });

  it("copia el alias al portapapeles", async () => {
    const user = userEvent.setup();

    setup();

    const writeTextSpy = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);

    await user.click(
      screen.getAllByRole("button", {
        name: /copiar/i,
      })[0],
    );

    expect(writeTextSpy).toHaveBeenCalledWith(
      "cande.viajera.ar",
    );
  });

  it("abre el modal de Cargar saldo", async () => {
    const user = userEvent.setup();

    setup();

    await user.click(
      screen.getAllByRole("button", {
        name: /cargar saldo|agregar saldo/i,
      })[0],
    );

    expect(
      screen.getByRole("dialog", {
        name: "Cargar saldo",
      }),
    ).toBeInTheDocument();
  });

  it("elige una moneda favorita y muestra el toast de confirmación", async () => {
    const user = userEvent.setup();

    const setPreferredCurrency = vi
      .fn()
      .mockResolvedValue(undefined);

    setup({
      setPreferredCurrency,
    });

    await user.click(
      screen.getAllByRole("button", {
        name: /USD · Dólar estadounidense/i,
      })[0],
    );

    expect(setPreferredCurrency).toHaveBeenCalledWith(
      "USD",
    );

    await waitFor(() => {
      expect(mocks.showToast).toHaveBeenCalledWith(
        "Tu moneda favorita ahora es USD",
        "success",
        expect.anything(),
      );
    });
  });

  it("muestra un toast de error si falla al elegir la moneda favorita", async () => {
    const user = userEvent.setup();

    const setPreferredCurrency = vi
      .fn()
      .mockRejectedValue(new Error("falló"));

    setup({
      setPreferredCurrency,
    });

    await user.click(
      screen.getAllByRole("button", {
        name: /USD · Dólar estadounidense/i,
      })[0],
    );

    await waitFor(() => {
      expect(mocks.showToast).toHaveBeenCalledWith(
        "No pudimos actualizar tu moneda favorita. Probá de nuevo.",
        "error",
      );
    });

    expect(setPreferredCurrency).toHaveBeenCalledWith(
      "USD",
    );
  });

  it("mantiene deshabilitada la moneda favorita actual", () => {
    setup();

    const favoriteButtons = screen.getAllByRole(
      "button",
      {
        name: /ARS · Peso argentino/i,
      },
    );

    expect(favoriteButtons.length).toBeGreaterThan(0);

    favoriteButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });
});
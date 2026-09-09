import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Exchange from "../../pages/Exchange";
import { ToastProvider } from "../../context/ToastContext";

const {
  mockUseAuth,
  mockUseWallet,
  mockExchangeCurrency,
  mockRefetch,
  mockNavigate,
} = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
  mockUseWallet: vi.fn(),
  mockExchangeCurrency: vi.fn(),
  mockRefetch: vi.fn(),
  mockNavigate: vi.fn(),
}));

vi.mock("../../hooks/useAuth", () => ({
  useAuth: mockUseAuth,
}));

vi.mock("../../hooks/useWallet", () => ({
  useWallet: mockUseWallet,
}));

vi.mock("../../services/walletService", () => ({
  exchangeCurrency: mockExchangeCurrency,
}));

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const walletMock = {
  balances: [
    {
      currency: {
        code: "USD",
        name: "Dólar estadounidense",
        symbol: "US$",
      },
      amount: 1000,
      isPrimary: true,
    },
    {
      currency: {
        code: "ARS",
        name: "Peso argentino",
        symbol: "$",
      },
      amount: 0,
    },
    {
      currency: {
        code: "BRL",
        name: "Real brasileño",
        symbol: "R$",
      },
      amount: 0,
    },
  ],
  exchangeRates: [
    {
      from: "USD",
      to: "ARS",
      rate: 1700,
    },
    {
      from: "BRL",
      to: "ARS",
      rate: 300,
    },
  ],
  recentMovements: [],
};

const exchangeResponseMock = {
  transaction: {
    id: 5,
    type: "exchange",
    status: "completed",
    currencyOrigin: "USD",
    currencyDestination: "ARS",
    amount: "10.00",
    fee: "0.05",
    finalAmount: "17000.00",
    exchangeRate: "1700.00",
    transactionDate: "2026-09-04T16:28:52.543Z",
  },
  wallet: {
    walletId: 14,
    preferredCurrency: "USD",
    balances: [
      {
        currencyCode: "USD",
        currencyName: "Dólar Estadounidense",
        symbol: "$",
        amount: "989.95",
      },
      {
        currencyCode: "ARS",
        currencyName: "Peso Argentino",
        symbol: "$",
        amount: "17000.00",
      },
      {
        currencyCode: "BRL",
        currencyName: "Real Brasileño",
        symbol: "R$",
        amount: "0.00",
      },
    ],
  },
};

function renderExchange() {
  return render(
    <ToastProvider>
      <Exchange />
    </ToastProvider>,
  );
}

async function waitForPrimaryCurrencySelected() {
  await waitFor(() => {
    expect(
      screen.getByRole("button", {
        name: /dólar estadounidense/i,
      }),
    ).toBeInTheDocument();
  });
}

describe("Exchange", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseAuth.mockReturnValue({
      user: {
        name: "Agustin Spataro",
      },
    });

    mockUseWallet.mockReturnValue({
      wallet: walletMock,
      loading: false,
      error: null,
      refetch: mockRefetch,
      setPreferredCurrency: vi.fn(),
      deposit: vi.fn(),
      mockDeposit: vi.fn(),
      mockTransfer: vi.fn(),
    });
  });

 it("muestra el título y el subtítulo", () => {
  renderExchange();

  expect(
    screen.getByRole("heading", {
      name: /convertir monedas/i,
    }),
  ).toBeInTheDocument();

  expect(
    screen.getByText(/entre tus propias monedas/i),
  ).toBeInTheDocument();
});

it("muestra los saldos obtenidos desde WalletContext", async () => {
  renderExchange();

  await waitFor(() => {
    expect(
      screen.getAllByText("1.000,00").length,
    ).toBeGreaterThan(0);
  });

  expect(
    screen.getAllByText(/disponible:/i).length,
  ).toBeGreaterThan(0);
});

  it("muestra el estado de carga de la billetera", () => {
    mockUseWallet.mockReturnValue({
      wallet: {
        balances: [],
        exchangeRates: [],
        recentMovements: [],
      },
      loading: true,
      error: null,
      refetch: mockRefetch,
      setPreferredCurrency: vi.fn(),
      deposit: vi.fn(),
      mockDeposit: vi.fn(),
      mockTransfer: vi.fn(),
    });

    renderExchange();

    expect(
      screen.getByText(/cargando saldos y cotizaciones/i),
    ).toBeInTheDocument();
  });

  it("muestra un error de billetera", () => {
    mockUseWallet.mockReturnValue({
      wallet: {
        balances: [],
        exchangeRates: [],
        recentMovements: [],
      },
      loading: false,
      error: "No pudimos cargar tu saldo.",
      refetch: mockRefetch,
      setPreferredCurrency: vi.fn(),
      deposit: vi.fn(),
      mockDeposit: vi.fn(),
      mockTransfer: vi.fn(),
    });

    renderExchange();

    expect(
      screen.getByText(/no pudimos cargar tu saldo/i),
    ).toBeInTheDocument();
  });

  it("no permite elegir la moneda de origen como destino", async () => {
    const user = userEvent.setup();

    renderExchange();

    await waitForPrimaryCurrencySelected();

    await user.click(
      screen.getByRole("button", {
        name: /peso argentino/i,
      }),
    );

    expect(
      screen.queryByRole("option", {
        name: /dólar estadounidense/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("coloca el 10% del saldo al presionar 10%", async () => {
    const user = userEvent.setup();

    renderExchange();

    await waitForPrimaryCurrencySelected();

    await user.click(
      screen.getByRole("button", {
        name: "10%",
      }),
    );

    expect(
      screen.getByLabelText(/monto a convertir/i),
    ).toHaveValue("100,00");
  });

  it("coloca todo el saldo al presionar Máximo", async () => {
    const user = userEvent.setup();

    renderExchange();

    await waitForPrimaryCurrencySelected();

    await user.click(
      screen.getByRole("button", {
        name: /máximo/i,
      }),
    );

    expect(
      screen.getByLabelText(/monto a convertir/i),
    ).toHaveValue("1.000,00");
  });

  it("muestra un error cuando el monto supera el saldo", async () => {
    renderExchange();

    await waitForPrimaryCurrencySelected();

    const input = screen.getByLabelText(
      /monto a convertir/i,
    );

    fireEvent.change(input, {
      target: {
        value: "2000,00",
      },
    });

    const continueButton = screen.getByRole("button", {
      name: /continuar/i,
    });

    expect(continueButton).toBeDisabled();

    expect(
      screen.getByText(/no tenés saldo suficiente/i),
    ).toBeInTheDocument();

    expect(mockExchangeCurrency).not.toHaveBeenCalled();
  });

  it("envía la conversión y muestra el éxito", async () => {
    const user = userEvent.setup();

    mockExchangeCurrency.mockResolvedValueOnce(
      exchangeResponseMock,
    );

    renderExchange();

    await waitForPrimaryCurrencySelected();

    const input = screen.getByLabelText(
      /monto a convertir/i,
    );

    await user.clear(input);
    await user.type(input, "10,00");

    await user.click(
      screen.getByRole("button", {
        name: /continuar/i,
      }),
    );

    const confirmButton = await screen.findByRole(
      "button",
      {
        name: /sí, convertir/i,
      },
    );

    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockExchangeCurrency).toHaveBeenCalledTimes(1);
    });

    expect(mockExchangeCurrency).toHaveBeenCalledWith({
      fromCurrency: "USD",
      toCurrency: "ARS",
      amount: 10,
    });

    expect(
      await screen.findByText(/conversión aprobada/i),
    ).toBeInTheDocument();

    expect(input).toHaveValue("0,00");
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("muestra un error cuando falla la conversión", async () => {
    const user = userEvent.setup();

    mockExchangeCurrency.mockRejectedValueOnce(
      new Error("Error del backend"),
    );

    renderExchange();

    await waitForPrimaryCurrencySelected();

    const input = screen.getByLabelText(
      /monto a convertir/i,
    );

    await user.clear(input);
    await user.type(input, "1,00");

    await user.click(
      screen.getByRole("button", {
        name: /continuar/i,
      }),
    );

    const confirmButton = await screen.findByRole(
      "button",
      {
        name: /sí, convertir/i,
      },
    );

    await user.click(confirmButton);

    expect(
      await screen.findByText(
        /no pudimos realizar la conversión/i,
      ),
    ).toBeInTheDocument();

    expect(mockExchangeCurrency).toHaveBeenCalledTimes(1);
  });
});
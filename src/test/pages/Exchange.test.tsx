import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import Exchange from "../../pages/exchange/Exchange";

const {
  mockUseAuth,
  mockUseWallet,
  mockExchangeCurrency,
  mockRefetch,
} = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
  mockUseWallet: vi.fn(),
  mockExchangeCurrency: vi.fn(),
  mockRefetch: vi.fn(),
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
      mockDeposit: vi.fn(),
      mockTransfer: vi.fn(),
    });
  });

  it("muestra el título y el titular de la cuenta", () => {
    render(<Exchange />);

    expect(
      screen.getByRole("heading", {
        name: /convertir monedas/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/hola, agustin spataro/i),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/entre tus propias monedas/i),
    ).toBeInTheDocument();
  });

  it("muestra los saldos obtenidos desde WalletContext", async () => {
    render(<Exchange />);

    await waitFor(() => {
      expect(
        screen.getAllByText("1.000,00").length,
      ).toBeGreaterThan(0);
    });

    expect(
      screen.getByText(/disponible: us\$ 1\.000,00/i),
    ).toBeInTheDocument();
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
      mockDeposit: vi.fn(),
      mockTransfer: vi.fn(),
    });

    render(<Exchange />);

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
      mockDeposit: vi.fn(),
      mockTransfer: vi.fn(),
    });

    render(<Exchange />);

    expect(
      screen.getByText(/no pudimos cargar tu saldo/i),
    ).toBeInTheDocument();
  });

  it("no permite seleccionar la moneda de origen como destino", async () => {
    render(<Exchange />);

    const selectors = screen.getAllByRole("combobox");
    const originSelector = selectors[0];
    const destinationSelector = selectors[1];

    await waitFor(() => {
      expect(originSelector).toHaveValue("USD");
    });

    const usdOption = within(
      destinationSelector,
    ).getByRole("option", {
      name: /dólar estadounidense/i,
    });

    expect(usdOption).toBeDisabled();
  });

  it("coloca el 10% del saldo al presionar 10%", async () => {
    const user = userEvent.setup();

    render(<Exchange />);

    const originSelector =
      screen.getAllByRole("combobox")[0];

    await waitFor(() => {
      expect(originSelector).toHaveValue("USD");
    });

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

    render(<Exchange />);

    const originSelector =
      screen.getAllByRole("combobox")[0];

    await waitFor(() => {
      expect(originSelector).toHaveValue("USD");
    });

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
    render(<Exchange />);

    const originSelector =
      screen.getAllByRole("combobox")[0];

    await waitFor(() => {
      expect(originSelector).toHaveValue("USD");
    });

    const input = screen.getByLabelText(
      /monto a convertir/i,
    );

    fireEvent.change(input, {
      target: {
        value: "2000,00",
      },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /confirmar conversión/i,
      }),
    );

    expect(
      screen.getByText(/no tenés saldo suficiente/i),
    ).toBeInTheDocument();

    expect(
      mockExchangeCurrency,
    ).not.toHaveBeenCalled();
  });

  it("envía la conversión y muestra el éxito", async () => {
    const user = userEvent.setup();

    mockExchangeCurrency.mockResolvedValueOnce(
      exchangeResponseMock,
    );

    render(<Exchange />);

    const originSelector =
      screen.getAllByRole("combobox")[0];

    await waitFor(() => {
      expect(originSelector).toHaveValue("USD");
    });

    const input = screen.getByLabelText(
      /monto a convertir/i,
    );

    await user.clear(input);
    await user.type(input, "10,00");

    await user.click(
      screen.getByRole("button", {
        name: /confirmar conversión/i,
      }),
    );

    await waitFor(() => {
      expect(
        mockExchangeCurrency,
      ).toHaveBeenCalledWith({
        fromCurrency: "USD",
        toCurrency: "ARS",
        amount: 10,
      });
    });

    expect(
      await screen.findByText(/conversión aprobada/i),
    ).toBeInTheDocument();

    expect(input).toHaveValue("0,00");
    expect(mockRefetch).toHaveBeenCalled();
  });

  it("muestra un error cuando falla la conversión", async () => {
    const user = userEvent.setup();

    mockExchangeCurrency.mockRejectedValueOnce(
      new Error("Error del backend"),
    );

    render(<Exchange />);

    const originSelector =
      screen.getAllByRole("combobox")[0];

    await waitFor(() => {
      expect(originSelector).toHaveValue("USD");
    });

    const input = screen.getByLabelText(
      /monto a convertir/i,
    );

    await user.clear(input);
    await user.type(input, "1,00");

    await user.click(
      screen.getByRole("button", {
        name: /confirmar conversión/i,
      }),
    );

    expect(
      await screen.findByText(
        /no pudimos realizar la conversión/i,
      ),
    ).toBeInTheDocument();
  });
});
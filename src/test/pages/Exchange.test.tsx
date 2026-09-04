import {
  afterEach,
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
  mockGetMyWallet,
  mockExchangeCurrency,
} = vi.hoisted(() => ({
  mockGetMyWallet: vi.fn(),
  mockExchangeCurrency: vi.fn(),
}));

vi.mock("../../services/walletService", () => ({
  getMyWallet: mockGetMyWallet,
  exchangeCurrency: mockExchangeCurrency,
}));

const walletMock = {
  walletId: 14,
  preferredCurrency: "USD" as const,
  balances: [
    {
      currencyCode: "USD" as const,
      currencyName: "Dólar Estadounidense",
      symbol: "$",
      amount: "1000.00",
    },
    {
      currencyCode: "ARS" as const,
      currencyName: "Peso Argentino",
      symbol: "$",
      amount: "0.00",
    },
    {
      currencyCode: "BRL" as const,
      currencyName: "Real Brasileño",
      symbol: "R$",
      amount: "0.00",
    },
  ],
};

const exchangeResponseMock = {
  transaction: {
    id: 5,
    type: "exchange" as const,
    status: "completed",
    currencyOrigin: "USD" as const,
    currencyDestination: "ARS" as const,
    amount: "10.00",
    fee: "0.05",
    finalAmount: "17000.00",
    exchangeRate: "1700.00",
    transactionDate: "2026-09-04T16:28:52.543Z",
  },
  wallet: {
    walletId: 14,
    preferredCurrency: "USD" as const,
    balances: [
      {
        currencyCode: "USD" as const,
        currencyName: "Dólar Estadounidense",
        symbol: "$",
        amount: "989.95",
      },
      {
        currencyCode: "ARS" as const,
        currencyName: "Peso Argentino",
        symbol: "$",
        amount: "17000.00",
      },
      {
        currencyCode: "BRL" as const,
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

    mockGetMyWallet.mockResolvedValue(walletMock);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          rates: {
            ARS: 1700,
            USD: 1,
            BRL: 5,
          },
        }),
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("muestra el título del conversor", () => {
    render(<Exchange />);

    expect(
      screen.getByRole("heading", {
        name: /convertir/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/entre tus propias monedas/i),
    ).toBeInTheDocument();
  });

  it("consulta y muestra los saldos de la billetera", async () => {
    render(<Exchange />);

    expect(
      screen.getByText(/cargando saldos/i),
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(mockGetMyWallet).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(
        screen.queryByText(/cargando saldos/i),
      ).not.toBeInTheDocument();
    });

    expect(
      screen.getAllByText("1.000,00").length,
    ).toBeGreaterThan(0);
  });

  it("muestra un error si no se pueden cargar los saldos", async () => {
    mockGetMyWallet.mockRejectedValueOnce(
      new Error("Error de conexión"),
    );

    render(<Exchange />);

    expect(
      await screen.findByText(/no pudimos cargar los saldos/i),
    ).toBeInTheDocument();
  });

  it("no permite seleccionar la misma moneda de origen y destino", async () => {
    render(<Exchange />);

    await waitFor(() => {
      expect(mockGetMyWallet).toHaveBeenCalled();
    });

    const selectors = screen.getAllByRole("combobox");
    const destinationSelector = selectors[1];

    const usdOption = within(destinationSelector).getByRole(
      "option",
      {
        name: /dólar estadounidense/i,
      },
    );

    expect(usdOption).toBeDisabled();
  });

  it("coloca el 10% del saldo al presionar el botón 10%", async () => {
    const user = userEvent.setup();

    render(<Exchange />);

    await waitFor(() => {
      expect(mockGetMyWallet).toHaveBeenCalled();
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

    await waitFor(() => {
      expect(mockGetMyWallet).toHaveBeenCalled();
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

    await waitFor(() => {
      expect(mockGetMyWallet).toHaveBeenCalled();
    });

    const input = screen.getByLabelText(/monto a convertir/i);

    fireEvent.change(input, {
      target: {
        value: "2000,00",
      },
    });

    const confirmButton = screen.getByRole("button", {
      name: /confirmar conversión/i,
    });

    await waitFor(() => {
      expect(confirmButton).toBeEnabled();
    });

    fireEvent.click(confirmButton);

    expect(
      screen.getByText(/no tenés saldo suficiente/i),
    ).toBeInTheDocument();

    expect(mockExchangeCurrency).not.toHaveBeenCalled();
  });

  it("envía la conversión al backend y muestra el éxito", async () => {
    const user = userEvent.setup();

    mockExchangeCurrency.mockResolvedValueOnce(
      exchangeResponseMock,
    );

    render(<Exchange />);

    await waitFor(() => {
      expect(mockGetMyWallet).toHaveBeenCalled();
    });

    const input = screen.getByLabelText(/monto a convertir/i);

    await user.clear(input);
    await user.type(input, "10,00");

    const confirmButton = screen.getByRole("button", {
      name: /confirmar conversión/i,
    });

    await waitFor(() => {
      expect(confirmButton).toBeEnabled();
    });

    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockExchangeCurrency).toHaveBeenCalledWith({
        fromCurrency: "USD",
        toCurrency: "ARS",
        amount: 10,
      });
    });

    expect(
      await screen.findByText(/conversión aprobada/i),
    ).toBeInTheDocument();

    expect(input).toHaveValue("0,00");
  });

  it("muestra un error cuando falla la conversión", async () => {
    const user = userEvent.setup();

    mockExchangeCurrency.mockRejectedValueOnce({
      response: {
        data: {
          error: "Tu access token expiró.",
          code: "TOKEN_EXPIRED",
        },
      },
    });

    render(<Exchange />);

    await waitFor(() => {
      expect(mockGetMyWallet).toHaveBeenCalled();
    });

    const input = screen.getByLabelText(/monto a convertir/i);

    await user.clear(input);
    await user.type(input, "1,00");

    const confirmButton = screen.getByRole("button", {
      name: /confirmar conversión/i,
    });

    await waitFor(() => {
      expect(confirmButton).toBeEnabled();
    });

    await user.click(confirmButton);

    expect(
      await screen.findByText(
        /no pudimos realizar la conversión/i,
      ),
    ).toBeInTheDocument();
  });
});
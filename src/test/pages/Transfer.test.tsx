import {
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import Transfer from "../../pages/Transfer";

const mocks = vi.hoisted(() => ({
  useWallet: vi.fn(),
  useAuth: vi.fn(),
  navigate: vi.fn(),
  getFrequentContacts: vi.fn(),
  lookupAlias: vi.fn(),
}));

vi.mock("../../hooks/useWallet", () => ({
  useWallet: mocks.useWallet,
}));

vi.mock("../../hooks/useAuth", () => ({
  useAuth: mocks.useAuth,
}));

vi.mock("../../services/contactService", () => ({
  getFrequentContacts: mocks.getFrequentContacts,
  lookupAlias: mocks.lookupAlias,
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
    amount: 5000,
    isPrimary: true,
  },
  {
    currency: {
      code: "USD" as const,
      name: "Dólar estadounidense",
      symbol: "US$",
    },
    amount: 200,
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

const FREQUENT_CONTACTS = [
  {
    id: 1,
    alias: "julian.torres.nomapay",
    cbu: null,
    name: "Julián",
    surname: "Torres",
    profilePictureUrl: null,
    interactionCount: 5,
  },
  {
    id: 2,
    alias: "martina.gomez",
    cbu: null,
    name: "Martina",
    surname: "Gómez",
    profilePictureUrl: null,
    interactionCount: 3,
  },
  {
    id: 3,
    alias: "bruno.ibanez",
    cbu: null,
    name: "Bruno",
    surname: "Ibáñez",
    profilePictureUrl: null,
    interactionCount: 1,
  },
];

function setup() {
  mocks.useWallet.mockReturnValue({
    wallet: {
      balances: BALANCES,
      exchangeRates: [],
      recentMovements: [],
    },
    loading: false,
    error: null,
    refetch: vi.fn(),
    mockDeposit: vi.fn(),
    mockTransfer: vi.fn(),
  });

  mocks.useAuth.mockReturnValue({
    user: {
      name: "Cande",
      surname: "Ferrari",
      alias: "cande.viajera.ar",
      profilePictureUrl: null,
    },
  });

  return render(<Transfer />);
}

describe("Transfer", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.getFrequentContacts.mockResolvedValue(
      FREQUENT_CONTACTS,
    );

    mocks.lookupAlias.mockRejectedValue(
      new Error("network error"),
    );
  });

  it("no deja continuar del paso 1 sin elegir destinatario", () => {
    setup();

    expect(
      screen.getByRole("button", {
        name: "Continuar",
      }),
    ).toBeDisabled();
  });

  it("elige un contacto frecuente y arma el resumen", async () => {
    const user = userEvent.setup();

    setup();

    const [julian] = await screen.findAllByRole(
      "button",
      {
        name: /Julián Torres/,
      },
    );

    await user.click(julian);

    await user.click(
      screen.getByRole("button", {
        name: "Continuar",
      }),
    );

    await user.type(
      screen.getByPlaceholderText("0,00"),
      "1500",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Continuar",
      }),
    );

    const summary = screen
      .getByText("Total a enviar")
      .closest(".rounded-card") as HTMLElement;

    expect(summary).not.toBeNull();

    expect(
      within(summary).getByText("Destinatario")
        .nextElementSibling,
    ).toHaveTextContent("Julián Torres");

    expect(
      within(summary).getByText("Monto").nextElementSibling,
    ).toHaveTextContent("ARS 1.500,00");
  });

  it("no deja avanzar si el monto supera el saldo", async () => {
    const user = userEvent.setup();

    setup();

    const [julian] = await screen.findAllByRole(
      "button",
      {
        name: /Julián Torres/,
      },
    );

    await user.click(julian);

    await user.click(
      screen.getByRole("button", {
        name: "Continuar",
      }),
    );

    await user.type(
      screen.getByPlaceholderText("0,00"),
      "999999",
    );

    expect(
      screen.getByRole("button", {
        name: "Continuar",
      }),
    ).toBeDisabled();
  });

  it("permite usar un alias manual si no puede verificarlo", async () => {
    const user = userEvent.setup();

    setup();

    await user.type(
      screen.getByPlaceholderText(
        "Buscar alias, CBU o contacto",
      ),
      "un.alias.cualquiera",
    );

    const manualRecipientButton =
      await screen.findByRole(
        "button",
        {
          name: /Usar como destinatario/i,
        },
        {
          timeout: 2000,
        },
      );

    await user.click(manualRecipientButton);

    expect(
      screen.getByRole("button", {
        name: "Continuar",
      }),
    ).toBeEnabled();
  });

  it("usa un alias verificado por el backend", async () => {
    const user = userEvent.setup();

    mocks.lookupAlias.mockResolvedValue({
      found: true,
      name: "Nueva",
      surname: "Persona",
      alias: "nueva.persona",
    });

    setup();

    await user.type(
      screen.getByPlaceholderText(
        "Buscar alias, CBU o contacto",
      ),
      "nueva.persona",
    );

    const foundOption = await screen.findByRole(
      "button",
      {
        name: /Nueva Persona/i,
      },
      {
        timeout: 2000,
      },
    );

    await user.click(foundOption);

    await user.click(
      screen.getByRole("button", {
        name: "Continuar",
      }),
    );

    await user.type(
      screen.getByPlaceholderText("0,00"),
      "100",
    );

    await user.click(
      screen.getByRole("button", {
        name: "Continuar",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Enviar dinero",
      }),
    );

    await user.click(
      screen.getByRole("button", {
        name: "Confirmar envío",
      }),
    );

    await waitFor(() => {
      expect(mocks.navigate).toHaveBeenCalledWith(
        "/comprobante",
        expect.objectContaining({
          state: expect.objectContaining({
            aliasOrCbu: "nueva.persona",
          }),
        }),
      );
    });
  });

  it("no permite usar un alias inexistente", async () => {
    const user = userEvent.setup();

    mocks.lookupAlias.mockResolvedValue({
      found: false,
    });

    setup();

    await user.type(
      screen.getByPlaceholderText(
        "Buscar alias, CBU o contacto",
      ),
      "no.existe.nomapay",
    );

    await screen.findByText(
      "No encontramos ningún usuario con ese alias o CBU.",
      undefined,
      {
        timeout: 2000,
      },
    );

    expect(
      screen.queryByRole("button", {
        name: /Usar como destinatario/i,
      }),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Continuar",
      }),
    ).toBeDisabled();
  });

 it("no muestra contactos cuando la lista está vacía", async () => {
  mocks.getFrequentContacts.mockResolvedValue([]);

  setup();

  await waitFor(() => {
    expect(
      mocks.getFrequentContacts,
    ).toHaveBeenCalledTimes(1);
  });

  expect(
    screen.queryByRole("button", {
      name: /Julián Torres/i,
    }),
  ).not.toBeInTheDocument();

  expect(
    screen.queryByRole("button", {
      name: /Martina Gómez/i,
    }),
  ).not.toBeInTheDocument();

  expect(
    screen.queryByRole("button", {
      name: /Bruno Ibáñez/i,
    }),
  ).not.toBeInTheDocument();
});
});
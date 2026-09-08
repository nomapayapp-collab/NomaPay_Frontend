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

    // El endpoint de búsqueda todavía no está disponible.
    // Transfer debe permitir continuar manualmente.
    mocks.lookupAlias.mockRejectedValue(
      new Error("Endpoint no disponible"),
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

  it("elige un contacto de Frecuentes y arma el resumen del paso 3", async () => {
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

  it("no deja avanzar del paso 2 si el monto supera el saldo disponible", async () => {
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

  it("permite usar un alias tipeado a mano como destinatario", async () => {
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

  it("usa el texto tipeado como aliasOrCbu cuando no es un contacto conocido", async () => {
    const user = userEvent.setup();

    setup();

    await user.type(
      screen.getByPlaceholderText(
        "Buscar alias, CBU o contacto",
      ),
      "no.existe.nomapay",
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
            aliasOrCbu: "no.existe.nomapay",
          }),
        }),
      );
    });
  });

  it("muestra un estado vacío si el usuario no tiene contactos frecuentes", async () => {
    mocks.getFrequentContacts.mockResolvedValue([]);

    setup();

    const emptyMessages = await screen.findAllByText(
      "Todavía no tenés contactos frecuentes.",
    );

    expect(emptyMessages.length).toBeGreaterThan(0);
  });
});

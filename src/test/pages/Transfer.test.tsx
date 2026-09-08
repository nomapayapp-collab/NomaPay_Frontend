import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return { ...actual, useNavigate: () => mocks.navigate };
});

const BALANCES = [
  { currency: { code: "ARS" as const, name: "Peso argentino", symbol: "$" }, amount: 5000, isPrimary: true },
  { currency: { code: "USD" as const, name: "Dólar estadounidense", symbol: "US$" }, amount: 200 },
  { currency: { code: "BRL" as const, name: "Real brasileño", symbol: "R$" }, amount: 0 },
];

// Misma gente que antes vivía en mockContacts.ts, pero con la forma que
// devuelve GET /contacts de verdad (FrequentContact).
const FREQUENT_CONTACTS = [
  { id: 1, alias: "julian.torres.nomapay", cbu: null, name: "Julián", surname: "Torres", profilePictureUrl: null, interactionCount: 5 },
  { id: 2, alias: "martina.gomez", cbu: null, name: "Martina", surname: "Gómez", profilePictureUrl: null, interactionCount: 3 },
  { id: 3, alias: "bruno.ibanez", cbu: null, name: "Bruno", surname: "Ibáñez", profilePictureUrl: null, interactionCount: 1 },
];

function setup() {
  mocks.useWallet.mockReturnValue({
    wallet: { balances: BALANCES, exchangeRates: [], recentMovements: [] },
    loading: false,
    error: null,
    refetch: vi.fn(),
    mockDeposit: vi.fn(),
    mockTransfer: vi.fn(),
  });
  mocks.useAuth.mockReturnValue({
    user: { name: "Cande", surname: "Ferrari", alias: "cande.viajera.ar", profilePictureUrl: null },
  });
  return render(<Transfer />);
}

describe("Transfer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.getFrequentContacts.mockResolvedValue(FREQUENT_CONTACTS);
    mocks.lookupAlias.mockRejectedValue(new Error("network error"));
  });

  it("no deja continuar del paso 1 sin elegir destinatario", () => {
    setup();
    expect(screen.getByRole("button", { name: "Continuar" })).toBeDisabled();
  });

  it("elige un contacto de Frecuentes y arma el resumen del paso 3", async () => {
    const user = userEvent.setup();
    setup();

    // getAllByRole[0]: el mismo contacto aparece en la lista de Frecuentes
    // del paso 1 Y en el panel lateral de desktop (que siempre está en el
    // DOM). Usamos el primero, que es el de la columna principal.
    // findAllByRole porque los contactos llegan async (GET /contacts).
    const [julian] = await screen.findAllByRole("button", { name: /Julián Torres/ });
    await user.click(julian);
    await user.click(screen.getByRole("button", { name: "Continuar" }));

    await user.type(screen.getByPlaceholderText("0,00"), "1500");
    await user.click(screen.getByRole("button", { name: "Continuar" }));

    // "Destinatario"/"Monto" también aparecen como etiquetas del tracker de
    // pasos de desktop, así que buscamos puntual adentro de la tarjeta de
    // resumen (la ubicamos por "Total a enviar", que sí es único).
    const summary = screen.getByText("Total a enviar").closest(".rounded-card") as HTMLElement;
    expect(within(summary).getByText("Destinatario").nextElementSibling).toHaveTextContent("Julián Torres");
    expect(within(summary).getByText("Monto").nextElementSibling).toHaveTextContent("ARS 1.500,00");
  });

  it("no deja avanzar del paso 2 si el monto supera el saldo disponible", async () => {
    const user = userEvent.setup();
    setup();

    const [julian] = await screen.findAllByRole("button", { name: /Julián Torres/ });
    await user.click(julian);
    await user.click(screen.getByRole("button", { name: "Continuar" }));

    await user.type(screen.getByPlaceholderText("0,00"), "999999");

    expect(screen.getByRole("button", { name: "Continuar" })).toBeDisabled();
  });

  // GET /contacts/lookup ya está conectado (contactService.lookupAlias):
  // mientras se tipea un alias que no es un contacto frecuente, se verifica
  // en vivo contra el back con debounce (ver el useEffect en Transfer.tsx).

  it("permite usar un alias tipeado a mano como destinatario cuando no se puede verificar", async () => {
    // Simula que lookupAlias no pudo confirmar nada (sin conexión, 500,
    // etc.) — el efecto cae a "idle" y el botón manual sigue de respaldo,
    // igual que antes de que existiera el endpoint.
    mocks.lookupAlias.mockRejectedValue(new Error("network error"));
    const user = userEvent.setup();
    setup();

    await user.type(screen.getByPlaceholderText("Buscar alias, CBU o contacto"), "un.alias.cualquiera");

    const useButton = await screen.findByRole(
      "button",
      { name: /Usar como destinatario/ },
      { timeout: 2000 },
    );
    await user.click(useButton);

    expect(screen.getByRole("button", { name: "Continuar" })).toBeEnabled();
  });

  it("usa un alias verificado por el back que no es un contacto frecuente", async () => {
    // El back sí conoce este alias aunque no sea un contacto frecuente de
    // Cande: lookupAlias() lo confirma y el efecto pasa a "found".
    mocks.lookupAlias.mockResolvedValue({
      found: true,
      name: "Nueva",
      surname: "Persona",
      alias: "nueva.persona",
    });
    const user = userEvent.setup();
    setup();

    await user.type(screen.getByPlaceholderText("Buscar alias, CBU o contacto"), "nueva.persona");

    const foundOption = await screen.findByRole("button", { name: /Nueva/ }, { timeout: 2000 });
    await user.click(foundOption);
    await user.click(screen.getByRole("button", { name: "Continuar" }));

    await user.type(screen.getByPlaceholderText("0,00"), "100");
    await user.click(screen.getByRole("button", { name: "Continuar" }));

    await user.click(screen.getByRole("button", { name: "Enviar dinero" }));
    await user.click(screen.getByRole("button", { name: "Confirmar envío" }));

    await waitFor(() => {
      expect(mocks.navigate).toHaveBeenCalledWith(
        "/comprobante",
        expect.objectContaining({ state: expect.objectContaining({ aliasOrCbu: "nueva.persona" }) }),
      );
    });
  });

  it("no deja usar un alias que el back confirma que no existe", async () => {
    mocks.lookupAlias.mockResolvedValue({ found: false });
    const user = userEvent.setup();
    setup();

    await user.type(screen.getByPlaceholderText("Buscar alias, CBU o contacto"), "no.existe.nomapay");

    await screen.findByText(
      "No encontramos ningún usuario con ese alias o CBU.",
      undefined,
      { timeout: 2000 },
    );

    expect(
      screen.queryByRole("button", { name: /Usar como destinatario/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continuar" })).toBeDisabled();
  });

  it("muestra un estado vacío si el usuario no tiene contactos frecuentes", async () => {
    mocks.getFrequentContacts.mockResolvedValue([]);
    setup();

    // El mensaje aparece dos veces: en la lista de Frecuentes del paso 1 y
    // en el panel lateral de desktop (que siempre está en el DOM).
    const emptyMessages = await screen.findAllByText("Todavía no tenés contactos frecuentes.");
    expect(emptyMessages.length).toBeGreaterThan(0);
  });
});

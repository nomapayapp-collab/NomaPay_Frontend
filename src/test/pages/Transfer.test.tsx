import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Transfer from "../../pages/Transfer";

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
  { currency: { code: "ARS" as const, name: "Peso argentino", symbol: "$" }, amount: 5000, isPrimary: true },
  { currency: { code: "USD" as const, name: "Dólar estadounidense", symbol: "US$" }, amount: 200 },
  { currency: { code: "BRL" as const, name: "Real brasileño", symbol: "R$" }, amount: 0 },
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
    await user.click(screen.getAllByRole("button", { name: /Julián Torres/ })[0]);
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

    await user.click(screen.getAllByRole("button", { name: /Julián Torres/ })[0]);
    await user.click(screen.getByRole("button", { name: "Continuar" }));

    await user.type(screen.getByPlaceholderText("0,00"), "999999");

    expect(screen.getByRole("button", { name: "Continuar" })).toBeDisabled();
  });

  it("permite usar un alias tipeado a mano como destinatario", async () => {
    const user = userEvent.setup();
    setup();

    await user.type(screen.getByPlaceholderText("Buscar alias, CBU o contacto"), "un.alias.cualquiera");
    await user.click(screen.getByRole("button", { name: /Usar como destinatario/ }));

    expect(screen.getByRole("button", { name: "Continuar" })).toBeEnabled();
  });

  it("confirma el envío y navega al Comprobante con los datos correctos", async () => {
    const user = userEvent.setup();
    setup();

    await user.click(screen.getAllByRole("button", { name: /Julián Torres/ })[0]);
    await user.click(screen.getByRole("button", { name: "Continuar" }));

    await user.type(screen.getByPlaceholderText("0,00"), "1500");
    await user.click(screen.getByRole("button", { name: "Continuar" }));

    await user.click(screen.getByRole("button", { name: "Enviar dinero" }));
    await user.click(screen.getByRole("button", { name: "Confirmar envío" }));

    await waitFor(() => {
      expect(mocks.navigate).toHaveBeenCalledWith("/comprobante", {
        state: {
          amount: 1500,
          currency: "ARS",
          recipientName: "Julián Torres",
          recipientAlias: "julian.torres.nomapay",
          known: true,
        },
      });
    });
  });

  it("marca known: false cuando el destinatario no es un contacto conocido", async () => {
    const user = userEvent.setup();
    setup();

    await user.type(screen.getByPlaceholderText("Buscar alias, CBU o contacto"), "no.existe.nomapay");
    await user.click(screen.getByRole("button", { name: /Usar como destinatario/ }));
    await user.click(screen.getByRole("button", { name: "Continuar" }));

    await user.type(screen.getByPlaceholderText("0,00"), "100");
    await user.click(screen.getByRole("button", { name: "Continuar" }));

    await user.click(screen.getByRole("button", { name: "Enviar dinero" }));
    await user.click(screen.getByRole("button", { name: "Confirmar envío" }));

    await waitFor(() => {
      expect(mocks.navigate).toHaveBeenCalledWith(
        "/comprobante",
        expect.objectContaining({ state: expect.objectContaining({ known: false }) }),
      );
    });
  });
});
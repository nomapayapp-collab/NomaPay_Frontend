import { StrictMode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Receipt from "../../pages/Receipt";
import type { TransferResponse } from "../../services/transferService";

/**
 * Receipt.tsx mantiene la pantalla "en proceso" un mínimo de ~6.4s
 * (MIN_PROCESSING_MS, no exportado desde el componente) aunque el backend
 * conteste antes. Usamos timers reales (como el resto de la suite) y le damos
 * a waitFor/it margen suficiente para ese mínimo en vez de pelear con fake
 * timers contra el scheduler de React.
 */
const WAIT_FOR_TIMEOUT = 8000;
const TEST_TIMEOUT = 10000;

const mocks = vi.hoisted(() => ({
  useWallet: vi.fn(),
  navigate: vi.fn(),
  location: { state: null as { amount: number; currency: string; aliasOrCbu: string } | null },
  transferFunds: vi.fn(),
}));

vi.mock("../../hooks/useWallet", () => ({
  useWallet: mocks.useWallet,
}));

vi.mock("../../services/transferService", () => ({
  transferFunds: mocks.transferFunds,
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mocks.navigate,
    useLocation: () => mocks.location,
  };
});

const TRANSFER_RESULT: TransferResponse = {
  message: "Transferencia exitosa",
  transaction: {
    id: 123,
    receiverName: "Juan Pérez",
    receiverAlias: "juan.perez",
    amount: 500,
    currencyCode: "ARS",
    transactionDate: "2026-01-01T00:00:00Z",
  },
};

describe("Receipt", () => {
  const refetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.location.state = null;
    mocks.useWallet.mockReturnValue({ refetch });
  });

  it("si no hay estado de navegación (se entró directo a la URL), redirige al inicio sin llamar a transferFunds", () => {
    mocks.location.state = null;

    render(<Receipt />);

    expect(mocks.navigate).toHaveBeenCalledWith("/", { replace: true });
    expect(mocks.transferFunds).not.toHaveBeenCalled();
  });

  it(
    "con una transferencia exitosa, muestra los datos de la transacción y refresca la wallet",
    async () => {
      mocks.location.state = { amount: 500, currency: "ARS", aliasOrCbu: "juan.perez" };
      mocks.transferFunds.mockResolvedValue(TRANSFER_RESULT);

      render(<Receipt />);

      await waitFor(
        () => expect(screen.getByText("Transferencia enviada")).toBeInTheDocument(),
        { timeout: WAIT_FOR_TIMEOUT },
      );
      expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
      expect(screen.getByText("N° de operación NP-123")).toBeInTheDocument();
      expect(refetch).toHaveBeenCalledTimes(1);
    },
    TEST_TIMEOUT,
  );

  it(
    "si el backend rechaza la transferencia, muestra el motivo y no refresca la wallet",
    async () => {
      mocks.location.state = { amount: 500, currency: "ARS", aliasOrCbu: "juan.perez" };
      mocks.transferFunds.mockRejectedValue(new Error("falló la red"));

      render(<Receipt />);

      await waitFor(
        () => expect(screen.getByText("No pudimos enviar el dinero")).toBeInTheDocument(),
        { timeout: WAIT_FOR_TIMEOUT },
      );
      expect(
        screen.getByText("No pudimos procesar la transferencia. Probá de nuevo en un rato."),
      ).toBeInTheDocument();
      expect(refetch).not.toHaveBeenCalled();
    },
    TEST_TIMEOUT,
  );

  it(
    "no dispara la transferencia dos veces aunque el efecto se vuelva a montar (protección contra el doble-invoke de StrictMode)",
    async () => {
      mocks.location.state = { amount: 500, currency: "ARS", aliasOrCbu: "juan.perez" };
      mocks.transferFunds.mockResolvedValue(TRANSFER_RESULT);

      // StrictMode monta, desmonta y vuelve a montar los efectos una vez en
      // desarrollo. Si el guard `requestSentRef` de Receipt.tsx se rompiera,
      // esto dispararía dos POST /transfers y le cobraría dos veces al usuario.
      render(
        <StrictMode>
          <Receipt />
        </StrictMode>,
      );

      await waitFor(
        () => expect(screen.getByText("Transferencia enviada")).toBeInTheDocument(),
        { timeout: WAIT_FOR_TIMEOUT },
      );
      expect(mocks.transferFunds).toHaveBeenCalledTimes(1);
    },
    TEST_TIMEOUT,
  );
});

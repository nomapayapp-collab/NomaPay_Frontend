import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Config from "../../../pages/config/Config";
import type { AuthUser } from "../../../types/auth";
import type { WalletSummary } from "../../../types/wallet";

const mocks = vi.hoisted(() => ({
  useAuth: vi.fn(),
  useWallet: vi.fn(),
  navigate: vi.fn(),
  getMyProfile: vi.fn(),
  getMyWallet: vi.fn(),
  updateProfile: vi.fn(),
  updatePreferredCurrency: vi.fn(),
  deleteMyAccount: vi.fn(),
}));

vi.mock("../../../hooks/useAuth", () => ({
  useAuth: mocks.useAuth,
}));

vi.mock("../../../hooks/useWallet", () => ({
  useWallet: mocks.useWallet,
}));

vi.mock("../../../services/authService", () => ({
  getMyProfile: mocks.getMyProfile,
  getMyWallet: mocks.getMyWallet,
  updateProfile: mocks.updateProfile,
  updatePreferredCurrency: mocks.updatePreferredCurrency,
  deleteMyAccount: mocks.deleteMyAccount,
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mocks.navigate,
  };
});

const BASE_USER: AuthUser = {
  id: 1,
  name: "Cande",
  surname: "Ferrari",
  email: "cande@test.com",
  username: "cande",
  alias: "cande.alias",
  cbu: "0000003100012345678902",
  country: "AR",
};

const BASE_WALLET: WalletSummary = {
  walletId: 1,
  preferredCurrency: "USD",
  balances: [],
};

function mockLocationReplace() {
  const replace = vi.fn();
  Object.defineProperty(window, "location", {
    value: { ...window.location, replace },
    writable: true,
  });
  return replace;
}

describe("Config", () => {
  const updateUser = vi.fn();
  const refetchWallet = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useAuth.mockReturnValue({ user: BASE_USER, updateUser });
    mocks.useWallet.mockReturnValue({ refetch: refetchWallet });
    mocks.getMyProfile.mockResolvedValue({ ...BASE_USER });
    mocks.getMyWallet.mockResolvedValue({ ...BASE_WALLET });
  });

  it("guarda el país y la moneda preferida, refresca la wallet y vuelve a la pantalla anterior", async () => {
    mocks.updateProfile.mockResolvedValue({ ...BASE_USER, country: "BR" });
    mocks.updatePreferredCurrency.mockResolvedValue({ ...BASE_WALLET, preferredCurrency: "BRL" });
    const user = userEvent.setup();

    render(<Config />);

    await waitFor(() => expect(mocks.getMyProfile).toHaveBeenCalled());

    await user.click(screen.getByRole("button", { name: "País de residencia" }));
    await user.click(screen.getByRole("option", { name: "Brasil" }));

    await user.click(screen.getAllByRole("button", { name: "BRL" })[0]);
    await user.click(screen.getAllByRole("button", { name: "Guardar cambios" })[0]);

    await waitFor(() => expect(mocks.updateProfile).toHaveBeenCalledWith({ country: "BR" }));
    expect(mocks.updatePreferredCurrency).toHaveBeenCalledWith("BRL");
    await waitFor(() => expect(refetchWallet).toHaveBeenCalled());
    expect(updateUser).toHaveBeenCalledWith({ ...BASE_USER, country: "BR" });
    await waitFor(() => expect(mocks.navigate).toHaveBeenCalledWith(-1));
  });

  it("si falla alguna de las dos actualizaciones, muestra el error combinado y no navega", async () => {
    mocks.updateProfile.mockRejectedValue(new Error("país inválido"));
    mocks.updatePreferredCurrency.mockResolvedValue({ ...BASE_WALLET });
    const user = userEvent.setup();

    render(<Config />);
    await waitFor(() => expect(mocks.getMyProfile).toHaveBeenCalled());

    await user.click(screen.getAllByRole("button", { name: "Guardar cambios" })[0]);

    expect(await screen.findByText("No pudimos actualizar tus datos.")).toBeInTheDocument();
    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  it("eliminar cuenta exige escribir el email exacto antes de habilitar la confirmación, y al confirmar borra la cuenta y redirige a login", async () => {
    mocks.deleteMyAccount.mockResolvedValue("cuenta eliminada");
    const replace = mockLocationReplace();
    const user = userEvent.setup();

    render(<Config />);
    await waitFor(() => expect(mocks.getMyProfile).toHaveBeenCalled());

    await user.click(screen.getAllByRole("button", { name: "Eliminar cuenta" })[0]);

    const confirmButton = await screen.findByRole("button", { name: "Sí, eliminar cuenta" });
    expect(confirmButton).toBeDisabled();

    const confirmInput = screen.getByLabelText(
      `Para confirmar, escribí tu email: ${BASE_USER.email}`,
    );
    await user.type(confirmInput, "email.equivocado@test.com");
    expect(confirmButton).toBeDisabled();

    await user.clear(confirmInput);
    await user.type(confirmInput, BASE_USER.email);
    expect(confirmButton).toBeEnabled();

    await user.click(confirmButton);

    await waitFor(() => expect(mocks.deleteMyAccount).toHaveBeenCalledTimes(1));
    await waitFor(
  () => expect(replace).toHaveBeenCalledWith("/"),
  { timeout: 7000 },
);
  });

  it("si falla la eliminación de la cuenta, muestra el error y no redirige", async () => {
    mocks.deleteMyAccount.mockRejectedValue(new Error("no se pudo borrar"));
    const replace = mockLocationReplace();
    const user = userEvent.setup();

    render(<Config />);
    await waitFor(() => expect(mocks.getMyProfile).toHaveBeenCalled());

    await user.click(screen.getAllByRole("button", { name: "Eliminar cuenta" })[0]);

    const confirmInput = screen.getByLabelText(
      `Para confirmar, escribí tu email: ${BASE_USER.email}`,
    );
    await user.type(confirmInput, BASE_USER.email);
    await user.click(screen.getByRole("button", { name: "Sí, eliminar cuenta" }));

    const errors = await screen.findAllByText(
      "No pudimos eliminar tu cuenta. Intentá nuevamente.",
    );
    expect(errors.length).toBeGreaterThan(0);
    expect(replace).not.toHaveBeenCalled();
  });

  it("edita el alias desde el modal y lo refleja actualizado en la pantalla", async () => {
    mocks.updateProfile.mockResolvedValue({ ...BASE_USER, alias: "cande.nueva" });
    const user = userEvent.setup();

    render(<Config />);
    await waitFor(() => expect(mocks.getMyProfile).toHaveBeenCalled());
    expect(screen.getAllByText(`@${BASE_USER.alias}`).length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "Editar alias" }));

    const newAliasInput = await screen.findByLabelText("Nuevo alias");
    await user.clear(newAliasInput);
    await user.type(newAliasInput, "cande.nueva");
    await user.click(screen.getByRole("button", { name: "Guardar alias" }));

    await waitFor(() =>
      expect(mocks.updateProfile).toHaveBeenCalledWith({ alias: "cande.nueva" }),
    );
    expect(updateUser).toHaveBeenCalledWith({ ...BASE_USER, alias: "cande.nueva" });
    await waitFor(() =>
      expect(screen.getAllByText("@cande.nueva").length).toBeGreaterThan(0),
    );
  });
});

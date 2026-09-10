import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ResetPassword from "../../../pages/password/ResetPassword";

const mocks = vi.hoisted(() => ({
  resetPassword: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock("../../../services/authService", () => ({
  resetPassword: mocks.resetPassword,
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mocks.navigate,
  };
});

function renderPage(path = "/reset-password?token=tok-123") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ResetPassword />
    </MemoryRouter>,
  );
}

const VALID_PASSWORD = "NuevaClave1!";

describe("ResetPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("valida la contraseña antes de enviar: mínimo 8 caracteres y que coincida con la confirmación", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText("Nueva contraseña"), "abc");
    await user.type(screen.getByLabelText("Confirmar contraseña"), "abc");
    await user.click(screen.getByRole("button", { name: "Guardar nueva contraseña" }));

    expect(screen.getByText("Debe tener al menos 8 caracteres")).toBeInTheDocument();
    expect(mocks.resetPassword).not.toHaveBeenCalled();

    await user.clear(screen.getByLabelText("Nueva contraseña"));
    await user.type(screen.getByLabelText("Nueva contraseña"), VALID_PASSWORD);
    await user.clear(screen.getByLabelText("Confirmar contraseña"));
    await user.type(screen.getByLabelText("Confirmar contraseña"), "OtraClave1!");
    await user.click(screen.getByRole("button", { name: "Guardar nueva contraseña" }));

    expect(
  screen.getAllByText("Las contraseñas no coinciden").length,
).toBeGreaterThan(0);
    expect(mocks.resetPassword).not.toHaveBeenCalled();
  });

  it("si no hay token en el link, muestra el error y no llama a resetPassword", async () => {
    const user = userEvent.setup();
    renderPage("/reset-password");

    await user.type(screen.getByLabelText("Nueva contraseña"), VALID_PASSWORD);
    await user.type(screen.getByLabelText("Confirmar contraseña"), VALID_PASSWORD);
    await user.click(screen.getByRole("button", { name: "Guardar nueva contraseña" }));

    expect(
      await screen.findByText(
        "El link no es válido. Pedí uno nuevo desde 'Olvidé mi contraseña'.",
      ),
    ).toBeInTheDocument();
    expect(mocks.resetPassword).not.toHaveBeenCalled();
  });

  it(
    "con un token válido, guarda la contraseña y redirige al login después de mostrar el mensaje de éxito",
    async () => {
      mocks.resetPassword.mockResolvedValue(undefined);
      const user = userEvent.setup();
      renderPage();

      await user.type(screen.getByLabelText("Nueva contraseña"), VALID_PASSWORD);
      await user.type(screen.getByLabelText("Confirmar contraseña"), VALID_PASSWORD);
      await user.click(screen.getByRole("button", { name: "Guardar nueva contraseña" }));

      await waitFor(() =>
        expect(mocks.resetPassword).toHaveBeenCalledWith("tok-123", VALID_PASSWORD),
      );
      expect(
        await screen.findByText("Listo, tu contraseña se actualizó. Te llevamos al inicio de sesión..."),
      ).toBeInTheDocument();

      await waitFor(
        () => expect(mocks.navigate).toHaveBeenCalledWith("/login"),
        { timeout: 4000 },
      );
    },
    8000,
  );

  it("si el link venció o el token es inválido, muestra el error y no redirige", async () => {
    mocks.resetPassword.mockRejectedValue(new Error("token vencido"));
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText("Nueva contraseña"), VALID_PASSWORD);
    await user.type(screen.getByLabelText("Confirmar contraseña"), VALID_PASSWORD);
    await user.click(screen.getByRole("button", { name: "Guardar nueva contraseña" }));

    expect(
      await screen.findByText("El link venció o ya se usó. Pedí uno nuevo."),
    ).toBeInTheDocument();
    expect(mocks.navigate).not.toHaveBeenCalled();
  });
});

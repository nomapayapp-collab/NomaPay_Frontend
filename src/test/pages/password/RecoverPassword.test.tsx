import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import RecoverPassword from "../../../pages/password/RecoverPassword";

const mocks = vi.hoisted(() => ({
  forgotPassword: vi.fn(),
}));

vi.mock("../../../services/authService", () => ({
  forgotPassword: mocks.forgotPassword,
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <RecoverPassword />
    </MemoryRouter>,
  );
}

describe("RecoverPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("valida el email antes de enviar y no llama a forgotPassword si está vacío o mal formado", async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole("button", { name: "Enviar instrucciones" }));
    expect(screen.getAllByText("El email es obligatorio").length).toBeGreaterThan(0);
    expect(mocks.forgotPassword).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText("Email"), "no-es-un-email");
    await user.click(screen.getByRole("button", { name: "Enviar instrucciones" }));
    expect(screen.getAllByText("Ingresá un email válido").length).toBeGreaterThan(0);
    expect(mocks.forgotPassword).not.toHaveBeenCalled();
  });

  it("al enviar un email válido, llama a forgotPassword y muestra el mensaje de confirmación (sin revelar si el email existe)", async () => {
    mocks.forgotPassword.mockResolvedValue(undefined);
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText("Email"), "cande@test.com");
    await user.click(screen.getByRole("button", { name: "Enviar instrucciones" }));

    await waitFor(() =>
      expect(mocks.forgotPassword).toHaveBeenCalledWith("cande@test.com"),
    );
    expect(
      await screen.findByText(/está registrado, te va a llegar un link/),
    ).toBeInTheDocument();
  });

  it("si el backend falla, muestra un error genérico y no revela nada sobre el email", async () => {
    mocks.forgotPassword.mockRejectedValue(new Error("network error"));
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByLabelText("Email"), "cande@test.com");
    await user.click(screen.getByRole("button", { name: "Enviar instrucciones" }));

    const errors = await screen.findAllByText(
      "No pudimos procesar la solicitud. Probá de nuevo en un rato.",
    );
    expect(errors.length).toBeGreaterThan(0);
  });
});

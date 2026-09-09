import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ChangePasswordModal } from "../../../pages/config/ChangePasswordModal";

const mocks = vi.hoisted(() => ({
  changePassword: vi.fn(),
}));

vi.mock("../../../services/authService", () => ({
  changePassword: mocks.changePassword,
}));

const VALID_PASSWORD = "Contraseña1!";

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Contraseña actual"), "ViejaClave1!");
  await user.type(screen.getByLabelText("Contraseña nueva"), VALID_PASSWORD);
  await user.type(screen.getByLabelText("Confirmar contraseña nueva"), VALID_PASSWORD);
}

describe("ChangePasswordModal", () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("el botón de guardar arranca deshabilitado y solo se habilita con una contraseña actual y una nueva válida y confirmada", async () => {
    const user = userEvent.setup();
    render(<ChangePasswordModal open onClose={onClose} />);

    expect(screen.getByRole("button", { name: "Guardar contraseña" })).toBeDisabled();

    // nueva contraseña débil: sigue deshabilitado
    await user.type(screen.getByLabelText("Contraseña actual"), "ViejaClave1!");
    await user.type(screen.getByLabelText("Contraseña nueva"), "abc");
    await user.type(screen.getByLabelText("Confirmar contraseña nueva"), "abc");
    expect(screen.getByRole("button", { name: "Guardar contraseña" })).toBeDisabled();

    // completa con una contraseña que cumple todos los requisitos y coincide
    await user.clear(screen.getByLabelText("Contraseña nueva"));
    await user.clear(screen.getByLabelText("Confirmar contraseña nueva"));
    await user.type(screen.getByLabelText("Contraseña nueva"), VALID_PASSWORD);
    await user.type(screen.getByLabelText("Confirmar contraseña nueva"), VALID_PASSWORD);

    expect(screen.getByRole("button", { name: "Guardar contraseña" })).toBeEnabled();
  });

  it("guarda la nueva contraseña y cierra el modal", async () => {
    mocks.changePassword.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<ChangePasswordModal open onClose={onClose} />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Guardar contraseña" }));

    await waitFor(() =>
      expect(mocks.changePassword).toHaveBeenCalledWith({
        currentPassword: "ViejaClave1!",
        newPassword: VALID_PASSWORD,
      }),
    );
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });

  it("si el backend rechaza el cambio (ej. contraseña actual incorrecta), muestra el error y no cierra el modal", async () => {
    mocks.changePassword.mockRejectedValue(new Error("contraseña incorrecta"));
    const user = userEvent.setup();
    render(<ChangePasswordModal open onClose={onClose} />);

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Guardar contraseña" }));

    expect(await screen.findByText("No pudimos cambiar tu contraseña.")).toBeInTheDocument();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("al volver a abrirse, arranca limpio (no arrastra lo que se había escrito la vez anterior)", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<ChangePasswordModal open onClose={onClose} />);

    await user.type(screen.getByLabelText("Contraseña actual"), "algo-que-no-deberia-quedar");

    rerender(<ChangePasswordModal open={false} onClose={onClose} />);
    rerender(<ChangePasswordModal open onClose={onClose} />);

    expect(screen.getByLabelText("Contraseña actual")).toHaveValue("");
  });
});

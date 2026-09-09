import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EditAliasModal } from "../../../pages/config/EditAliasModal";
import type { AuthUser } from "../../../types/auth";

const mocks = vi.hoisted(() => ({
  updateProfile: vi.fn(),
}));

vi.mock("../../../services/authService", () => ({
  updateProfile: mocks.updateProfile,
}));

const CURRENT_ALIAS = "cande.vieja";

const UPDATED_USER: AuthUser = {
  id: 1,
  name: "Cande",
  surname: "Ferrari",
  email: "cande@test.com",
  username: "cande",
  alias: "cande.nueva",
  cbu: null,
};

describe("EditAliasModal", () => {
  const onClose = vi.fn();
  const onSaved = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("arranca con el botón deshabilitado porque el alias no cambió", () => {
    render(
      <EditAliasModal
        open
        currentAlias={CURRENT_ALIAS}
        onClose={onClose}
        onSaved={onSaved}
      />,
    );

    expect(screen.getByLabelText("Nuevo alias")).toHaveValue(CURRENT_ALIAS);
    expect(screen.getByRole("button", { name: "Guardar alias" })).toBeDisabled();
  });

  it("muestra qué falta mientras el alias no cumple el formato, y no deja guardar", async () => {
    const user = userEvent.setup();
    render(
      <EditAliasModal
        open
        currentAlias={CURRENT_ALIAS}
        onClose={onClose}
        onSaved={onSaved}
      />,
    );

    await user.clear(screen.getByLabelText("Nuevo alias"));
    await user.type(screen.getByLabelText("Nuevo alias"), "ab@");

    expect(screen.getByText("Faltan 5 caracteres")).toBeInTheDocument();
    expect(
      screen.getByText("Solo se permiten letras, números y puntos"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Guardar alias" })).toBeDisabled();
    expect(mocks.updateProfile).not.toHaveBeenCalled();
  });

  it("guarda el alias nuevo y avisa al padre con el usuario actualizado", async () => {
    mocks.updateProfile.mockResolvedValue(UPDATED_USER);
    const user = userEvent.setup();
    render(
      <EditAliasModal
        open
        currentAlias={CURRENT_ALIAS}
        onClose={onClose}
        onSaved={onSaved}
      />,
    );

    await user.clear(screen.getByLabelText("Nuevo alias"));
    await user.type(screen.getByLabelText("Nuevo alias"), "cande.nueva");
    await user.click(screen.getByRole("button", { name: "Guardar alias" }));

    await waitFor(() =>
      expect(mocks.updateProfile).toHaveBeenCalledWith({ alias: "cande.nueva" }),
    );
    await waitFor(() => expect(onSaved).toHaveBeenCalledWith(UPDATED_USER));
  });

  it("si el backend rechaza el alias (ej. ya está en uso), muestra el error y no avisa al padre", async () => {
    mocks.updateProfile.mockRejectedValue(new Error("alias en uso"));
    const user = userEvent.setup();
    render(
      <EditAliasModal
        open
        currentAlias={CURRENT_ALIAS}
        onClose={onClose}
        onSaved={onSaved}
      />,
    );

    await user.clear(screen.getByLabelText("Nuevo alias"));
    await user.type(screen.getByLabelText("Nuevo alias"), "cande.nueva");
    await user.click(screen.getByRole("button", { name: "Guardar alias" }));

    expect(await screen.findByText("No pudimos actualizar tu alias.")).toBeInTheDocument();
    expect(onSaved).not.toHaveBeenCalled();
  });
});

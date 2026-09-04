import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Register from "../../pages/register/Register";

const mocks = vi.hoisted(() => ({
  register: vi.fn(),
  registerWithGoogle: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock("../../services/authService", () => ({
  register: mocks.register,
}));

vi.mock("../../hooks/useAuth", () => ({
  useAuth: () => ({
    registerWithGoogle: mocks.registerWithGoogle,
  }),
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

vi.mock("@react-oauth/google", () => ({
  GoogleLogin: () => (
    <button type="button">Registrarse con Google</button>
  ),
}));

function renderRegister() {
  return render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>,
  );
}

describe("Register", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("valida todos los campos obligatorios", async () => {
    renderRegister();

    fireEvent.submit(
      screen
        .getByRole("button", { name: "Continuar" })
        .closest("form")!,
    );

    expect(
      await screen.findByText("El nombre es obligatorio"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("El apellido es obligatorio"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("El email es obligatorio"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("La contraseña es obligatoria"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Confirmá tu contraseña"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("Seleccioná un país"),
    ).toBeInTheDocument();

    expect(mocks.register).not.toHaveBeenCalled();
  });

  it("registra un usuario válido y navega al login", async () => {
    const user = userEvent.setup();

    mocks.register.mockResolvedValue({ id: 1 });

    renderRegister();

    await user.type(
      screen.getByPlaceholderText("Nombre"),
      "Agustín",
    );

    await user.type(
      screen.getByPlaceholderText("Apellido"),
      "Spataro",
    );

    await user.type(
      screen.getByLabelText("Email"),
      "agustin@nomapay.app",
    );

    const passwords =
      screen.getAllByPlaceholderText("••••••••••");

    await user.type(passwords[0], "Clave1234!");
    await user.type(passwords[1], "Clave1234!");

    await user.click(
      screen.getByRole("button", {
        name: "Seleccioná tu país",
      }),
    );

    await user.click(
      screen.getByRole("option", {
        name: "Argentina",
      }),
    );

    await user.click(
      screen.getByRole("button", { name: "Continuar" }),
    );

    await waitFor(() => {
      expect(mocks.register).toHaveBeenCalledWith({
        name: "Agustín",
        surname: "Spataro",
        country: "AR",
        email: "agustin@nomapay.app",
        password: "Clave1234!",
      });
    });

    expect(mocks.navigate).toHaveBeenCalledWith("/login");
  });
});
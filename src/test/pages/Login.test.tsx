import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Login from "../../pages/Login";

const mocks = vi.hoisted(() => ({
  login: vi.fn(),
  loginWithGoogle: vi.fn(),
  navigate: vi.fn(),
}));

vi.mock("../../hooks/useAuth", () => ({
  useAuth: () => ({
    login: mocks.login,
    loginWithGoogle: mocks.loginWithGoogle,
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
    <button type="button">Continuar con Google</button>
  ),
}));

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );
}

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra errores cuando se envía vacío", async () => {
    renderLogin();

    fireEvent.submit(
      screen
        .getByRole("button", { name: "Continuar" })
        .closest("form")!,
    );

    expect(
      await screen.findByText("El email es obligatorio"),
    ).toBeInTheDocument();

    expect(
      screen.getByText("La contraseña es obligatoria"),
    ).toBeInTheDocument();

    expect(mocks.login).not.toHaveBeenCalled();
  });

  it("inicia sesión y navega al inicio con datos válidos", async () => {
    const user = userEvent.setup();

    mocks.login.mockResolvedValue(undefined);

    renderLogin();

    await user.type(
      screen.getByLabelText("Email"),
      "agustin@nomapay.app",
    );

    await user.type(
      screen.getByPlaceholderText("••••••••••"),
      "Clave1234",
    );

    await user.click(
      screen.getByRole("button", { name: "Continuar" }),
    );

    await waitFor(() => {
      expect(mocks.login).toHaveBeenCalledWith({
        email: "agustin@nomapay.app",
        password: "Clave1234",
      });
    });

    expect(mocks.navigate).toHaveBeenCalledWith("/");
  });

  it("informa el error al fallar el inicio de sesión", async () => {
    const user = userEvent.setup();

    mocks.login.mockRejectedValue(
      new Error("Credenciales inválidas"),
    );

    vi.spyOn(console, "error").mockImplementation(
      () => undefined,
    );

    renderLogin();

    await user.type(
      screen.getByLabelText("Email"),
      "agustin@nomapay.app",
    );

    await user.type(
      screen.getByPlaceholderText("••••••••••"),
      "Clave1234",
    );

    await user.click(
      screen.getByRole("button", { name: "Continuar" }),
    );

    expect(
      await screen.findByText(
        "No pudimos iniciar sesión. Revisá tu email y contraseña.",
      ),
    ).toBeInTheDocument();

    expect(mocks.navigate).not.toHaveBeenCalled();
  });
});
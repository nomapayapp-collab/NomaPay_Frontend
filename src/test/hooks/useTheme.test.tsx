import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AuthProvider as AuthProviderType } from "../../context/AuthContext";
import type { useTheme as useThemeType } from "../../hooks/useTheme";
import type { AuthUser } from "../../types/auth";

const mocks = vi.hoisted(() => ({
  getMyProfile: vi.fn(),
  updateTheme: vi.fn(),
  logoutRequest: vi.fn(),
}));

vi.mock("../../services/authService", () => ({
  getMyProfile: mocks.getMyProfile,
  updateTheme: mocks.updateTheme,
  logoutRequest: mocks.logoutRequest,
}));

// useTheme.ts guarda a propósito el "ya apliqué el tema de la cuenta" en una
// variable de módulo (no en un useRef) — así sobrevive a que Sidebar/TopTabBar
// se remonten en cada navegación. Pero eso significa que ese estado persiste
// mientras el módulo esté cargado en memoria, incluida la vida de este
// archivo de test. Para que cada test empiece con la misma pizarra en blanco
// que tiene una pestaña recién abierta, reseteamos el registro de módulos y
// volvemos a importar todo (incluido AuthContext, del que useTheme depende)
// en cada test.
let AuthProvider: typeof AuthProviderType;
let useTheme: typeof useThemeType;

const BASE_USER: AuthUser = {
  id: 1,
  name: "Cande",
  surname: "Ferrari",
  email: "cande@test.com",
  username: "cande",
  alias: "cande.alias",
  cbu: null,
  theme: "dark",
};

function ThemeConsumer({ testId }: { testId: string }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <button type="button" data-testid={testId} onClick={toggleTheme}>
      {theme}
    </button>
  );
}

describe("useTheme", () => {
  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();
    try {
      localStorage.clear();
    } catch {
      // localStorage puede no estar disponible en algunos entornos de test
    }
    document.body.className = "";

    ({ AuthProvider } = await import("../../context/AuthContext"));
    ({ useTheme } = await import("../../hooks/useTheme"));
  });

  it("al iniciar sesión, adopta el tema guardado en la cuenta", async () => {
    mocks.getMyProfile.mockResolvedValue({ ...BASE_USER, theme: "light" });

    render(
      <AuthProvider>
        <ThemeConsumer testId="sidebar" />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByTestId("sidebar")).toHaveTextContent("light"));
    expect(document.body.classList.contains("light")).toBe(true);
  });

  it("después de un cambio manual de tema, un remount (como al navegar de pantalla) no lo revierte al tema viejo de la cuenta", async () => {
    mocks.getMyProfile.mockResolvedValue({ ...BASE_USER, theme: "dark" });
    mocks.updateTheme.mockImplementation((theme: "light" | "dark") =>
      Promise.resolve({ ...BASE_USER, theme }),
    );
    const user = userEvent.setup();

    // AuthProvider vive en la raíz de la app y no se remonta al navegar; lo
    // que se desmonta y se vuelve a montar en cada página es el layout
    // (Sidebar/TopTabBar, y por lo tanto useTheme()). Por eso mantenemos el
    // mismo <AuthProvider> entre el render inicial y el "rerender" de más
    // abajo, y solo forzamos el remount del consumidor cambiándole la key.
    const { rerender } = render(
      <AuthProvider>
        <ThemeConsumer key="antes-de-navegar" testId="sidebar" />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByTestId("sidebar")).toHaveTextContent("dark"));

    await user.click(screen.getByTestId("sidebar"));

    await waitFor(() => expect(screen.getByTestId("sidebar")).toHaveTextContent("light"));
    await waitFor(() => expect(mocks.updateTheme).toHaveBeenCalledWith("light"));

    // Simula la navegación: nuevo layout, mismo AuthProvider.
    rerender(
      <AuthProvider>
        <ThemeConsumer key="despues-de-navegar" testId="sidebar-after-nav" />
      </AuthProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId("sidebar-after-nav")).toHaveTextContent("light"),
    );
  });

  it("dos instancias montadas a la vez (como Sidebar y TopTabBar) terminan mostrando el mismo tema de cuenta al iniciar sesión", async () => {
    mocks.getMyProfile.mockResolvedValue({ ...BASE_USER, theme: "light" });

    render(
      <AuthProvider>
        <ThemeConsumer testId="sidebar" />
        <ThemeConsumer testId="toptabbar" />
      </AuthProvider>,
    );

    await waitFor(() => expect(screen.getByTestId("sidebar")).toHaveTextContent("light"));
    await waitFor(() => expect(screen.getByTestId("toptabbar")).toHaveTextContent("light"));
  });
});

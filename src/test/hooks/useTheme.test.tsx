import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import type {
  AuthProvider as AuthProviderType,
} from "../../context/AuthContext";
import type {
  useTheme as useThemeType,
} from "../../hooks/useTheme";
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

function ThemeConsumer({
  testId,
}: {
  testId: string;
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      data-testid={testId}
      onClick={toggleTheme}
    >
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
     
    }

    document.body.className = "";

    ({ AuthProvider } = await import(
      "../../context/AuthContext"
    ));

    ({ useTheme } = await import(
      "../../hooks/useTheme"
    ));
  });

  it(
    "al iniciar sesión, adopta el tema guardado en la cuenta",
    async () => {
      mocks.getMyProfile.mockResolvedValue({
        ...BASE_USER,
        theme: "light",
      });

      render(
        <AuthProvider>
          <ThemeConsumer testId="sidebar" />
        </AuthProvider>,
      );

     
      await waitFor(() => {
        expect(
          screen.getByTestId("sidebar"),
        ).toHaveTextContent("light");

        expect(
          document.body.classList.contains("light"),
        ).toBe(true);
      });
    },
  );

  it(
    "después de un cambio manual de tema, un remount (como al navegar de pantalla) no lo revierte al tema viejo de la cuenta",
    async () => {
      mocks.getMyProfile.mockResolvedValue({
        ...BASE_USER,
        theme: "dark",
      });

      mocks.updateTheme.mockImplementation(
        (theme: "light" | "dark") =>
          Promise.resolve({
            ...BASE_USER,
            theme,
          }),
      );

      const user = userEvent.setup();

    
      const { rerender } = render(
        <AuthProvider>
          <ThemeConsumer
            key="antes-de-navegar"
            testId="sidebar"
          />
        </AuthProvider>,
      );

      await waitFor(() => {
        expect(
          screen.getByTestId("sidebar"),
        ).toHaveTextContent("dark");
      });

      await user.click(
        screen.getByTestId("sidebar"),
      );

      await waitFor(() => {
        expect(
          screen.getByTestId("sidebar"),
        ).toHaveTextContent("light");
      });

      await waitFor(() => {
        expect(
          mocks.updateTheme,
        ).toHaveBeenCalledWith("light");
      });

      
      rerender(
        <AuthProvider>
          <ThemeConsumer
            key="despues-de-navegar"
            testId="sidebar-after-nav"
          />
        </AuthProvider>,
      );

      await waitFor(() => {
        expect(
          screen.getByTestId("sidebar-after-nav"),
        ).toHaveTextContent("light");
      });
    },
  );

  it(
    "dos instancias montadas a la vez (como Sidebar y TopTabBar) terminan mostrando el mismo tema de cuenta al iniciar sesión",
    async () => {
      mocks.getMyProfile.mockResolvedValue({
        ...BASE_USER,
        theme: "light",
      });

      render(
        <AuthProvider>
          <ThemeConsumer testId="sidebar" />
          <ThemeConsumer testId="toptabbar" />
        </AuthProvider>,
      );

      await waitFor(() => {
        expect(
          screen.getByTestId("sidebar"),
        ).toHaveTextContent("light");

        expect(
          screen.getByTestId("toptabbar"),
        ).toHaveTextContent("light");
      });
    },
  );
});
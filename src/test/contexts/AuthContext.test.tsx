import {
  act,
  renderHook,
  waitFor,
} from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider } from "../../context/AuthContext";
import { useAuth } from "../../hooks/useAuth";
import * as authService from "../../services/authService";

vi.mock("../../services/authService", () => ({
  getMyProfile: vi.fn(),
  login: vi.fn(),
  loginWithGoogle: vi.fn(),
  registerWithGoogle: vi.fn(),
  logoutRequest: vi.fn(),
}));

const user = {
  id: 1,
  name: "Agustín",
  surname: "Spataro",
  email: "agustin@nomapay.app",
  username: "agustin",
  alias: "agustin.nomapay",
  cbu: null,
};

const wrapper = ({
  children,
}: {
  children: ReactNode;
}) => <AuthProvider>{children}</AuthProvider>;

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("recupera la sesión existente al iniciar", async () => {
    vi.mocked(authService.getMyProfile).mockResolvedValue(user);

    const { result } = renderHook(() => useAuth(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(user);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it("inicia y cierra la sesión", async () => {
    vi.mocked(authService.getMyProfile).mockRejectedValue(
      new Error("Sin sesión"),
    );

    vi.mocked(authService.login).mockResolvedValue(user);

    vi.mocked(authService.logoutRequest).mockResolvedValue(
      undefined,
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(() =>
      result.current.login({
        email: user.email,
        password: "Clave1234",
      }),
    );

    expect(result.current.user).toEqual(user);
    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(authService.logoutRequest).toHaveBeenCalledOnce();
  });
});
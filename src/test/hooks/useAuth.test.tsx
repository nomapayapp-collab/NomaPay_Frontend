import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { AuthContext } from "../../context/AuthContext";
import { useAuth } from "../../hooks/useAuth";

describe("useAuth", () => {
  it("lanza un error claro fuera de AuthProvider", () => {
    vi.spyOn(console, "error").mockImplementation(
      () => undefined,
    );

    expect(() => {
      renderHook(() => useAuth());
    }).toThrow(
      "useAuth debe usarse dentro de un <AuthProvider>",
    );
  });

  it("devuelve el contexto cuando existe un proveedor", () => {
    const value = {
      user: null,
      isAuthenticated: false,
      loading: false,
      login: vi.fn(),
      loginWithGoogle: vi.fn(),
      registerWithGoogle: vi.fn(),
      updateUser: vi.fn(),
      logout: vi.fn(),
    };

    const wrapper = ({
      children,
    }: {
      children: ReactNode;
    }) => (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), {
      wrapper,
    });

    expect(result.current).toBe(value);
  });
});
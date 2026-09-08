import { afterEach, describe, expect, it, vi } from "vitest";
import type { InternalAxiosRequestConfig } from "axios";
import { api } from "../../services/api";
import { onSessionExpired } from "../../services/authEvents";

/**
 * api.test.ts — prueba el interceptor de refresh de api.ts sin pegarle a
 * ningún backend real. Le reemplazamos el adapter de axios (la pieza que
 * manda la request por red de verdad) por una función fake que devuelve
 * la respuesta que cada test necesita; el resto de axios (interceptores,
 * reintentos, manejo de errores) corre exactamente igual que en producción.
 */

type FakeResponse = { status: number; data?: unknown };
type FakeHandler = (config: InternalAxiosRequestConfig) => FakeResponse;

const originalAdapter = api.defaults.adapter;

function useFakeAdapter(handler: FakeHandler) {
  api.defaults.adapter = (async (config: InternalAxiosRequestConfig) => {
    const { status, data } = handler(config);
    const response = { data: data ?? {}, status, statusText: "", headers: {}, config };

    if (status >= 200 && status < 300) {
      return response;
    }

    // Mismo shape que un error real de axios: la única parte que el
    // interceptor de api.ts necesita es response.status y config.
    return Promise.reject({
      config,
      response,
      isAxiosError: true,
      message: `Request failed with status code ${status}`,
    });
  }) as typeof api.defaults.adapter;
}

afterEach(() => {
  api.defaults.adapter = originalAdapter;
});

describe("api — interceptor de renovación de sesión", () => {
  it("ante un 401 pide un token nuevo con /auth/refresh y reintenta la request original", async () => {
    const calls: string[] = [];
    let walletAttempts = 0;

    useFakeAdapter((config) => {
      calls.push(config.url ?? "");

      if (config.url === "/auth/refresh") {
        return { status: 200, data: { message: "Tokens renovados" } };
      }

      walletAttempts += 1;
      return walletAttempts === 1 ? { status: 401 } : { status: 200, data: { ok: true } };
    });

    const response = await api.get("/wallets/me");

    expect(response.status).toBe(200);
    expect(response.data).toEqual({ ok: true });
    // request original -> refresh -> reintento de la misma request
    expect(calls).toEqual(["/wallets/me", "/auth/refresh", "/wallets/me"]);
  });

  it("no intenta refrescar si el 401 viene de /auth/login (es credenciales inválidas, no un token vencido)", async () => {
    const calls: string[] = [];

    useFakeAdapter((config) => {
      calls.push(config.url ?? "");
      return { status: 401, data: { error: "Credenciales inválidas" } };
    });

    await expect(
      api.post("/auth/login", { email: "a@a.com", password: "x" }),
    ).rejects.toMatchObject({ response: { status: 401 } });

    expect(calls).toEqual(["/auth/login"]);
  });

  it("si varias requests fallan con 401 al mismo tiempo, dispara un solo refresh y reintenta todas", async () => {
    const attempts: Record<string, number> = {};
    let refreshCalls = 0;

    useFakeAdapter((config) => {
      const url = config.url ?? "";

      if (url === "/auth/refresh") {
        refreshCalls += 1;
        return { status: 200 };
      }

      attempts[url] = (attempts[url] ?? 0) + 1;
      return attempts[url] === 1 ? { status: 401 } : { status: 200, data: { url } };
    });

    const [walletResponse, historyResponse] = await Promise.all([
      api.get("/wallets/me"),
      api.get("/history"),
    ]);

    expect(walletResponse.status).toBe(200);
    expect(historyResponse.status).toBe(200);
    // aunque las dos requests originales fallaron con 401, solo se pidió
    // un refresh — la segunda esperó en la cola en vez de pedir el suyo.
    expect(refreshCalls).toBe(1);
  });

  it("si el refresh también falla, avisa por authEvents y no reintenta la request original de nuevo", async () => {
    const calls: string[] = [];

    useFakeAdapter((config) => {
      calls.push(config.url ?? "");

      if (config.url === "/auth/refresh") {
        return { status: 401, data: { error: "Refresh token revocado." } };
      }

      return { status: 401 };
    });

    const handler = vi.fn();
    const unsubscribe = onSessionExpired(handler);

    await expect(api.get("/wallets/me")).rejects.toMatchObject({
      response: { status: 401 },
    });

    expect(handler).toHaveBeenCalledTimes(1);
    // no vuelve a pedir /wallets/me después de que el refresh falló
    expect(calls).toEqual(["/wallets/me", "/auth/refresh"]);

    unsubscribe();
  });
});

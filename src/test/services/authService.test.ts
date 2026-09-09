import { afterEach, describe, expect, it } from "vitest";
import type { InternalAxiosRequestConfig } from "axios";
import { api } from "../../services/api";
import { forgotPassword, resetPassword } from "../../services/authService";

/**
 * authService.test.ts — cubre forgotPassword/resetPassword con el mismo
 * enfoque de api.test.ts: reemplazamos el adapter de axios por uno fake,
 * así ejercitamos el código real de authService (endpoint, método, body)
 * sin pegarle a un backend de verdad.
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

    return Promise.reject({
      config,
      response,
      isAxiosError: true,
      message: `Request failed with status code ${status}`,
    });
  }) as typeof api.defaults.adapter;
}

function parseBody(config: InternalAxiosRequestConfig | undefined): unknown {
  if (!config) return undefined;
  return typeof config.data === "string" ? JSON.parse(config.data) : config.data;
}

afterEach(() => {
  api.defaults.adapter = originalAdapter;
});

describe("authService — recuperación de contraseña", () => {
  it("forgotPassword pega a POST /auth/forgot-password con el email", async () => {
    let received: InternalAxiosRequestConfig | undefined;
    useFakeAdapter((config) => {
      received = config;
      return { status: 200, data: { message: "ok" } };
    });

    await forgotPassword("cande@test.com");

    expect(received?.url).toBe("/auth/forgot-password");
    expect(received?.method).toBe("post");
    expect(parseBody(received)).toEqual({ email: "cande@test.com" });
  });

  it("si el backend rechaza la solicitud, forgotPassword propaga el error", async () => {
    useFakeAdapter(() => ({ status: 400, data: { error: "bad request" } }));

    await expect(forgotPassword("x@x.com")).rejects.toBeTruthy();
  });

  it("resetPassword pega a POST /auth/reset-password con el token y la nueva contraseña", async () => {
    let received: InternalAxiosRequestConfig | undefined;
    useFakeAdapter((config) => {
      received = config;
      return { status: 200, data: { message: "ok" } };
    });

    await resetPassword("tok-123", "NuevaClave1!");

    expect(received?.url).toBe("/auth/reset-password");
    expect(received?.method).toBe("post");
    expect(parseBody(received)).toEqual({
      token: "tok-123",
      newPassword: "NuevaClave1!",
    });
  });

  it("si el token es inválido o venció, resetPassword propaga el error", async () => {
    useFakeAdapter(() => ({ status: 400, data: { error: "token vencido" } }));

    await expect(resetPassword("expired", "NuevaClave1!")).rejects.toBeTruthy();
  });
});

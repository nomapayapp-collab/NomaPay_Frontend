import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { emitSessionExpired } from "./authEvents";


export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

// Endpoints de auth que nunca deben disparar un intento de refresh (evita
// loops: un 401 de /auth/login es "contraseña incorrecta", no "token vencido").
const AUTH_ENDPOINTS = ["/auth/refresh", "/auth/login", "/auth/register"];

function isAuthEndpoint(url?: string): boolean {
  return !!url && AUTH_ENDPOINTS.some((path) => url.includes(path));
}


let isRefreshing = false;
let pendingQueue: Array<{
  config: RetriableConfig;
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

function flushQueue(error: unknown | null) {
  const queued = pendingQueue;
  pendingQueue = [];

  queued.forEach(({ config, resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(api(config));
    }
  });
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined;

    const shouldTryRefresh =
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint(originalRequest.url);

    if (!shouldTryRefresh) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Ya hay un refresh en curso: esta request espera su turno y se
      // reintenta sola cuando termine (con éxito o no).
      return new Promise((resolve, reject) => {
        pendingQueue.push({ config: originalRequest, resolve, reject });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await api.post("/auth/refresh");
      isRefreshing = false;
      flushQueue(null);
      return api(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      flushQueue(refreshError);
      // El refresh token también venció o fue revocado: no hay forma de
      // renovar la sesión sin volver a loguearse. Avisamos a AuthContext.
      emitSessionExpired();
      return Promise.reject(refreshError);
    }
  }
);

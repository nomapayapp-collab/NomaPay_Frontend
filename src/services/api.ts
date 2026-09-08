import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { emitSessionExpired } from "./authEvents";

/**
 
services/api.ts — instancia única de axios para toda la app.
Ningún service llama a axios directo: siempre importan "api" desde acá.*
Requiere en el .env (raíz del proyecto):
VITE_API_URL=http://localhost:3000/api
(le pedís a Gastón/Gisella la URL real del backend cuando la tengan)*/

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

// El access token dura poco (30 min por default) a propósito, y el back
// expone POST /auth/refresh (rota el refresh token, ambos van por cookie
// httpOnly) para renovarlo sin pedirle la contraseña de nuevo al usuario.
// Antes, ningún lado de la app llamaba a ese endpoint: al vencer el access
// token, la siguiente request cualquiera devolvía 401 y listo. Este
// interceptor intercepta ESE 401, pide un token nuevo una sola vez, y
// reintenta la request original con el token fresco.
//
// isRefreshing + pendingQueue existen porque si varias requests fallan con
// 401 al mismo tiempo (ej: WalletContext dispara 3 fetch en paralelo), no
// queremos disparar 3 refresh en simultáneo — el back rota el refresh token
// en cada uso, así que el segundo refresh invalidaría el token que ya usó
// el primero. Solo el primer 401 dispara el refresh; el resto espera en
// la cola y reintenta cuando ese refresh termina.
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

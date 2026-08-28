import axios from "axios";

/**
 
services/api.ts — instancia única de axios para toda la app.
Ningún service llama a axios directo: siempre importan "api" desde acá.*
Requiere en el .env (raíz del proyecto):
VITE_API_URL=http://localhost:3000/api
(le pedís a Gastón/Gisella la URL real del backend cuando la tengan)*/

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Adjunta el token guardado a cada request, si existe


// Si el backend responde 401 (token vencido/inválido), limpiamos la sesión local
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("nomapay_token");
      localStorage.removeItem("nomapay_user");
      // el AuthContext detecta esto en el próximo render y redirige a /login
    }
    return Promise.reject(error);
  }
);
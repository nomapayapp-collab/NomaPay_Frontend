import axios from "axios";


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


// Si el backend responde 401 (cookie vencida/inválida), el AuthContext lo detecta
// en el próximo render (isAuthenticated pasa a false) y redirige a /login.
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);


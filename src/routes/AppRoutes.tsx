import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import { ProtectedRoute } from "./ProtectedRoute";
//import Register from "../pages/register/Register";//

/**
 * AppRoutes — acá se registra CADA pantalla nueva que se vaya armando.
 *
 * "/" ya es el Dashboard real, protegido: sin sesión activa redirige a
 * /login (ver ProtectedRoute.tsx).
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/register" element={<Register />} /> */}

      {/* Pendientes: /recuperar-contrasena, /wallet, /exchange, /transfer, /history, /summary */}
    </Routes>
  );
}
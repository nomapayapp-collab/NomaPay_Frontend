import { Routes, Route } from "react-router-dom";
import Register from "../pages/register/Register";
import Login from "../pages/Login";
import { Root } from "./Root";
import { ProtectedRoute } from "./ProtectedRoute";
import Config from "../pages/config/Config";
import NotFound from "../pages/NotFound";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import ComingSoon from "../pages/ComingSoon";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Root />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Config />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wallet"
        element={
          <ProtectedRoute>
            <ComingSoon title="Billetera" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/comprar-vender"
        element={
          <ProtectedRoute>
            <ComingSoon title="Comprar / Vender" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exchange"
        element={
          <ProtectedRoute>
            <ComingSoon title="Convertir" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/transfer"
        element={
          <ProtectedRoute>
            <ComingSoon title="Transferir" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <ComingSoon title="Historial" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/summary"
        element={
          <ProtectedRoute>
            <ComingSoon title="Resumen" />
          </ProtectedRoute>
        }
      />
      <Route path="/politica-de-privacidad" element={<PrivacyPolicy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
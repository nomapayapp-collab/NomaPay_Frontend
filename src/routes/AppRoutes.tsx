import { Routes, Route } from "react-router-dom";
import Register from "../pages/register/Register";
import Login from "../pages/Login";
import { Root } from "./Root";
import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "../components/layout/AppLayout";
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
            <AppLayout>
              <ComingSoon title="Billetera" />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/comprar-vender"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ComingSoon title="Comprar / Vender" />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/exchange"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ComingSoon title="Convertir" />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/transfer"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ComingSoon title="Transferir" />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ComingSoon title="Historial" />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/summary"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ComingSoon title="Resumen" />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path="/politica-de-privacidad" element={<PrivacyPolicy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
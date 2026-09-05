import { Routes, Route } from "react-router-dom";
import Register from "../pages/register/Register";
import Login from "../pages/Login";
import Exchange from "../pages/exchange/Exchange";
import { Root } from "./Root";
import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "../components/layout/AppLayout";
import Config from "../pages/config/Config";
import NotFound from "../pages/NotFound";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import ComingSoon from "../pages/ComingSoon";
import Wallet from "../pages/Wallet";
import Transfer from "../pages/Transfer";
import Receipt from "../pages/Receipt";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Root />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Config />
        </ProtectedRoute>} />
      <Route path="/wallet" element={
        <ProtectedRoute>
          <AppLayout>
            <Wallet />
          </AppLayout>
        </ProtectedRoute>} />
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
        <Exchange />
      </AppLayout>
    </ProtectedRoute>
  }
/>
      <Route
        path="/transfer"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Transfer />
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
      <Route path="/comprobante" element={
        <ProtectedRoute>
          <Receipt />
        </ProtectedRoute>} />
      <Route path="/politica-de-privacidad" element={<PrivacyPolicy />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
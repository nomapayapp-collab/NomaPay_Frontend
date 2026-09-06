import { Route, Routes } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import ComingSoon from "../pages/ComingSoon";
import Exchange from "../pages/Exchange";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Receipt from "../pages/Receipt";
import Register from "../pages/Register";
import Transfer from "../pages/Transfer";
import Wallet from "../pages/Wallet";
import Config from "../pages/config/Config";
import RecoverPassword from "../pages/password/RecoverPassword";
import ResetPassword from "../pages/password/ResetPassword";
import Summary from "../pages/summary/Summary";
import { ProtectedRoute } from "./ProtectedRoute";
import { Root } from "./Root";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Root />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/recover-password" element={<RecoverPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

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
              <Wallet />
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
              <Summary />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/comprobante"
        element={
          <ProtectedRoute>
            <Receipt />
          </ProtectedRoute>
        }
      />

      <Route
        path="/politica-de-privacidad"
        element={<PrivacyPolicy />}
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
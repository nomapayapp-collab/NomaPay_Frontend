import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { WalletProvider } from "./context/WalletContext";
import { ThemeInit } from "../.flowbite-react/init";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <ThemeInit />
          <AuthProvider>
            <WalletProvider>
              <AppRoutes />
            </WalletProvider>
          </AuthProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
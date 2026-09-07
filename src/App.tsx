import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom";
import { ChatAssistant } from "./components/chat/ChatAssistant";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { WalletProvider } from "./context/WalletContext";
import { useAuth } from "./hooks/useAuth";
import AppRoutes from "./routes/AppRoutes";
import { ThemeInit } from "../.flowbite-react/init";

function AuthenticatedChatAssistant() {
  const { isAuthenticated, loading } = useAuth();

  if (loading || !isAuthenticated) {
    return null;
  }

  return <ChatAssistant />;
}

function App() {
  return (
    <ErrorBoundary>
      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
      >
        <BrowserRouter>
          <ThemeInit />

          <ToastProvider>
            <AuthProvider>
              <WalletProvider>
                <AppRoutes />

                <AuthenticatedChatAssistant />
              </WalletProvider>
            </AuthProvider>
          </ToastProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  );
}

export default App;
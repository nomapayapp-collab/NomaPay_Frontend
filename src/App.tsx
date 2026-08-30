import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { WalletProvider } from "./context/WalletContext";
import { ThemeInit } from "../.flowbite-react/init";
import Splash from "./pages/Splash";
import { useSplash } from "./hooks/useSplash";

function App() {
  const showSplash = useSplash(6000);

  if (showSplash) return <Splash />;

  return (
    <BrowserRouter>
      <ThemeInit />
      <AuthProvider>
        <WalletProvider>
          {/* El sprite del logo se monta UNA sola vez acá arriba de todo */}
          <AppRoutes />
        </WalletProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
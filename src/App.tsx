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
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
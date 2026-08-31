import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { WalletProvider } from "./context/WalletContext";
import { ThemeInit } from "../.flowbite-react/init";

function App() {
  return (
    <BrowserRouter>
      <ThemeInit />
      <AuthProvider>
        <WalletProvider>
          <AppRoutes />
        </WalletProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
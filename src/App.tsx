import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { ThemeInit } from "../.flowbite-react/init";

function App() {
  return (
    <BrowserRouter>
      <ThemeInit />
      <AuthProvider>
        {/* El sprite del logo se monta UNA sola vez acá arriba de todo */}
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

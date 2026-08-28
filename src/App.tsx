import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";



function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* El sprite del logo se monta UNA sola vez acá arriba de todo */}
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
//import Register from "../pages/register/Register";//

/**
 * AppRoutes — acá se registra CADA pantalla nueva que se vaya armando.
 *
 * Por ahora solo están Login y Register (que son las que ya maquetamos).
 * A medida que el equipo vaya terminando el resto (Home, Wallet, Transfer, etc.)
 * se van agregando acá, cada una con su <Route path="..." element={<Pantalla />} />.
 *
 * "/" redirige a /login temporalmente, hasta que exista la pantalla Home real.
 * Cuando la tengan, cambiar esa línea por: <Route path="/" element={<Home />} />
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
     {/*oute path="/register" element={<Register />} />

      {/* Pendientes: /recuperar-contrasena, /home, /wallet, /transferir, etc. */}
    </Routes>
  );
}

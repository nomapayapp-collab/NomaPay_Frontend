import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import { Root } from "./Root";
//import Register from "../pages/register/Register";//
//import Config from "../pages/config/Config";//
//import { ProtectedRoute } from "./ProtectedRoute";//

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Root />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/register" element={<Register />} /> */}
      {/* <Route path="/profile" element={<ProtectedRoute><Config /></ProtectedRoute>} /> */}
      {/* Pendientes: /recuperar-contrasena, /wallet, /exchange, /transfer, /history, /summary */}
    </Routes>
  );
}
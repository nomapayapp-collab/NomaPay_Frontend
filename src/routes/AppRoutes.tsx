import { Routes, Route, Navigate } from "react-router-dom";
import Register from "../pages/register/Register";
import Login from "../pages/Login";
import { Root } from "./Root";
//import Register from "../pages/register/Register";//
//import Config from "../pages/config/Config";//
//import { ProtectedRoute } from "./ProtectedRoute";//

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
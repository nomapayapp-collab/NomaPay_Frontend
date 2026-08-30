import { Routes, Route, Navigate } from "react-router-dom";
import Register from "../pages/register/Register";
import Login from "../pages/Login";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
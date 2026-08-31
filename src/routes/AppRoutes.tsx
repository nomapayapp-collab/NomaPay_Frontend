import { Routes, Route } from "react-router-dom";
import Register from "../pages/register/Register";
import Login from "../pages/Login";
import { Root } from "./Root";
import { ProtectedRoute } from "./ProtectedRoute";
import Config from "../pages/config/Config";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Root />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Config />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
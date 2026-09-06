import { useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth";
import * as authService from "../services/authService";

export type Theme = "dark" | "light";

const THEME_KEY = "nomapay_theme";

function getStoredTheme(): Theme {
  try {
    return localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

/**
 * Modo claro/oscuro de toda la app.
 *
 * El tema inicial ya se aplica antes de que React monte (ver el script en
 * index.html, evita el flash del tema incorrecto al cargar). Este hook
 * sincroniza el estado de React con la clase "light" del body, expone
 * toggleTheme() para el switch de Configuración, y sincroniza el tema con
 * la cuenta (GET /users/me trae `theme`, PATCH /users/me/theme lo guarda)
 * para que viaje entre dispositivos.
 *
 * Se usa en dos lugares a la vez (TopTabBar y Sidebar, mobile/desktop), cada
 * uno con su propio useState — no comparten estado de React, solo la clase
 * del body y localStorage. Por eso el "adoptar el tema de la cuenta" usa un
 * ref para aplicarse una sola vez por valor, y el toggle nunca dispara el
 * PATCH desde un efecto (evita duplicados si algún día conviven ambos).
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);
  const { user, isAuthenticated } = useAuth();
  const appliedAccountTheme = useRef<Theme | null>(null);

  // Al iniciar sesión (o cuando carga el perfil), adoptamos el tema guardado
  // en la cuenta como fuente de verdad — una sola vez por valor, así un
  // toggle posterior del usuario no se pisa solo en cada render.
  useEffect(() => {
    if (!isAuthenticated || !user?.theme) return;
    if (appliedAccountTheme.current === user.theme) return;
    appliedAccountTheme.current = user.theme;
    setTheme(user.theme);
  }, [isAuthenticated, user?.theme]);

  useEffect(() => {
    document.body.classList.toggle("light", theme === "light");
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // localStorage puede no estar disponible (Safari en modo privado, etc.)
    }
  }, [theme]);

  function toggleTheme() {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    appliedAccountTheme.current = next;

    if (isAuthenticated) {
      authService.updateTheme(next).catch(() => {
        // si falla el guardado en la cuenta, el cambio visual ya se aplicó
        // igual — no bloqueamos ni revertimos el toggle por esto.
      });
    }
  }

  return { theme, toggleTheme };
}
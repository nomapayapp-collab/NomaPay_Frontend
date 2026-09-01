import { useEffect, useState } from "react";

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
 * sincroniza el estado de React con la clase "light" del body y expone
 * toggleTheme() para el switch de Configuración.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);

  useEffect(() => {
    document.body.classList.toggle("light", theme === "light");
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // localStorage puede no estar disponible (Safari en modo privado, etc.)
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  }

  return { theme, toggleTheme };
}
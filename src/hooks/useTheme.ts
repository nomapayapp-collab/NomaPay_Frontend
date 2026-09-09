import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import * as authService from "../services/authService";

export type Theme = "dark" | "light";

const THEME_KEY = "nomapay_theme";

// Vive a nivel de modulo (no en un useRef) a proposito: cada pagina envuelve
// su propio <AppLayout> en vez de compartir un layout persistente con
// Outlet, asi que Sidebar/TopTabBar (y por lo tanto useTheme()) se
// desmontan y vuelven a montar en cada navegacion. Con un ref local, esa
// guarda de "aplicar el tema de la cuenta una sola vez" se reseteaba en
// cada remount y volvia a pisar el toggle manual del usuario con el tema
// (viejo) de la cuenta en cada cambio de pantalla.
let appliedAccountTheme: Theme | null = null;

function getStoredTheme(): Theme {
  try {
    return localStorage.getItem(THEME_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}


export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);
  const { user, isAuthenticated, updateUser } = useAuth();

  // Al iniciar sesión (o cuando carga el perfil), adoptamos el tema guardado
  // en la cuenta como fuente de verdad — una sola vez por valor, así un
  // toggle posterior del usuario no se pisa solo en cada render.
  useEffect(() => {
    if (!isAuthenticated || !user?.theme) return;
    if (appliedAccountTheme === user.theme) return;
    appliedAccountTheme = user.theme;
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
    appliedAccountTheme = next;

    if (isAuthenticated) {
      // Actualizamos tambien el user local con la respuesta del back: si no,
      // user.theme queda desactualizado el resto de la sesion y la guarda de
      // arriba lo vuelve a pisar en cada remount (ver comentario arriba).
      authService.updateTheme(next).then(updateUser).catch(() => {
        // si falla el guardado en la cuenta, el cambio visual ya se aplicó
        // igual — no bloqueamos ni revertimos el toggle por esto.
      });
    }
  }

  return { theme, toggleTheme };
}
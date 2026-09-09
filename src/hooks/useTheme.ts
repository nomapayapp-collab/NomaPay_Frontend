import { useEffect, useState } from "react";
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

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);
  const { user, isAuthenticated, updateUser } = useAuth();

  // Al iniciar sesión (o cuando cambia el tema guardado en la cuenta, incluido
  // después de nuestro propio toggle una vez que se sincroniza más abajo),
  // adoptamos ese valor. No hace falta ninguna guarda manual de "aplicar una
  // sola vez": React ya evita el re-render si el valor no cambió, así que
  // este efecto es inofensivo si vuelve a correr con el mismo tema (por
  // ejemplo al remontar, ya que cada página envuelve su propio AppLayout).
  //
  // Antes había una guarda a nivel de módulo acá para eso mismo, pero tenía
  // un efecto secundario real: cuando Sidebar y TopTabBar se montan juntos
  // (como pasa siempre — uno queda oculto por CSS según el breakpoint), el
  // primero en correr su efecto marcaba la guarda como "ya aplicada" y el
  // segundo se quedaba con el tema por defecto en vez del de la cuenta. Sin
  // la guarda, cada instancia sincroniza la suya de forma independiente.
  useEffect(() => {
    if (!isAuthenticated || !user?.theme) return;
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

    if (isAuthenticated) {
      // Actualizamos tambien el user local con la respuesta del back: si no,
      // user.theme queda desactualizado el resto de la sesion (por ejemplo,
      // en otra pantalla que muestre la preferencia guardada).
      authService.updateTheme(next).then(updateUser).catch(() => {
        // si falla el guardado en la cuenta, el cambio visual ya se aplicó
        // igual — no bloqueamos ni revertimos el toggle por esto.
      });
    }
  }

  return { theme, toggleTheme };
}

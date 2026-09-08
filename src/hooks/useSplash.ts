import { useEffect, useState } from "react";

export const SPLASH_SEEN_KEY = "nomapay_splash_seen";


export function useSplash(ms = 2000) {
  const [showSplash, setShowSplash] = useState(() => {
    try {
      return sessionStorage.getItem(SPLASH_SEEN_KEY) !== "true";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (!showSplash) return;
    const timer = setTimeout(() => {
      setShowSplash(false);
      try {
        sessionStorage.setItem(SPLASH_SEEN_KEY, "true");
      } catch {
         // sessionStorage puede no estar disponible (Safari en modo privado, etc.)
      }
    }, ms);
    return () => clearTimeout(timer);
  }, [showSplash, ms]);

  return showSplash;
}
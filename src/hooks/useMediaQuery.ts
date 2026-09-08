import { useEffect, useState } from "react";

/**
 * true/false según si el media query matchea ahora mismo — se actualiza
 * solo al cruzar el breakpoint (resize, rotar el celular, etc).
 *
 * Uso: const isDesktop = useMediaQuery("(min-width: 1024px)");
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handleChange = () => setMatches(mql.matches);

    handleChange();
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
}

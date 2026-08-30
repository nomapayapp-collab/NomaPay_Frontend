import { useEffect, useState } from "react";

export function useSplash(ms = 2000) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), ms);
    return () => clearTimeout(timer);
  }, [ms]);

  return showSplash;
}
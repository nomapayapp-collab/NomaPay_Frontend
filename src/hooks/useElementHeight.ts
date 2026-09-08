import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Mide en vivo la altura renderizada de un elemento (vía ResizeObserver) —
 * pensado para que OTRO elemento use ese número como su propia altura fija
 * (o max-height) y así "copiarle" el alto, con scroll interno si su
 * contenido no entra. Devuelve null hasta el primer render/medición.
 *
 * Uso: const [ref, height] = useElementHeight<HTMLDivElement>();
 *      <div ref={ref}>...</div>   // el elemento "molde"
 *      <OtroComponente maxHeight={height} />
 */
export function useElementHeight<T extends HTMLElement = HTMLDivElement>(): [RefObject<T | null>, number | null] {
  const ref = useRef<T>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setHeight(entry.contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, height];
}

import type { ReactNode } from "react";
import { useReveal } from "../../hooks/animations/useReveal";

type RevealProps = {
  children: ReactNode;
  /** Delay en ms — para escalonar varios Reveal dentro de una misma grilla. */
  delay?: number;
  offset?: number;
  className?: string;
};

export function Reveal({ children, delay = 0, offset = 20, className }: RevealProps) {
  const { ref, isVisible } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={["transition-all duration-700 ease-out", className].filter(Boolean).join(" ")}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : `translateY(${offset}px)`,
        transitionDelay: isVisible ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}
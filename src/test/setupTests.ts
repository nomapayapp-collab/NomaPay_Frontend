import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";


// useMediaQuery y useElementHeight (Dashboard y Wallet, para calcular
// alturas en breakpoints lg:). Sin esto, cualquier componente que use esos
// hooks rompe en tests. 
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}

if (typeof window !== "undefined" && !window.ResizeObserver) {
  class ResizeObserverStub implements ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  window.ResizeObserver = ResizeObserverStub;
}

function clearBrowserStorage() {
  try {
    window.sessionStorage?.clear();
  } catch {
    // sessionStorage puede no estar disponible en algunos entornos.
  }

  try {
    window.localStorage?.clear();
  } catch {
    // localStorage puede no estar disponible en algunos entornos.
  }
}

afterEach(() => {
  cleanup();
  clearBrowserStorage();
});
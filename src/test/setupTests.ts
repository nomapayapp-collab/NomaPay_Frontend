import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

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
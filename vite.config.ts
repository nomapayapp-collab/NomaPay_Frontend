import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import flowbiteReact from "flowbite-react/plugin/vite";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    ...(mode === "test" ? [] : [tailwindcss(), flowbiteReact()]),
  ],

  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setupTests.ts",
    testTimeout: 20000,
    // Evita problemas de procesos paralelos en Windows.
    pool: "threads",
    maxWorkers: 1,
    fileParallelism: false,
  },
}));
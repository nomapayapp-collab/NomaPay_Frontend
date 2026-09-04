import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import flowbiteReact from "flowbite-react/plugin/vite";

export default defineConfig(({ mode }) => ({
  // Tailwind y Flowbite solamente son necesarios para la aplicación.
  // Se excluyen durante los tests para evitar procesos abiertos.
  plugins: [
    react(),
    ...(mode === "test" ? [] : [tailwindcss(), flowbiteReact()]),
  ],

  test: {
    environment: "jsdom",
    globals: true,
  setupFiles: "./src/test/setupTests.ts"
  },
}));
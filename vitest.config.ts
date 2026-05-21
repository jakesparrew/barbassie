// vitest.config.ts
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "node:path"

export default defineConfig({
  plugins: [react()],
  css: {
    // Prevent Vite from loading the Next.js postcss.config.mjs (string plugin
    // format is incompatible with Vite's internal PostCSS loader)
    postcss: { plugins: [] },
  },
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    css: false,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
})

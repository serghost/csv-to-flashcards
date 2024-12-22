import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/csv-to-flashcards/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: true
  },
  // TS config
  server: {
    port: 3000,
    open: true
  },
  root: "src",
  publicDir: "../public"
})

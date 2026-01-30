import { defineConfig } from "vite"
import path from "path"

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/main/index.ts"),
      formats: ["cjs"],       // 👈 IMPORTANT
      fileName: () => "main.js",
    },
    rollupOptions: {
      external: ["electron", "sharp"],
    },
  },
})

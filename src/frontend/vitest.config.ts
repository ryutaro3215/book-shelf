import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import * as path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    environment: "jsdom",
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    setupFiles: ["./src/test/setup.ts"],
  },
});

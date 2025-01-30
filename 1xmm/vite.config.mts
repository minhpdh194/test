import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      buffer: "buffer", // Add this alias
    },
  },
  optimizeDeps: {
    include: ["buffer"], // Pre-bundle the buffer package
  },
  server: {
    allowedHosts: ["bot.onexmm.com", "api.onexmm.com"],
  //   proxy: {
  //     "/api": {
  //       target: "http://clicker-game-api.me",
  //       changeOrigin: true,
  //     },
  //   },
  },
});

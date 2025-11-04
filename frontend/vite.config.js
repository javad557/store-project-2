import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: "./index.html",
      },
    },
  },
  server: {
    open: "/index.html",
    historyApiFallback: true,
  },
});
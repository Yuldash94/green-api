import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      [process.env.VITE_API_PROXY_PATH ?? "/greenapi"]: {
        target: process.env.VITE_API_BASE_URL ?? "https://api.green-api.com",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(
            new RegExp(`^${process.env.VITE_API_PROXY_PATH ?? "/greenapi"}`),
            "",
          ),
        secure: true,
      },
    },
  },
});

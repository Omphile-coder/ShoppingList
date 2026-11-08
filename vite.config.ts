import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Keep local requests on Vite's origin and use the same port as the API launcher.
const proxy = {
  "/api": {
    target: `http://127.0.0.1:${process.env.PORT || 8000}`,
    rewrite: (path: string) => path.replace(/^\/api/, ""),
  },
};

export default defineConfig({ plugins: [react()], server: { proxy }, preview: { proxy } });

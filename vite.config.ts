import react from "@vitejs/plugin-react";
import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, loadEnv, type Plugin } from "vite";
import { searchPhotos } from "./api/unsplash.ts";

// Keep local requests on Vite's origin and use the same port as the API launcher.
const proxy = {
  "/api": {
    target: `http://127.0.0.1:${process.env.PORT || 8000}`,
    rewrite: (path: string) => path.replace(/^\/api/, ""),
  },
};

// Runs the same server-side photo search in Vite and in Vercel.
function localPhotoSearch(accessKey: string | undefined): Plugin {
  function middleware(request: IncomingMessage, response: ServerResponse, next: () => void) {
    if (request.url?.split("?")[0] !== "/api/unsplash") {
      next();
      return;
    }
    void searchPhotos(request, response, accessKey);
  }

  return {
    name: "local-photo-search",
    configureServer(server) { server.middlewares.use(middleware); },
    configurePreviewServer(server) { server.middlewares.use(middleware); },
  };
}

export default defineConfig(({ mode }) => {
  const { UNSPLASH_ACCESS_KEY } = loadEnv(mode, process.cwd(), "UNSPLASH_");
  return {
    plugins: [react(), localPhotoSearch(UNSPLASH_ACCESS_KEY)],
    server: { proxy },
    preview: { proxy },
  };
});

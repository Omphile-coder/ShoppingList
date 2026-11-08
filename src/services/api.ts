import axios from "axios";

// Vite proxies local requests. Vercel uses the Render URL set at build time.
const api = axios.create({
  baseURL: import.meta.env.DEV ? "/api" : import.meta.env.VITE_API_URL?.trim() || "/api",
  timeout: 60_000,
});

export default api;

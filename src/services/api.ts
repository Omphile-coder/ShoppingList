import axios from "axios";

// This points to our JSON Server
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers
        : {
        "Content-Type": "application/json",
    },
});

export default api;
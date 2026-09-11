import axios from "axios";

// This points to Render deployment
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, 
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000, 
});

export default api;
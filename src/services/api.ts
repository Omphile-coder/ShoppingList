import axios from "axios";

// This points to our JSON Server
const api = axios.create({
    baseURL: "http://localhost:3000",
    headers
        : {
        "Content-Type": "application/json",
    },
});

export default api;
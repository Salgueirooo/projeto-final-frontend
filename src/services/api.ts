import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

let isAlertShown = false;

const api = axios.create({
    baseURL: `${BASE_URL}/api`,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url;

        const isPublicEndpoint =
            url?.includes("/auth/login") ||
            url?.includes("/auth/register-client") ||
            url?.includes("/initialize");

        if (status === 401 && !isAlertShown && !isPublicEndpoint) {
            isAlertShown = true;
            alert("A sua sessão expirou. Irá ser redirecionado para a página de login.");
            localStorage.removeItem("token");
            window.location.href = "/";
        }

        return Promise.reject(error);
    }
);

export default api;
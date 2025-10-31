import axios from "axios";

let isAlertShown = false;

const api = axios.create({
    baseURL: "http://192.168.1.66:8080/api",
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
      url?.includes("/auth/register-client");

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
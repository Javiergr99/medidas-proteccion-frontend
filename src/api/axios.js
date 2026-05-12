import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

/**
 * Endpoints públicos del flujo de autenticación.
 * 
 * Importante:
 * Estos endpoints NO necesitan Authorization Bearer.
 * Si dejamos que se mande un token viejo desde localStorage,
 * puede provocar comportamientos extraños durante login o 2FA.
 */
const PUBLIC_AUTH_ENDPOINTS = ["/login", "/setup", "/enable", "/login/2fa"];

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const requestUrl = config.url || "";

    const isPublicAuthEndpoint = PUBLIC_AUTH_ENDPOINTS.some((endpoint) =>
      requestUrl.startsWith(endpoint)
    );

    /**
     * Solo agregamos Authorization Bearer en rutas protegidas.
     * No lo agregamos en /login, /setup, /enable ni /login/2fa.
     */
    if (token && !isPublicAuthEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const currentPath = window.location.pathname;

    const isAuthFlowPage =
      currentPath === "/login" || currentPath === "/two-factor";

    /**
     * Si ocurre 401 durante /two-factor, NO redirigimos automáticamente.
     * Ejemplo: código 2FA incorrecto.
     *
     * En ese caso, la pantalla debe mostrar el error y permitir reintentar.
     */
    if (status === 401 && !isAuthFlowPage) {
      localStorage.removeItem("token");
      localStorage.removeItem("auth_user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
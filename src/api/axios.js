import axios from "axios";

import {
  clearAuthSession,
  clearPendingTwoFactorChallenge,
  clearPostLoginWelcomeFlag,
  getStoredAuthSession,
} from "../utils/storage";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const PUBLIC_AUTH_ENDPOINTS = ["/login", "/setup", "/enable", "/login/2fa"];

const AUTH_FLOW_PAGES = ["/login", "/auth/verificacion-2fa"];

const TEMP_2FA_STORAGE_KEYS = [
  "temp_2fa_user_id",
  "temp_2fa_status",
  "temp_2fa_expires_at",
];

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  withCredentials: false,
});

/**
 * Obtiene el pathname real de una URL.
 *
 * Funciona tanto para:
 * - "/login"
 * - "http://127.0.0.1:8000/login"
 *
 * @param {string} url
 * @returns {string}
 */
function getRequestPathname(url = "") {
  try {
    return new URL(url, API_URL).pathname;
  } catch {
    return url;
  }
}

/**
 * Indica si una petición pertenece al flujo público de autenticación.
 *
 * Estos endpoints NO deben recibir Authorization Bearer, porque:
 * - /login aún no tiene token final.
 * - /setup, /enable y /login/2fa usan user_id temporal + código.
 * - Un token viejo en localStorage puede provocar comportamientos confusos.
 *
 * @param {string} url
 * @returns {boolean}
 */
function isPublicAuthEndpoint(url = "") {
  const pathname = getRequestPathname(url);
  return PUBLIC_AUTH_ENDPOINTS.includes(pathname);
}

/**
 * Limpia el respaldo temporal 2FA guardado en localStorage.
 *
 * Se mantiene aquí para evitar ciclos de importación:
 * axios.js -> auth.service.js -> http.js -> axios.js
 */
function clearLocalTwoFactorTempSession() {
  for (const key of TEMP_2FA_STORAGE_KEYS) {
    localStorage.removeItem(key);
  }
}

/**
 * Indica si la página actual pertenece al flujo de autenticación.
 *
 * @returns {boolean}
 */
function isCurrentAuthFlowPage() {
  return AUTH_FLOW_PAGES.includes(window.location.pathname);
}

api.interceptors.request.use(
  (config) => {
    const { token } = getStoredAuthSession();

    if (token && !isPublicAuthEndpoint(config.url)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || "";

    const isAuthRequest = isPublicAuthEndpoint(requestUrl);

    /**
     * Si ocurre 401 en rutas protegidas:
     * - limpiamos sesión final
     * - limpiamos reto 2FA pendiente
     * - limpiamos bandera de bienvenida
     * - limpiamos respaldo temporal 2FA
     *
     * No redirigimos automáticamente si el error ocurrió dentro del flujo auth,
     * porque login/2FA deben poder mostrar su propio error.
     */
    if (status === 401 && !isAuthRequest) {
      clearAuthSession();
      clearPendingTwoFactorChallenge();
      clearPostLoginWelcomeFlag();
      clearLocalTwoFactorTempSession();

      if (!isCurrentAuthFlowPage()) {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
import api from "./axios";
import {
  clearAuthSession,
  clearPendingTwoFactorChallenge,
  clearPostLoginWelcomeFlag,
  getStoredAuthSession,
} from "../utils/storage";

let interceptorsConfigured = false;

/**
 * Configura interceptores globales para peticiones y respuestas.
 * Evita registrar interceptores duplicados en desarrollo.
 *
 * @returns {void}
 */
export function setupInterceptors() {
  if (interceptorsConfigured) return;

  api.interceptors.request.use(
    (config) => {
      const { token } = getStoredAuthSession();

      if (token) {
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

      const isAuthRequest =
        requestUrl.includes("/login") ||
        requestUrl.includes("/auth/login") ||
        requestUrl.includes("/2fa");

      if (status === 401 && !isAuthRequest) {
        clearAuthSession();
        clearPendingTwoFactorChallenge();
        clearPostLoginWelcomeFlag();
      }

      return Promise.reject(error);
    }
  );

  interceptorsConfigured = true;
}
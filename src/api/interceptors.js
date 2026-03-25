import api from "./axios";

/**
 * Configura interceptores globales para peticiones y respuestas.
 * @returns {void}
 */
export function setupInterceptors() {
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");

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
      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      return Promise.reject(error);
    }
  );
}
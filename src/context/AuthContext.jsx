import { createContext, useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";

/**
 * Contexto de autenticación.
 * Maneja usuario actual, token y estado autenticado
 * de forma segura aunque localStorage tenga datos corruptos.
 */
const AuthContext = createContext(null);

/**
 * Lee y parsea un valor JSON de localStorage sin romper el render.
 * @param {string} key
 * @param {any} fallback
 * @returns {any}
 */
function safeReadJSON(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);

    if (!raw || raw === "undefined" || raw === "null") {
      return fallback;
    }

    return JSON.parse(raw);
  } catch (error) {
    console.error(`Error leyendo localStorage["${key}"]`, error);
    localStorage.removeItem(key);
    return fallback;
  }
}

/**
 * Lee texto plano de localStorage de forma segura.
 * @param {string} key
 * @param {string|null} fallback
 * @returns {string|null}
 */
function safeReadText(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);
    return value ?? fallback;
  } catch (error) {
    console.error(`Error leyendo localStorage["${key}"]`, error);
    localStorage.removeItem(key);
    return fallback;
  }
}

/**
 * Proveedor del contexto de autenticación.
 * @param {{ children: import("react").ReactNode }} props
 * @returns {JSX.Element}
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => safeReadJSON("user", null));
  const [token, setToken] = useState(() => safeReadText("token", null));

  const isAuthenticated = Boolean(token);

  /**
   * Guarda sesión en estado y localStorage.
   * @param {{ user?: object|null, token?: string|null }} payload
   */
  const login = ({ user: nextUser = null, token: nextToken = null }) => {
    setUser(nextUser);
    setToken(nextToken);

    try {
      if (nextUser) {
        localStorage.setItem("user", JSON.stringify(nextUser));
      } else {
        localStorage.removeItem("user");
      }

      if (nextToken) {
        localStorage.setItem("token", nextToken);
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Error guardando sesión en localStorage", error);
    }
  };

  /**
   * Limpia sesión.
   */
  const logout = () => {
    setUser(null);
    setToken(null);

    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Error limpiando localStorage", error);
    }
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      login,
      logout,
    }),
    [user, token, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Hook para consumir el contexto.
 * @returns {{
 *  user: object|null,
 *  token: string|null,
 *  isAuthenticated: boolean,
 *  login: Function,
 *  logout: Function
 * }}
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }

  return context;
}
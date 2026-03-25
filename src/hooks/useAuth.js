import { useAuth as useAuthContext } from "../context/AuthContext";

/**
 * Hook de acceso al contexto de autenticación.
 * @returns {{
 *   user: object|null,
 *   token: string|null,
 *   isAuthenticated: boolean,
 *   login: Function,
 *   logout: Function
 * }}
 */
export function useAuth() {
  return useAuthContext();
}
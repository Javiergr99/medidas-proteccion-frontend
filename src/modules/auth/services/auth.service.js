import api from "../../../api/http";
import endpoints from "../../../api/endpoints";

const TOKEN_KEY = "token";
const USER_KEY = "auth_user";

const TEMP_2FA_USER_ID_KEY = "temp_2fa_user_id";
const TEMP_2FA_STATUS_KEY = "temp_2fa_status";

/**
 * Guarda el token final de sesión.
 * Este token solo debe venir de:
 * - POST /enable
 * - POST /login/2fa
 */
export function saveAuthToken(token) {
  if (!token) return;
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Obtiene el token JWT actual.
 */
export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Guarda el perfil del usuario autenticado.
 */
export function saveAuthUser(user) {
  if (!user) return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * Obtiene el usuario autenticado desde localStorage.
 */
export function getAuthUser() {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.warn("No se pudo leer auth_user desde localStorage:", error);
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

/**
 * Limpia únicamente la sesión autenticada.
 */
export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Guarda datos temporales del flujo 2FA.
 * Se usan después del POST /login.
 */
export function saveTwoFactorTempSession({ userId, status }) {
  if (userId) {
    localStorage.setItem(TEMP_2FA_USER_ID_KEY, String(userId));
  }

  if (status) {
    localStorage.setItem(TEMP_2FA_STATUS_KEY, String(status));
  }
}

/**
 * Obtiene los datos temporales del flujo 2FA.
 * Esto ayuda si el usuario recarga la pantalla /two-factor.
 */
export function getTwoFactorTempSession() {
  return {
    userId: localStorage.getItem(TEMP_2FA_USER_ID_KEY),
    status: localStorage.getItem(TEMP_2FA_STATUS_KEY),
  };
}

/**
 * Limpia los datos temporales del flujo 2FA.
 */
export function clearTwoFactorTempSession() {
  localStorage.removeItem(TEMP_2FA_USER_ID_KEY);
  localStorage.removeItem(TEMP_2FA_STATUS_KEY);
}

/**
 * Normaliza el código 2FA.
 * Solo permite números y máximo 6 dígitos.
 */
function normalizeCode(code) {
  return String(code || "")
    .replace(/\D/g, "")
    .slice(0, 6);
}

/**
 * Normaliza el user_id temporal.
 * El backend espera string.
 */
function normalizeUserId(userId) {
  return String(userId || "").trim();
}

/**
 * POST /login
 *
 * El backend espera:
 * Content-Type: application/x-www-form-urlencoded
 *
 * username=<CURP>
 * password=<contraseña>
 *
 * Importante:
 * Este endpoint NO devuelve token.
 * Devuelve:
 * - pending_setup
 * - pending_2fa
 */
export async function loginRequest({ curp, password }) {
  const params = new URLSearchParams();

  params.append("username", curp?.trim().toUpperCase() || "");
  params.append("password", password || "");

  const response = await api.post(endpoints.auth.login, params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data;
}

/**
 * GET /users/me
 *
 * Requiere token Bearer.
 * Por eso primero debemos guardar el token en localStorage
 * antes de llamar esta función.
 */
export async function getCurrentUserProfile() {
  const response = await api.get(endpoints.auth.me);
  return response.data;
}

/**
 * POST /setup
 *
 * Se usa SOLO cuando el login respondió:
 * status === "pending_setup"
 *
 * Devuelve una imagen PNG como blob.
 */
export async function fetchTwoFactorSetupQr({ userId }) {
  const response = await api.post(
    endpoints.auth.setupTwoFactor,
    {
      user_id: normalizeUserId(userId),
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
      responseType: "blob",
    }
  );

  return response.data;
}

/**
 * POST /enable
 *
 * Se usa SOLO en la primera configuración 2FA.
 *
 * El backend espera:
 * {
 *   "user_id": "string",
 *   "code": "123456"
 * }
 *
 * Devuelve:
 * {
 *   "access_token": "...",
 *   "token_type": "bearer"
 * }
 */
export async function enableTwoFactorRequest({ userId, code }) {
  const response = await api.post(
    endpoints.auth.enableTwoFactor,
    {
      user_id: normalizeUserId(userId),
      code: normalizeCode(code),
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

/**
 * POST /login/2fa
 *
 * Se usa cuando el usuario ya tiene 2FA activo.
 *
 * El backend espera:
 * {
 *   "user_id": "string",
 *   "code": "123456"
 * }
 *
 * Devuelve:
 * {
 *   "access_token": "...",
 *   "token_type": "bearer"
 * }
 */
export async function verifyTwoFactorRequest({ userId, code }) {
  const response = await api.post(
    endpoints.auth.verifyTwoFactor,
    {
      user_id: normalizeUserId(userId),
      code: normalizeCode(code),
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}
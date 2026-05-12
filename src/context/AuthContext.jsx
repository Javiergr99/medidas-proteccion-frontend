import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";

import {
  clearAuthSession as clearStoredAuthSession,
  clearPendingTwoFactorChallenge,
  clearPostLoginWelcomeFlag,
  getPendingTwoFactorChallenge,
  getStoredAuthSession,
  persistAuthSession,
  persistPendingTwoFactorChallenge,
} from "../utils/storage";

import {
  clearTwoFactorTempSession,
  getTwoFactorTempSession,
  saveTwoFactorTempSession,
} from "../modules/auth/services/auth.service";

const AuthContext = createContext(null);

/**
 * Normaliza un reto 2FA para que internamente siempre use:
 * {
 *   tempUserId: string,
 *   status: "pending_setup" | "pending_2fa"
 * }
 */
function normalizeTwoFactorChallenge(challenge) {
  if (!challenge) return null;

  const tempUserId =
    challenge.tempUserId ||
    challenge.temp_user_id ||
    challenge.userId ||
    challenge.user_id ||
    challenge.id ||
    "";

  const status = challenge.status || "";

  const isValidStatus = status === "pending_setup" || status === "pending_2fa";

  if (!tempUserId || !isValidStatus) {
    return null;
  }

  return {
    ...challenge,
    tempUserId: String(tempUserId),
    status,
  };
}

/**
 * Construye el estado inicial de autenticación.
 *
 * Lee:
 * - Sesión final: token + auth_user.
 * - Reto 2FA persistido.
 * - Respaldo temporal 2FA: temp_2fa_user_id + temp_2fa_status.
 */
function buildInitialAuthState() {
  const { token, tokenType, user } = getStoredAuthSession();

  const storedPendingTwoFactor = normalizeTwoFactorChallenge(
    getPendingTwoFactorChallenge()
  );

  const tempTwoFactor = getTwoFactorTempSession();

  const fallbackPendingTwoFactor = normalizeTwoFactorChallenge(
    tempTwoFactor?.userId
      ? {
          tempUserId: tempTwoFactor.userId,
          status: tempTwoFactor.status,
        }
      : null
  );

  const pendingTwoFactor =
    storedPendingTwoFactor || fallbackPendingTwoFactor || null;

  const isAuthenticated = Boolean(token);
  const isPendingTwoFactor = Boolean(
    pendingTwoFactor?.tempUserId && pendingTwoFactor?.status
  );

  return {
    token,
    tokenType,
    user,
    pendingTwoFactor,
    isAuthenticated,
    isPendingTwoFactor,
  };
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(buildInitialAuthState);

  /**
   * Completa el login final.
   *
   * Se llama después de:
   * - POST /enable
   * - POST /login/2fa
   *
   * Importante:
   * Aquí ya debe existir access_token.
   */
  const completeLogin = useCallback(({ token, tokenType, user }) => {
    persistAuthSession({
      token,
      tokenType: tokenType || "bearer",
      user: user || null,
    });

    clearPendingTwoFactorChallenge();
    clearTwoFactorTempSession();

    setAuthState({
      token,
      tokenType: tokenType || "bearer",
      user: user || null,
      pendingTwoFactor: null,
      isAuthenticated: Boolean(token),
      isPendingTwoFactor: false,
    });
  }, []);

  /**
   * Inicia el reto 2FA.
   *
   * Se llama después de POST /login cuando backend responde:
   * - pending_setup
   * - pending_2fa
   */
  const startTwoFactorChallenge = useCallback((challenge) => {
    const normalizedChallenge = normalizeTwoFactorChallenge(challenge);

    clearStoredAuthSession();
    clearPendingTwoFactorChallenge();
    clearTwoFactorTempSession();

    if (!normalizedChallenge) {
      setAuthState({
        token: null,
        tokenType: null,
        user: null,
        pendingTwoFactor: null,
        isAuthenticated: false,
        isPendingTwoFactor: false,
      });

      return;
    }

    persistPendingTwoFactorChallenge(normalizedChallenge);

    saveTwoFactorTempSession({
      userId: normalizedChallenge.tempUserId,
      status: normalizedChallenge.status,
    });

    setAuthState({
      token: null,
      tokenType: null,
      user: null,
      pendingTwoFactor: normalizedChallenge,
      isAuthenticated: false,
      isPendingTwoFactor: true,
    });
  }, []);

  /**
   * Actualiza parcialmente el reto 2FA.
   *
   * Ejemplo:
   * - Guardar qrImageUrl después de llamar POST /setup.
   */
  const updatePendingTwoFactorChallenge = useCallback((partialData) => {
    setAuthState((prev) => {
      const nextChallenge = normalizeTwoFactorChallenge({
        ...(prev.pendingTwoFactor || {}),
        ...(partialData || {}),
      });

      if (!nextChallenge) {
        clearPendingTwoFactorChallenge();
        clearTwoFactorTempSession();

        return {
          ...prev,
          pendingTwoFactor: null,
          isPendingTwoFactor: false,
        };
      }

      persistPendingTwoFactorChallenge(nextChallenge);

      saveTwoFactorTempSession({
        userId: nextChallenge.tempUserId,
        status: nextChallenge.status,
      });

      return {
        ...prev,
        pendingTwoFactor: nextChallenge,
        isPendingTwoFactor: true,
      };
    });
  }, []);

  /**
   * Limpia únicamente el reto 2FA pendiente.
   */
  const clearTwoFactorChallenge = useCallback(() => {
    clearPendingTwoFactorChallenge();
    clearTwoFactorTempSession();

    setAuthState((prev) => ({
      ...prev,
      pendingTwoFactor: null,
      isPendingTwoFactor: false,
    }));
  }, []);

  /**
   * Cierra sesión completa.
   */
  const logout = useCallback(() => {
    clearStoredAuthSession();
    clearPendingTwoFactorChallenge();
    clearTwoFactorTempSession();
    clearPostLoginWelcomeFlag();

    setAuthState({
      token: null,
      tokenType: null,
      user: null,
      pendingTwoFactor: null,
      isAuthenticated: false,
      isPendingTwoFactor: false,
    });
  }, []);

  const value = useMemo(
    () => ({
      ...authState,
      login: completeLogin,
      completeLogin,
      startTwoFactorChallenge,
      updatePendingTwoFactorChallenge,
      clearTwoFactorChallenge,
      logout,
    }),
    [
      authState,
      completeLogin,
      startTwoFactorChallenge,
      updatePendingTwoFactorChallenge,
      clearTwoFactorChallenge,
      logout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext debe usarse dentro de AuthProvider");
  }

  return context;
}
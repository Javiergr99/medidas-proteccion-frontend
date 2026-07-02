import {
  createContext,
  use,
  useCallback,
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

import { consumeExternalAuthSessionFromUrl } from "../utils/externalAuthRedirect";

import {
  clearTwoFactorTempSession,
  getTwoFactorTempSession,
  logoutRequest,
  saveTwoFactorTempSession,
} from "../modules/auth/services/auth.service";

const AuthContext = createContext(null);

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

function buildInitialAuthState() {
  /**
   * MP puede recibir la sesión desde Login Universal mediante:
   * http://localhost:5173/medidas#auth_bridge=...
   *
   * Esto se consume antes de leer localStorage para que los guards
   * detecten sesión desde el primer render.
   */
  consumeExternalAuthSessionFromUrl();

  const { token, refreshToken, tokenType, user } = getStoredAuthSession();

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
    refreshToken,
    tokenType,
    user,
    pendingTwoFactor,
    isAuthenticated,
    isPendingTwoFactor,
  };
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(buildInitialAuthState);

  const completeLogin = useCallback(
    ({ token, refreshToken, tokenType, user }) => {
      persistAuthSession({
        token,
        refreshToken,
        tokenType: tokenType || "bearer",
        user: user || null,
      });

      clearPendingTwoFactorChallenge();
      clearTwoFactorTempSession();

      setAuthState({
        token,
        refreshToken: refreshToken || null,
        tokenType: tokenType || "bearer",
        user: user || null,
        pendingTwoFactor: null,
        isAuthenticated: Boolean(token),
        isPendingTwoFactor: false,
      });
    },
    []
  );

  const startTwoFactorChallenge = useCallback((challenge) => {
    const normalizedChallenge = normalizeTwoFactorChallenge(challenge);

    clearStoredAuthSession();
    clearPendingTwoFactorChallenge();
    clearTwoFactorTempSession();

    if (!normalizedChallenge) {
      setAuthState({
        token: null,
        refreshToken: null,
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
      refreshToken: null,
      tokenType: null,
      user: null,
      pendingTwoFactor: normalizedChallenge,
      isAuthenticated: false,
      isPendingTwoFactor: true,
    });
  }, []);

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

  const clearTwoFactorChallenge = useCallback(() => {
    clearPendingTwoFactorChallenge();
    clearTwoFactorTempSession();

    setAuthState((prev) => ({
      ...prev,
      pendingTwoFactor: null,
      isPendingTwoFactor: false,
    }));
  }, []);

  const clearLocalSession = useCallback(() => {
    clearStoredAuthSession();
    clearPendingTwoFactorChallenge();
    clearTwoFactorTempSession();
    clearPostLoginWelcomeFlag();

    setAuthState({
      token: null,
      refreshToken: null,
      tokenType: null,
      user: null,
      pendingTwoFactor: null,
      isAuthenticated: false,
      isPendingTwoFactor: false,
    });
  }, []);

  const logout = useCallback(async () => {
    const { refreshToken } = getStoredAuthSession();

    try {
      if (refreshToken) {
        await logoutRequest({
          refreshToken,
        });
      }
    } catch (error) {
      console.warn("No fue posible cerrar sesión en backend:", error);
    } finally {
      clearLocalSession();
    }
  }, [clearLocalSession]);

  const value = useMemo(
    () => ({
      ...authState,
      login: completeLogin,
      completeLogin,
      startTwoFactorChallenge,
      updatePendingTwoFactorChallenge,
      clearTwoFactorChallenge,
      clearLocalSession,
      logout,
    }),
    [
      authState,
      completeLogin,
      startTwoFactorChallenge,
      updatePendingTwoFactorChallenge,
      clearTwoFactorChallenge,
      clearLocalSession,
      logout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuthContext() {
  const context = use(AuthContext);

  if (!context) {
    throw new Error("useAuthContext debe usarse dentro de AuthProvider");
  }

  return context;
}
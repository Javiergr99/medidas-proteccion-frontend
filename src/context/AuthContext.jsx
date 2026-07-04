import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";

import SessionLogoutOverlay from "../components/feedback/SessionLogoutOverlay";

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
  getExternalRedirectCodeFromUrl,
  getLoginUniversalUrl,
  hasExternalRedirectCodeInUrl,
  removeExternalRedirectCodeFromUrl,
  redirectToLoginUniversal,
} from "../utils/externalAuthRedirect";

import {
  SESSION_ACTIVITY_STORAGE_KEY,
  SESSION_INACTIVITY_REASON,
  SESSION_LOGOUT_EVENT_STORAGE_KEY,
  broadcastSessionInactivityLogout,
  getRemainingInactivityMs,
  isSessionInactivityLogoutEvent,
  markSessionActivity,
} from "../utils/sessionInactivity";

import {
  clearTwoFactorTempSession,
  exchangeRedirectCodeRequest,
  getCurrentUserProfile,
  getTwoFactorTempSession,
  logoutRequest,
  saveTwoFactorTempSession,
} from "../modules/auth/services/auth.service";

const AuthContext = createContext(null);

const INACTIVITY_LOGOUT_ANIMATION_MS = 1400;

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function normalizeSessionPayload(payload) {
  const token =
    payload?.access_token || payload?.token || payload?.accessToken || "";

  const refreshToken =
    payload?.refresh_token || payload?.refreshToken || payload?.refresh || "";

  const tokenType = payload?.token_type || payload?.tokenType || "bearer";

  if (!token) {
    return null;
  }

  return {
    token,
    refreshToken,
    tokenType,
  };
}

function normalizeTwoFactorChallenge(challenge) {
  if (!challenge) return null;

  const tempToken =
    challenge.tempToken ||
    challenge.temp_token ||
    challenge.token ||
    challenge.tempUserId ||
    challenge.temp_user_id ||
    challenge.userId ||
    challenge.user_id ||
    challenge.id ||
    "";

  const status = challenge.status || "";

  const isValidStatus = status === "pending_setup" || status === "pending_2fa";

  if (!tempToken || !isValidStatus) {
    return null;
  }

  return {
    ...challenge,
    tempToken: String(tempToken),
    status,
  };
}

function buildInitialAuthState() {
  const hasRedirectCode = hasExternalRedirectCodeInUrl();
  const { token, refreshToken, tokenType, user } = getStoredAuthSession();

  const storedPendingTwoFactor = normalizeTwoFactorChallenge(
    getPendingTwoFactorChallenge()
  );

  const tempTwoFactor = getTwoFactorTempSession();

  const fallbackPendingTwoFactor = normalizeTwoFactorChallenge(
    tempTwoFactor?.tempToken
      ? {
          tempToken: tempTwoFactor.tempToken,
          status: tempTwoFactor.status,
        }
      : null
  );

  const pendingTwoFactor =
    storedPendingTwoFactor || fallbackPendingTwoFactor || null;

  const hasToken = Boolean(token);
  const hasUser = Boolean(user);

  return {
    token: hasRedirectCode ? null : token,
    refreshToken: hasRedirectCode ? null : refreshToken,
    tokenType: hasRedirectCode ? null : tokenType,
    user: hasRedirectCode ? null : user,
    pendingTwoFactor,
    isAuthenticated: hasToken && !hasRedirectCode,
    isPendingTwoFactor: Boolean(
      pendingTwoFactor?.tempToken && pendingTwoFactor?.status
    ),
    isAuthCodeExchangePending: Boolean(hasRedirectCode),
    isUserProfileLoading: hasToken && !hasUser && !hasRedirectCode,
  };
}

function redirectToLoginUniversalByInactivity() {
  const loginUrl = new URL(getLoginUniversalUrl());

  loginUrl.searchParams.set("reason", SESSION_INACTIVITY_REASON);

  window.location.replace(loginUrl.toString());
}

function redirectToLoginUniversalByManualLogout() {
  const loginUrl = new URL(getLoginUniversalUrl());

  loginUrl.searchParams.set("logout", "1");

  window.location.replace(loginUrl.toString());
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(buildInitialAuthState);
  const [isSessionClosing, setIsSessionClosing] = useState(false);

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

      markSessionActivity({
        force: true,
      });

      setAuthState({
        token,
        refreshToken: refreshToken || null,
        tokenType: tokenType || "bearer",
        user: user || null,
        pendingTwoFactor: null,
        isAuthenticated: Boolean(token),
        isPendingTwoFactor: false,
        isAuthCodeExchangePending: false,
        isUserProfileLoading: false,
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
        isAuthCodeExchangePending: false,
        isUserProfileLoading: false,
      });

      return;
    }

    persistPendingTwoFactorChallenge(normalizedChallenge);

    saveTwoFactorTempSession({
      tempToken: normalizedChallenge.tempToken,
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
      isAuthCodeExchangePending: false,
      isUserProfileLoading: false,
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
        tempToken: nextChallenge.tempToken,
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
      isAuthCodeExchangePending: false,
      isUserProfileLoading: false,
    });
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function exchangeExternalRedirectCode() {
      const code = getExternalRedirectCodeFromUrl();

      if (!code) return;

      setAuthState((prev) => ({
        ...prev,
        isAuthCodeExchangePending: true,
        isUserProfileLoading: true,
      }));

      try {
        const sessionResponse = await exchangeRedirectCodeRequest({ code });
        const finalSession = normalizeSessionPayload(sessionResponse);

        if (!finalSession?.token) {
          throw new Error("No se recibió access_token desde /auth/exchange-code.");
        }

        persistAuthSession({
          token: finalSession.token,
          refreshToken: finalSession.refreshToken,
          tokenType: finalSession.tokenType || "bearer",
          user: null,
        });

        const profileResponse = await getCurrentUserProfile();

        if (!isMounted) return;

        removeExternalRedirectCodeFromUrl();

        completeLogin({
          token: finalSession.token,
          refreshToken: finalSession.refreshToken,
          tokenType: finalSession.tokenType || "bearer",
          user: profileResponse || null,
        });
      } catch (error) {
        console.warn(
          "No fue posible intercambiar el código temporal de redirección:",
          error
        );

        removeExternalRedirectCodeFromUrl();
        clearLocalSession();

        if (isMounted) {
          redirectToLoginUniversal(window.location.pathname);
        }
      }
    }

    exchangeExternalRedirectCode();

    return () => {
      isMounted = false;
    };
  }, [clearLocalSession, completeLogin]);

  useEffect(() => {
    let isMounted = true;

    async function hydrateUserProfileFromStoredToken() {
      if (hasExternalRedirectCodeInUrl()) return;

      const { token, refreshToken, tokenType, user } = getStoredAuthSession();

      if (!token || user) return;

      setAuthState((prev) => ({
        ...prev,
        isUserProfileLoading: true,
      }));

      try {
        const profileResponse = await getCurrentUserProfile();

        if (!isMounted) return;

        completeLogin({
          token,
          refreshToken,
          tokenType: tokenType || "bearer",
          user: profileResponse || null,
        });
      } catch (error) {
        console.warn("No fue posible cargar /users/me con la sesión actual:", error);

        clearLocalSession();

        if (isMounted) {
          redirectToLoginUniversal(window.location.pathname);
        }
      }
    }

    hydrateUserProfileFromStoredToken();

    return () => {
      isMounted = false;
    };
  }, [clearLocalSession, completeLogin]);

  const logout = useCallback(async () => {
    setIsSessionClosing(true);

    const minimumAnimationPromise = wait(INACTIVITY_LOGOUT_ANIMATION_MS);
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
      await minimumAnimationPromise;

      clearLocalSession();
      redirectToLoginUniversalByManualLogout();
    }
  }, [clearLocalSession]);

  useEffect(() => {
    if (!authState.isAuthenticated) {
      return undefined;
    }

    let timeoutId = null;
    let logoutStarted = false;

    async function executeInactivityLogout({ broadcast = true } = {}) {
      if (logoutStarted) return;

      logoutStarted = true;
      setIsSessionClosing(true);

      const minimumAnimationPromise = wait(INACTIVITY_LOGOUT_ANIMATION_MS);
      const { refreshToken } = getStoredAuthSession();

      try {
        if (refreshToken) {
          await logoutRequest({
            refreshToken,
          });
        }
      } catch (error) {
        console.warn("No fue posible cerrar sesión por inactividad:", error);
      } finally {
        await minimumAnimationPromise;

        if (broadcast) {
          broadcastSessionInactivityLogout();
        }

        clearLocalSession();
        redirectToLoginUniversalByInactivity();
      }
    }

    function scheduleInactivityTimeout() {
      window.clearTimeout(timeoutId);

      const remainingMs = getRemainingInactivityMs();

      timeoutId = window.setTimeout(() => {
        const nextRemainingMs = getRemainingInactivityMs();

        if (nextRemainingMs <= 0) {
          executeInactivityLogout({
            broadcast: true,
          });

          return;
        }

        scheduleInactivityTimeout();
      }, Math.max(remainingMs, 1000));
    }

    function handleStorageChange(event) {
      if (event.key === SESSION_ACTIVITY_STORAGE_KEY) {
        scheduleInactivityTimeout();
        return;
      }

      if (
        event.key === SESSION_LOGOUT_EVENT_STORAGE_KEY &&
        isSessionInactivityLogoutEvent(event.newValue)
      ) {
        executeInactivityLogout({
          broadcast: false,
        });
      }
    }

    scheduleInactivityTimeout();

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [authState.isAuthenticated, clearLocalSession]);

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

  return (
    <AuthContext.Provider value={value}>
      {isSessionClosing ? <SessionLogoutOverlay open /> : children}
    </AuthContext.Provider>
  );
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

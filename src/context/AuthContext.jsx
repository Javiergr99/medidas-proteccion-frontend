import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";
import {
  clearAuthSession,
  clearPendingTwoFactorChallenge,
  clearPostLoginWelcomeFlag,
  getPendingTwoFactorChallenge,
  getStoredAuthSession,
  persistAuthSession,
  persistPendingTwoFactorChallenge,
} from "../utils/storage";

const AuthContext = createContext(null);

function buildInitialAuthState() {
  const { token, tokenType, user } = getStoredAuthSession();
  const pendingTwoFactor = getPendingTwoFactorChallenge();

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

  const completeLogin = useCallback(({ token, tokenType, user }) => {
    persistAuthSession({
      token,
      tokenType,
      user: user || null,
    });

    clearPendingTwoFactorChallenge();

    setAuthState({
      token,
      tokenType,
      user: user || null,
      pendingTwoFactor: null,
      isAuthenticated: Boolean(token),
      isPendingTwoFactor: false,
    });
  }, []);

  const startTwoFactorChallenge = useCallback((challenge) => {
    clearAuthSession();
    persistPendingTwoFactorChallenge(challenge);

    setAuthState({
      token: null,
      tokenType: null,
      user: null,
      pendingTwoFactor: challenge,
      isAuthenticated: false,
      isPendingTwoFactor: Boolean(
        challenge?.tempUserId && challenge?.status
      ),
    });
  }, []);

  const updatePendingTwoFactorChallenge = useCallback((partialData) => {
    setAuthState((prev) => {
      const nextChallenge = {
        ...(prev.pendingTwoFactor || {}),
        ...(partialData || {}),
      };

      persistPendingTwoFactorChallenge(nextChallenge);

      return {
        ...prev,
        pendingTwoFactor: nextChallenge,
        isPendingTwoFactor: Boolean(
          nextChallenge?.tempUserId && nextChallenge?.status
        ),
      };
    });
  }, []);

  const clearTwoFactorChallenge = useCallback(() => {
    clearPendingTwoFactorChallenge();

    setAuthState((prev) => ({
      ...prev,
      pendingTwoFactor: null,
      isPendingTwoFactor: false,
    }));
  }, []);

  const logout = useCallback(() => {
    clearAuthSession();
    clearPendingTwoFactorChallenge();
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
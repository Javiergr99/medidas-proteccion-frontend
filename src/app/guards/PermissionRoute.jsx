import { useEffect } from "react";
import PropTypes from "prop-types";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Box, Button, CircularProgress, Typography } from "@mui/material";

import routes from "../routes";
import { useAuth } from "../../hooks/useAuth";
import { getStoredAuthSession } from "../../utils/storage";
import { hasPermissionGroupAccess } from "../../utils/rbac";
import {
  getLoginUniversalRedirectPath,
  redirectToLoginUniversal,
} from "../../utils/externalAuthRedirect";

const EMPTY_ACTIONS = [];

function AuthLoadingFallback() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        background:
          "linear-gradient(135deg, #f8fafc 0%, #f3f4f6 46%, #f7f1e9 100%)",
        fontFamily: "Noto Sans, sans-serif",
      }}
    >
      <CircularProgress size={42} thickness={4.2} sx={{ color: "#8f1538" }} />

      <Typography
        sx={{
          fontFamily: "Noto Sans, sans-serif",
          fontWeight: 850,
          color: "#8f1538",
          fontSize: "0.95rem",
        }}
      >
        Validando permisos…
      </Typography>
    </Box>
  );
}

function AccessDeniedFallback({ onGoDashboard }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        background:
          "linear-gradient(135deg, #f8fafc 0%, #f3f4f6 46%, #f7f1e9 100%)",
        fontFamily: "Noto Sans, sans-serif",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 520,
          borderRadius: "24px",
          backgroundColor: "#ffffff",
          border: "1px solid rgba(15,23,42,0.08)",
          boxShadow: "0 24px 70px rgba(15,23,42,0.10)",
          p: { xs: 3, sm: 4 },
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Noto Sans, sans-serif",
            fontWeight: 950,
            color: "#611232",
            fontSize: "1.35rem",
            mb: 1,
          }}
        >
          Acceso no disponible
        </Typography>

        <Typography
          sx={{
            fontFamily: "Noto Sans, sans-serif",
            color: "#64748b",
            fontSize: "0.95rem",
            lineHeight: 1.7,
            mb: 2.5,
          }}
        >
          Tu cuenta no cuenta con los permisos necesarios para ingresar a este
          módulo. Si consideras que deberías tener acceso, solicita la
          asignación correspondiente al administrador.
        </Typography>

        <Button
          variant="contained"
          onClick={onGoDashboard}
          sx={{
            borderRadius: 999,
            px: 2.5,
            py: 1,
            backgroundColor: "#611232",
            fontFamily: "Noto Sans, sans-serif",
            fontWeight: 850,
            textTransform: "none",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#7a1b41",
              boxShadow: "none",
            },
          }}
        >
          Volver al panel principal
        </Button>
      </Box>
    </Box>
  );
}

AccessDeniedFallback.propTypes = {
  onGoDashboard: PropTypes.func.isRequired,
};

function normalizePath(value) {
  try {
    const url = new URL(value, window.location.origin);
    return url.pathname;
  } catch {
    return String(value || "");
  }
}

export default function PermissionRoute({
  children = null,
  accessRule = null,
  groupCode = "",
  allowGroupOnly = false,
  requiredActions = EMPTY_ACTIONS,
  fallbackActions = EMPTY_ACTIONS,
  redirectTo = routes.medidas,
}) {
  const location = useLocation();

  const {
    user: authUser,
    isAuthenticated,
    isAuthCodeExchangePending,
    isUserProfileLoading,
  } = useAuth();

  const storedSession = getStoredAuthSession();
  const user = authUser || storedSession.user;
  const hasToken = Boolean(storedSession.token);

  const resolvedGroupCode = accessRule?.groupCode || groupCode;
  const resolvedAllowGroupOnly = accessRule?.allowGroupOnly ?? allowGroupOnly;
  const resolvedRequiredActions =
    accessRule?.requiredActions || requiredActions;
  const resolvedFallbackActions =
    accessRule?.fallbackActions || fallbackActions;

  const shouldRedirectToLogin =
    !isAuthCodeExchangePending &&
    !isUserProfileLoading &&
    !isAuthenticated &&
    !hasToken;

  useEffect(() => {
    if (!shouldRedirectToLogin) return;

    redirectToLoginUniversal(getLoginUniversalRedirectPath(location));
  }, [location, shouldRedirectToLogin]);

  if (isAuthCodeExchangePending || isUserProfileLoading) {
    return <AuthLoadingFallback />;
  }

  if (shouldRedirectToLogin) {
    return null;
  }

  const hasAccess = hasPermissionGroupAccess({
    user,
    groupCode: resolvedGroupCode,
    allowGroupOnly: resolvedAllowGroupOnly,
    requiredActions: resolvedRequiredActions,
    fallbackActions: resolvedFallbackActions,
  });

  if (!hasAccess) {
    const currentPath = normalizePath(location.pathname);
    const redirectPath = normalizePath(redirectTo);

    if (currentPath === redirectPath) {
      return (
        <AccessDeniedFallback
          onGoDashboard={() => {
            window.location.assign(routes.loginUniversalDashboard);
          }}
        />
      );
    }

    return (
      <Navigate
        to={redirectTo}
        replace
        state={{
          accessDenied: true,
          deniedGroupCode: resolvedGroupCode,
          from: location.pathname,
        }}
      />
    );
  }

  return children || <Outlet />;
}

PermissionRoute.propTypes = {
  children: PropTypes.node,
  accessRule: PropTypes.shape({
    groupCode: PropTypes.string.isRequired,
    allowGroupOnly: PropTypes.bool,
    requiredActions: PropTypes.arrayOf(PropTypes.string),
    fallbackActions: PropTypes.arrayOf(PropTypes.string),
  }),
  groupCode: PropTypes.string,
  allowGroupOnly: PropTypes.bool,
  requiredActions: PropTypes.arrayOf(PropTypes.string),
  fallbackActions: PropTypes.arrayOf(PropTypes.string),
  redirectTo: PropTypes.string,
};

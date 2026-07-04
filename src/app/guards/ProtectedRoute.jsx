import { useEffect } from "react";
import PropTypes from "prop-types";
import { Outlet, useLocation } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";

import { useAuth } from "../../hooks/useAuth";
import { getStoredAuthSession } from "../../utils/storage";
import {
  getLoginUniversalRedirectPath,
  redirectToLoginUniversal,
} from "../../utils/externalAuthRedirect";

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
      <CircularProgress
        size={42}
        thickness={4.2}
        sx={{
          color: "#8f1538",
        }}
      />

      <Typography
        sx={{
          fontFamily: "Noto Sans, sans-serif",
          fontWeight: 850,
          color: "#8f1538",
          fontSize: "0.95rem",
        }}
      >
        Verificando acceso…
      </Typography>
    </Box>
  );
}

export default function ProtectedRoute({ children = null }) {
  const location = useLocation();
  const { isAuthenticated, isAuthCodeExchangePending } = useAuth();

  const storedSession = getStoredAuthSession();
  const hasToken = Boolean(storedSession.token);

  const shouldRedirect =
    !isAuthCodeExchangePending && !isAuthenticated && !hasToken;

  useEffect(() => {
    if (!shouldRedirect) {
      return;
    }

    redirectToLoginUniversal(getLoginUniversalRedirectPath(location));
  }, [location, shouldRedirect]);

  if (isAuthCodeExchangePending) {
    return <AuthLoadingFallback />;
  }

  if (shouldRedirect) {
    return null;
  }

  return children || <Outlet />;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};

import { useEffect, useMemo } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import routes from "../../../app/routes";
import { useAuth } from "../../../hooks/useAuth";
import {
  clearPostLoginWelcomeFlag,
  getStoredAuthSession,
} from "../../../utils/storage";
import { getAuthUserDisplayName } from "../helpers/auth.helper";

export default function PostLoginWelcomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const sessionUser = useMemo(() => {
    return user || getStoredAuthSession().user;
  }, [user]);

  const displayName = getAuthUserDisplayName(sessionUser);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      clearPostLoginWelcomeFlag();
      navigate(routes.dashboard, { replace: true });
    }, 7000);

    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
        background:
          "linear-gradient(135deg, #f4f5f7 0%, #eef2f7 45%, #e9eef5 100%)",
        fontFamily: "'Noto Sans', sans-serif",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 720,
          borderRadius: "28px",
          px: { xs: 3, sm: 5 },
          py: { xs: 4, sm: 5 },
          textAlign: "center",
          background: "rgba(255,255,255,0.72)",
          border: "1px solid rgba(255,255,255,0.55)",
          boxShadow: "0 24px 80px rgba(15, 23, 42, 0.10)",
          backdropFilter: "blur(18px)",
        }}
      >
        <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
          <CircularProgress size={58} thickness={4.6} />
        </Box>

        <Typography
          sx={{
            fontFamily: "'Noto Sans', sans-serif",
            fontWeight: 700,
            color: "#1f2937",
            fontSize: { xs: "1.7rem", sm: "2.2rem" },
            lineHeight: 1.2,
            mb: 1,
          }}
        >
          Bienvenido, {displayName}
        </Typography>

        <Typography
          sx={{
            fontFamily: "'Noto Sans', sans-serif",
            color: "#6b7280",
            fontSize: { xs: "0.95rem", sm: "1rem" },
          }}
        >
          Estamos preparando tu espacio de trabajo...
        </Typography>
      </Box>
    </Box>
  );
}
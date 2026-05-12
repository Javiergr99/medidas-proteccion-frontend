import { useEffect, useMemo, useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import routes from "../../../app/routes";
import { useAuth } from "../../../hooks/useAuth";
import {
  clearPostLoginWelcomeFlag,
  getStoredAuthSession,
} from "../../../utils/storage";
import { getAuthUserDisplayName } from "../helpers/auth.helper";

const REDIRECT_DELAY_MS = 2200;

const loadingMessages = [
  "Verificando permisos de acceso...",
  "Preparando módulos disponibles...",
  "Cargando tu espacio de trabajo...",
];

export default function PostLoginWelcomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [messageIndex, setMessageIndex] = useState(0);

  const sessionUser = useMemo(() => {
    return user || getStoredAuthSession().user;
  }, [user]);

  const displayName = getAuthUserDisplayName(sessionUser);

  useEffect(() => {
    const messageTimer = window.setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 620);

    const redirectTimer = window.setTimeout(() => {
      clearPostLoginWelcomeFlag();
      navigate(routes.dashboard, { replace: true });
    }, REDIRECT_DELAY_MS);

    return () => {
      window.clearInterval(messageTimer);
      window.clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 2, sm: 3 },
        py: 4,
        fontFamily: "'Noto Sans', sans-serif",
        background:
          "radial-gradient(circle at 18% 20%, rgba(159,34,65,0.16) 0%, transparent 30%), radial-gradient(circle at 82% 24%, rgba(188,149,92,0.18) 0%, transparent 32%), radial-gradient(circle at 50% 100%, rgba(15,23,42,0.08) 0%, transparent 36%), linear-gradient(135deg, #f8fafc 0%, #eef2f7 48%, #f7f2eb 100%)",

        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          opacity: 0.38,
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.045) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          maskImage:
            "radial-gradient(circle at center, black 0%, transparent 72%)",
          pointerEvents: "none",
        },

        "@keyframes cardEnter": {
          "0%": {
            opacity: 0,
            transform: "translateY(22px) scale(0.975)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0) scale(1)",
          },
        },

        "@keyframes floatSoft": {
          "0%, 100%": {
            transform: "translate3d(0, 0, 0) scale(1)",
          },
          "50%": {
            transform: "translate3d(18px, -18px, 0) scale(1.06)",
          },
        },

        "@keyframes ringPulse": {
          "0%": {
            transform: "scale(0.72)",
            opacity: 0.4,
          },
          "70%": {
            transform: "scale(1.32)",
            opacity: 0,
          },
          "100%": {
            transform: "scale(1.32)",
            opacity: 0,
          },
        },

        "@keyframes checkDraw": {
          "0%": {
            strokeDashoffset: 60,
            opacity: 0,
          },
          "20%": {
            opacity: 1,
          },
          "100%": {
            strokeDashoffset: 0,
            opacity: 1,
          },
        },

        "@keyframes iconLift": {
          "0%": {
            transform: "translateY(4px) scale(0.92)",
            opacity: 0,
          },
          "100%": {
            transform: "translateY(0) scale(1)",
            opacity: 1,
          },
        },

        "@keyframes progressFill": {
          "0%": {
            transform: "scaleX(0)",
          },
          "100%": {
            transform: "scaleX(1)",
          },
        },

        "@keyframes shimmer": {
          "0%": {
            transform: "translateX(-120%)",
          },
          "100%": {
            transform: "translateX(120%)",
          },
        },

        "@keyframes fadeText": {
          "0%": {
            opacity: 0,
            transform: "translateY(4px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: { xs: 240, md: 340 },
          height: { xs: 240, md: 340 },
          borderRadius: "999px",
          top: { xs: -110, md: -90 },
          left: { xs: -120, md: "8%" },
          background:
            "linear-gradient(135deg, rgba(159,34,65,0.22), rgba(188,149,92,0.08))",
          filter: "blur(10px)",
          animation: "floatSoft 6s ease-in-out infinite",
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: { xs: 310, md: 430 },
          height: { xs: 310, md: 430 },
          borderRadius: "999px",
          right: { xs: -190, md: "3%" },
          bottom: { xs: -210, md: -170 },
          background:
            "linear-gradient(135deg, rgba(188,149,92,0.22), rgba(159,34,65,0.09))",
          filter: "blur(14px)",
          animation: "floatSoft 7s ease-in-out infinite reverse",
        }}
      />

      <Box
        sx={{
          width: "100%",
          maxWidth: 720,
          position: "relative",
          zIndex: 1,
          borderRadius: { xs: "28px", sm: "36px" },
          p: "1px",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.36), rgba(188,149,92,0.36))",
          boxShadow:
            "0 34px 100px rgba(15, 23, 42, 0.16), 0 10px 34px rgba(159,34,65,0.08)",
          animation: "cardEnter 520ms cubic-bezier(0.22, 1, 0.36, 1) both",
        }}
      >
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            borderRadius: { xs: "27px", sm: "35px" },
            px: { xs: 3, sm: 5.5 },
            py: { xs: 4.5, sm: 5.5 },
            textAlign: "center",
            background: "rgba(255,255,255,0.78)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.52)",

            "&::after": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.95), transparent)",
            },
          }}
        >
          <Stack alignItems="center" spacing={2.4}>
            <Box
              sx={{
                width: 104,
                height: 104,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: "rgba(159,34,65,0.10)",
                  animation: "ringPulse 1.9s ease-out infinite",
                }}
              />

              <Box
                sx={{
                  position: "absolute",
                  inset: 9,
                  borderRadius: "50%",
                  border: "1px solid rgba(188,149,92,0.34)",
                  animation: "ringPulse 1.9s ease-out infinite 0.35s",
                }}
              />

              <Box
                sx={{
                  width: 74,
                  height: 74,
                  borderRadius: "26px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg, #9f2241 0%, #8f1538 44%, #bc955c 100%)",
                  boxShadow:
                    "0 22px 46px rgba(159,34,65,0.24), inset 0 1px 0 rgba(255,255,255,0.26)",
                  animation: "iconLift 520ms ease-out both",
                }}
              >
                <Box
                  component="svg"
                  viewBox="0 0 52 52"
                  sx={{
                    width: 40,
                    height: 40,
                    fill: "none",
                  }}
                >
                  <Box
                    component="path"
                    d="M15 27.5L22.5 35L38 17"
                    sx={{
                      stroke: "#ffffff",
                      strokeWidth: 5,
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeDasharray: 60,
                      strokeDashoffset: 60,
                      animation: "checkDraw 720ms ease-out 220ms forwards",
                    }}
                  />
                </Box>
              </Box>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontFamily: "'Noto Sans', sans-serif",
                  fontWeight: 900,
                  color: "#111827",
                  fontSize: { xs: "1.65rem", sm: "2.35rem" },
                  lineHeight: 1.08,
                  letterSpacing: "-0.045em",
                  mb: 1,
                }}
              >
                Acceso verificado
              </Typography>

              <Typography
                sx={{
                  fontFamily: "'Noto Sans', sans-serif",
                  color: "#374151",
                  fontSize: { xs: "1rem", sm: "1.08rem" },
                  lineHeight: 1.55,
                  fontWeight: 600,
                }}
              >
                Bienvenido, {displayName}
              </Typography>
            </Box>

            <Box
              sx={{
                px: 2,
                py: 0.9,
                borderRadius: 999,
                background: "rgba(159,34,65,0.08)",
                border: "1px solid rgba(159,34,65,0.10)",
              }}
            >
              <Typography
                key={messageIndex}
                sx={{
                  fontFamily: "'Noto Sans', sans-serif",
                  color: "#8f1538",
                  fontSize: "0.88rem",
                  fontWeight: 800,
                  animation: "fadeText 240ms ease-out both",
                }}
              >
                {loadingMessages[messageIndex]}
              </Typography>
            </Box>

            <Box
              sx={{
                width: "100%",
                maxWidth: 390,
                pt: 0.5,
              }}
            >
              <Box
                sx={{
                  height: 10,
                  width: "100%",
                  borderRadius: 999,
                  overflow: "hidden",
                  position: "relative",
                  background: "rgba(15,23,42,0.08)",
                  boxShadow: "inset 0 1px 2px rgba(15,23,42,0.08)",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    transformOrigin: "left center",
                    borderRadius: 999,
                    background:
                      "linear-gradient(90deg, #9f2241 0%, #bc955c 100%)",
                    animation: `progressFill ${REDIRECT_DELAY_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards`,

                    "&::after": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
                      animation: "shimmer 1100ms ease-in-out infinite",
                    },
                  }}
                />
              </Box>
            </Box>

            <Typography
              sx={{
                fontFamily: "'Noto Sans', sans-serif",
                color: "#94a3b8",
                fontSize: "0.76rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Registro de Medidas de Protección
            </Typography>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
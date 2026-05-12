import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";

import AuthLayout from "../../../components/layout/AuthLayout";
import routes from "../../../app/routes";
import { useAuth } from "../../../hooks/useAuth";
import {
  clearPostLoginWelcomeFlag,
  setPostLoginWelcomeFlag,
} from "../../../utils/storage";
import {
  getErrorMessage,
  normalizeFinalSession,
  normalizeUserProfile,
} from "../helpers/auth.helper";
import {
  clearTwoFactorTempSession,
  enableTwoFactorRequest,
  fetchTwoFactorSetupQr,
  getCurrentUserProfile,
  getTwoFactorTempSession,
  saveAuthToken,
  saveAuthUser,
  verifyTwoFactorRequest,
} from "../services/auth.service";

import bg from "../../../assets/images/login.webp";
import loginIcon from "../../../assets/icons/login-icon.png";

const instructionTextStyles = {
  fontFamily: "Noto Sans, sans-serif",
  color: "rgba(255,255,255,0.94)",
  fontSize: { xs: "0.98rem", sm: "1.04rem" },
  fontWeight: 650,
  lineHeight: 1.55,
  textShadow:
    "0 3px 12px rgba(0,0,0,0.62), 0 10px 28px rgba(0,0,0,0.34)",
};

export default function TwoFactorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const {
    pendingTwoFactor,
    completeLogin,
    updatePendingTwoFactorChallenge,
    clearTwoFactorChallenge,
  } = useAuth();

  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrLoading, setQrLoading] = useState(false);
  const [localQrImageUrl, setLocalQrImageUrl] = useState(null);

  const qrObjectUrlRef = useRef(null);

  const storedTwoFactor = useMemo(() => getTwoFactorTempSession(), []);
  const routeChallenge = location.state?.challenge || null;

  const activeChallenge =
    pendingTwoFactor ||
    routeChallenge ||
    (storedTwoFactor?.userId
      ? {
          tempUserId: storedTwoFactor.userId,
          status: storedTwoFactor.status,
        }
      : null);

  const challengeStatus = activeChallenge?.status || "";
  const isSetupMode = challengeStatus === "pending_setup";

  const qrImageUrl =
    pendingTwoFactor?.qrImageUrl ||
    localQrImageUrl ||
    activeChallenge?.qrImageUrl ||
    null;

  const tempUserId =
    activeChallenge?.tempUserId ||
    activeChallenge?.user_id ||
    activeChallenge?.userId ||
    activeChallenge?.id ||
    "";

  useEffect(() => {
    if (!activeChallenge || !tempUserId || !challengeStatus) {
      navigate(routes.login || "/login", { replace: true });
    }
  }, [activeChallenge, challengeStatus, navigate, tempUserId]);

  useEffect(() => {
    let isMounted = true;

    async function loadSetupQr() {
      /**
       * El QR solo se solicita cuando el backend respondió:
       * status === "pending_setup"
       *
       * Si el usuario ya tiene 2FA activo, NO llamamos /setup.
       */
      if (!isSetupMode || !tempUserId || qrImageUrl) return;

      try {
        setQrLoading(true);

        const qrBlob = await fetchTwoFactorSetupQr({
          userId: String(tempUserId),
        });

        const objectUrl = URL.createObjectURL(qrBlob);

        if (qrObjectUrlRef.current) {
          URL.revokeObjectURL(qrObjectUrlRef.current);
        }

        qrObjectUrlRef.current = objectUrl;

        if (!isMounted) return;

        setLocalQrImageUrl(objectUrl);

        if (typeof updatePendingTwoFactorChallenge === "function") {
          updatePendingTwoFactorChallenge({
            qrImageUrl: objectUrl,
          });
        }
      } catch (error) {
        enqueueSnackbar(
          getErrorMessage(error, "No fue posible generar el código QR."),
          { variant: "error" }
        );

        console.error("Error al generar QR 2FA:", error);
      } finally {
        if (isMounted) {
          setQrLoading(false);
        }
      }
    }

    loadSetupQr();

    return () => {
      isMounted = false;
    };
  }, [
    enqueueSnackbar,
    isSetupMode,
    qrImageUrl,
    tempUserId,
    updatePendingTwoFactorChallenge,
  ]);

  useEffect(() => {
    return () => {
      if (qrObjectUrlRef.current) {
        URL.revokeObjectURL(qrObjectUrlRef.current);
        qrObjectUrlRef.current = null;
      }
    };
  }, []);

  const canSubmit = useMemo(() => {
    return (
      verificationCode.trim().length === 6 &&
      !loading &&
      Boolean(tempUserId)
    );
  }, [verificationCode, loading, tempUserId]);

  function handleCodeChange(event) {
    const onlyDigits = event.target.value.replace(/\D/g, "").slice(0, 6);
    setVerificationCode(onlyDigits);
  }

  function handleBackToLogin() {
    clearPostLoginWelcomeFlag();
    clearTwoFactorChallenge();
    clearTwoFactorTempSession();
    navigate(routes.login || "/login", { replace: true });
  }

  async function finishAuthenticatedSession(sessionData) {
    const finalSession = normalizeFinalSession(sessionData);

    if (!finalSession?.token) {
      throw new Error("No se recibió un token válido del backend.");
    }

    /**
     * Importante:
     * Guardamos primero el token para que getCurrentUserProfile()
     * mande Authorization: Bearer <token>.
     */
    saveAuthToken(finalSession.token);

    let currentUser = null;

    try {
      const profileResponse = await getCurrentUserProfile();
      currentUser = normalizeUserProfile(profileResponse);
      saveAuthUser(currentUser);
    } catch (profileError) {
      console.warn(
        "La verificación fue correcta, pero no se pudo consultar /users/me:",
        profileError
      );
    }

    completeLogin({
      token: finalSession.token,
      tokenType: finalSession.tokenType || "bearer",
      user: currentUser,
    });

    clearTwoFactorChallenge();
    clearTwoFactorTempSession();
    setPostLoginWelcomeFlag(true);

    enqueueSnackbar("Verificación completada correctamente.", {
      variant: "success",
    });

    navigate(
      routes.postLoginWelcome || routes.dashboard || routes.registros || "/",
      {
        replace: true,
      }
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!canSubmit) return;

    const cleanCode = verificationCode.replace(/\D/g, "").slice(0, 6);
    const cleanUserId = String(tempUserId).trim();

    try {
      setLoading(true);

      let sessionResponse;

      if (isSetupMode) {
        /**
         * Flujo primera configuración:
         * POST /enable
         *
         * Activa el 2FA y devuelve el primer access_token.
         * No llamamos después a /login/2fa.
         */
        sessionResponse = await enableTwoFactorRequest({
          userId: cleanUserId,
          code: cleanCode,
        });
      } else {
        /**
         * Flujo normal:
         * POST /login/2fa
         *
         * Se usa cuando el usuario ya tiene 2FA activo.
         */
        sessionResponse = await verifyTwoFactorRequest({
          userId: cleanUserId,
          code: cleanCode,
        });
      }

      await finishAuthenticatedSession(sessionResponse);
    } catch (error) {
      enqueueSnackbar(
        getErrorMessage(
          error,
          "No fue posible validar el código de verificación."
        ),
        {
          variant: "error",
        }
      );

      console.error("Error al verificar 2FA:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "fixed",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.76) 0%, rgba(0,0,0,0.58) 34%, rgba(0,0,0,0.34) 58%, rgba(0,0,0,0.62) 100%)",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "fixed",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 42%, rgba(159,34,65,0.24) 0%, transparent 34%), radial-gradient(circle at 78% 18%, rgba(188,149,92,0.16) 0%, transparent 28%)",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "1220px",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: { xs: 4, md: 6, lg: 8 },
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              color: "#ffffff",
              maxWidth: "720px",
              px: { xs: 0.5, sm: 1, lg: 0 },
            }}
          >
            <Typography
              component="h1"
              data-testid="two-factor-page-title"
              sx={{
                fontFamily: "Noto Sans, sans-serif",
                fontSize: {
                  xs: "2.65rem",
                  sm: "3.35rem",
                  md: "4rem",
                  lg: "4.35rem",
                },
                fontWeight: 950,
                lineHeight: 0.98,
                letterSpacing: "-0.06em",
                maxWidth: "760px",
                color: "#ffffff",
                textShadow:
                  "0 5px 18px rgba(0,0,0,0.60), 0 18px 48px rgba(0,0,0,0.42)",
              }}
            >
              {isSetupMode
                ? "Configura tu autenticación en dos pasos"
                : "Verifica tu acceso seguro"}
            </Typography>

            <Box
              sx={{
                width: { xs: 82, sm: 104 },
                height: 5,
                borderRadius: 999,
                mt: 2.4,
                mb: 2.8,
                background:
                  "linear-gradient(90deg, #ffffff 0%, rgba(188,149,92,0.95) 100%)",
                boxShadow: "0 8px 22px rgba(255,255,255,0.20)",
              }}
            />

            <Typography
              sx={{
                fontFamily: "Noto Sans, sans-serif",
                fontSize: {
                  xs: "1.12rem",
                  sm: "1.25rem",
                  md: "1.34rem",
                },
                fontWeight: 650,
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.96)",
                maxWidth: "700px",
                textShadow:
                  "0 3px 12px rgba(0,0,0,0.66), 0 12px 32px rgba(0,0,0,0.38)",
              }}
            >
              {isSetupMode
                ? "Es obligatorio configurar la autenticación en dos pasos para proteger tu cuenta. Escanea el código QR con Google Authenticator o Microsoft Authenticator y captura el código generado."
                : "Ingresa el código de seis dígitos generado por tu aplicación autenticadora para completar el acceso a la plataforma."}
            </Typography>

            <Stack spacing={1.35} sx={{ mt: 3.5 }}>
              {isSetupMode ? (
                <>
                  <Typography sx={instructionTextStyles}>
                    • Abre Google Authenticator o Microsoft Authenticator.
                  </Typography>

                  <Typography sx={instructionTextStyles}>
                    • Escanea el código QR que se muestra en pantalla.
                  </Typography>

                  <Typography sx={instructionTextStyles}>
                    • Captura el código actual de seis dígitos para activar tu
                    acceso.
                  </Typography>
                </>
              ) : (
                <>
                  <Typography sx={instructionTextStyles}>
                    • Abre tu aplicación autenticadora y localiza el código
                    vigente.
                  </Typography>

                  <Typography sx={instructionTextStyles}>
                    • Verifica que la hora del dispositivo esté configurada
                    automáticamente.
                  </Typography>

                  <Typography sx={instructionTextStyles}>
                    • Captura el código actual de seis dígitos para continuar.
                  </Typography>
                </>
              )}
            </Stack>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", lg: "flex-end" },
            }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                width: "100%",
                maxWidth: 490,
                borderRadius: "28px",
                backgroundColor: "rgba(255,255,255,0.14)",
                backdropFilter: "blur(18px)",
                border: "1px solid rgba(255,255,255,0.22)",
                boxShadow: "0 20px 45px rgba(0, 0, 0, 0.22)",
                p: { xs: 3, sm: 4 },
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 1,
                  mb: 1.5,
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      width: 90,
                      height: 90,
                      borderRadius: "50%",
                      background:
                        "radial-gradient(circle, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.10) 40%, rgba(255,255,255,0) 70%)",
                      filter: "blur(8px)",
                      zIndex: 0,
                    }}
                  />

                  <Box
                    component="img"
                    src={loginIcon}
                    alt="Verificación en dos pasos"
                    sx={{
                      width: 58,
                      height: "auto",
                      position: "relative",
                      zIndex: 1,
                      filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.28))",
                    }}
                  />
                </Box>
              </Box>

              <Typography
                component="h2"
                sx={{
                  fontFamily: "Noto Sans, sans-serif",
                  fontSize: "1.45rem",
                  fontWeight: 600,
                  lineHeight: 1.15,
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                {isSetupMode
                  ? "Configura tu autenticador"
                  : "Ingresa tu código de verificación"}
              </Typography>

              <Typography
                sx={{
                  fontFamily: "Noto Sans, sans-serif",
                  fontSize: "0.92rem",
                  color: "rgba(255,255,255,0.82)",
                  mt: 1,
                  mb: 2.3,
                  textAlign: "center",
                }}
              >
                {activeChallenge?.userHint || activeChallenge?.curp
                  ? `Cuenta: ${activeChallenge.userHint || activeChallenge.curp}`
                  : "Continúa con la verificación de seguridad."}
              </Typography>

              {activeChallenge?.message ? (
                <Alert
                  severity="info"
                  sx={{
                    mb: 2,
                    borderRadius: 3,
                    backgroundColor: "rgba(255,255,255,0.92)",
                  }}
                >
                  {activeChallenge.message}
                </Alert>
              ) : null}

              {isSetupMode ? (
                <Stack spacing={2}>
                  {qrLoading ? (
                    <Alert
                      severity="info"
                      sx={{
                        borderRadius: 3,
                        backgroundColor: "rgba(255,255,255,0.92)",
                      }}
                    >
                      Generando código QR…
                    </Alert>
                  ) : qrImageUrl ? (
                    <Box
                      data-testid="two-factor-qr-panel"
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        p: 2,
                        borderRadius: 3,
                        backgroundColor: "#ffffff",
                      }}
                    >
                      <Box
                        component="img"
                        src={qrImageUrl}
                        alt="Código QR para autenticación en dos pasos"
                        sx={{
                          width: 220,
                          maxWidth: "100%",
                          height: "auto",
                          display: "block",
                        }}
                      />
                    </Box>
                  ) : (
                    <Alert
                      severity="warning"
                      sx={{
                        borderRadius: 3,
                        backgroundColor: "rgba(255,255,255,0.92)",
                      }}
                    >
                      No fue posible cargar el código QR.
                    </Alert>
                  )}

                  <Divider
                    sx={{
                      borderColor: "rgba(255,255,255,0.14)",
                    }}
                  />
                </Stack>
              ) : null}

              <Stack spacing={1.8} sx={{ mt: 2 }}>
                <TextField
                  label="Código de verificación"
                  fullWidth
                  value={verificationCode}
                  onChange={handleCodeChange}
                  autoComplete="one-time-code"
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    maxLength: 6,
                  }}
                  InputLabelProps={{
                    sx: {
                      color: "rgba(255,255,255,0.78)",
                      fontFamily: "Noto Sans, sans-serif",
                      "&.Mui-focused": {
                        color: "#ffffff",
                      },
                    },
                  }}
                  InputProps={{
                    sx: {
                      height: 52,
                      backgroundColor: "rgba(255,255,255,0.08)",
                      borderRadius: "14px",
                      color: "#ffffff",
                      fontFamily: "Noto Sans, sans-serif",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255,255,255,0.18)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255,255,255,0.28)",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(255,255,255,0.36)",
                        borderWidth: "1px",
                      },
                      "&.Mui-focused": {
                        boxShadow: "0 0 0 4px rgba(255,255,255,0.08)",
                      },
                      "& input": {
                        letterSpacing: "0.28em",
                        fontWeight: 700,
                        textAlign: "center",
                      },
                    },
                  }}
                />

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={!canSubmit || (isSetupMode && qrLoading)}
                  sx={{
                    textTransform: "none",
                    py: 1.45,
                    borderRadius: 999,
                    fontWeight: 800,
                    fontFamily: "Noto Sans, sans-serif",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
                    backgroundColor: "#ffffff",
                    color: "#0f172a",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      backgroundColor: "#f3f4f6",
                      transform: "translateY(-2px)",
                      boxShadow: "0 14px 28px rgba(0,0,0,0.24)",
                    },
                    "&:active": {
                      transform: "translateY(0)",
                    },
                    "&.Mui-disabled": {
                      background: "rgba(255,255,255,0.45)",
                      color: "rgba(15,23,42,0.55)",
                      boxShadow: "none",
                    },
                  }}
                >
                  {loading
                    ? "Validando..."
                    : isSetupMode
                      ? "Activar y continuar"
                      : "Confirmar verificación"}
                </Button>

                <Button
                  type="button"
                  variant="text"
                  onClick={handleBackToLogin}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    color: "#ffffff",
                    "&:hover": {
                      backgroundColor: "transparent",
                      textDecoration: "underline",
                    },
                  }}
                >
                  Volver al inicio de sesión
                </Button>

                <Typography
                  sx={{
                    textAlign: "center",
                    fontSize: "0.75rem",
                    color: "rgba(255,255,255,0.68)",
                    pt: 0.5,
                    fontFamily: "Noto Sans, sans-serif",
                  }}
                >
                  Acceso restringido a personal autorizado
                </Typography>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </AuthLayout>
  );
}
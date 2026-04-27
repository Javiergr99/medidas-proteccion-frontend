import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  normalizeEnableSuccess,
  normalizeFinalSession,
  normalizeUserProfile,
} from "../helpers/auth.helper";
import {
  enableTwoFactorRequest,
  fetchTwoFactorSetupQr,
  getCurrentUserProfile,
  verifyTwoFactorRequest,
} from "../services/auth.service";

import bg from "../../../assets/images/login.webp";
import loginIcon from "../../../assets/icons/login-icon.png";

export default function TwoFactorPage() {
  const navigate = useNavigate();
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
  const qrObjectUrlRef = useRef(null);

  const challengeStatus = pendingTwoFactor?.status || "pending_2fa";
  const isSetupMode = challengeStatus === "pending_setup";
  const isVerifyMode = challengeStatus === "pending_2fa";
  const qrImageUrl = pendingTwoFactor?.qrImageUrl || null;
  const tempUserId = pendingTwoFactor?.tempUserId || "";

  useEffect(() => {
    let isMounted = true;

    async function loadSetupQr() {
      if (!isSetupMode || !tempUserId || qrImageUrl) return;

      try {
        setQrLoading(true);

        const qrBlob = await fetchTwoFactorSetupQr({ userId: tempUserId });
        const objectUrl = URL.createObjectURL(qrBlob);

        if (qrObjectUrlRef.current) {
          URL.revokeObjectURL(qrObjectUrlRef.current);
        }

        qrObjectUrlRef.current = objectUrl;

        if (!isMounted) return;

        updatePendingTwoFactorChallenge({
          qrImageUrl: objectUrl,
        });
      } catch (error) {
        enqueueSnackbar(
          getErrorMessage(error, "No fue posible generar el código QR."),
          { variant: "error" }
        );
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
    navigate(routes.login, { replace: true });
  }

  async function finishAuthenticatedSession(sessionData) {
    const finalSession = normalizeFinalSession(sessionData);

    if (!finalSession) {
      throw new Error("No se recibió un token válido del backend.");
    }

    const profileResponse = await getCurrentUserProfile();
    const currentUser = normalizeUserProfile(profileResponse);

    completeLogin({
      token: finalSession.token,
      tokenType: finalSession.tokenType,
      user: currentUser,
    });

    setPostLoginWelcomeFlag(true);

    enqueueSnackbar("Verificación completada correctamente.", {
      variant: "success",
    });

    navigate(routes.postLoginWelcome, { replace: true });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!canSubmit) return;

    try {
      setLoading(true);

      if (isSetupMode) {
        const enableResponse = await enableTwoFactorRequest({
          userId: tempUserId,
          code: verificationCode,
        });

        const enableResult = normalizeEnableSuccess(enableResponse);

        if (!enableResult) {
          throw new Error(
            "No se recibió la confirmación esperada al habilitar el 2FA."
          );
        }

        const verifyResponse = await verifyTwoFactorRequest({
          userId: tempUserId,
          code: verificationCode,
        });

        await finishAuthenticatedSession(verifyResponse);
        return;
      }

      const verifyResponse = await verifyTwoFactorRequest({
        userId: tempUserId,
        code: verificationCode,
      });

      await finishAuthenticatedSession(verifyResponse);
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
            "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.28) 45%, rgba(0,0,0,0.52) 100%)",
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
          <Box sx={{ color: "#ffffff" }}>
            <Typography
              component="h1"
              data-testid="two-factor-page-title"
              sx={{
                fontFamily: "Noto Sans, sans-serif",
                fontSize: { xs: "2rem", md: "2.85rem" },
                fontWeight: 600,
                lineHeight: 1.08,
                maxWidth: "680px",
              }}
            >
              {isSetupMode
                ? "Configura tu autenticación en dos pasos"
                : "Verifica tu acceso con autenticación en dos pasos"}
            </Typography>

            <Typography
              sx={{
                fontFamily: "Noto Sans, sans-serif",
                fontSize: { xs: "1rem", md: "1.05rem" },
                fontWeight: 400,
                lineHeight: 1.8,
                mt: 2.5,
                opacity: 0.94,
                maxWidth: "650px",
              }}
            >
              {isSetupMode
                ? "Es obligatorio configurar la autenticación en dos pasos para continuar. Escanea el código QR con Google Authenticator o Microsoft Authenticator y después captura el código generado."
                : "Ingresa el código de seis dígitos generado por tu aplicación autenticadora para completar el acceso."}
            </Typography>

            <Stack spacing={1.2} sx={{ mt: 3 }}>
              {isSetupMode ? (
                <>
                  <Typography
                    sx={{
                      fontFamily: "Noto Sans, sans-serif",
                      color: "rgba(255,255,255,0.92)",
                      fontSize: "0.95rem",
                    }}
                  >
                    • Abre Google Authenticator o Microsoft Authenticator.
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: "Noto Sans, sans-serif",
                      color: "rgba(255,255,255,0.92)",
                      fontSize: "0.95rem",
                    }}
                  >
                    • Escanea el código QR que se muestra en pantalla.
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: "Noto Sans, sans-serif",
                      color: "rgba(255,255,255,0.92)",
                      fontSize: "0.95rem",
                    }}
                  >
                    • Si vuelves a generar el QR, el anterior dejará de servir.
                  </Typography>
                </>
              ) : (
                <>
                  <Typography
                    sx={{
                      fontFamily: "Noto Sans, sans-serif",
                      color: "rgba(255,255,255,0.92)",
                      fontSize: "0.95rem",
                    }}
                  >
                    • Abre tu aplicación autenticadora y localiza el código
                    vigente.
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: "Noto Sans, sans-serif",
                      color: "rgba(255,255,255,0.92)",
                      fontSize: "0.95rem",
                    }}
                  >
                    • Verifica que la hora del dispositivo esté configurada
                    automáticamente si el código no coincide.
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: "Noto Sans, sans-serif",
                      color: "rgba(255,255,255,0.92)",
                      fontSize: "0.95rem",
                    }}
                  >
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
                {pendingTwoFactor?.userHint || pendingTwoFactor?.email
                  ? `Cuenta: ${pendingTwoFactor.userHint || pendingTwoFactor.email}`
                  : "Continúa con la verificación de seguridad."}
              </Typography>

              {pendingTwoFactor?.message ? (
                <Alert
                  severity="info"
                  sx={{
                    mb: 2,
                    borderRadius: 3,
                    backgroundColor: "rgba(255,255,255,0.92)",
                  }}
                >
                  {pendingTwoFactor.message}
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
                      Generando código QR...
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
import { useMemo, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../../components/layout/AuthLayout";

import bg from "../../../assets/images/login.webp";
import loginIcon from "../../../assets/icons/login-icon.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

function getEmailError(value) {
  if (!value.trim()) return "Ingresa tu correo.";
  if (!/\S+@\S+\.\S+/.test(value.trim())) return "Ingresa un correo válido.";
  return "";
}

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const emailError = useMemo(() => getEmailError(email), [email]);

  const canSubmit = useMemo(() => {
    return !emailError && !loading;
  }, [emailError, loading]);

  async function handleSubmit() {
    if (!canSubmit) return;

    try {
      setLoading(true);

      // Aquí después conectamos el backend real
      await new Promise((resolve) => setTimeout(resolve, 900));

      setSubmitted(true);

      enqueueSnackbar("Se envió la solicitud de recuperación.", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar("No se pudo procesar la solicitud.", {
        variant: "error",
      });
      console.error("Error en recuperación:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      {/* Fondo global */}
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

      {/* Capa de contraste global */}
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

      {/* Contenido */}
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "1200px",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1.05fr 0.95fr" },
            gap: { xs: 4, md: 6, lg: 8 },
            alignItems: "center",
          }}
        >
          {/* IZQUIERDA */}
          <Box sx={{ color: "#ffffff" }}>
            <Typography
              sx={{
                fontFamily: "Noto Sans, sans-serif",
                fontSize: { xs: "2.1rem", md: "3rem" },
                fontWeight: 600,
                lineHeight: 1.08,
                maxWidth: "680px",
              }}
            >
              Recupera el acceso a tu cuenta
            </Typography>

            <Typography
              sx={{
                fontFamily: "Noto Sans, sans-serif",
                fontSize: { xs: "1rem", md: "1.05rem" },
                fontWeight: 400,
                lineHeight: 1.8,
                mt: 2.5,
                opacity: 0.94,
                maxWidth: "620px",
              }}
            >
              Ingresa tu correo institucional para recibir las instrucciones de
              recuperación de contraseña.
            </Typography>
          </Box>

          {/* DERECHA */}
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", lg: "flex-end" },
            }}
          >
            <Box
              sx={{
                width: "100%",
                maxWidth: "430px",
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
                    alt="Recuperación de acceso"
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
                sx={{
                  fontFamily: "Noto Sans, sans-serif",
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  lineHeight: 1.15,
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                ¿Olvidaste tu contraseña?
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
                Te ayudaremos a recuperar tu acceso de forma segura.
              </Typography>

              {!submitted ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.8 }}>
                  <TextField
                    label="Correo"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    error={Boolean(email && emailError)}
                    helperText={email ? emailError : " "}
                    FormHelperTextProps={{
                      sx: {
                        color: "rgba(255,255,255,0.72)",
                        fontFamily: "Noto Sans, sans-serif",
                        ml: 0.5,
                      },
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
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          sx={{
                            mr: 0.5,
                            width: 32,
                            height: 32,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faEnvelope}
                            style={{
                              fontSize: 14,
                              color: "#ffffff",
                            }}
                          />
                        </InputAdornment>
                      ),
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
                        "& input:-webkit-autofill": {
                          WebkitBoxShadow:
                            "0 0 0 1000px rgba(255,255,255,0.08) inset",
                          WebkitTextFillColor: "#ffffff",
                          caretColor: "#ffffff",
                          borderRadius: "14px",
                          transition:
                            "background-color 9999s ease-out, color 9999s ease-out",
                        },
                        "& input:-webkit-autofill:hover": {
                          WebkitBoxShadow:
                            "0 0 0 1000px rgba(255,255,255,0.08) inset",
                          WebkitTextFillColor: "#ffffff",
                          caretColor: "#ffffff",
                          borderRadius: "14px",
                        },
                        "& input:-webkit-autofill:focus": {
                          WebkitBoxShadow:
                            "0 0 0 1000px rgba(255,255,255,0.08) inset",
                          WebkitTextFillColor: "#ffffff",
                          caretColor: "#ffffff",
                          borderRadius: "14px",
                        },
                      },
                    }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    disabled={!canSubmit}
                    onClick={handleSubmit}
                    sx={{
                      textTransform: "none",
                      py: 1.45,
                      mt: 0.5,
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
                    {loading ? "Enviando..." : "Enviar instrucciones"}
                  </Button>
                </Box>
              ) : (
                <Box
                  sx={{
                    borderRadius: "18px",
                    backgroundColor: "rgba(255,255,255,0.10)",
                    border: "1px solid rgba(255,255,255,0.18)",
                    p: 2.2,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: 700,
                      color: "#ffffff",
                      fontSize: "1rem",
                      mb: 1,
                    }}
                  >
                    Solicitud enviada
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: "Noto Sans, sans-serif",
                      color: "rgba(255,255,255,0.84)",
                      fontSize: "0.92rem",
                      lineHeight: 1.7,
                    }}
                  >
                    Si el correo <strong>{email}</strong> existe en el sistema,
                    recibirás instrucciones para restablecer tu contraseña.
                  </Typography>
                </Box>
              )}

              <Button
                variant="text"
                onClick={() => navigate("/login")}
                startIcon={<FontAwesomeIcon icon={faArrowLeft} />}
                sx={{
                  mt: 2.2,
                  minWidth: "auto",
                  p: 0,
                  textTransform: "none",
                  fontWeight: 700,
                  color: "#ffffff",
                  fontSize: "0.9rem",
                  fontFamily: "Noto Sans, sans-serif",
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
                  pt: 2,
                  fontFamily: "Noto Sans, sans-serif",
                }}
              >
                Acceso restringido a personal autorizado
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </AuthLayout>
  );
}
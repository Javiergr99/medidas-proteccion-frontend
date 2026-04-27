import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useSnackbar } from "notistack";
import AuthLayout from "../../../components/layout/AuthLayout";

import bg from "../../../assets/images/login.webp";
import loginIcon from "../../../assets/icons/login-icon.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import routes from "../../../app/routes";
import { useAuth } from "../../../hooks/useAuth";
import { loginRequest } from "../services/auth.service";
import { getErrorMessage, resolveLoginFlow } from "../helpers/auth.helper";
import {
  clearRememberedUser,
  getRememberedUser,
  setRememberedUser,
} from "../../../utils/storage";

export default function LoginPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { startTwoFactorChallenge } = useAuth();

  const rememberedUser = useMemo(() => getRememberedUser(), []);
  const [email, setEmail] = useState(rememberedUser);
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(Boolean(rememberedUser));
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.trim().length > 0 && !loading;
  }, [email, password, loading]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!canSubmit) return;

    try {
      setLoading(true);

      const response = await loginRequest({
        email: email.trim(),
        password,
      });

      const result = resolveLoginFlow(response, email.trim());

      if (remember) {
        setRememberedUser(email.trim());
      } else {
        clearRememberedUser();
      }

      if (result.type === "pending_two_factor") {
        startTwoFactorChallenge(result.challenge);

        enqueueSnackbar(
          result.challenge.status === "pending_setup"
            ? "Credenciales validadas. Ahora debes configurar la autenticación en dos pasos."
            : "Credenciales validadas. Ingresa tu código de verificación.",
          {
            variant: "info",
          }
        );

        navigate(routes.twoFactor, { replace: true });
      }
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error, "No se pudo iniciar sesión."), {
        variant: "error",
      });
      console.error("Error en login:", error);
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
          <Box sx={{ color: "#ffffff" }}>
            <Typography
              component="h1"
              sx={{
                fontFamily: "Noto Sans, sans-serif",
                fontSize: { xs: "2.1rem", md: "3rem" },
                fontWeight: 600,
                lineHeight: 1.08,
                maxWidth: "680px",
              }}
            >
              Bienvenido al Registro de Medidas de Protección
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
              Accede al sistema de manera segura. Después de validar tus
              credenciales, continuarás con la verificación en dos pasos.
            </Typography>
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
                    transition: "transform 280ms ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
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
                    alt="Registro de Medidas de Protección"
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
                Accede a tu cuenta
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
                Ingresa con tus credenciales para continuar.
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.8 }}>
                <TextField
                  label="Correo"
                  fullWidth
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  autoComplete="email"
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

                <TextField
                  label="Contraseña"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
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
                        <IconButton
                          aria-label={
                            showPassword
                              ? "Ocultar contraseña"
                              : "Mostrar contraseña"
                          }
                          onClick={() => setShowPassword((prev) => !prev)}
                          disableRipple
                          sx={{
                            width: 32,
                            height: 32,
                            p: 0,
                            m: 0,
                            color: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            "&:hover": {
                              backgroundColor: "transparent",
                            },
                          }}
                        >
                          <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                            style={{ fontSize: 14 }}
                          />
                        </IconButton>
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
                      "& input::-ms-reveal": {
                        display: "none",
                      },
                      "& input::-ms-clear": {
                        display: "none",
                      },
                      "& input::-webkit-credentials-auto-fill-button": {
                        display: "none !important",
                        visibility: "hidden",
                        pointerEvents: "none",
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

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={remember}
                        onChange={(event) => setRemember(event.target.checked)}
                        sx={{
                          color: "rgba(255,255,255,0.72)",
                          "&.Mui-checked": {
                            color: "#ffffff",
                          },
                        }}
                      />
                    }
                    label={
                      <Typography
                        sx={{
                          fontSize: "0.88rem",
                          color: "rgba(255,255,255,0.88)",
                          fontFamily: "Noto Sans, sans-serif",
                        }}
                      >
                        Recordar correo
                      </Typography>
                    }
                    sx={{ m: 0 }}
                  />

                  <Button
                    variant="text"
                    onClick={() => navigate(routes.forgotPassword)}
                    sx={{
                      minWidth: "auto",
                      p: 0,
                      textTransform: "none",
                      fontWeight: 700,
                      color: "#ffffff",
                      fontSize: "0.82rem",
                      fontFamily: "Noto Sans, sans-serif",
                      "&:hover": {
                        backgroundColor: "transparent",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    ¿Olvidaste tu contraseña?
                  </Button>
                </Box>

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={!canSubmit}
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
                  {loading ? "Validando..." : "Iniciar sesión"}
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
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </AuthLayout>
  );
}
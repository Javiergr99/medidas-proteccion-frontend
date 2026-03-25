import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

import routes from "../../../app/routes";
import { useAuth } from "../../../hooks/useAuth";

/**
 * Formulario visual de acceso.
 * Temporalmente usa login demo para conservar el flujo.
 * Después se reemplazará por Formik + Yup + backend real.
 *
 * @returns {JSX.Element}
 */
export default function LoginForm() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { login } = useAuth();

  const [form, setForm] = useState({
    username: "",
    password: "",
    remember: true,
  });

  const [loading, setLoading] = useState(false);

  /**
   * Maneja cambios de campos.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /**
   * Login temporal para conservar navegación funcional.
   *
   * @param {React.FormEvent<HTMLFormElement>} event
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.username.trim() || !form.password.trim()) {
      enqueueSnackbar("Captura usuario y contraseña", {
        variant: "warning",
      });
      return;
    }

    try {
      setLoading(true);

      await new Promise((resolve) => {
        setTimeout(resolve, 600);
      });

      login({
        user: {
          username: form.username,
          nombre: "Javier",
          rol: "Administrador",
        },
        token: "token-demo",
      });

      enqueueSnackbar("Acceso correcto", { variant: "success" });
      navigate(routes.dashboard, { replace: true });
    } catch (error) {
      console.error(error);
      enqueueSnackbar("No fue posible iniciar sesión", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={2.25}>
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#1f2a2d",
              mb: 0.75,
            }}
          >
            Accede a tu cuenta
          </Typography>

          <Typography sx={{ color: "#5f6b6d" }}>
            Ingresa con tus credenciales institucionales para continuar.
          </Typography>
        </Box>

        <Alert
          severity="info"
          sx={{
            borderRadius: 3,
            "& .MuiAlert-message": {
              fontSize: "0.92rem",
            },
          }}
        >
          Esta versión mantiene un acceso demo temporal mientras conectamos el
          backend real.
        </Alert>

        <TextField
          label="Usuario"
          name="username"
          value={form.username}
          onChange={handleChange}
          fullWidth
          autoComplete="username"
        />

        <TextField
          label="Contraseña"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          autoComplete="current-password"
        />

        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            gap: 1.5,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                name="remember"
                checked={form.remember}
                onChange={handleChange}
              />
            }
            label="Mantener sesión"
          />

          <Button
            type="button"
            variant="text"
            sx={{
              textTransform: "none",
              fontWeight: 700,
              color: "#7A1F3D",
              px: 0,
            }}
          >
            ¿Olvidaste tu contraseña?
          </Button>
        </Box>

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          sx={{
            minHeight: 52,
            fontWeight: 700,
            textTransform: "none",
            borderRadius: 3,
            bgcolor: "#7A1F3D",
            boxShadow: "0 10px 24px rgba(122,31,61,0.28)",
            "&:hover": {
              bgcolor: "#641630",
            },
          }}
        >
          {loading ? "Validando acceso..." : "Iniciar sesión"}
        </Button>

        <Typography
          sx={{
            fontSize: "0.9rem",
            color: "#6d7779",
            textAlign: "center",
          }}
        >
          Desarrollo DTI · Acceso restringido a personal autorizado
        </Typography>
      </Stack>
    </Box>
  );
}
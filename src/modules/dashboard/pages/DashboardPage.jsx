import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";

import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import HealthAndSafetyRoundedIcon from "@mui/icons-material/HealthAndSafetyRounded";

import routes from "../../../app/routes";
import RegistryAccessCard from "../components/RegistryAccessCard";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("auth_user") || "null");
  } catch {
    return null;
  }
}

const registryCatalog = {
  rncas: {
    key: "rncas",
    code: "RNCAS",
    title: "Minería de datos públicos nacional de centros de asistencia social",
    description:
      "Consulta la información pública relacionada con centros de asistencia social y los registros habilitados para este módulo.",
    route: routes.rncas,
    icon: <AssignmentTurnedInRoundedIcon sx={{ fontSize: 34 }} />,
  },
  rmh: {
    key: "rmh",
    code: "RMH",
    title: "Minería de datos públicos de NNA en contexto de movilidad humana",
    description:
      "Accede al módulo de movilidad humana para consultar la información y continuar con los flujos habilitados para tu perfil.",
    route: routes.movilidadHumana,
    icon: <SyncRoundedIcon sx={{ fontSize: 34 }} />,
  },
  dvf: {
    key: "dvf",
    code: "DVF",
    title: "Minería de datos públicos del derecho a vivir en familia",
    description:
      "Ingresa al registro vinculado con el derecho a vivir en familia y consulta la información disponible según tus privilegios.",
    route: routes.vivirEnFamilia,
    icon: <FavoriteBorderRoundedIcon sx={{ fontSize: 34 }} />,
  },
  rmp: {
    key: "rmp",
    code: "RMP",
    title: "Minería de datos públicos de medidas de protección",
    description:
      "Accede al registro de medidas de protección para consultar, capturar o dar seguimiento según el perfil asociado a tu cuenta.",
    route: routes.medidas,
    icon: <HealthAndSafetyRoundedIcon sx={{ fontSize: 34 }} />,
  },
};

export default function DashboardPage() {
  const navigate = useNavigate();

  const user = useMemo(() => getStoredUser(), []);
  const displayName = user?.nombre || user?.name || "Usuario";
  const role = user?.rol || "Sin rol asignado";

  const availableRegistries = useMemo(() => {
    const registryKeys = Array.isArray(user?.registros) ? user.registros : [];
    return registryKeys
      .map((key) => registryCatalog[key])
      .filter(Boolean);
  }, [user]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("auth_user");
    sessionStorage.removeItem("show_post_login_welcome");
    navigate(routes.login, { replace: true });
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f4f4f4",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, sm: 4 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1120px",
          mx: "auto",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: "Noto Sans, sans-serif",
                fontWeight: 800,
                fontSize: { xs: "1.7rem", md: "2rem" },
                color: "#2b2b2b",
                lineHeight: 1.1,
                mb: 1,
              }}
            >
              Registros disponibles
            </Typography>

            <Typography
              sx={{
                fontFamily: "Noto Sans, sans-serif",
                color: "#6a6a6a",
                fontSize: "0.96rem",
                lineHeight: 1.5,
                mb: 1.2,
              }}
            >
              Bienvenido, {displayName}. Selecciona el registro al que deseas ingresar.
            </Typography>

            <Chip
              label={role}
              sx={{
                fontFamily: "Noto Sans, sans-serif",
                fontWeight: 700,
                color: "#8f1538",
                backgroundColor: "rgba(159,34,65,0.08)",
              }}
            />
          </Box>

          <Button
            variant="outlined"
            onClick={handleLogout}
            sx={{
              textTransform: "none",
              borderColor: "rgba(159,34,65,0.35)",
              color: "#8f1538",
              fontWeight: 700,
              borderRadius: 999,
              px: 2.2,
              py: 1,
              "&:hover": {
                borderColor: "#8f1538",
                backgroundColor: "rgba(159,34,65,0.04)",
              },
            }}
          >
            Cerrar sesión
          </Button>
        </Stack>

        <Stack spacing={2}>
          {availableRegistries.length > 0 ? (
            availableRegistries.map((registry) => (
              <RegistryAccessCard
                key={registry.key}
                code={registry.code}
                title={registry.title}
                description={registry.description}
                icon={registry.icon}
                onClick={() => navigate(registry.route)}
              />
            ))
          ) : (
            <Box
              sx={{
                border: "1px solid #dddddd",
                borderRadius: "12px",
                backgroundColor: "#ffffff",
                p: 3,
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Noto Sans, sans-serif",
                  fontWeight: 700,
                  color: "#444444",
                  mb: 0.5,
                }}
              >
                No hay registros asociados
              </Typography>

              <Typography
                sx={{
                  fontFamily: "Noto Sans, sans-serif",
                  color: "#6d6d6d",
                  fontSize: "0.95rem",
                }}
              >
                Tu cuenta aún no tiene módulos asignados. Cuando llegue el backend,
                este listado se llenará con los privilegios reales del usuario.
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
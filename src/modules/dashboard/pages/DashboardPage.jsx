import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Chip, Divider, Stack, Typography } from "@mui/material";

import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import HealthAndSafetyRoundedIcon from "@mui/icons-material/HealthAndSafetyRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import AppsRoundedIcon from "@mui/icons-material/AppsRounded";

import routes from "../../../app/routes";
import { useAuth } from "../../../hooks/useAuth";
import RegistryAccessCard from "../components/RegistryAccessCard";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("auth_user") || "null");
  } catch {
    return null;
  }
}

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Catálogo visual local.
 *
 * Importante:
 * Este catálogo NO asigna permisos.
 * Solo traduce los accesos que vengan del backend a tarjetas visuales.
 */
const registryCatalog = {
  rncas: {
    key: "rncas",
    aliases: [
      "rncas",
      "registro nacional de centros de asistencia social",
      "centros de asistencia social",
      "cas",
    ],
    code: "RNCAS",
    title: "Registro Nacional de Centros de Asistencia Social",
    subtitle: "Centros de asistencia social",
    description:
      "Consulta y da seguimiento a la información relacionada con centros de asistencia social y los registros habilitados para tu perfil.",
    route: routes.rncas || routes.dashboard,
    icon: <AssignmentTurnedInRoundedIcon sx={{ fontSize: 34 }} />,
  },
  rmh: {
    key: "rmh",
    aliases: [
      "rmh",
      "movilidad humana",
      "registro de movilidad humana",
      "registro de ninas ninos y adolescentes en movilidad humana",
      "registro de niñas niños y adolescentes en movilidad humana",
    ],
    code: "RMH",
    title: "Registro de Niñas, Niños y Adolescentes en Movilidad Humana",
    subtitle: "Movilidad humana",
    description:
      "Accede al módulo de movilidad humana para consultar información, validar datos y continuar con los flujos habilitados.",
    route: routes.movilidadHumana || routes.dashboard,
    icon: <SyncRoundedIcon sx={{ fontSize: 34 }} />,
  },
  dvf: {
    key: "dvf",
    aliases: [
      "dvf",
      "vivir en familia",
      "derecho a vivir en familia",
      "registro del derecho a vivir en familia",
    ],
    code: "DVF",
    title: "Registro del Derecho a Vivir en Familia",
    subtitle: "Derecho a vivir en familia",
    description:
      "Ingresa al registro vinculado con el derecho a vivir en familia y consulta la información disponible según tus privilegios.",
    route: routes.vivirEnFamilia || routes.dashboard,
    icon: <FavoriteBorderRoundedIcon sx={{ fontSize: 34 }} />,
  },
  rmp: {
    key: "rmp",
    aliases: [
      "rmp",
      "medidas",
      "medidas de proteccion",
      "medidas de protección",
      "registro de medidas de proteccion",
      "registro de medidas de protección",
    ],
    code: "RMP",
    title: "Registro de Medidas de Protección",
    subtitle: "Medidas de protección",
    description:
      "Accede al registro de medidas de protección para consultar, capturar o dar seguimiento a los casos asociados a tu cuenta.",
    route: routes.medidas || routes.dashboard,
    icon: <HealthAndSafetyRoundedIcon sx={{ fontSize: 34 }} />,
  },
};

function getRegistryFromCatalog(value) {
  const normalizedValue = normalizeText(value);

  if (!normalizedValue) return null;

  return (
    Object.values(registryCatalog).find((registry) => {
      const normalizedKey = normalizeText(registry.key);
      const normalizedCode = normalizeText(registry.code);
      const normalizedTitle = normalizeText(registry.title);
      const normalizedSubtitle = normalizeText(registry.subtitle);

      const normalizedAliases = registry.aliases.map((alias) =>
        normalizeText(alias)
      );

      return (
        normalizedValue === normalizedKey ||
        normalizedValue === normalizedCode ||
        normalizedValue === normalizedTitle ||
        normalizedValue === normalizedSubtitle ||
        normalizedAliases.includes(normalizedValue)
      );
    }) || null
  );
}

function getRegistryCandidateValue(item) {
  if (!item) return "";

  if (typeof item === "string" || typeof item === "number") {
    return item;
  }

  /**
   * Posibles formas que puede devolver backend:
   *
   * user.registros = ["rmp", "rmh"]
   * user.registros = [{ codigo: "RMP" }]
   * user.registros = [{ nombre: "Registro de Medidas de Protección" }]
   * user.accesos = [{ registro: { nombre: "Registro de Medidas de Protección" } }]
   * user.accesos = [{ registro_codigo: "RMP" }]
   */
  return (
    item.key ||
    item.codigo ||
    item.code ||
    item.clave ||
    item.acro ||
    item.nombre ||
    item.name ||
    item.registro_codigo ||
    item.registroCode ||
    item.registro_key ||
    item.registroKey ||
    item.registro?.key ||
    item.registro?.codigo ||
    item.registro?.code ||
    item.registro?.clave ||
    item.registro?.acro ||
    item.registro?.nombre ||
    item.registro?.name ||
    ""
  );
}

function isActiveAccess(item) {
  if (!item || typeof item !== "object") return true;

  if (typeof item.is_active === "boolean") return item.is_active;
  if (typeof item.isActive === "boolean") return item.isActive;
  if (typeof item.activo === "boolean") return item.activo;
  if (typeof item.active === "boolean") return item.active;

  return true;
}

/**
 * Extrae los registros permitidos desde el usuario autenticado.
 *
 * No asigna tarjetas manualmente.
 * Solo muestra registros si vienen en la respuesta del backend.
 */
function getAllowedRegistriesFromUser(user) {
  const possibleAccessLists = [
    user?.registros,
    user?.registros_disponibles,
    user?.registrosDisponibles,
    user?.accesos,
    user?.accesses,
    user?.user_access,
    user?.userAccess,
    user?.permissions?.registros,
    user?.permisos?.registros,
  ];

  const rawItems = possibleAccessLists.find((list) => Array.isArray(list)) || [];

  const registriesMap = new Map();

  rawItems.forEach((item) => {
    if (!isActiveAccess(item)) return;

    const candidateValue = getRegistryCandidateValue(item);
    const registry = getRegistryFromCatalog(candidateValue);

    if (registry) {
      registriesMap.set(registry.key, registry);
    }
  });

  return Array.from(registriesMap.values());
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);

  const user = useMemo(() => getStoredUser(), []);

  const displayName =
    user?.nombre_completo ||
    user?.nombreCompleto ||
    user?.nombre ||
    user?.name ||
    "Usuario";

  const role = user?.rol || user?.role || "Perfil autorizado";

  const availableRegistries = useMemo(() => {
    return getAllowedRegistriesFromUser(user);
  }, [user]);

  function handleLogout() {
  if (loggingOut) return;

  setLoggingOut(true);

  logout();

  navigate(routes.login, {
    replace: true,
  });
}

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, sm: 4, md: 5 },
        fontFamily: "Noto Sans, sans-serif",
        background:
          "radial-gradient(circle at 10% 8%, rgba(159,34,65,0.13) 0%, transparent 27%), radial-gradient(circle at 88% 12%, rgba(188,149,92,0.16) 0%, transparent 30%), radial-gradient(circle at 50% 105%, rgba(15,23,42,0.08) 0%, transparent 34%), linear-gradient(135deg, #f8fafc 0%, #f3f4f6 46%, #f7f1e9 100%)",

        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          opacity: 0.32,
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          maskImage:
            "radial-gradient(circle at center, black 0%, transparent 76%)",
          pointerEvents: "none",
        },

        "&::after": {
          content: '""',
          position: "absolute",
          width: 520,
          height: 520,
          right: -260,
          top: 120,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(159,34,65,0.10), rgba(188,149,92,0.08))",
          filter: "blur(10px)",
          pointerEvents: "none",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "1200px",
          mx: "auto",
        }}
      >
        <Box
          sx={{
            mb: { xs: 3, md: 4 },
            borderRadius: { xs: "28px", md: "36px" },
            p: "1px",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.42), rgba(188,149,92,0.28))",
            boxShadow:
              "0 28px 80px rgba(15,23,42,0.10), 0 10px 30px rgba(159,34,65,0.06)",
          }}
        >
          <Box
            sx={{
              borderRadius: { xs: "27px", md: "35px" },
              p: { xs: 3, sm: 3.5, md: 4 },
              background: "rgba(255,255,255,0.80)",
              border: "1px solid rgba(255,255,255,0.72)",
              backdropFilter: "blur(22px)",
              position: "relative",
              overflow: "hidden",

              "&::before": {
                content: '""',
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(120deg, rgba(255,255,255,0.42), transparent 38%, rgba(188,149,92,0.07))",
                pointerEvents: "none",
              },
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={3}
              sx={{ position: "relative", zIndex: 1 }}
            >
              <Box sx={{ maxWidth: 760 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  sx={{
                    mb: 1.6,
                    flexWrap: "wrap",
                    rowGap: 1,
                  }}
                >
                  <Chip
                    icon={<VerifiedUserRoundedIcon />}
                    label="Acceso verificado"
                    sx={{
                      height: 34,
                      borderRadius: 999,
                      color: "#8f1538",
                      backgroundColor: "rgba(159,34,65,0.08)",
                      border: "1px solid rgba(159,34,65,0.12)",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: 900,
                      "& .MuiChip-icon": {
                        color: "#8f1538",
                      },
                    }}
                  />

                  <Chip
                    icon={<LockRoundedIcon />}
                    label={role}
                    sx={{
                      height: 34,
                      borderRadius: 999,
                      color: "#72522b",
                      backgroundColor: "rgba(188,149,92,0.13)",
                      border: "1px solid rgba(188,149,92,0.18)",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: 900,
                      "& .MuiChip-icon": {
                        color: "#72522b",
                      },
                    }}
                  />
                </Stack>

                <Typography
                  component="h1"
                  sx={{
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: 950,
                    fontSize: {
                      xs: "1.9rem",
                      sm: "2.35rem",
                      md: "2.8rem",
                    },
                    color: "#111827",
                    lineHeight: 1.03,
                    letterSpacing: "-0.055em",
                    mb: 1.3,
                  }}
                >
                  Registros disponibles
                </Typography>

                <Typography
                  sx={{
                    fontFamily: "Noto Sans, sans-serif",
                    color: "#64748b",
                    fontSize: { xs: "0.96rem", sm: "1.02rem" },
                    lineHeight: 1.75,
                    maxWidth: 760,
                  }}
                >
                  Bienvenido,{" "}
                  <Box
                    component="span"
                    sx={{
                      color: "#8f1538",
                      fontWeight: 950,
                    }}
                  >
                    {displayName}
                  </Box>
                  . Selecciona el registro al que deseas ingresar para continuar
                  con tus actividades dentro de la plataforma.
                </Typography>
              </Box>

              <Stack
                spacing={1.4}
                alignItems={{ xs: "stretch", md: "flex-end" }}
                sx={{
                  width: { xs: "100%", md: "auto" },
                  minWidth: { md: 260 },
                }}
              >
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 1,
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      borderRadius: "18px",
                      p: 1.6,
                      background: "rgba(255,255,255,0.66)",
                      border: "1px solid rgba(15,23,42,0.06)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Noto Sans, sans-serif",
                        fontWeight: 950,
                        color: "#8f1538",
                        fontSize: "1.45rem",
                        lineHeight: 1,
                      }}
                    >
                      {availableRegistries.length}
                    </Typography>

                    <Typography
                      sx={{
                        fontFamily: "Noto Sans, sans-serif",
                        color: "#64748b",
                        fontSize: "0.74rem",
                        fontWeight: 800,
                        mt: 0.4,
                      }}
                    >
                      Módulos
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      borderRadius: "18px",
                      p: 1.6,
                      background: "rgba(255,255,255,0.66)",
                      border: "1px solid rgba(15,23,42,0.06)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Noto Sans, sans-serif",
                        fontWeight: 950,
                        color: "#72522b",
                        fontSize: "1.45rem",
                        lineHeight: 1,
                      }}
                    >
                      2FA
                    </Typography>

                    <Typography
                      sx={{
                        fontFamily: "Noto Sans, sans-serif",
                        color: "#64748b",
                        fontSize: "0.74rem",
                        fontWeight: 800,
                        mt: 0.4,
                      }}
                    >
                      Seguridad
                    </Typography>
                  </Box>
                </Box>

                <Button
                  variant="outlined"
                  startIcon={<LogoutRoundedIcon />}
                  onClick={handleLogout}
                  disabled={loggingOut}
                  sx={{
                    textTransform: "none",
                    borderColor: "rgba(159,34,65,0.28)",
                    color: "#8f1538",
                    fontWeight: 950,
                    borderRadius: 999,
                    px: 2.5,
                    py: 1.08,
                    width: { xs: "100%", md: "fit-content" },
                    fontFamily: "Noto Sans, sans-serif",
                    backgroundColor: "rgba(255,255,255,0.58)",
                    transition: "all 220ms ease",
                    "&:hover": {
                      borderColor: "#8f1538",
                      backgroundColor: "rgba(159,34,65,0.05)",
                      transform: "translateY(-1px)",
                    },
                    "&.Mui-disabled": {
                      borderColor: "rgba(159,34,65,0.18)",
                      color: "rgba(143,21,56,0.45)",
                      backgroundColor: "rgba(159,34,65,0.03)",
                    },
                  }}
                >
                  {loggingOut ? "Cerrando..." : "Cerrar sesión"}
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Box>

        <Box
          sx={{
            borderRadius: { xs: "26px", md: "34px" },
            p: { xs: 1.3, sm: 1.6, md: 2 },
            background: "rgba(255,255,255,0.56)",
            border: "1px solid rgba(255,255,255,0.76)",
            boxShadow:
              "0 24px 70px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.82)",
            backdropFilter: "blur(18px)",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            spacing={1.5}
            sx={{ px: { xs: 1, md: 1.5 }, py: 1, mb: 1 }}
          >
            <Box>
              <Stack direction="row" alignItems="center" spacing={1}>
                <DashboardCustomizeRoundedIcon
                  sx={{
                    color: "#8f1538",
                    fontSize: 22,
                  }}
                />

                <Typography
                  sx={{
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: 950,
                    color: "#1f2937",
                    fontSize: "1rem",
                  }}
                >
                  Selecciona un módulo
                </Typography>
              </Stack>

              <Typography
                sx={{
                  mt: 0.4,
                  fontFamily: "Noto Sans, sans-serif",
                  color: "#64748b",
                  fontSize: "0.84rem",
                  lineHeight: 1.5,
                }}
              >
                Los accesos disponibles se muestran de acuerdo con tu perfil y
                privilegios registrados.
              </Typography>
            </Box>

            <Chip
              icon={<AppsRoundedIcon />}
              label={`${availableRegistries.length} disponibles`}
              sx={{
                borderRadius: 999,
                color: "#8f1538",
                backgroundColor: "rgba(159,34,65,0.07)",
                border: "1px solid rgba(159,34,65,0.10)",
                fontFamily: "Noto Sans, sans-serif",
                fontWeight: 900,
                "& .MuiChip-icon": {
                  color: "#8f1538",
                },
              }}
            />
          </Stack>

          <Divider
            sx={{
              mb: 1.5,
              borderColor: "rgba(15,23,42,0.06)",
            }}
          />

          <Stack spacing={1.55}>
            {availableRegistries.length > 0 ? (
              availableRegistries.map((registry, index) => (
                <RegistryAccessCard
                  key={registry.key}
                  code={registry.code}
                  title={registry.title}
                  subtitle={registry.subtitle}
                  description={registry.description}
                  icon={registry.icon}
                  index={index + 1}
                  onClick={() => navigate(registry.route)}
                />
              ))
            ) : (
              <Box
                sx={{
                  border: "1px solid rgba(15,23,42,0.08)",
                  borderRadius: "24px",
                  backgroundColor: "#ffffff",
                  p: { xs: 3, sm: 4 },
                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: 950,
                    color: "#1f2937",
                    mb: 0.8,
                  }}
                >
                  No hay registros asociados
                </Typography>

                <Typography
                  sx={{
                    fontFamily: "Noto Sans, sans-serif",
                    color: "#64748b",
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                    maxWidth: 620,
                    mx: "auto",
                  }}
                >
                  Tu cuenta aún no tiene módulos asignados. Cuando el backend
                  entregue los privilegios reales del usuario, este listado se
                  llenará automáticamente.
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
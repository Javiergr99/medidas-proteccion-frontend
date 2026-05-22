import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import HealthAndSafetyRoundedIcon from "@mui/icons-material/HealthAndSafetyRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";

import routes from "../../../app/routes";

export default function MedidasListPage() {
  const navigate = useNavigate();

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
          "radial-gradient(circle at 10% 8%, rgba(159,34,65,0.13) 0%, transparent 27%), radial-gradient(circle at 88% 12%, rgba(188,149,92,0.16) 0%, transparent 30%), linear-gradient(135deg, #f8fafc 0%, #f3f4f6 46%, #f7f1e9 100%)",

        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          opacity: 0.28,
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          maskImage:
            "radial-gradient(circle at center, black 0%, transparent 76%)",
          pointerEvents: "none",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "1120px",
          mx: "auto",
        }}
      >
        <Button
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate(routes.dashboard)}
          sx={{
            mb: 3,
            textTransform: "none",
            fontFamily: "Noto Sans, sans-serif",
            fontWeight: 800,
            color: "#8f1538",
            borderRadius: 999,
            px: 1,
            "&:hover": {
              backgroundColor: "rgba(159,34,65,0.06)",
            },
          }}
        >
          Volver a registros disponibles
        </Button>

        <Box
          sx={{
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
              p: { xs: 3, sm: 4, md: 5 },
              background: "rgba(255,255,255,0.84)",
              border: "1px solid rgba(255,255,255,0.72)",
              backdropFilter: "blur(22px)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={3}
              alignItems={{ xs: "flex-start", md: "center" }}
              justifyContent="space-between"
            >
              <Box sx={{ maxWidth: 760 }}>
                <Chip
                  icon={<ShieldRoundedIcon />}
                  label="Módulo autorizado"
                  sx={{
                    mb: 2,
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

                <Typography
                  component="h1"
                  sx={{
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: 950,
                    fontSize: {
                      xs: "1.9rem",
                      sm: "2.35rem",
                      md: "2.85rem",
                    },
                    color: "#111827",
                    lineHeight: 1.04,
                    letterSpacing: "-0.055em",
                    mb: 1.4,
                  }}
                >
                  Registro de Medidas de Protección
                </Typography>

                <Typography
                  sx={{
                    fontFamily: "Noto Sans, sans-serif",
                    color: "#64748b",
                    fontSize: { xs: "0.98rem", sm: "1.05rem" },
                    lineHeight: 1.75,
                    maxWidth: 720,
                  }}
                >
                  Este espacio concentrará el listado, captura, consulta y
                  seguimiento de medidas de protección registradas dentro de la
                  plataforma.
                </Typography>
              </Box>

              <Box
                sx={{
                  width: { xs: 86, md: 110 },
                  height: { xs: 86, md: 110 },
                  borderRadius: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  background:
                    "linear-gradient(135deg, #c40b48 0%, #9f2241 50%, #75102f 100%)",
                  boxShadow:
                    "0 20px 42px rgba(159,34,65,0.24), inset 0 1px 0 rgba(255,255,255,0.28)",
                }}
              >
                <HealthAndSafetyRoundedIcon sx={{ fontSize: 54 }} />
              </Box>
            </Stack>
          </Box>
        </Box>

        <Box
          sx={{
            mt: 3,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 2,
          }}
        >
          <InfoCard
            icon={<AssignmentRoundedIcon />}
            title="Listado de medidas"
            description="Aquí se mostrarán las medidas de protección registradas cuando el backend entregue los datos del módulo."
          />

          <InfoCard
            icon={<HealthAndSafetyRoundedIcon />}
            title="Captura y seguimiento"
            description="Se integrarán acciones para registrar, consultar, editar y dar seguimiento a las medidas conforme a los permisos del usuario."
          />

          <InfoCard
            icon={<ConstructionRoundedIcon />}
            title="Módulo en preparación"
            description="La ruta ya quedó conectada para evitar redirecciones a la landing mientras se construye la funcionalidad real."
          />
        </Box>
      </Box>
    </Box>
  );
}

function InfoCard({ icon, title, description }) {
  return (
    <Box
      sx={{
        borderRadius: "24px",
        p: 3,
        background: "rgba(255,255,255,0.84)",
        border: "1px solid rgba(255,255,255,0.76)",
        boxShadow:
          "0 16px 42px rgba(15,23,42,0.07), inset 0 1px 0 rgba(255,255,255,0.85)",
        backdropFilter: "blur(16px)",
      }}
    >
      <Box
        sx={{
          width: 52,
          height: 52,
          borderRadius: "18px",
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#8f1538",
          backgroundColor: "rgba(159,34,65,0.08)",
        }}
      >
        {icon}
      </Box>

      <Typography
        sx={{
          fontFamily: "Noto Sans, sans-serif",
          fontWeight: 950,
          color: "#1f2937",
          fontSize: "1rem",
          mb: 0.8,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          fontFamily: "Noto Sans, sans-serif",
          color: "#64748b",
          fontSize: "0.9rem",
          lineHeight: 1.6,
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}
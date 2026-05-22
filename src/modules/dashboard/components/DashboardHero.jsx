import PropTypes from "prop-types";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";

import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";

export default function DashboardHero({
  displayName,
  role,
  registriesCount,
  loggingOut,
  onLogout,
}) {
  return (
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
              <Box sx={statCardStyles}>
                <Typography sx={statNumberWineStyles}>
                  {registriesCount}
                </Typography>

                <Typography sx={statLabelStyles}>Módulos</Typography>
              </Box>

              <Box sx={statCardStyles}>
                <Typography sx={statNumberGoldStyles}>2FA</Typography>

                <Typography sx={statLabelStyles}>Seguridad</Typography>
              </Box>
            </Box>

            <Button
              variant="outlined"
              startIcon={<LogoutRoundedIcon />}
              onClick={onLogout}
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
  );
}

DashboardHero.propTypes = {
  displayName: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  registriesCount: PropTypes.number.isRequired,
  loggingOut: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
};

const statCardStyles = {
  borderRadius: "18px",
  p: 1.6,
  background: "rgba(255,255,255,0.66)",
  border: "1px solid rgba(15,23,42,0.06)",
};

const statNumberWineStyles = {
  fontFamily: "Noto Sans, sans-serif",
  fontWeight: 950,
  color: "#8f1538",
  fontSize: "1.45rem",
  lineHeight: 1,
};

const statNumberGoldStyles = {
  ...statNumberWineStyles,
  color: "#72522b",
};

const statLabelStyles = {
  fontFamily: "Noto Sans, sans-serif",
  color: "#64748b",
  fontSize: "0.74rem",
  fontWeight: 800,
  mt: 0.4,
};
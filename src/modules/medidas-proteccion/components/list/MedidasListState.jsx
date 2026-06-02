import PropTypes from "prop-types";
import { Alert, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";

import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import SearchOffRoundedIcon from "@mui/icons-material/SearchOffRounded";

export function MedidasLoadingState() {
  return (
    <Box
      sx={{
        minHeight: 260,
        borderRadius: "24px",
        backgroundColor: "#ffffff",
        border: "1px solid rgba(15,23,42,0.06)",
        boxShadow: "0 14px 34px rgba(15,23,42,0.045)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        textAlign: "center",
      }}
    >
      <Stack alignItems="center" spacing={1.5}>
        <CircularProgress
          size={42}
          thickness={4}
          sx={{
            color: "#8f1538",
          }}
        />

        <Typography
          sx={{
            color: "#1f2937",
            fontWeight: 950,
            fontFamily: "Noto Sans, sans-serif",
          }}
        >
          Cargando registros de Medidas de Protección…
        </Typography>
      </Stack>
    </Box>
  );
}

export function MedidasPermissionState() {
  return (
    <Box
      sx={{
        minHeight: 260,
        borderRadius: "24px",
        backgroundColor: "#ffffff",
        border: "1px solid rgba(15,23,42,0.06)",
        boxShadow: "0 14px 34px rgba(15,23,42,0.045)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        textAlign: "center",
      }}
    >
      <Stack alignItems="center" spacing={1.4} sx={{ maxWidth: 620 }}>
        <Box
          sx={{
            width: 54,
            height: 54,
            borderRadius: "18px",
            color: "#8f1538",
            backgroundColor: "rgba(143,21,56,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LockRoundedIcon sx={{ fontSize: 30 }} />
        </Box>

        <Typography
          sx={{
            color: "#1f2937",
            fontWeight: 950,
            fontFamily: "Noto Sans, sans-serif",
            fontSize: "1.05rem",
          }}
        >
          No tienes permiso para consultar registros
        </Typography>

        <Typography
          sx={{
            color: "#64748b",
            fontFamily: "Noto Sans, sans-serif",
            fontSize: "0.92rem",
            lineHeight: 1.65,
          }}
        >
          Para consultar este listado tu cuenta debe tener la acción
          MP_LEER_REGISTRO asignada dentro del grupo MP.
        </Typography>
      </Stack>
    </Box>
  );
}

export function MedidasErrorState({ message, onRetry }) {
  return (
    <Alert
      severity="error"
      action={
        <Button
          color="inherit"
          size="small"
          startIcon={<RefreshRoundedIcon />}
          onClick={onRetry}
          sx={{
            fontWeight: 900,
            textTransform: "none",
          }}
        >
          Reintentar
        </Button>
      }
      sx={{
        borderRadius: "18px",
        fontFamily: "Noto Sans, sans-serif",
        "& .MuiAlert-message": {
          width: "100%",
        },
      }}
    >
      {message}
    </Alert>
  );
}

export function MedidasEmptyState() {
  return (
    <Box
      sx={{
        minHeight: 260,
        borderRadius: "24px",
        backgroundColor: "#ffffff",
        border: "1px solid rgba(15,23,42,0.06)",
        boxShadow: "0 14px 34px rgba(15,23,42,0.045)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        textAlign: "center",
      }}
    >
      <Stack alignItems="center" spacing={1.4} sx={{ maxWidth: 620 }}>
        <Box
          sx={{
            width: 54,
            height: 54,
            borderRadius: "18px",
            color: "#72522b",
            backgroundColor: "rgba(188,149,92,0.13)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <SearchOffRoundedIcon sx={{ fontSize: 30 }} />
        </Box>

        <Typography
          sx={{
            color: "#1f2937",
            fontWeight: 950,
            fontFamily: "Noto Sans, sans-serif",
            fontSize: "1.05rem",
          }}
        >
          No hay registros para mostrar
        </Typography>

        <Typography
          sx={{
            color: "#64748b",
            fontFamily: "Noto Sans, sans-serif",
            fontSize: "0.92rem",
            lineHeight: 1.65,
          }}
        >
          El backend no devolvió registros o los filtros actuales no tienen
          coincidencias.
        </Typography>
      </Stack>
    </Box>
  );
}

MedidasErrorState.propTypes = {
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func.isRequired,
};
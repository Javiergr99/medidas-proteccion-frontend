import PropTypes from "prop-types";
import { Box, Button, Stack, Tooltip, Typography } from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CleaningServicesRoundedIcon from "@mui/icons-material/CleaningServicesRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

export default function MedidasListHeader({
  totalRecords,
  filteredRecords,
  hasActiveFilters,
  canCreate,
  loading,
  onBack,
  onCreateRecord,
  onClearFilters,
  onRefresh,
}) {
  return (
    <Box
      sx={{
        borderRadius: { xs: "24px", md: "30px" },
        backgroundColor: "#ffffff",
        border: "1px solid rgba(15,23,42,0.06)",
        boxShadow:
          "0 20px 55px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.92)",
        p: { xs: 2.4, sm: 3, md: 3.4 },
      }}
    >
      <Button
        startIcon={<ArrowBackRoundedIcon />}
        onClick={onBack}
        sx={{
          mb: 2,
          textTransform: "none",
          fontWeight: 900,
          color: "#8f1538",
          borderRadius: 999,
          px: 0,
          "&:hover": {
            backgroundColor: "transparent",
            textDecoration: "underline",
          },
        }}
      >
        Volver al dashboard
      </Button>

      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={2.4}
      >
        <Box>
          <Typography
            component="h1"
            sx={{
              fontFamily: "Noto Sans, sans-serif",
              fontWeight: 950,
              color: "#111827",
              fontSize: { xs: "1.7rem", sm: "2.05rem", md: "2.35rem" },
              lineHeight: 1.05,
              letterSpacing: "-0.045em",
            }}
          >
            Listado de Registro de Medidas de Protección
          </Typography>

          <Typography
            sx={{
              mt: 1,
              maxWidth: 820,
              color: "#64748b",
              fontFamily: "Noto Sans, sans-serif",
              fontSize: { xs: "0.92rem", md: "0.98rem" },
              lineHeight: 1.65,
            }}
          >
            Consulta y filtra los registros recibidos desde el backend. En esta
            fase los filtros se aplican localmente sobre los expedientes
            cargados.
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            sx={{ mt: 1.7, rowGap: 1 }}
          >
            <CounterPill label="Registros cargados" value={totalRecords} />
            <CounterPill label="Resultado actual" value={filteredRecords} />
          </Stack>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{
            width: { xs: "100%", md: "auto" },
          }}
        >
          {canCreate ? (
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={onCreateRecord}
              sx={{
                minHeight: 44,
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 950,
                px: 2.2,
                bgcolor: "#8f1538",
                boxShadow: "0 12px 24px rgba(143,21,56,0.18)",
                "&:hover": {
                  bgcolor: "#7a1230",
                  boxShadow: "0 16px 30px rgba(143,21,56,0.23)",
                },
              }}
            >
              Nuevo registro
            </Button>
          ) : null}

          <Button
            variant="outlined"
            startIcon={<RefreshRoundedIcon />}
            onClick={onRefresh}
            disabled={loading}
            sx={{
              minHeight: 44,
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 900,
              px: 2,
              color: "#0f4f46",
              borderColor: "rgba(15,79,70,0.28)",
              backgroundColor: "rgba(255,255,255,0.72)",
              "&:hover": {
                borderColor: "#0f4f46",
                backgroundColor: "rgba(15,79,70,0.06)",
              },
            }}
          >
            {loading ? "Actualizando..." : "Actualizar"}
          </Button>

          <Tooltip
            title={
              hasActiveFilters
                ? "Limpiar filtros activos"
                : "No hay filtros activos"
            }
          >
            <span>
              <Button
                variant="outlined"
                startIcon={<CleaningServicesRoundedIcon />}
                onClick={onClearFilters}
                disabled={!hasActiveFilters}
                sx={{
                  minHeight: 44,
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 900,
                  px: 2,
                  color: "#334155",
                  borderColor: "rgba(100,116,139,0.25)",
                  backgroundColor: "rgba(255,255,255,0.72)",
                  "&:hover": {
                    borderColor: "#64748b",
                    backgroundColor: "rgba(100,116,139,0.06)",
                  },
                }}
              >
                Limpiar filtros
              </Button>
            </span>
          </Tooltip>
        </Stack>
      </Stack>
    </Box>
  );
}

function CounterPill({ label, value }) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        px: 1.3,
        py: 0.55,
        borderRadius: 999,
        backgroundColor: "rgba(248,250,252,0.9)",
        border: "1px solid rgba(15,23,42,0.07)",
        color: "#334155",
        fontFamily: "Noto Sans, sans-serif",
        fontSize: "0.78rem",
        fontWeight: 850,
      }}
    >
      <Box
        component="span"
        sx={{
          color: "#8f1538",
          fontWeight: 950,
        }}
      >
        {value}
      </Box>
      {label}
    </Box>
  );
}

MedidasListHeader.propTypes = {
  totalRecords: PropTypes.number.isRequired,
  filteredRecords: PropTypes.number.isRequired,
  hasActiveFilters: PropTypes.bool.isRequired,
  canCreate: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
  onCreateRecord: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
};

CounterPill.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};
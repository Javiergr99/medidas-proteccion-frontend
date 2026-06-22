import PropTypes from "prop-types";
import { Box, Button, Stack, Tooltip, Typography } from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CleaningServicesRoundedIcon from "@mui/icons-material/CleaningServicesRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

export default function MedidasListHeader({
  hasActiveFilters,
  canCreate,
  loading,
  onCreateRecord,
  onClearFilters,
  onRefresh,
}) {
  return (
    <Box
      component="section"
      sx={{
        borderRadius: { xs: "20px", md: "24px" },
        backgroundColor: "#ffffff",
        border: "1px solid rgba(152,152,154,0.16)",
        boxShadow: "0 10px 28px rgba(19,50,46,0.045)",
        p: { xs: 2, sm: 2.4, md: 2.7 },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 3,
          background:
            "linear-gradient(90deg, #611232 0%, #9d2449 48%, #BC955C 100%)",
        }}
      />

      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
        spacing={2}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="h1"
            sx={{
              m: 0,
              fontFamily: "Noto Sans, sans-serif",
              fontWeight: 950,
              color: "#13322e",
              fontSize: { xs: "1.45rem", sm: "1.75rem", md: "2rem" },
              lineHeight: 1.08,
              letterSpacing: "-0.045em",
            }}
          >
            Listado de registros
          </Typography>

          <Typography
            sx={{
              mt: 0.55,
              maxWidth: 740,
              fontFamily: "Noto Sans, sans-serif",
              color: "#64748b",
              fontWeight: 650,
              fontSize: { xs: "0.84rem", md: "0.9rem" },
              lineHeight: 1.45,
            }}
          >
            Consulta, actualiza y da seguimiento a los registros de Medidas de
            Protección.
          </Typography>
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
                minHeight: 42,
                borderRadius: 999,
                textTransform: "none",
                fontFamily: "Noto Sans, sans-serif",
                fontWeight: 900,
                px: 2.15,
                color: "#ffffff",
                backgroundColor: "#611232",
                boxShadow: "0 10px 22px rgba(97,18,50,0.18)",
                "&:hover": {
                  backgroundColor: "#4d0e28",
                  boxShadow: "0 12px 26px rgba(97,18,50,0.22)",
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
              minHeight: 42,
              borderRadius: 999,
              textTransform: "none",
              fontFamily: "Noto Sans, sans-serif",
              fontWeight: 850,
              px: 1.95,
              color: "#13322e",
              borderColor: "rgba(19,50,46,0.18)",
              backgroundColor: "#ffffff",
              boxShadow: "none",
              "&:hover": {
                borderColor: "rgba(19,50,46,0.32)",
                backgroundColor: "rgba(19,50,46,0.035)",
                boxShadow: "none",
              },
              "&.Mui-disabled": {
                color: "#94a3b8",
                borderColor: "rgba(148,163,184,0.28)",
                backgroundColor: "#ffffff",
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
                  minHeight: 42,
                  borderRadius: 999,
                  textTransform: "none",
                  fontFamily: "Noto Sans, sans-serif",
                  fontWeight: 850,
                  px: 1.95,
                  color: "#64748b",
                  borderColor: "rgba(152,152,154,0.22)",
                  backgroundColor: "#ffffff",
                  boxShadow: "none",
                  "&:hover": {
                    borderColor: "rgba(152,152,154,0.38)",
                    backgroundColor: "rgba(152,152,154,0.045)",
                    boxShadow: "none",
                  },
                  "&.Mui-disabled": {
                    color: "#cbd5e1",
                    borderColor: "rgba(203,213,225,0.32)",
                    backgroundColor: "#ffffff",
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

MedidasListHeader.propTypes = {
  hasActiveFilters: PropTypes.bool.isRequired,
  canCreate: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  onCreateRecord: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  onRefresh: PropTypes.func.isRequired,
};
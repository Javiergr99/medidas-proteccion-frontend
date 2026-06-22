import PropTypes from "prop-types";
import { Box, Stack, Typography } from "@mui/material";

import CachedRoundedIcon from "@mui/icons-material/CachedRounded";

const STATUS_STYLES = {
  "En captura": {
    color: "#611232",
    background: "rgba(97,18,50,0.07)",
    borderColor: "rgba(97,18,50,0.16)",
  },
  "En revisión": {
    color: "#735827",
    background: "rgba(221,201,163,0.22)",
    borderColor: "rgba(188,149,92,0.28)",
  },
  Revisado: {
    color: "#13322e",
    background: "rgba(19,50,46,0.08)",
    borderColor: "rgba(19,50,46,0.16)",
  },
};

export default function MedidasCreateRecordHero({
  idMp,
  numeroExpediente,
  activeSectionTitle,
  estadoActual = "En captura",
}) {
  const displayIdMp = idMp?.trim() || "Pendiente";
  const displayNumeroExpediente = numeroExpediente?.trim() || "Sin capturar";
  const statusStyles =
    STATUS_STYLES[estadoActual] || STATUS_STYLES["En captura"];

  return (
    <Box
      component="section"
      sx={{
        borderRadius: { xs: "20px", md: "24px" },
        backgroundColor: "#ffffff",
        border: "1px solid rgba(152,152,154,0.16)",
        boxShadow: "0 10px 28px rgba(19,50,46,0.045)",
        p: { xs: 2, sm: 2.3, md: 2.6 },
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

      <Stack spacing={2.2}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
          spacing={1.4}
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
              Detalle del expediente
            </Typography>

            <Typography
              sx={{
                mt: 0.55,
                fontFamily: "Noto Sans, sans-serif",
                color: "#64748b",
                fontWeight: 700,
                fontSize: { xs: "0.84rem", md: "0.9rem" },
                lineHeight: 1.45,
              }}
            >
              {activeSectionTitle || "Datos Generales"}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.65,
              px: 1.2,
              py: 0.68,
              borderRadius: 999,
              color: statusStyles.color,
              backgroundColor: statusStyles.background,
              border: `1px solid ${statusStyles.borderColor}`,
              fontFamily: "Noto Sans, sans-serif",
              fontWeight: 900,
              fontSize: "0.74rem",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            <CachedRoundedIcon sx={{ fontSize: 15 }} />
            {estadoActual}
          </Box>
        </Stack>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.2}
          sx={{ width: "100%" }}
        >
          <InfoCard label="Folio MP" value={displayIdMp} />

          <InfoCard
            label="Número de expediente"
            value={displayNumeroExpediente}
          />
        </Stack>
      </Stack>
    </Box>
  );
}

function InfoCard({ label, value }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        borderRadius: "16px",
        backgroundColor: "#fbfaf8",
        border: "1px solid rgba(152,152,154,0.14)",
        px: 1.7,
        py: 1.25,
        transition:
          "border-color 180ms ease, background-color 180ms ease, transform 180ms ease",
        "&:hover": {
          transform: "translateY(-1px)",
          backgroundColor: "#ffffff",
          borderColor: "rgba(188,149,92,0.24)",
        },
      }}
    >
      <Typography
        sx={{
          mb: 0.42,
          fontFamily: "Noto Sans, sans-serif",
          color: "#64748b",
          fontWeight: 850,
          fontSize: "0.68rem",
          lineHeight: 1,
          letterSpacing: "0.055em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          overflow: "hidden",
          fontFamily: "Noto Sans, sans-serif",
          color: "#13322e",
          fontWeight: 920,
          fontSize: { xs: "0.9rem", md: "0.96rem" },
          lineHeight: 1.25,
          textOverflow: "ellipsis",
          whiteSpace: { xs: "normal", md: "nowrap" },
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

MedidasCreateRecordHero.propTypes = {
  idMp: PropTypes.string,
  numeroExpediente: PropTypes.string,
  activeSectionTitle: PropTypes.string.isRequired,
  estadoActual: PropTypes.string,
};

InfoCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};
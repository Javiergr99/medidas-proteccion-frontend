import PropTypes from "prop-types";
import { Box, Stack, Typography } from "@mui/material";

import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";

const SUMMARY_CONFIG = [
  {
    key: "total",
    label: "Total de registros",
    icon: <AssignmentRoundedIcon />,
    color: "#8f1538",
    backgroundColor: "rgba(143,21,56,0.08)",
  },
  {
    key: "enCaptura",
    label: "En captura",
    icon: <PendingActionsRoundedIcon />,
    color: "#475569",
    backgroundColor: "rgba(100,116,139,0.10)",
  },
  {
    key: "enRevision",
    label: "En revisión",
    icon: <EditNoteRoundedIcon />,
    color: "#9a5b00",
    backgroundColor: "rgba(188,149,92,0.13)",
  },
  {
    key: "revisados",
    label: "Revisados",
    icon: <CheckCircleRoundedIcon />,
    color: "#047857",
    backgroundColor: "rgba(4,120,87,0.10)",
  },
];

export default function MedidasSummaryCards({ summary }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          lg: "repeat(4, minmax(0, 1fr))",
        },
        gap: 1.5,
      }}
    >
      {SUMMARY_CONFIG.map((item) => (
        <Box
          key={item.key}
          sx={{
            borderRadius: "22px",
            backgroundColor: "#ffffff",
            border: "1px solid rgba(15,23,42,0.06)",
            boxShadow: "0 14px 34px rgba(15,23,42,0.045)",
            p: 2,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.3}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "16px",
                color: item.color,
                backgroundColor: item.backgroundColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "& svg": {
                  fontSize: 24,
                },
              }}
            >
              {item.icon}
            </Box>

            <Box>
              <Typography
                sx={{
                  fontFamily: "Noto Sans, sans-serif",
                  fontWeight: 950,
                  color: "#111827",
                  fontSize: "1.35rem",
                  lineHeight: 1,
                }}
              >
                {summary[item.key] || 0}
              </Typography>

              <Typography
                sx={{
                  mt: 0.35,
                  fontFamily: "Noto Sans, sans-serif",
                  color: "#64748b",
                  fontWeight: 800,
                  fontSize: "0.78rem",
                }}
              >
                {item.label}
              </Typography>
            </Box>
          </Stack>
        </Box>
      ))}
    </Box>
  );
}

MedidasSummaryCards.propTypes = {
  summary: PropTypes.shape({
    total: PropTypes.number.isRequired,
    enCaptura: PropTypes.number.isRequired,
    enRevision: PropTypes.number.isRequired,
    revisados: PropTypes.number.isRequired,
  }).isRequired,
};
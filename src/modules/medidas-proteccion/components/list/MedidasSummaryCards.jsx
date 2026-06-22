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
    backgroundColor: "rgba(143,21,56,0.07)",
  },
  {
    key: "enCaptura",
    label: "En captura",
    icon: <PendingActionsRoundedIcon />,
    color: "#475569",
    backgroundColor: "rgba(100,116,139,0.09)",
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
    backgroundColor: "rgba(4,120,87,0.09)",
  },
];

export default function MedidasSummaryCards({ summary }) {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        overflow: "hidden",
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          lg: "repeat(4, minmax(0, 1fr))",
        },
        gap: { xs: 1.2, md: 1.4 },
      }}
    >
      {SUMMARY_CONFIG.map((item) => (
        <SummaryCard
          key={item.key}
          icon={item.icon}
          label={item.label}
          value={summary[item.key] || 0}
          color={item.color}
          backgroundColor={item.backgroundColor}
        />
      ))}
    </Box>
  );
}

function SummaryCard({ icon, label, value, color, backgroundColor }) {
  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
        maxWidth: "100%",
        borderRadius: { xs: "18px", md: "20px" },
        backgroundColor: "#ffffff",
        border: "1px solid rgba(152,152,154,0.14)",
        boxShadow: "0 8px 22px rgba(19,50,46,0.035)",
        px: { xs: 1.5, md: 1.7 },
        py: { xs: 1.45, md: 1.6 },
        boxSizing: "border-box",
        overflow: "hidden",
        transition:
          "border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease",
        "&:hover": {
          transform: "translateY(-1px)",
          borderColor: "rgba(188,149,92,0.24)",
          boxShadow: "0 10px 26px rgba(19,50,46,0.045)",
        },
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.25}
        sx={{
          width: "100%",
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            width: 38,
            height: 38,
            minWidth: 38,
            borderRadius: "14px",
            color,
            backgroundColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "& svg": {
              fontSize: 22,
            },
          }}
        >
          {icon}
        </Box>

        <Box
          sx={{
            minWidth: 0,
            flex: 1,
          }}
        >
          <Typography
            sx={{
              m: 0,
              fontFamily: "Noto Sans, sans-serif",
              fontWeight: 950,
              color: "#13322e",
              fontSize: { xs: "1.15rem", md: "1.25rem" },
              lineHeight: 1,
              letterSpacing: "-0.025em",
            }}
          >
            {value}
          </Typography>

          <Typography
            sx={{
              mt: 0.32,
              overflow: "hidden",
              fontFamily: "Noto Sans, sans-serif",
              color: "#64748b",
              fontWeight: 800,
              fontSize: "0.75rem",
              lineHeight: 1.25,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </Typography>
        </Box>
      </Stack>
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

SummaryCard.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  backgroundColor: PropTypes.string.isRequired,
};
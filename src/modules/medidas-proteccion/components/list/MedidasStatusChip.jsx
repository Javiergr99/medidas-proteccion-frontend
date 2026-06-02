import PropTypes from "prop-types";
import { Box } from "@mui/material";

const STATUS_STYLES = {
  "En captura": {
    color: "#475569",
    backgroundColor: "rgba(100,116,139,0.10)",
    borderColor: "rgba(100,116,139,0.16)",
  },
  "En revisión": {
    color: "#9a5b00",
    backgroundColor: "rgba(188,149,92,0.13)",
    borderColor: "rgba(188,149,92,0.22)",
  },
  Revisado: {
    color: "#047857",
    backgroundColor: "rgba(4,120,87,0.10)",
    borderColor: "rgba(4,120,87,0.18)",
  },
};

export default function MedidasStatusChip({ status }) {
  const styles = STATUS_STYLES[status] || STATUS_STYLES["En captura"];

  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 96,
        px: 1.2,
        py: 0.45,
        borderRadius: 999,
        fontFamily: "Noto Sans, sans-serif",
        fontWeight: 900,
        fontSize: "0.72rem",
        lineHeight: 1,
        color: styles.color,
        backgroundColor: styles.backgroundColor,
        border: `1px solid ${styles.borderColor}`,
        whiteSpace: "nowrap",
      }}
    >
      {status || "Sin estado"}
    </Box>
  );
}

MedidasStatusChip.propTypes = {
  status: PropTypes.string,
};
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";

export default function MedidasCreatePendingSection({ title, description }) {
  return (
    <Box
      sx={{
        minHeight: 360,
        borderRadius: "28px",
        background:
          "linear-gradient(135deg, rgba(248,250,252,0.92), rgba(221,201,163,0.18))",
        border: "1px dashed rgba(157,36,73,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
        textAlign: "center",
      }}
    >
      <Box sx={{ maxWidth: 620 }}>
        <Typography
          sx={{
            fontFamily: "Noto Sans, sans-serif",
            fontWeight: 950,
            color: "#13322e",
            fontSize: { xs: "1.3rem", md: "1.7rem" },
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            mt: 1,
            fontFamily: "Noto Sans, sans-serif",
            color: "#64748b",
            fontWeight: 750,
            lineHeight: 1.65,
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
}

MedidasCreatePendingSection.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

export default function RegistryAccessCard({
  code,
  title,
  description,
  icon,
  onClick,
}) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        width: "100%",
        border: "1px solid #d7d7d7",
        borderRadius: "10px",
        backgroundColor: "#ffffff",
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 2.25 },
        textAlign: "left",
        cursor: "pointer",
        transition: "all 220ms ease",
        boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "auto 1fr auto" },
        gap: { xs: 2, sm: 2.5 },
        alignItems: "center",
        "&:hover": {
          borderColor: "#9f2241",
          transform: "translateY(-2px)",
          boxShadow: "0 10px 26px rgba(159,34,65,0.10)",
        },
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          minWidth: 72,
          borderRadius: "50%",
          backgroundColor: "#b0124d",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mx: { xs: "auto", sm: 0 },
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography
          sx={{
            fontFamily: "Noto Sans, sans-serif",
            fontWeight: 800,
            fontSize: "1.05rem",
            color: "#8f1538",
            lineHeight: 1.1,
            mb: 0.4,
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          {code}
        </Typography>

        <Typography
          sx={{
            fontFamily: "Noto Sans, sans-serif",
            fontWeight: 700,
            fontSize: "0.97rem",
            color: "#4b4b4b",
            lineHeight: 1.35,
            mb: 0.8,
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontFamily: "Noto Sans, sans-serif",
            fontWeight: 400,
            fontSize: "0.84rem",
            color: "#6d6d6d",
            lineHeight: 1.5,
            maxWidth: "820px",
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          {description}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "center", sm: "flex-end" },
          alignItems: "center",
          color: "#8f1538",
        }}
      >
        <ArrowForwardRoundedIcon sx={{ fontSize: 36 }} />
      </Box>
    </Box>
  );
}
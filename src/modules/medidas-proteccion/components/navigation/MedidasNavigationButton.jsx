import PropTypes from "prop-types";
import { Button } from "@mui/material";

export default function MedidasNavigationButton({
  active = false,
  icon,
  label,
  onClick,
}) {
  return (
    <Button
      type="button"
      startIcon={icon}
      onClick={onClick}
      sx={{
        minHeight: 44,
        borderRadius: "999px",
        px: 2.15,
        textTransform: "none",
        fontFamily: "Noto Sans, sans-serif",
        fontWeight: 950,
        fontSize: "0.86rem",
        whiteSpace: "nowrap",
        color: active ? "#ffffff" : "#334155",
        background: active
          ? "linear-gradient(135deg, #13322e 0%, #0f2926 100%)"
          : "transparent",
        border: active
          ? "1px solid rgba(19,50,46,0.30)"
          : "1px solid transparent",
        boxShadow: active
          ? "0 12px 28px rgba(19,50,46,0.18), inset 0 1px 0 rgba(255,255,255,0.18)"
          : "none",
        transition:
          "background 180ms ease, color 180ms ease, border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease",

        "& .MuiButton-startIcon": {
          mr: 0.7,
          "& svg": {
            fontSize: 20,
          },
        },

        "&:hover": {
          color: active ? "#ffffff" : "#13322e",
          background: active
            ? "linear-gradient(135deg, #13322e 0%, #611232 100%)"
            : "#ffffff",
          borderColor: active ? "rgba(97,18,50,0.32)" : "rgba(19,50,46,0.13)",
          transform: "translateY(-1px)",
          boxShadow: active
            ? "0 14px 30px rgba(97,18,50,0.20)"
            : "0 10px 24px rgba(15,23,42,0.055)",
        },
      }}
    >
      {label}
    </Button>
  );
}

MedidasNavigationButton.propTypes = {
  active: PropTypes.bool,
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
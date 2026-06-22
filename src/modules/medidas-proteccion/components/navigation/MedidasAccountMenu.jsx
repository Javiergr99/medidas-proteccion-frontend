import { useState } from "react";
import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

function getInitials(displayName) {
  const parts = String(displayName || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return "U";
  }

  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default function MedidasAccountMenu({
  displayName,
  loggingOut,
  onViewProfile,
  onLogout,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const isOpen = Boolean(anchorEl);
  const initials = getInitials(displayName);

  function openMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function closeMenu() {
    setAnchorEl(null);
  }

  function handleViewProfile() {
    closeMenu();
    onViewProfile();
  }

  function handleLogout() {
    closeMenu();
    onLogout();
  }

  return (
    <>
      <Button
        type="button"
        onClick={openMenu}
        endIcon={<ExpandMoreRoundedIcon />}
        sx={{
          minHeight: 46,
          borderRadius: "999px",
          px: 0.85,
          pr: 1.45,
          textTransform: "none",
          color: "#334155",
          backgroundColor: "#ffffff",
          border: "1px solid rgba(15,23,42,0.075)",
          fontFamily: "Noto Sans, sans-serif",
          fontWeight: 950,
          boxShadow:
            "0 10px 24px rgba(15,23,42,0.055), inset 0 1px 0 rgba(255,255,255,0.95)",
          transition:
            "background-color 180ms ease, border-color 180ms ease, color 180ms ease, transform 180ms ease",

          "&:hover": {
            color: "#611232",
            backgroundColor: "rgba(221,201,163,0.16)",
            borderColor: "rgba(157,36,73,0.16)",
            transform: "translateY(-1px)",
          },
        }}
      >
        <Avatar
          sx={{
            width: 31,
            height: 31,
            mr: 0.55,
            bgcolor: "rgba(97,18,50,0.08)",
            color: "#611232",
            border: "1px solid rgba(97,18,50,0.13)",
            fontFamily: "Noto Sans, sans-serif",
            fontWeight: 950,
            fontSize: "0.72rem",
          }}
        >
          {initials}
        </Avatar>

        <Box
          component="span"
          sx={{
            display: "inline-block",
            maxWidth: 142,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: "0.84rem",
          }}
        >
          Mi cuenta
        </Box>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={closeMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 270,
            borderRadius: "20px",
            background:
              "linear-gradient(180deg, #ffffff 0%, rgba(248,250,252,0.98) 100%)",
            boxShadow:
              "0 24px 60px rgba(15,23,42,0.18), inset 0 1px 0 rgba(255,255,255,0.95)",
            border: "1px solid rgba(15,23,42,0.07)",
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.55,
            background:
              "linear-gradient(135deg, rgba(221,201,163,0.22), rgba(255,255,255,0.92))",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Noto Sans, sans-serif",
              fontWeight: 950,
              color: "#1f2937",
              fontSize: "0.94rem",
            }}
          >
            {displayName}
          </Typography>

          <Typography
            sx={{
              fontFamily: "Noto Sans, sans-serif",
              color: "#64748b",
              fontSize: "0.78rem",
              mt: 0.3,
            }}
          >
            Cuenta institucional
          </Typography>
        </Box>

        <Divider />

        <MenuItem onClick={handleViewProfile} sx={menuItemStyles}>
          <PersonRoundedIcon sx={menuIconStyles} />
          Ver perfil
        </MenuItem>

        <Divider />

        <MenuItem
          onClick={handleLogout}
          disabled={loggingOut}
          sx={{
            ...menuItemStyles,
            color: "#611232",
            fontWeight: 950,
          }}
        >
          <LogoutRoundedIcon sx={{ ...menuIconStyles, color: "#611232" }} />
          {loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
        </MenuItem>
      </Menu>
    </>
  );
}

MedidasAccountMenu.propTypes = {
  displayName: PropTypes.string.isRequired,
  loggingOut: PropTypes.bool.isRequired,
  onViewProfile: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

const menuItemStyles = {
  gap: 1.2,
  py: 1.25,
  px: 2,
  fontFamily: "Noto Sans, sans-serif",
  fontWeight: 850,
  color: "#334155",
};

const menuIconStyles = {
  fontSize: 21,
  color: "#9d2449",
};
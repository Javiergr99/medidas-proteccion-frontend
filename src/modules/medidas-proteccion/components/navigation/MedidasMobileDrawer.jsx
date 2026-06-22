import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
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

export default function MedidasMobileDrawer({
  activeSection,
  displayName,
  items,
  loggingOut,
  open,
  onClose,
  onNavigate,
  onViewProfile,
  onLogout,
}) {
  const initials = getInitials(displayName);

  function handleNavigate(itemKey) {
    onClose();
    onNavigate(itemKey);
  }

  function handleViewProfile() {
    onClose();
    onViewProfile();
  }

  function handleLogout() {
    onClose();
    onLogout();
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: 310, sm: 350 },
          maxWidth: "88vw",
          background:
            "linear-gradient(180deg, #ffffff 0%, #f8fafc 72%, rgba(221,201,163,0.18) 100%)",
          borderTopLeftRadius: "26px",
          borderBottomLeftRadius: "26px",
          boxShadow: "-26px 0 70px rgba(15,23,42,0.20)",
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          height: 4,
          background:
            "linear-gradient(90deg, #13322e 0%, #611232 52%, #BC955C 100%)",
        }}
      />

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: 2,
          py: 1.6,
          borderBottom: "1px solid rgba(15,23,42,0.07)",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Noto Sans, sans-serif",
            fontWeight: 950,
            color: "#0f172a",
            fontSize: "0.98rem",
          }}
        >
          Navegación
        </Typography>

        <IconButton
          type="button"
          aria-label="Cerrar menú"
          onClick={onClose}
          sx={{
            width: 40,
            height: 40,
            borderRadius: "14px",
            color: "#611232",
            backgroundColor: "rgba(97,18,50,0.07)",
            "&:hover": {
              backgroundColor: "rgba(97,18,50,0.11)",
            },
          }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Stack>

      <List sx={{ p: 1.2 }}>
        {items.map((item) => (
          <ListItemButton
            key={item.key}
            selected={activeSection === item.key}
            onClick={() => handleNavigate(item.key)}
            sx={{
              borderRadius: "17px",
              mb: 0.75,
              minHeight: 52,
              color: activeSection === item.key ? "#ffffff" : "#334155",
              background:
                activeSection === item.key
                  ? "linear-gradient(135deg, #13322e 0%, #0f2926 100%)"
                  : "transparent",
              border:
                activeSection === item.key
                  ? "1px solid rgba(19,50,46,0.18)"
                  : "1px solid transparent",
              boxShadow:
                activeSection === item.key
                  ? "0 12px 26px rgba(19,50,46,0.17)"
                  : "none",
              "&:hover": {
                backgroundColor:
                  activeSection === item.key
                    ? undefined
                    : "rgba(19,50,46,0.06)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 39,
                color: "inherit",
              }}
            >
              {item.icon}
            </ListItemIcon>

            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontFamily: "Noto Sans, sans-serif",
                fontWeight: 950,
                fontSize: "0.92rem",
              }}
            />
          </ListItemButton>
        ))}

        <Divider sx={{ my: 1.1 }} />

        <Box
          sx={{
            borderRadius: "18px",
            border: "1px solid rgba(15,23,42,0.07)",
            backgroundColor: "#ffffff",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              px: 1.4,
              py: 1.15,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: "rgba(97,18,50,0.08)",
                color: "#611232",
                border: "1px solid rgba(97,18,50,0.12)",
                fontSize: "0.72rem",
                fontWeight: 950,
              }}
            >
              {initials}
            </Avatar>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontFamily: "Noto Sans, sans-serif",
                  fontWeight: 950,
                  color: "#1f2937",
                  fontSize: "0.88rem",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {displayName}
              </Typography>

              <Typography
                sx={{
                  fontFamily: "Noto Sans, sans-serif",
                  color: "#64748b",
                  fontWeight: 750,
                  fontSize: "0.72rem",
                }}
              >
                Mi cuenta
              </Typography>
            </Box>
          </Box>

          <Divider />

          <ListItemButton onClick={handleViewProfile} sx={accountItemStyles}>
            <ListItemIcon sx={accountIconContainerStyles}>
              <PersonRoundedIcon sx={accountIconStyles} />
            </ListItemIcon>
            <ListItemText
              primary="Ver perfil"
              primaryTypographyProps={accountTextStyles}
            />
          </ListItemButton>

          <ListItemButton
            onClick={handleLogout}
            disabled={loggingOut}
            sx={accountItemStyles}
          >
            <ListItemIcon sx={accountIconContainerStyles}>
              <LogoutRoundedIcon sx={{ ...accountIconStyles, color: "#611232" }} />
            </ListItemIcon>
            <ListItemText
              primary={loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
              primaryTypographyProps={{
                ...accountTextStyles,
                color: "#611232",
              }}
            />
          </ListItemButton>
        </Box>
      </List>
    </Drawer>
  );
}

MedidasMobileDrawer.propTypes = {
  activeSection: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
    })
  ).isRequired,
  loggingOut: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onNavigate: PropTypes.func.isRequired,
  onViewProfile: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

const accountItemStyles = {
  minHeight: 46,
  color: "#334155",
  "&:hover": {
    backgroundColor: "rgba(157,36,73,0.045)",
  },
};

const accountIconContainerStyles = {
  minWidth: 38,
};

const accountIconStyles = {
  color: "#9d2449",
  fontSize: 21,
};

const accountTextStyles = {
  fontFamily: "Noto Sans, sans-serif",
  fontWeight: 900,
  fontSize: "0.86rem",
};
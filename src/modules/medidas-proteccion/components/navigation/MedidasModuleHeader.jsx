import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  ButtonBase,
  Divider,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";

import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";

import MedidasMobileDrawer from "./MedidasMobileDrawer";

import logoPfpnna from "../../../../assets/icons/SNDIF.png";
import perfilIcon from "../../../../assets/icons/perfil.webp";

const NAV_ITEMS = [
  {
    key: "dashboard",
    label: "Panel principal",
    icon: <DashboardRoundedIcon />,
  },
  {
    key: "listado",
    label: "Listado",
    icon: <ViewListRoundedIcon />,
  },
  {
    key: "mineria",
    label: "Minería",
    icon: <AnalyticsRoundedIcon />,
  },
  {
    key: "flujo",
    label: "Registro",
    icon: <AccountTreeRoundedIcon />,
  },
];

export default function MedidasModuleHeader({
  activeSection = "listado",
  displayName,
  loggingOut,
  onDashboard,
  onList,
  onMining,
  onWorkflow,
  onViewProfile,
  onLogout,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const accountMenuOpen = Boolean(accountAnchorEl);

  const navHandlers = {
    dashboard: onDashboard,
    listado: onList,
    mineria: onMining,
    flujo: onWorkflow || onMining,
  };

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 8);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function openMobileMenu() {
    setMobileOpen(true);
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  function openAccountMenu(event) {
    setAccountAnchorEl(event.currentTarget);
  }

  function closeAccountMenu() {
    setAccountAnchorEl(null);
  }

  function handleNavigation(itemKey) {
    const handler = navHandlers[itemKey];

    if (typeof handler === "function") {
      handler();
    }
  }

  function handleViewProfile() {
    closeAccountMenu();
    onViewProfile();
  }

  function handleLogout() {
    closeAccountMenu();
    onLogout();
  }

  return (
    <>
      <style>{headerAnimations}</style>

      <Box
        component="header"
        sx={{
          width: "100%",
          position: "sticky",
          top: 0,
          zIndex: 30,
          backgroundColor: isScrolled
            ? "rgba(255,255,255,0.82)"
            : "rgba(255,255,255,0.92)",
          borderBottom: isScrolled
            ? "1px solid rgba(152,152,154,0.18)"
            : "1px solid rgba(152,152,154,0.12)",
          boxShadow: isScrolled
            ? "0 14px 36px rgba(15,23,42,0.075)"
            : "0 4px 18px rgba(15,23,42,0.025)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          transition:
            "background-color 220ms ease, box-shadow 220ms ease, border-color 220ms ease",
        }}
      >
        <Box
          sx={{
            height: 3,
            background:
              "linear-gradient(90deg, #13322e 0%, #611232 48%, #BC955C 100%)",
            backgroundSize: "220% 100%",
            animation: "mpHeaderTopLine 8s ease-in-out infinite",
          }}
        />

        <Box
          sx={{
            width: "100%",
            maxWidth: "1480px",
            mx: "auto",
            px: { xs: 1.7, sm: 2.6, md: 4 },
            py: {
              xs: isScrolled ? 0.85 : 1.05,
              md: isScrolled ? 0.95 : 1.15,
            },
            transition: "padding 220ms ease",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr auto",
                md: "minmax(210px, 1fr) auto minmax(210px, 1fr)",
              },
              alignItems: "center",
              gap: { xs: 1.4, md: 2 },
              minHeight: {
                xs: isScrolled ? 52 : 56,
                md: isScrolled ? 58 : 64,
              },
              transition: "min-height 220ms ease",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                minWidth: 0,
              }}
            >
              <ButtonBase
                type="button"
                disableRipple
                disableTouchRipple
                onClick={onDashboard}
                aria-label="Ir al panel principal"
                sx={{
                  borderRadius: "14px",
                  backgroundColor: "transparent !important",
                  p: 0.35,
                  minWidth: 0,
                  WebkitTapHighlightColor: "transparent",
                  transformOrigin: "left center",
                  transition:
                    "transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease, filter 180ms ease",
                  "&:hover": {
                    transform: "translateY(-1px) scale(1.015)",
                    backgroundColor: "transparent !important",
                    opacity: 0.94,
                    filter: "drop-shadow(0 8px 14px rgba(19,50,46,0.08))",
                  },
                  "&:active": {
                    transform: "scale(0.99)",
                  },
                  "&:focus": {
                    outline: "none",
                  },
                  "&:focus-visible": {
                    outline: "2px solid rgba(97,18,50,0.24)",
                    outlineOffset: 4,
                  },
                }}
              >
                <Box
                  component="img"
                  src={logoPfpnna}
                  alt="PFPNNA"
                  sx={{
                    display: "block",
                    width: "auto",
                    height: {
                      xs: isScrolled ? 34 : 36,
                      md: isScrolled ? 40 : 44,
                    },
                    maxWidth: { xs: 180, sm: 230, md: 280 },
                    objectFit: "contain",
                    transition: "height 220ms ease",
                  }}
                />
              </ButtonBase>
            </Box>

            <Stack
              component="nav"
              aria-label="Navegación del módulo de medidas"
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={{ md: 4.2, lg: 5.4 }}
              sx={{
                display: { xs: "none", md: "flex" },
                minHeight: 52,
              }}
            >
              {NAV_ITEMS.map((item) => (
                <NavTextButton
                  key={item.key}
                  active={activeSection === item.key}
                  label={item.label}
                  onClick={() => handleNavigation(item.key)}
                />
              ))}
            </Stack>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              spacing={1}
            >
              <IconButton
                type="button"
                aria-label="Abrir menú de navegación"
                onClick={openMobileMenu}
                sx={{
                  display: { xs: "inline-flex", md: "none" },
                  width: 42,
                  height: 42,
                  borderRadius: "14px",
                  color: "#13322e",
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(19,50,46,0.12)",
                  boxShadow: "0 8px 20px rgba(15,23,42,0.055)",
                  transition:
                    "transform 180ms ease, background-color 180ms ease, box-shadow 180ms ease",
                  "&:hover": {
                    transform: "translateY(-1px)",
                    backgroundColor: "rgba(19,50,46,0.045)",
                    boxShadow: "0 10px 24px rgba(15,23,42,0.08)",
                  },
                }}
              >
                <MenuRoundedIcon />
              </IconButton>

              <Box
                sx={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: -3,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, rgba(97,18,50,0.30), rgba(188,149,92,0.24))",
                    opacity: accountMenuOpen ? 1 : 0,
                    transform: accountMenuOpen ? "scale(1)" : "scale(0.86)",
                    transition:
                      "opacity 220ms ease, transform 220ms cubic-bezier(0.22, 1, 0.36, 1)",
                    animation: accountMenuOpen
                      ? "mpProfileHalo 2.4s ease-in-out infinite"
                      : "none",
                  },
                }}
              >
                <IconButton
                  type="button"
                  aria-label="Abrir menú de cuenta"
                  aria-controls={
                    accountMenuOpen ? "medidas-account-menu" : undefined
                  }
                  aria-haspopup="true"
                  aria-expanded={accountMenuOpen ? "true" : undefined}
                  onClick={openAccountMenu}
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    width: isScrolled ? 48 : 52,
                    height: isScrolled ? 48 : 52,
                    borderRadius: "50%",
                    backgroundColor: accountMenuOpen
                      ? "rgba(97,18,50,0.07)"
                      : "#ffffff",
                    border: accountMenuOpen
                      ? "1px solid rgba(97,18,50,0.18)"
                      : "1px solid rgba(152,152,154,0.18)",
                    boxShadow: accountMenuOpen
                      ? "0 12px 28px rgba(97,18,50,0.13)"
                      : "0 8px 20px rgba(15,23,42,0.055)",
                    transition:
                      "width 220ms ease, height 220ms ease, transform 180ms ease, border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      backgroundColor: "rgba(97,18,50,0.055)",
                      borderColor: "rgba(97,18,50,0.22)",
                      boxShadow: "0 13px 28px rgba(97,18,50,0.13)",
                    },
                    "&:active": {
                      transform: "scale(0.97)",
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={perfilIcon}
                    alt=""
                    sx={{
                      width: isScrolled ? 28 : 30,
                      height: isScrolled ? 28 : 30,
                      objectFit: "contain",
                      display: "block",
                      transition:
                        "width 220ms ease, height 220ms ease, transform 180ms ease",
                    }}
                  />
                </IconButton>
              </Box>

              <Menu
                id="medidas-account-menu"
                anchorEl={accountAnchorEl}
                open={accountMenuOpen}
                onClose={closeAccountMenu}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                slotProps={{
                  paper: {
                    sx: {
                      mt: 1.1,
                      minWidth: 238,
                      borderRadius: "18px",
                      border: "1px solid rgba(152,152,154,0.16)",
                      boxShadow: "0 18px 42px rgba(15,23,42,0.14)",
                      overflow: "hidden",
                      animation: "mpAccountMenuIn 180ms ease-out",
                    },
                  },
                }}
                MenuListProps={{
                  sx: {
                    p: 0.8,
                  },
                }}
              >
                <Box
                  sx={{
                    px: 1.35,
                    py: 1.05,
                    background:
                      "linear-gradient(135deg, rgba(97,18,50,0.035), rgba(188,149,92,0.045))",
                    borderRadius: "12px",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#64748b",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: 800,
                      fontSize: "0.72rem",
                      lineHeight: 1,
                      letterSpacing: "0.045em",
                      textTransform: "uppercase",
                    }}
                  >
                    Sesión activa
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.45,
                      color: "#13322e",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: 950,
                      fontSize: "0.92rem",
                      lineHeight: 1.25,
                      maxWidth: 196,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={displayName}
                  >
                    {displayName}
                  </Typography>
                </Box>

                <Divider
                  sx={{
                    my: 0.65,
                    borderColor: "rgba(152,152,154,0.14)",
                  }}
                />

                <MenuItem onClick={handleViewProfile} sx={menuItemSx}>
                  <PersonRoundedIcon sx={menuIconSx} />
                  <ListItemText
                    primary="Ver perfil"
                    primaryTypographyProps={menuTextSx}
                  />
                </MenuItem>

                <MenuItem
                  onClick={handleLogout}
                  disabled={loggingOut}
                  sx={menuItemSx}
                >
                  <LogoutRoundedIcon sx={menuIconSx} />
                  <ListItemText
                    primary={loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
                    primaryTypographyProps={menuTextSx}
                  />
                </MenuItem>
              </Menu>
            </Stack>
          </Box>
        </Box>
      </Box>

      <MedidasMobileDrawer
        activeSection={activeSection}
        displayName={displayName}
        items={NAV_ITEMS}
        loggingOut={loggingOut}
        open={mobileOpen}
        onClose={closeMobileMenu}
        onNavigate={handleNavigation}
        onViewProfile={onViewProfile}
        onLogout={onLogout}
      />
    </>
  );
}

function NavTextButton({ active, label, onClick }) {
  return (
    <ButtonBase
      type="button"
      disableRipple
      disableTouchRipple
      onClick={onClick}
      sx={{
        position: "relative",
        px: 0.2,
        py: 1.15,
        borderRadius: 0,
        color: active ? "#13322e" : "#475569",
        backgroundColor: "transparent !important",
        overflow: "visible",
        WebkitTapHighlightColor: "transparent",
        transition:
          "color 180ms ease, transform 220ms cubic-bezier(0.22, 1, 0.36, 1)",
        "&:hover": {
          color: "#13322e",
          backgroundColor: "transparent !important",
          transform: "translateY(-2px)",
        },
        "&:focus": {
          outline: "none",
          backgroundColor: "transparent !important",
        },
        "&:focus-visible": {
          outline: "none",
          backgroundColor: "transparent !important",
        },
        "&.Mui-focusVisible": {
          outline: "none",
          backgroundColor: "transparent !important",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          left: "50%",
          bottom: 3,
          width: active ? "120%" : "0%",
          height: 10,
          borderRadius: 999,
          background:
            "radial-gradient(circle, rgba(188,149,92,0.18) 0%, rgba(188,149,92,0.0) 68%)",
          transform: "translateX(-50%)",
          opacity: active ? 1 : 0,
          transition:
            "width 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          left: "50%",
          bottom: 3,
          width: active ? "100%" : "0%",
          height: 2.5,
          borderRadius: 999,
          background:
            "linear-gradient(90deg, #611232 0%, #9d2449 55%, #BC955C 100%)",
          backgroundSize: "220% 100%",
          transform: "translateX(-50%)",
          opacity: active ? 1 : 0,
          transition:
            "width 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease",
          animation: active ? "mpNavUnderlineFlow 3s ease-in-out infinite" : "none",
        },
        "&:hover::after": {
          width: active ? "100%" : "46%",
          opacity: 1,
        },
      }}
    >
      <Typography
        component="span"
        sx={{
          position: "relative",
          zIndex: 1,
          fontFamily: "Noto Sans, sans-serif",
          fontWeight: active ? 950 : 800,
          fontSize: active ? "1.14rem" : "1rem",
          lineHeight: 1,
          letterSpacing: active ? "-0.02em" : "-0.01em",
          transition:
            "font-size 220ms cubic-bezier(0.22, 1, 0.36, 1), font-weight 180ms ease, letter-spacing 180ms ease",
          whiteSpace: "nowrap",
          userSelect: "none",
        }}
      >
        {label}
      </Typography>
    </ButtonBase>
  );
}

const menuItemSx = {
  minHeight: 42,
  borderRadius: "12px",
  px: 1.2,
  gap: 1,
  color: "#334155",
  fontFamily: "Noto Sans, sans-serif",
  transition: "background-color 160ms ease, color 160ms ease, transform 160ms ease",
  "&:hover": {
    backgroundColor: "rgba(97,18,50,0.055)",
    color: "#611232",
    transform: "translateX(2px)",
  },
  "&.Mui-disabled": {
    opacity: 0.55,
  },
};

const menuIconSx = {
  fontSize: 19,
  color: "inherit",
};

const menuTextSx = {
  fontFamily: "Noto Sans, sans-serif",
  fontWeight: 850,
  fontSize: "0.86rem",
};

const headerAnimations = `
  @keyframes mpHeaderTopLine {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  @keyframes mpNavUnderlineFlow {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  @keyframes mpProfileHalo {
    0%, 100% {
      transform: scale(0.98);
      opacity: 0.75;
    }
    50% {
      transform: scale(1.08);
      opacity: 1;
    }
  }

  @keyframes mpAccountMenuIn {
    from {
      opacity: 0;
      transform: translateY(-6px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

MedidasModuleHeader.propTypes = {
  activeSection: PropTypes.string,
  displayName: PropTypes.string.isRequired,
  loggingOut: PropTypes.bool.isRequired,
  onDashboard: PropTypes.func.isRequired,
  onList: PropTypes.func.isRequired,
  onMining: PropTypes.func.isRequired,
  onWorkflow: PropTypes.func,
  onViewProfile: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

NavTextButton.propTypes = {
  active: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
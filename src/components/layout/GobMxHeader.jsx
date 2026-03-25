import { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Box,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import gobLogo from "../../assets/images/gobmx-logo.png";

const MOBILE_ITEM_HEIGHT = 45;

/**
 * Header institucional estilo Gobierno de México.
 * Adaptado a la estructura actual en React + Vite + JavaScript.
 *
 * @returns {JSX.Element}
 */
export default function GobMxHeader() {
  const [open, setOpen] = useState(false);

  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    if (mdUp && open) {
      setOpen(false);
    }
  }, [mdUp, open]);

  /**
   * Navegación externa segura.
   *
   * @param {string} url
   */
  const handleGo = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  const menuItems = useMemo(
    () => [
      { label: "Trámites", onClick: () => setOpen(false) },
      { label: "Gobierno", onClick: () => setOpen(false) },
      {
        label: "Por Tus Derechos",
        onClick: () => handleGo("https://portusderechos.dif.gob.mx/"),
      },
    ],
    []
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "#621132",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Toolbar
          sx={{
            minHeight: { xs: 72, md: 92 },
            px: { xs: 2, sm: 3, md: 8 },
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              component="img"
              src={gobLogo}
              alt="Gobierno de México"
              loading="eager"
              sx={{
                height: { xs: 44, sm: 48, md: 56 },
                width: "auto",
                display: "block",
              }}
            />
          </Box>

          <Box sx={{ flex: 1 }} />

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: { md: 4, lg: 5 },
            }}
          >
            <Box
              component="button"
              type="button"
              sx={desktopButtonStyles}
            >
              Trámites
            </Box>

            <Box
              component="button"
              type="button"
              sx={desktopButtonStyles}
            >
              Gobierno
            </Box>

            <Box
              component="button"
              type="button"
              onClick={() => handleGo("https://portusderechos.dif.gob.mx/")}
              sx={desktopButtonStyles}
            >
              Por Tus Derechos
            </Box>

            <IconButton
              aria-label="Buscar"
              sx={{
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.30)",
                borderRadius: 1.8,
                p: "7px",
                transition: "all 200ms ease",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.08)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <SearchIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
            }}
          >
            <IconButton
              aria-label="Abrir menú"
              onClick={() => setOpen(true)}
              sx={{
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: 1.8,
                transition: "all 200ms ease",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.06)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="top"
        open={open}
        onClose={() => setOpen(false)}
        transitionDuration={{ enter: 320, exit: 240 }}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            backgroundColor: "#621132",
            backgroundImage: "none",
            color: "#ffffff",
            borderBottom: "1px solid rgba(255,255,255,0.10)",
            height: "auto",
            minHeight: 0,
            maxHeight: "none",
            overflow: "hidden",
          },
        }}
      >
        <Box
          sx={{
            px: 2.5,
            pt: 2,
            pb: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              component="img"
              src={gobLogo}
              alt="Gobierno de México"
              loading="eager"
              sx={{
                height: 34,
                width: "auto",
                display: "block",
              }}
            />
          </Box>

          <IconButton
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            sx={{
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.20)",
              borderRadius: 999,
              p: 1,
              transition: "all 200ms ease",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.08)",
                transform: "rotate(90deg)",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            pt: 0,
            pb: 2,
          }}
        >
          <List sx={{ width: "100%" }}>
            {menuItems.map((item, index) => (
              <Box key={item.label}>
                <ListItemButton
                  onClick={item.onClick}
                  sx={{
                    minHeight: `${MOBILE_ITEM_HEIGHT}px`,
                    height: `${MOBILE_ITEM_HEIGHT}px`,
                    justifyContent: "center",
                    textAlign: "center",
                    transition: "all 240ms ease",
                    position: "relative",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.02)",
                      transform: "translateY(-1px)",
                    },
                    "&:active": {
                      transform: "translateY(0px)",
                      backgroundColor: "rgba(255,255,255,0.04)",
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontFamily: "Noto Sans, sans-serif",
                          fontWeight: 600,
                          fontSize: "15px",
                          color: "#ffffff",
                          letterSpacing: "0.25px",
                          WebkitFontSmoothing: "antialiased",
                          MozOsxFontSmoothing: "grayscale",
                          transition: "all 200ms ease",
                          ".MuiListItemButton-root:hover &": {
                            letterSpacing: "0.35px",
                          },
                        }}
                      >
                        {item.label}
                      </Typography>
                    }
                  />
                </ListItemButton>

                {index < menuItems.length - 1 && (
                  <Divider sx={{ borderColor: "rgba(255,255,255,0.10)" }} />
                )}
              </Box>
            ))}
          </List>

          <Box
            sx={{
              minHeight: `${MOBILE_ITEM_HEIGHT}px`,
              height: `${MOBILE_ITEM_HEIGHT}px`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              transition: "background-color 200ms ease",
              width: "100%",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.02)",
              },
            }}
          >
            <IconButton
              aria-label="Buscar"
              onClick={() => setOpen(false)}
              sx={{
                color: "#ffffff",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: "50%",
                width: 38,
                height: 38,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mt: "15px",
                transition: "all 200ms ease",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.08)",
                  transform: "scale(1.05)",
                },
              }}
            >
              <SearchIcon
                sx={{
                  fontSize: { xs: 16, md: 20 },
                }}
              />
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

const desktopButtonStyles = {
  background: "transparent",
  border: "none",
  color: "#ffffff",
  fontWeight: 700,
  letterSpacing: "0.02em",
  fontSize: { md: "0.95rem", lg: "1rem" },
  fontFamily: "Noto Sans, sans-serif",
  cursor: "pointer",
  padding: 0,
  transition: "opacity 180ms ease",
  "&:hover": {
    opacity: 0.9,
  },
};
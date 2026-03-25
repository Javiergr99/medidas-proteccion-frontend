import PropTypes from "prop-types";
import {
  Box,
  Button,
  Divider,
  Drawer,
  Stack,
  Typography,
} from "@mui/material";

/**
 * Menú móvil reutilizable para vistas públicas o privadas.
 *
 * @param {{
 *  open: boolean,
 *  onClose: () => void,
 *  items?: Array<{ label: string, href?: string }>,
 *  title?: string
 * }} props
 * @returns {JSX.Element}
 */
export default function MobileMenu({
  open,
  onClose,
  items = [],
  title = "Menú",
}) {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 300,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#ffffff",
        }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "#13322B",
            color: "#ffffff",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>

          <Button
            onClick={onClose}
            sx={{
              minWidth: "auto",
              color: "#ffffff",
              fontSize: "1.4rem",
              lineHeight: 1,
              p: 0,
            }}
          >
            ×
          </Button>
        </Box>

        <Divider />

        <Stack spacing={0.5} sx={{ p: 2 }}>
          {items.map((item) => (
            <Button
              key={item.label}
              href={item.href || "#"}
              onClick={onClose}
              sx={{
                justifyContent: "flex-start",
                color: "#13322B",
                textTransform: "none",
                fontWeight: 600,
                px: 1,
                py: 1.25,
                borderRadius: 2,
              }}
            >
              {item.label}
            </Button>
          ))}
        </Stack>

        <Box sx={{ mt: "auto", p: 2, pt: 1 }}>
          <Typography variant="body2" sx={{ color: "#5f6b6d" }}>
            Gobierno de México · Registro de Medidas de Protección
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
}

MobileMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
    })
  ),
  title: PropTypes.string,
};
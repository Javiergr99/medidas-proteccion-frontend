import { Box, Container, Link, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faXTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

import gobLogo from "../../assets/images/gobmx-logo.png";
import footerTexture from "../../assets/images/footer-textura.png";

export default function GobMxFooter() {
  const iconBoxSx = {
    height: 48,
    width: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(255,255,255,0.35)",
    borderRadius: "6px",
    color: "#ffffff",
    textDecoration: "none",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.08)",
    },
  };

  const footerLinkSx = {
    color: "rgba(255,255,255,0.92)",
    textDecoration: "none",
    fontSize: "15px",
    lineHeight: 1.8,
    "&:hover": {
      textDecoration: "underline",
    },
  };

  return (
    <Box component="footer" sx={{ mt: "auto", backgroundColor: "#611232" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
              lg: "1.1fr 1fr 1fr 1fr",
            },
            gap: { xs: 5, md: 6, lg: 8 },
            alignItems: "start",
            color: "#ffffff",
          }}
        >
          {/* COLUMNA 1 */}
          <Box>
            <Box
              component="img"
              src={gobLogo}
              alt="Gobierno de México"
              sx={{
                height: { xs: 72, md: 92 },
                width: "auto",
                display: "block",
              }}
            />
          </Box>

          {/* COLUMNA 2 */}
          <Box>
            <Box sx={{ minHeight: 34, display: "flex", alignItems: "flex-start" }}>
              <Typography
                sx={{
                  fontFamily: "Noto Sans, sans-serif",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  lineHeight: 1.1,
                  color: "#ffffff",
                }}
              >
                Enlaces
              </Typography>
            </Box>

            <Box sx={{ pt: "18px", display: "flex", flexDirection: "column", gap: 0.75 }}>
              <Link href="https://www.gob.mx/datos" target="_blank" rel="noreferrer" sx={footerLinkSx}>
                Datos
              </Link>
              <Link href="https://www.gob.mx/transparencia" target="_blank" rel="noreferrer" sx={footerLinkSx}>
                Transparencia
              </Link>
              <Link href="https://consultapublicamx.inai.org.mx/vut-web/" target="_blank" rel="noreferrer" sx={footerLinkSx}>
                PNT
              </Link>
              <Link href="https://home.inai.org.mx/" target="_blank" rel="noreferrer" sx={footerLinkSx}>
                INAI
              </Link>
              <Link href="https://www.gob.mx/alertadores" target="_blank" rel="noreferrer" sx={footerLinkSx}>
                Alerta
              </Link>
              <Link href="https://sidec.funcionpublica.gob.mx/" target="_blank" rel="noreferrer" sx={footerLinkSx}>
                Denuncia
              </Link>
            </Box>
          </Box>

          {/* COLUMNA 3 */}
          <Box>
            <Box sx={{ minHeight: 34, display: "flex", alignItems: "flex-start" }}>
              <Typography
                sx={{
                  fontFamily: "Noto Sans, sans-serif",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  lineHeight: 1.1,
                  color: "#ffffff",
                }}
              >
                ¿Qué es gob.mx?
              </Typography>
            </Box>

            <Box sx={{ pt: "18px" }}>
              <Typography
                sx={{
                  fontSize: "15px",
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,0.92)",
                }}
              >
                Es el portal único de trámites, información y participación ciudadana.{" "}
                <Link
                  href="https://www.gob.mx/que-es-gobmx"
                  target="_blank"
                  rel="noreferrer"
                  sx={{
                    color: "#ffffff",
                    fontWeight: 700,
                    textDecoration: "underline",
                  }}
                >
                  Leer más
                </Link>
              </Typography>

              <Box sx={{ mt: "18px", display: "flex", flexDirection: "column", gap: 0.75 }}>
                <Link
                  href="https://www.gob.mx/accesibilidad"
                  target="_blank"
                  rel="noreferrer"
                  sx={footerLinkSx}
                >
                  Declaración de Accesibilidad
                </Link>
                <Link
                  href="https://www.gob.mx/terminos"
                  target="_blank"
                  rel="noreferrer"
                  sx={footerLinkSx}
                >
                  Términos y Condiciones
                </Link>
              </Box>
            </Box>
          </Box>

          {/* COLUMNA 4 */}
          <Box>
            <Box sx={{ minHeight: 34, display: "flex", alignItems: "flex-start" }}>
              <Typography
                sx={{
                  fontFamily: "Noto Sans, sans-serif",
                  fontWeight: 800,
                  fontSize: "1.1rem",
                  lineHeight: 1.1,
                  color: "#ffffff",
                }}
              >
                Contacto
              </Typography>
            </Box>

            <Box sx={{ pt: "18px" }}>
              <Typography
                sx={{
                  fontSize: "15px",
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,0.92)",
                }}
              >
                Dudas e información a:
                <br />
                <Box component="span" sx={{ fontWeight: 700 }}>
                  atencion_ciudadana@dif.gob.mx
                </Box>
              </Typography>

              <Box sx={{ mt: "18px" }}>
                <Typography
                  sx={{
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: 800,
                    fontSize: "1.1rem",
                    color: "#ffffff",
                  }}
                >
                  Síguenos en
                </Typography>

                <Box sx={{ mt: "10px", display: "flex", gap: 2 }}>
                  <Link
                    href="https://www.facebook.com/SNDIF/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook SNDIF"
                    sx={iconBoxSx}
                  >
                    <FontAwesomeIcon icon={faFacebookF} style={{ fontSize: 20 }} />
                  </Link>

                  <Link
                    href="https://x.com/DIF_NMX?lang=es"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="X DIF Nacional"
                    sx={iconBoxSx}
                  >
                    <FontAwesomeIcon icon={faXTwitter} style={{ fontSize: 20 }} />
                  </Link>

                  <Link
                    href="https://www.instagram.com/dif_nacional/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram DIF Nacional"
                    sx={iconBoxSx}
                  >
                    <FontAwesomeIcon icon={faInstagram} style={{ fontSize: 20 }} />
                  </Link>

                  <Link
                    href="https://www.youtube.com/channel/UCwnX3jD0_IaObRXWoZGFUWA"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="YouTube DIF Nacional"
                    sx={iconBoxSx}
                  >
                    <FontAwesomeIcon icon={faYoutube} style={{ fontSize: 20 }} />
                  </Link>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>

      <Box
        component="img"
        src={footerTexture}
        alt="Textura decorativa"
        sx={{
          width: "100%",
          height: "56px",
          objectFit: "cover",
          display: "block",
        }}
      />
    </Box>
  );
}
import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
} from "@mui/material";

import PublicHeader from "../components/PublicHeader";
import UserNoticeModal from "../components/UserNoticeModal";
import MexicoInteractiveMap from "../components/MexicoInteractiveMap";
import InterestCardsSection from "../components/InterestCardsSection";
import GeoBannerSection from "../components/GeoBannerSection";
import GobMxFooter from "../../../components/layout/GobMxFooter";

import logoPorTusDerechos from "../../../assets/logos/Logo_portusderechos.png";
import playeraBlancaImg from "../../../assets/images/NNA_PlayeraBlanca.jpg";
import abrazadosImg from "../../../assets/images/NNA_Abrazados.jpg";
import texturaRedImg from "../../../assets/images/Textura_Red.png";

import {
  aboutParagraphs,
  faqItems,
  heroContent,
  statsInitial,
} from "../data/landingData";

export default function HomePage() {
  const [noticeOpen, setNoticeOpen] = useState(true);

  const stats = useMemo(() => statsInitial, []);

  const handleAcceptNotice = () => {
    setNoticeOpen(false);
  };

  const handleRejectNotice = () => {
    window.location.href = "https://www.gob.mx/";
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f3f3f3",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <PublicHeader />

      <UserNoticeModal
        open={noticeOpen}
        onAccept={handleAcceptNotice}
        onReject={handleRejectNotice}
      />

      {/* HERO */}
      <Box sx={{ backgroundColor: "#ffffff" }}>
        <Container
          maxWidth={false}
          sx={{
            maxWidth: "1240px",
            mx: "auto",
            px: { xs: 2, sm: 3, md: 5, lg: "72px" },
            pt: { xs: 3.25, sm: 4, md: 5.25 },
            pb: { xs: 3, sm: 3.5, md: 4.5 },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: { xs: "flex-start", md: "center" },
              justifyContent: "space-between",
              gap: { xs: 3.5, sm: 4, md: 6, lg: 10 },
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            {/* LOGO IZQUIERDA */}
            <Box
              sx={{
                width: { xs: "100%", md: "52%" },
                display: "flex",
                alignItems: "center",
                justifyContent: { xs: "flex-start", md: "flex-start" },
                flexShrink: 0,
              }}
            >
              <Box
                component="img"
                src={logoPorTusDerechos}
                alt="Por tus Derechos"
                sx={{
                  width: "100%",
                  maxWidth: { xs: 300, sm: 360, md: 470, lg: 500 },
                  height: "auto",
                  display: "block",
                }}
              />
            </Box>

            {/* TEXTO Y BOTÓN DERECHA */}
            <Box
              sx={{
                width: { xs: "100%", md: "36%" },
                maxWidth: { xs: "100%", md: 390 },
                alignSelf: "center",
                flexShrink: 0,
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"Noto Sans", sans-serif',
                  fontSize: { xs: "0.98rem", sm: "1rem", md: "1rem" },
                  fontWeight: 400,
                  lineHeight: { xs: 1.68, md: 1.68 },
                  color: "#8a2642",
                  mb: { xs: 2.1, md: 2.4 },
                  maxWidth: 385,
                }}
              >
                {heroContent.description}
              </Typography>

              <Button
                variant="contained"
                disableElevation
                sx={{
                width: { xs: "100%", sm: "auto" },
                maxWidth: { xs: 320, sm: "none" },
                minWidth: { sm: 260, md: 294 },
                height: { xs: 46, md: 44 },
                px: 2.25,
                py: 0,
                textTransform: "none",
                fontFamily: '"Noto Sans", sans-serif',
                fontSize: { xs: "0.94rem", md: "0.96rem" },
                fontWeight: 700,
                lineHeight: 1.15,
                borderRadius: "5px",
                backgroundColor: "#8a0f3d",
                color: "#ffffff",
                border: "1.5px solid #6f1235",
                boxSizing: "border-box",
                justifyContent: "center",
                textAlign: "center",
                "&:hover": {
                    backgroundColor: "#740c33",
                },
                }}
              >
                {heroContent.buttonText}
              </Button>
            </Box>
          </Box>
        </Container>

        <Box
          component="img"
          src={playeraBlancaImg}
          alt="Niñas, niños y adolescentes"
          sx={{
            width: "100%",
            height: { xs: 210, sm: 280, md: 364, lg: 390 },
            objectFit: "cover",
            objectPosition: "center center",
            display: "block",
          }}
        />
      </Box>

      {/* ABOUT */}
      <Container
        maxWidth={false}
        sx={{
          maxWidth: "1240px",
          mx: "auto",
          px: { xs: 2, sm: 3, md: 5, lg: "72px" },
          pt: { xs: 5.5, sm: 6, md: 7.15 },
          pb: { xs: 3, md: 4.1 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: { xs: 3.2, sm: 4.4, md: 6.5 },
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* COLUMNA IZQUIERDA */}
          <Box
            sx={{
              width: { xs: "100%", md: "54%" },
              maxWidth: { xs: "100%", md: 470 },
            }}
          >
            <Typography
            sx={{
                fontFamily: '"Patria", serif',
                fontSize: { xs: "1.78rem", sm: "2.35rem", md: "3.14rem" },
                lineHeight: { xs: 1.02, md: 1.01 },
                fontWeight: 700,
                color: "#181818",
                mb: { xs: 1.8, md: 2.25 },
                letterSpacing: "-0.01em",
                textRendering: "geometricPrecision",
                "@media (max-width:359px)": {
                fontSize: "1.62rem",
                lineHeight: 1.01,
                },
            }}
            >
            ¿Qué es “Por tus Derechos”?
            </Typography>

            {aboutParagraphs.map((paragraph, index) => (
              <Typography
                key={`${index}-${paragraph.slice(0, 20)}`}
                sx={{
                  fontFamily: '"Noto Sans", sans-serif',
                  fontSize: { xs: "0.95rem", md: "0.92rem" },
                  lineHeight: { xs: 1.68, md: 1.6 },
                  fontWeight: 400,
                  color: "#6b6b6b",
                  mb: index === aboutParagraphs.length - 1 ? 2.3 : 1.7,
                  maxWidth: 458,
                }}
              >
                {paragraph}
              </Typography>
            ))}

            <Typography
              sx={{
                fontFamily: '"Noto Sans", sans-serif',
                fontSize: { xs: "1rem", md: "1rem" },
                fontWeight: 800,
                color: "#242424",
                mb: 1.5,
              }}
            >
              Preguntas Frecuentes:
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1.05,
                maxWidth: 468,
              }}
            >
              {faqItems.map((item) => (
                <Box key={item.id}>
                  <Typography
                    sx={{
                      fontFamily: '"Noto Sans", sans-serif',
                      fontSize: { xs: "0.92rem", md: "0.92rem" },
                      fontWeight: 800,
                      lineHeight: 1.4,
                      color: "#8a1a42",
                      mb: 0.28,
                    }}
                  >
                    {item.displayNumber} {item.question}
                  </Typography>

                  <Typography
                    sx={{
                      fontFamily: '"Noto Sans", sans-serif',
                      fontSize: { xs: "0.86rem", md: "0.86rem" },
                      lineHeight: 1.52,
                      fontWeight: 400,
                      color: "#707070",
                      maxWidth: 462,
                    }}
                  >
                    {item.answer}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* COLUMNA DERECHA */}
          <Box
            sx={{
                width: { xs: "100%", md: "40%" },
                display: "flex",
                justifyContent: { xs: "center", md: "flex-end" },
                pt: { xs: 0.25, md: 0.35 },
            }}
            >
            <Box
                sx={{
                position: "relative",
                width: {
                    xs: "min(100%, 320px)",
                    sm: 340,
                    md: 360,
                    lg: 390,
                    xl: 410,
                },
                maxWidth: "100%",
                height: {
                    xs: 410,
                    sm: 450,
                    md: 500,
                    lg: 540,
                    xl: 565,
                },
                }}
            >
                {/* TEXTURA ROJA */}
                <Box
                component="img"
                src={texturaRedImg}
                alt="Textura decorativa"
                sx={{
                    position: "absolute",
                    left: { xs: 6, sm: 0, md: -22, lg: -58, xl: -86 },
                    bottom: { xs: 0, sm: -4, md: -18, lg: -54, xl: -82 },
                    width: { xs: 168, sm: 186, md: 220, lg: 280, xl: 320 },
                    height: { xs: 168, sm: 186, md: 220, lg: 280, xl: 320 },
                    maxWidth: "100%",
                    objectFit: "cover",
                    display: "block",
                    zIndex: 1,
                    borderRadius: "18px",
                    "@media (max-width:359px)": {
                    width: 154,
                    height: 154,
                    left: 6,
                    bottom: 2,
                    },
                }}
                />

                {/* FOTO */}
                <Box
                component="img"
                src={abrazadosImg}
                alt="Niñas, niños y adolescentes abrazados"
                sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    zIndex: 2,
                    width: { xs: 248, sm: 278, md: 315, lg: 350, xl: 372 },
                    height: { xs: 340, sm: 385, md: 460, lg: 505, xl: 535 },
                    objectFit: "cover",
                    display: "block",
                    borderRadius: "18px",
                }}
                />
            </Box>
            </Box>
        </Box>
      </Container>

      {/* PROTECCIÓN EN TODO MÉXICO */}
      <Container
        maxWidth={false}
        sx={{
          maxWidth: "1240px",
          mx: "auto",
          px: { xs: 2, sm: 3, md: 5, lg: "72px" },
          pt: { xs: 5.5, md: 6.2 },
          pb: { xs: 3, md: 3.2 },
        }}
      >
        <Typography
          sx={{
            fontFamily: '"Patria", serif',
            fontSize: { xs: "1.95rem", sm: "2.35rem", md: "3rem" },
            lineHeight: { xs: 1.05, md: 1.04 },
            fontWeight: 700,
            color: "#1d1d1d",
            mb: 1.15,
            letterSpacing: "-0.01em",
          }}
        >
          Protección en Todo México
        </Typography>

        <Typography
          sx={{
            fontFamily: '"Noto Sans", sans-serif',
            fontSize: { xs: "0.95rem", md: "0.92rem" },
            lineHeight: 1.6,
            fontWeight: 400,
            color: "#5f5f5f",
            maxWidth: 615,
            mb: { xs: 3, md: 3.6 },
          }}
        >
          Explora dónde están activas las procuradurías de protección en todo el país.
          Haz clic en cada estado para ver cuántas procuradurías están operando, su
          estado y cuándo se actualizó la información por última vez.
        </Typography>

        <Box
        sx={{
            display: "grid",
            gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            md: "repeat(4, minmax(0, 1fr))",
            },
            columnGap: { xs: 1.4, sm: 2, md: 3.2 },
            rowGap: { xs: 2.2, md: 0 },
            alignItems: "start",
            mb: { xs: 3.5, md: 4.2 },
            "@media (max-width:359px)": {
            columnGap: 1.1,
            rowGap: 2,
            },
        }}
        >
          {stats.map((item) => (
            <Box
              key={item.id}
              sx={{
                minHeight: { xs: "auto", md: 116 },
                pr: { xs: 0.5, md: 0 },
              }}
            >
              <Typography
                sx={{
                    fontFamily: '"Patria", serif',
                    fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem" },
                    lineHeight: 0.98,
                    fontWeight: 700,
                    color: "#c0184f",
                    mb: 0.55,
                    letterSpacing: "-0.01em",
                    "@media (max-width:359px)": {
                    fontSize: "1.85rem",
                    },
                }}
                >
                {item.value.toLocaleString("es-MX")}
                {item.suffix}
              </Typography>

              <Typography
                sx={{
                    fontFamily: '"Noto Sans", sans-serif',
                    fontSize: { xs: "0.82rem", sm: "0.9rem", md: "0.94rem" },
                    lineHeight: 1.2,
                    fontWeight: 700,
                    color: "#2f2f2f",
                    maxWidth: { xs: "100%", md: 165 },
                    "@media (max-width:359px)": {
                    fontSize: "0.78rem",
                    },
                }}
                >
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            width: "100%",
            overflow: "hidden",
            borderRadius: { xs: "16px", md: "20px" },
          }}
        >
          <MexicoInteractiveMap />
        </Box>
      </Container>

      <InterestCardsSection />
      <GeoBannerSection />
      <GobMxFooter />
    </Box>
  );
}
import { useMemo, useState } from "react";
import { Box, Chip, Divider, Stack, Typography } from "@mui/material";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";

import mexicoStatesTopoJsonRaw from "../assets/mexico-states.topojson?raw";
import {
  DEFAULT_MEXICO_STATE_INFO,
  mexicoStatesData,
} from "../data/mexicoStatesData";
import { normalizeMexicoStateCode } from "../helpers/normalizeMexicoStateCode";

const MAP_WIDTH = 800;
const MAP_HEIGHT = 560;

const MAP_COLORS = {
  defaultFill: "#d9d1c7",
  hoverFill: "#b4174f",
  selectedFill: "#8a0f3d",
  disabledFill: "#c8c8c8",
  stroke: "#ffffff",
};

const EMPTY_FEATURE_COLLECTION = {
  type: "FeatureCollection",
  features: [],
};

const getMexicoFeatureCollection = () => {
  try {
    const parsedMap = JSON.parse(mexicoStatesTopoJsonRaw);

    if (parsedMap?.type === "FeatureCollection") {
      return parsedMap;
    }

    if (parsedMap?.type === "Feature") {
      return {
        type: "FeatureCollection",
        features: [parsedMap],
      };
    }

    if (parsedMap?.type === "Topology") {
      const statesObject = parsedMap.objects?.states;

      if (!statesObject) {
        console.warn(
          "El TopoJSON no contiene objects.states. Revisa mexico-states.topojson."
        );
        return EMPTY_FEATURE_COLLECTION;
      }

      const convertedFeatureCollection = feature(parsedMap, statesObject);

      if (convertedFeatureCollection?.type === "FeatureCollection") {
        return convertedFeatureCollection;
      }

      if (convertedFeatureCollection?.type === "Feature") {
        return {
          type: "FeatureCollection",
          features: [convertedFeatureCollection],
        };
      }
    }

    return EMPTY_FEATURE_COLLECTION;
  } catch (error) {
    console.error("No se pudo procesar el mapa de México:", error);
    return EMPTY_FEATURE_COLLECTION;
  }
};

const getStateFill = ({ stateCode, selectedStateCode, hoveredStateCode }) => {
  if (!stateCode) {
    return MAP_COLORS.disabledFill;
  }

  if (selectedStateCode === stateCode) {
    return MAP_COLORS.selectedFill;
  }

  if (hoveredStateCode === stateCode) {
    return MAP_COLORS.hoverFill;
  }

  return MAP_COLORS.defaultFill;
};

export default function MexicoInteractiveMap() {
  const [hoveredStateCode, setHoveredStateCode] = useState(null);
  const [selectedStateCode, setSelectedStateCode] = useState(null);

  const mexicoFeatureCollection = useMemo(() => {
    return getMexicoFeatureCollection();
  }, []);

  const mapFeatures = mexicoFeatureCollection.features ?? [];

  const projection = useMemo(() => {
    if (!mapFeatures.length) {
      return null;
    }

    return geoMercator().fitSize(
      [MAP_WIDTH, MAP_HEIGHT],
      mexicoFeatureCollection
    );
  }, [mapFeatures.length, mexicoFeatureCollection]);

  const pathGenerator = useMemo(() => {
    if (!projection) {
      return null;
    }

    return geoPath(projection);
  }, [projection]);

  const selectedStateInfo = useMemo(() => {
    if (!selectedStateCode) {
      return null;
    }

    return (
      mexicoStatesData[selectedStateCode] ?? {
        ...DEFAULT_MEXICO_STATE_INFO,
        code: selectedStateCode,
      }
    );
  }, [selectedStateCode]);

  const handleSelectState = (stateCode) => {
    if (!stateCode) {
      return;
    }

    setSelectedStateCode(stateCode);
  };

  const handleKeyDown = (event, stateCode) => {
    if (!stateCode) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelectState(stateCode);
    }
  };

  return (
    <Box
      sx={{
        mt: { xs: 0, md: 0.2 },
        width: "100%",
        minHeight: {
          xs: 420,
          sm: 500,
          md: 520,
          lg: 560,
          xl: 600,
        },
        borderRadius: { xs: "16px", md: "20px" },
        background:
          "linear-gradient(135deg, #f7f3ef 0%, #eeeeee 48%, #e7e2dd 100%)",
        border: "1px solid #dfdfdf",
        boxShadow: "0 18px 45px rgba(0,0,0,0.06)",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.4fr) 340px" },
        gap: { xs: 2.5, md: 3 },
        alignItems: "stretch",
        px: { xs: 1.5, sm: 2.5, md: 3 },
        py: { xs: 2, sm: 2.5, md: 3 },
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* MAPA */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          minHeight: { xs: 300, sm: 365, md: 460 },
          borderRadius: { xs: "14px", md: "18px" },
          background:
            "radial-gradient(circle at 50% 42%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.72) 46%, rgba(255,255,255,0.38) 100%)",
          border: "1px solid rgba(255,255,255,0.72)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          px: { xs: 0.5, sm: 1.5, md: 2 },
          py: { xs: 1.5, md: 2 },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: { xs: 12, md: 16 },
            left: { xs: 12, md: 16 },
            zIndex: 2,
            px: 1.2,
            py: 0.55,
            borderRadius: "999px",
            backgroundColor: "rgba(255,255,255,0.84)",
            border: "1px solid rgba(138,15,61,0.12)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Noto Sans", sans-serif',
              fontSize: { xs: "0.72rem", md: "0.76rem" },
              lineHeight: 1.2,
              fontWeight: 800,
              color: "#8a0f3d",
            }}
          >
            Haz clic en una entidad
          </Typography>
        </Box>

        {pathGenerator && mapFeatures.length > 0 ? (
          <Box
            component="svg"
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            role="img"
            aria-label="Mapa interactivo de México"
            sx={{
              width: "100%",
              maxWidth: 880,
              height: "auto",
              display: "block",
              overflow: "visible",
            }}
          >
            <g>
              {mapFeatures.map((geo, index) => {
                const stateCode = normalizeMexicoStateCode(geo.properties);
                const stateInfo =
                  stateCode && mexicoStatesData[stateCode]
                    ? mexicoStatesData[stateCode]
                    : DEFAULT_MEXICO_STATE_INFO;

                const isInteractive = Boolean(stateCode);
                const isActive =
                  hoveredStateCode === stateCode ||
                  selectedStateCode === stateCode;

                const fill = getStateFill({
                  stateCode,
                  selectedStateCode,
                  hoveredStateCode,
                });

                return (
                  <path
                    key={geo.id ?? stateCode ?? `state-${index}`}
                    d={pathGenerator(geo) ?? ""}
                    fill={fill}
                    stroke={MAP_COLORS.stroke}
                    strokeWidth={isActive ? 1.2 : 0.7}
                    role={isInteractive ? "button" : "img"}
                    tabIndex={isInteractive ? 0 : -1}
                    aria-label={
                      isInteractive
                        ? `Consultar información de ${stateInfo.name}`
                        : "Entidad no identificada"
                    }
                    onMouseEnter={() => {
                      if (isInteractive) {
                        setHoveredStateCode(stateCode);
                      }
                    }}
                    onMouseLeave={() => {
                      setHoveredStateCode(null);
                    }}
                    onFocus={() => {
                      if (isInteractive) {
                        setHoveredStateCode(stateCode);
                      }
                    }}
                    onBlur={() => {
                      setHoveredStateCode(null);
                    }}
                    onClick={() => handleSelectState(stateCode)}
                    onKeyDown={(event) => handleKeyDown(event, stateCode)}
                    style={{
                      cursor: isInteractive ? "pointer" : "default",
                      outline: "none",
                      transition:
                        "fill 180ms ease, stroke 180ms ease, filter 180ms ease",
                      filter: isActive
                        ? "drop-shadow(0 4px 8px rgba(138,15,61,0.25))"
                        : "none",
                    }}
                  />
                );
              })}
            </g>
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              maxWidth: 560,
              mx: "auto",
              textAlign: "center",
              px: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Patria", serif',
                fontSize: { xs: "1.45rem", sm: "1.7rem", md: "2rem" },
                lineHeight: 1.05,
                fontWeight: 700,
                color: "#4a4a4a",
                mb: 1.2,
              }}
            >
              Mapa no disponible
            </Typography>

            <Typography
              sx={{
                fontFamily: '"Noto Sans", sans-serif',
                fontSize: { xs: "0.9rem", md: "0.95rem" },
                lineHeight: 1.6,
                color: "#6f6f6f",
                fontWeight: 500,
              }}
            >
              No fue posible cargar la información geográfica del mapa. Revisa
              el archivo mexico-states.topojson.
            </Typography>
          </Box>
        )}
      </Box>

      {/* TARJETA INFORMATIVA */}
      <Box
        sx={{
          minHeight: { xs: "auto", md: "100%" },
          borderRadius: { xs: "14px", md: "18px" },
          backgroundColor: "rgba(255,255,255,0.86)",
          border: "1px solid rgba(255,255,255,0.82)",
          boxShadow: {
            xs: "0 10px 25px rgba(0,0,0,0.06)",
            md: "0 18px 36px rgba(0,0,0,0.08)",
          },
          backdropFilter: "blur(12px)",
          px: { xs: 2, sm: 2.4, md: 2.6 },
          py: { xs: 2, sm: 2.4, md: 2.8 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxSizing: "border-box",
        }}
      >
        {selectedStateInfo ? (
          <Box>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 1.4 }}
            >
              <Chip
                label={selectedStateInfo.isActive ? "Activo" : "Inactivo"}
                size="small"
                variant="outlined"
                sx={{
                  height: 34,
                  borderRadius: "999px",
                  backgroundColor: "#ffffff",
                  border: selectedStateInfo.isActive
                    ? "2px solid rgba(112,112,112,0.35)"
                    : "2px solid rgba(138,15,61,0.28)",
                  color: selectedStateInfo.isActive ? "#6d6d6d" : "#8a0f3d",
                  fontFamily: '"Noto Sans", sans-serif',
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  "& .MuiChip-label": {
                    px: 1.1,
                  },
                }}
              />

              <Typography
                sx={{
                  fontFamily: '"Noto Sans", sans-serif',
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  color: "#9a9a9a",
                  letterSpacing: "0.04em",
                }}
              >
                {selectedStateInfo.code}
              </Typography>
            </Stack>

            <Typography
              sx={{
                fontFamily: '"Patria", serif',
                fontSize: { xs: "2.05rem", md: "2.45rem" },
                lineHeight: 0.98,
                fontWeight: 700,
                color: "#a51d49",
                mb: 1.1,
                letterSpacing: "-0.015em",
              }}
            >
              {selectedStateInfo.name}
            </Typography>

            <Typography
              sx={{
                fontFamily: '"Noto Sans", sans-serif',
                fontSize: { xs: "0.9rem", md: "0.92rem" },
                lineHeight: 1.58,
                fontWeight: 400,
                color: "#666666",
                mb: 2.2,
              }}
            >
              {selectedStateInfo.description}
            </Typography>

            <Divider sx={{ borderColor: "rgba(138,15,61,0.12)", mb: 2 }} />

            <Stack spacing={1.6}>
              <Box>
                <Typography
                  sx={{
                    fontFamily: '"Noto Sans", sans-serif',
                    fontSize: "0.75rem",
                    lineHeight: 1.2,
                    fontWeight: 800,
                    color: "#8a0f3d",
                    mb: 0.35,
                    textTransform: "uppercase",
                    letterSpacing: "0.035em",
                  }}
                >
                  Procuradurías activas
                </Typography>

                <Typography
                  sx={{
                    fontFamily: '"Noto Sans", sans-serif',
                    fontSize: "0.94rem",
                    fontWeight: 800,
                    color: "#3a3a3a",
                  }}
                >
                  {selectedStateInfo.activeOffices}
                </Typography>
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontFamily: '"Noto Sans", sans-serif',
                    fontSize: "0.75rem",
                    lineHeight: 1.2,
                    fontWeight: 800,
                    color: "#8a0f3d",
                    mb: 0.35,
                    textTransform: "uppercase",
                    letterSpacing: "0.035em",
                  }}
                >
                  Última actualización
                </Typography>

                <Typography
                  sx={{
                    fontFamily: '"Noto Sans", sans-serif',
                    fontSize: "0.94rem",
                    fontWeight: 700,
                    color: "#555555",
                  }}
                >
                  {selectedStateInfo.lastUpdate}
                </Typography>
              </Box>
            </Stack>
          </Box>
        ) : (
          <Box>
            <Typography
              sx={{
                fontFamily: '"Patria", serif',
                fontSize: { xs: "1.55rem", md: "1.9rem" },
                lineHeight: 1.05,
                fontWeight: 700,
                color: "#1f1f1f",
                mb: 1.2,
              }}
            >
              Selecciona una entidad
            </Typography>

            <Typography
              sx={{
                fontFamily: '"Noto Sans", sans-serif',
                fontSize: { xs: "0.9rem", md: "0.92rem" },
                lineHeight: 1.6,
                color: "#666666",
                fontWeight: 400,
              }}
            >
              Haz clic sobre un estado del mapa para consultar la información
              institucional disponible de esa entidad federativa.
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            mt: { xs: 2.2, md: 3 },
            pt: 1.8,
            borderTop: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            sx={{
              fontFamily: '"Noto Sans", sans-serif',
              fontSize: "0.76rem",
              lineHeight: 1.45,
              color: "#8a8a8a",
              fontWeight: 500,
            }}
          >
            La información mostrada corresponde a datos en proceso de
            integración y validación institucional.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
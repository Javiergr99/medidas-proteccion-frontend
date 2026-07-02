import PropTypes from "prop-types";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import {
  DISCAPACIDAD_EMPTY_ITEM,
  YES_NO_OPTIONS,
} from "../../constants/medidasCreate.constants";
import { MedidasSelectField, MedidasTextField } from "./MedidasFormControls";

function getCatalogItemById(options, value) {
  if (!Array.isArray(options)) return null;

  return options.find((option) => String(option.id) === String(value)) || null;
}

function getEmptyDiscapacidadItem() {
  return {
    ...DISCAPACIDAD_EMPTY_ITEM,
  };
}

export default function DatosGeneralesDiscapacidadFields({
  form,
  errors,
  catalogos,
  onFieldChange,
}) {
  const tieneDiscapacidad = form.tiene_discapacidad === "si";

  const discapacidades = Array.isArray(form.discapacidades)
    ? form.discapacidades
    : [];

  const visibleDiscapacidades = tieneDiscapacidad
    ? discapacidades.length > 0
      ? discapacidades
      : [getEmptyDiscapacidadItem()]
    : [];

  const discapacidadErrors = Array.isArray(errors.discapacidades)
    ? errors.discapacidades
    : [];

  function getSubtipoOptionsByCategoria(categoriaId) {
    if (!categoriaId) return [];

    return catalogos.subtipo_discapacidad.filter((option) => {
      return String(option.categoria_id) === String(categoriaId);
    });
  }

  function updateDiscapacidades(nextDiscapacidades) {
    onFieldChange("discapacidades", nextDiscapacidades);
  }

  function handleTieneDiscapacidadChange(name, value) {
    onFieldChange(name, value);

    if (value === "si") {
      updateDiscapacidades(
        discapacidades.length > 0
          ? discapacidades
          : [getEmptyDiscapacidadItem()]
      );
    }

    if (value !== "si") {
      updateDiscapacidades([]);
    }
  }

  function handleDiscapacidadFieldChange(index, name, value) {
    const nextDiscapacidades = visibleDiscapacidades.map((item, itemIndex) => {
      if (itemIndex !== index) return item;

      const nextItem = {
        ...getEmptyDiscapacidadItem(),
        ...item,
        [name]: value,
      };

      if (name === "categoria_discapacidad_id") {
        nextItem.subtipo_discapacidad_id = "";
        nextItem.severidad_discapacidad_id = "";
        nextItem.especifique_otros = "";
        nextItem.requiere_especificacion = false;
      }

      if (name === "subtipo_discapacidad_id") {
        const selectedSubtipo = getCatalogItemById(
          catalogos.subtipo_discapacidad,
          value
        );

        const requiereEspecificacion =
          selectedSubtipo?.requiere_especificacion === true;

        nextItem.requiere_especificacion = requiereEspecificacion;

        if (!requiereEspecificacion) {
          nextItem.especifique_otros = "";
        }
      }

      return nextItem;
    });

    updateDiscapacidades(nextDiscapacidades);
  }

  function handleAddDiscapacidad() {
    updateDiscapacidades([
      ...visibleDiscapacidades,
      getEmptyDiscapacidadItem(),
    ]);
  }

  function handleRemoveDiscapacidad(index) {
    const nextDiscapacidades = visibleDiscapacidades.filter(
      (_, itemIndex) => itemIndex !== index
    );

    updateDiscapacidades(nextDiscapacidades);
  }

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
      }}
    >
      <Stack spacing={2.2} sx={{ width: "100%", minWidth: 0 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(0, 1fr) minmax(300px, 440px)",
            },
            gap: { xs: 1.6, md: 2.6 },
            alignItems: "start",
            width: "100%",
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              minWidth: 0,
              maxWidth: 780,
            }}
          >
            <Typography
              sx={{
                m: 0,
                fontFamily: "Noto Sans, sans-serif",
                color: "#64748b",
                fontWeight: 650,
                fontSize: "0.86rem",
                lineHeight: 1.58,
              }}
            >
              Selecciona si el NNA presenta discapacidad. Al elegir “Sí”, se
              habilitará la captura de categoría, subtipo y severidad.
            </Typography>
          </Box>

          <Box sx={{ width: "100%", minWidth: 0 }}>
            <MedidasSelectField
              label="¿Presenta discapacidad?"
              name="tiene_discapacidad"
              value={form.tiene_discapacidad}
              options={YES_NO_OPTIONS}
              valueKey="value"
              labelKey="label"
              onChange={handleTieneDiscapacidadChange}
              error={errors.tiene_discapacidad}
            />
          </Box>
        </Box>

        {typeof errors.discapacidades === "string" ? (
          <Typography
            sx={{
              fontFamily: "Noto Sans, sans-serif",
              color: "#b42318",
              fontWeight: 750,
              fontSize: "0.78rem",
            }}
          >
            {errors.discapacidades}
          </Typography>
        ) : null}

        {tieneDiscapacidad ? (
          <>
            <Divider
              sx={{
                borderColor: "rgba(152,152,154,0.14)",
              }}
            />

            <Stack spacing={1.8}>
              {visibleDiscapacidades.map((item, index) => {
                const rowErrors = discapacidadErrors[index] || {};

                const subtipoOptions = getSubtipoOptionsByCategoria(
                  item.categoria_discapacidad_id
                );

                const hasCategoria = Boolean(item.categoria_discapacidad_id);
                const hasSubtipo = Boolean(item.subtipo_discapacidad_id);

                return (
                  <Box
                    key={`discapacidad-${index + 1}`}
                    sx={{
                      width: "100%",
                      maxWidth: "100%",
                      minWidth: 0,
                      borderRadius: "20px",
                      backgroundColor: "#ffffff",
                      border: "1px solid rgba(152,152,154,0.16)",
                      boxShadow: "0 8px 22px rgba(19,50,46,0.035)",
                      p: { xs: 1.6, md: 1.9 },
                    }}
                  >
                    <Stack spacing={1.7}>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        justifyContent="space-between"
                        spacing={1.2}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontFamily: "Noto Sans, sans-serif",
                              color: "#611232",
                              fontWeight: 950,
                              fontSize: "0.9rem",
                              lineHeight: 1.2,
                            }}
                          >
                            Discapacidad {index + 1}
                          </Typography>

                          <Typography
                            sx={{
                              mt: 0.35,
                              fontFamily: "Noto Sans, sans-serif",
                              color: "#64748b",
                              fontWeight: 600,
                              fontSize: "0.78rem",
                              lineHeight: 1.45,
                            }}
                          >
                            La categoría filtra los subtipos disponibles. El
                            backend recibirá subtipo, severidad y especificación
                            si aplica.
                          </Typography>
                        </Box>

                        {visibleDiscapacidades.length > 1 ? (
                          <Button
                            type="button"
                            size="small"
                            startIcon={<DeleteOutlineRoundedIcon />}
                            onClick={() => handleRemoveDiscapacidad(index)}
                            sx={{
                              borderRadius: "999px",
                              color: "#9d2449",
                              fontFamily: "Noto Sans, sans-serif",
                              fontWeight: 850,
                              fontSize: "0.76rem",
                              textTransform: "none",
                              px: 1.35,
                              flex: "0 0 auto",
                              "&:hover": {
                                backgroundColor: "rgba(157,36,73,0.06)",
                              },
                            }}
                          >
                            Quitar
                          </Button>
                        ) : null}
                      </Stack>

                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: {
                            xs: "1fr",
                            md: "repeat(2, minmax(0, 1fr))",
                            xl: "repeat(3, minmax(0, 1fr))",
                          },
                          gap: { xs: 2, md: 2.15 },
                          alignItems: "start",
                          width: "100%",
                          minWidth: 0,
                        }}
                      >
                        <MedidasSelectField
                          label="Categoría de discapacidad"
                          name="categoria_discapacidad_id"
                          value={item.categoria_discapacidad_id}
                          options={catalogos.categoria_discapacidad}
                          onChange={(name, value) =>
                            handleDiscapacidadFieldChange(index, name, value)
                          }
                          error={rowErrors.categoria_discapacidad_id}
                        />

                        <MedidasSelectField
                          label="Subtipo de discapacidad"
                          name="subtipo_discapacidad_id"
                          value={item.subtipo_discapacidad_id}
                          options={subtipoOptions}
                          onChange={(name, value) =>
                            handleDiscapacidadFieldChange(index, name, value)
                          }
                          error={rowErrors.subtipo_discapacidad_id}
                          disabled={!hasCategoria}
                        />

                        <MedidasSelectField
                          label="Severidad"
                          name="severidad_discapacidad_id"
                          value={item.severidad_discapacidad_id}
                          options={catalogos.severidad_discapacidad}
                          onChange={(name, value) =>
                            handleDiscapacidadFieldChange(index, name, value)
                          }
                          error={rowErrors.severidad_discapacidad_id}
                          disabled={!hasSubtipo}
                        />

                        {item.requiere_especificacion ? (
                          <Box
                            sx={{
                              gridColumn: {
                                xs: "auto",
                                md: "1 / -1",
                              },
                            }}
                          >
                            <MedidasTextField
                              label="Especificar discapacidad"
                              name="especifique_otros"
                              value={item.especifique_otros}
                              onChange={(name, value) =>
                                handleDiscapacidadFieldChange(
                                  index,
                                  name,
                                  value
                                )
                              }
                              error={rowErrors.especifique_otros}
                              inputProps={{ maxLength: 255 }}
                            />
                          </Box>
                        ) : null}
                      </Box>
                    </Stack>
                  </Box>
                );
              })}

              <Box>
                <Button
                  type="button"
                  startIcon={<AddRoundedIcon />}
                  onClick={handleAddDiscapacidad}
                  sx={{
                    minHeight: 42,
                    borderRadius: "999px",
                    px: 1.8,
                    py: 0.78,
                    textTransform: "none",
                    fontFamily: "Noto Sans, sans-serif",
                    fontWeight: 900,
                    color: "#611232",
                    border: "1px solid rgba(188,149,92,0.28)",
                    backgroundColor: "rgba(221,201,163,0.18)",
                    "&:hover": {
                      backgroundColor: "rgba(221,201,163,0.28)",
                      borderColor: "#BC955C",
                    },
                  }}
                >
                  Agregar otra discapacidad
                </Button>
              </Box>
            </Stack>
          </>
        ) : null}
      </Stack>
    </Box>
  );
}

DatosGeneralesDiscapacidadFields.propTypes = {
  form: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  catalogos: PropTypes.shape({
    categoria_discapacidad: PropTypes.array.isRequired,
    subtipo_discapacidad: PropTypes.array.isRequired,
    severidad_discapacidad: PropTypes.array.isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
};
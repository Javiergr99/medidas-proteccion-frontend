import PropTypes from "prop-types";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import { YES_NO_OPTIONS } from "../../constants/medidasCreate.constants";
import {
  MedidasDateField,
  MedidasSelectField,
  MedidasTextField,
} from "./MedidasFormControls";

const LUGAR_INTERVENCION_OPTIONS = [
  {
    value: "Procuraduría de Protección",
    label: "Procuraduría de Protección",
  },
  {
    value: "Centro de asistencia social",
    label: "Centro de asistencia social",
  },
  {
    value: "Institución educativa",
    label: "Institución educativa",
  },
  {
    value: "Institución de salud",
    label: "Institución de salud",
  },
  {
    value: "Ministerio Público / Fiscalía",
    label: "Ministerio Público / Fiscalía",
  },
  {
    value: "Domicilio particular",
    label: "Domicilio particular",
  },
  {
    value: "Otras",
    label: "Otras",
  },
];

const EMPTY_DETALLE_DIAGNOSTICO = {
  tipo_diagnostico: "",
  fecha_diagnostico: "",
};

function getEmptyDetalleDiagnostico() {
  return {
    ...EMPTY_DETALLE_DIAGNOSTICO,
  };
}

function getDetallesDiagnosticos(form) {
  return Array.isArray(form.detalles_diagnosticos)
    ? form.detalles_diagnosticos
    : [];
}

function normalizeDetalleDiagnosticoValue(name, value) {
  if (name === "tipo_diagnostico") {
    return String(value || "").toUpperCase();
  }

  return value;
}

export default function IntervencionMultidisciplinariaForm({
  form,
  errors,
  catalogos,
  onFieldChange,
}) {
  const lugarIntervencionEsOtra = form.lugar_intervencion === "Otras";
  const diagnosticoElaborado = form.diagnostico_elaborado === "si";
  const asesoriaLegal = form.asesoria_legal === "si";
  const representacionJuridica = form.representacion_juridica === "si";

  const detallesDiagnosticos = getDetallesDiagnosticos(form);

  const visibleDetallesDiagnosticos = diagnosticoElaborado
    ? detallesDiagnosticos.length > 0
      ? detallesDiagnosticos
      : [getEmptyDetalleDiagnostico()]
    : [];

  const detallesErrors = Array.isArray(errors.detalles_diagnosticos)
    ? errors.detalles_diagnosticos
    : [];

  function updateDetallesDiagnosticos(nextDetalles) {
    onFieldChange("detalles_diagnosticos", nextDetalles);
  }

  function handleDiagnosticoElaboradoChange(name, value) {
    onFieldChange(name, value);

    if (value === "si") {
      updateDetallesDiagnosticos(
        detallesDiagnosticos.length > 0
          ? detallesDiagnosticos
          : [getEmptyDetalleDiagnostico()]
      );
    }

    if (value !== "si") {
      updateDetallesDiagnosticos([]);
    }
  }

  function handleDetalleDiagnosticoChange(index, name, value) {
    const normalizedValue = normalizeDetalleDiagnosticoValue(name, value);

    const nextDetalles = visibleDetallesDiagnosticos.map((item, itemIndex) => {
      if (itemIndex !== index) return item;

      return {
        ...getEmptyDetalleDiagnostico(),
        ...item,
        [name]: normalizedValue,
      };
    });

    updateDetallesDiagnosticos(nextDetalles);
  }

  function handleAddDetalleDiagnostico() {
    updateDetallesDiagnosticos([
      ...visibleDetallesDiagnosticos,
      getEmptyDetalleDiagnostico(),
    ]);
  }

  function handleRemoveDetalleDiagnostico(index) {
    const nextDetalles = visibleDetallesDiagnosticos.filter(
      (_, itemIndex) => itemIndex !== index
    );

    updateDetallesDiagnosticos(nextDetalles);
  }

  function handleAsesoriaLegalChange(name, value) {
    onFieldChange(name, value);

    if (value !== "si") {
      onFieldChange("asesoria_legal_servidor_publico", "");
      onFieldChange("asesoria_legal_fecha", "");
    }
  }

  function handleRepresentacionJuridicaChange(name, value) {
    onFieldChange(name, value);

    if (value !== "si") {
      onFieldChange("representacion_juridica_servidor_publico", "");
      onFieldChange("representacion_juridica_fecha", "");
    }
  }

  function handleLugarIntervencionChange(name, value) {
    onFieldChange(name, value);

    if (value !== "Otras") {
      onFieldChange("otro_lugar_intervencion", "");
    }
  }

  return (
    <section className="mp-intervencion-form">
      <style>{styles}</style>

      <header className="mp-intervencion-header">
        <div>
          <h2 className="mp-intervencion-title">
            Intervención multidisciplinaria
          </h2>

          <p className="mp-intervencion-description">
            Registra los datos generales de la intervención, los diagnósticos
            elaborados y la participación del área jurídica cuando corresponda.
          </p>
        </div>
      </header>

      <div className="mp-intervencion-sections">
        <section className="mp-intervencion-card">
          <div className="mp-intervencion-card-header">
            <h3 className="mp-intervencion-card-title">
              Datos de la intervención
            </h3>

            <p className="mp-intervencion-card-description">
              Información base sobre la derivación, lugar de intervención y
              entidad donde se tuvo conocimiento del caso.
            </p>
          </div>

          <div className="mp-intervencion-grid">
            <MedidasTextField
              label="Actor que deriva"
              name="actor_derivacion"
              value={form.actor_derivacion}
              onChange={onFieldChange}
              error={errors.actor_derivacion}
              inputProps={{ maxLength: 200 }}
            />

            <MedidasSelectField
              label="Lugar de intervención"
              name="lugar_intervencion"
              value={form.lugar_intervencion}
              options={LUGAR_INTERVENCION_OPTIONS}
              valueKey="value"
              labelKey="label"
              onChange={handleLugarIntervencionChange}
              error={errors.lugar_intervencion}
            />

            {lugarIntervencionEsOtra ? (
              <MedidasTextField
                label="Especificar otro lugar de intervención"
                name="otro_lugar_intervencion"
                value={form.otro_lugar_intervencion}
                onChange={onFieldChange}
                error={errors.otro_lugar_intervencion}
                inputProps={{ maxLength: 200 }}
              />
            ) : null}

            <MedidasSelectField
              label="Entidad federativa de conocimiento"
              name="entidad_federativa_conocimiento"
              value={form.entidad_federativa_conocimiento}
              options={catalogos.entidad_federativa}
              valueKey="descripcion"
              labelKey="descripcion"
              onChange={onFieldChange}
              error={errors.entidad_federativa_conocimiento}
            />

            <Box
              sx={{
                gridColumn: {
                  xs: "auto",
                  md: "1 / -1",
                },
              }}
            >
              <MedidasTextField
                label="Lugar donde se realizó la intervención"
                name="lugar_realizacion_intervencion"
                value={form.lugar_realizacion_intervencion}
                onChange={onFieldChange}
                error={errors.lugar_realizacion_intervencion}
                inputProps={{ maxLength: 200 }}
              />
            </Box>
          </div>
        </section>

        <section className="mp-intervencion-card">
          <div className="mp-intervencion-card-header">
            <h3 className="mp-intervencion-card-title">
              Diagnóstico multidisciplinario
            </h3>

            <p className="mp-intervencion-card-description">
              Indica si se elaboró diagnóstico y registra el tipo y fecha de
              cada diagnóstico realizado.
            </p>
          </div>

          <Stack spacing={2.2}>
            <Box className="mp-intervencion-question-row">
              <Box>
                <Typography
                  sx={{
                    fontFamily: "Noto Sans, sans-serif",
                    color: "#64748b",
                    fontWeight: 650,
                    fontSize: "0.86rem",
                    lineHeight: 1.58,
                  }}
                >
                  Cuando se seleccione “Sí”, podrás agregar uno o más
                  diagnósticos elaborados por el equipo multidisciplinario.
                </Typography>
              </Box>

              <MedidasSelectField
                label="¿Se elaboró diagnóstico?"
                name="diagnostico_elaborado"
                value={form.diagnostico_elaborado}
                options={YES_NO_OPTIONS}
                valueKey="value"
                labelKey="label"
                onChange={handleDiagnosticoElaboradoChange}
                error={errors.diagnostico_elaborado}
              />
            </Box>

            {typeof errors.detalles_diagnosticos === "string" ? (
              <Typography
                sx={{
                  fontFamily: "Noto Sans, sans-serif",
                  color: "#b42318",
                  fontWeight: 750,
                  fontSize: "0.78rem",
                }}
              >
                {errors.detalles_diagnosticos}
              </Typography>
            ) : null}

            {diagnosticoElaborado ? (
              <>
                <Divider
                  sx={{
                    borderColor: "rgba(152,152,154,0.14)",
                  }}
                />

                <Stack spacing={1.8}>
                  {visibleDetallesDiagnosticos.map((item, index) => {
                    const rowErrors = detallesErrors[index] || {};

                    return (
                      <Box
                        key={`detalle-diagnostico-${index + 1}`}
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
                                Diagnóstico {index + 1}
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
                                Registra el tipo de diagnóstico y la fecha de
                                elaboración.
                              </Typography>
                            </Box>

                            {visibleDetallesDiagnosticos.length > 1 ? (
                              <Button
                                type="button"
                                size="small"
                                startIcon={<DeleteOutlineRoundedIcon />}
                                onClick={() =>
                                  handleRemoveDetalleDiagnostico(index)
                                }
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

                          <Box className="mp-intervencion-detail-grid">
                            <MedidasTextField
                              label="Tipo de diagnóstico"
                              name="tipo_diagnostico"
                              value={item.tipo_diagnostico}
                              onChange={(name, value) =>
                                handleDetalleDiagnosticoChange(
                                  index,
                                  name,
                                  value
                                )
                              }
                              error={rowErrors.tipo_diagnostico}
                              inputProps={{ maxLength: 100 }}
                            />

                            <MedidasDateField
                              label="Fecha de diagnóstico"
                              name="fecha_diagnostico"
                              value={item.fecha_diagnostico}
                              onChange={(name, value) =>
                                handleDetalleDiagnosticoChange(
                                  index,
                                  name,
                                  value
                                )
                              }
                              error={rowErrors.fecha_diagnostico}
                            />
                          </Box>
                        </Stack>
                      </Box>
                    );
                  })}

                  <Box>
                    <Button
                      type="button"
                      startIcon={<AddRoundedIcon />}
                      onClick={handleAddDetalleDiagnostico}
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
                      Agregar otro diagnóstico
                    </Button>
                  </Box>
                </Stack>
              </>
            ) : null}
          </Stack>
        </section>

        <section className="mp-intervencion-card">
          <div className="mp-intervencion-card-header">
            <h3 className="mp-intervencion-card-title">
              Asesoría y representación jurídica
            </h3>

            <p className="mp-intervencion-card-description">
              Captura la intervención del área jurídica cuando se haya brindado
              asesoría legal o representación jurídica.
            </p>
          </div>

          <Stack spacing={2.4}>
            <Box className="mp-intervencion-legal-block">
              <div className="mp-intervencion-legal-header">
                <h4 className="mp-intervencion-legal-title">
                  Asesoría legal
                </h4>

                <p className="mp-intervencion-legal-description">
                  Registra el servidor público y fecha únicamente cuando se haya
                  brindado asesoría legal.
                </p>
              </div>

              <div className="mp-intervencion-grid">
                <MedidasSelectField
                  label="¿Recibió asesoría legal?"
                  name="asesoria_legal"
                  value={form.asesoria_legal}
                  options={YES_NO_OPTIONS}
                  valueKey="value"
                  labelKey="label"
                  onChange={handleAsesoriaLegalChange}
                  error={errors.asesoria_legal}
                />

                {asesoriaLegal ? (
                  <>
                    <MedidasTextField
                      label="Servidor público que brindó asesoría"
                      name="asesoria_legal_servidor_publico"
                      value={form.asesoria_legal_servidor_publico}
                      onChange={onFieldChange}
                      error={errors.asesoria_legal_servidor_publico}
                      inputProps={{ maxLength: 200 }}
                    />

                    <MedidasDateField
                      label="Fecha de asesoría legal"
                      name="asesoria_legal_fecha"
                      value={form.asesoria_legal_fecha}
                      onChange={onFieldChange}
                      error={errors.asesoria_legal_fecha}
                    />
                  </>
                ) : null}
              </div>
            </Box>

            <Divider
              sx={{
                borderColor: "rgba(152,152,154,0.14)",
              }}
            />

            <Box className="mp-intervencion-legal-block">
              <div className="mp-intervencion-legal-header">
                <h4 className="mp-intervencion-legal-title">
                  Representación jurídica
                </h4>

                <p className="mp-intervencion-legal-description">
                  Registra el servidor público y fecha únicamente cuando se haya
                  otorgado representación jurídica.
                </p>
              </div>

              <div className="mp-intervencion-grid">
                <MedidasSelectField
                  label="¿Recibió representación jurídica?"
                  name="representacion_juridica"
                  value={form.representacion_juridica}
                  options={YES_NO_OPTIONS}
                  valueKey="value"
                  labelKey="label"
                  onChange={handleRepresentacionJuridicaChange}
                  error={errors.representacion_juridica}
                />

                {representacionJuridica ? (
                  <>
                    <MedidasTextField
                      label="Servidor público representante"
                      name="representacion_juridica_servidor_publico"
                      value={form.representacion_juridica_servidor_publico}
                      onChange={onFieldChange}
                      error={errors.representacion_juridica_servidor_publico}
                      inputProps={{ maxLength: 200 }}
                    />

                    <MedidasDateField
                      label="Fecha de representación jurídica"
                      name="representacion_juridica_fecha"
                      value={form.representacion_juridica_fecha}
                      onChange={onFieldChange}
                      error={errors.representacion_juridica_fecha}
                    />
                  </>
                ) : null}
              </div>
            </Box>
          </Stack>
        </section>
      </div>
    </section>
  );
}

const styles = `
  .mp-intervencion-form {
    display: grid;
    gap: 22px;
    width: 100%;
    min-width: 0;
  }

  .mp-intervencion-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;
    width: 100%;
    min-width: 0;
  }

  .mp-intervencion-title {
    margin: 0;
    color: #611232;
    font-family: "Noto Sans", sans-serif;
    font-size: clamp(1.35rem, 2vw, 1.85rem);
    font-weight: 950;
    line-height: 1.12;
    letter-spacing: -0.035em;
  }

  .mp-intervencion-description {
    max-width: 840px;
    margin: 8px 0 0;
    color: #64748b;
    font-family: "Noto Sans", sans-serif;
    font-size: 0.93rem;
    font-weight: 600;
    line-height: 1.6;
  }

  .mp-intervencion-sections {
    display: grid;
    gap: 18px;
    width: 100%;
    min-width: 0;
  }

  .mp-intervencion-card {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    border-radius: 24px;
    background: linear-gradient(180deg, #ffffff 0%, rgba(251,250,248,0.72) 100%);
    border: 1px solid rgba(152,152,154,0.16);
    box-shadow: 0 10px 26px rgba(19,50,46,0.04);
    padding: 24px;
    overflow: hidden;
    transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
  }

  .mp-intervencion-card:hover {
    transform: translateY(-1px);
    border-color: rgba(188,149,92,0.24);
    box-shadow: 0 14px 32px rgba(19,50,46,0.055);
  }

  .mp-intervencion-card-header {
    margin-bottom: 20px;
    max-width: 980px;
  }

  .mp-intervencion-card-title {
    margin: 0;
    color: #13322e;
    font-family: "Noto Sans", sans-serif;
    font-size: clamp(1.02rem, 1.3vw, 1.16rem);
    font-weight: 950;
    line-height: 1.18;
    letter-spacing: -0.025em;
  }

  .mp-intervencion-card-description {
    max-width: 900px;
    margin: 6px 0 0;
    color: #64748b;
    font-family: "Noto Sans", sans-serif;
    font-size: 0.84rem;
    font-weight: 600;
    line-height: 1.55;
  }

  .mp-intervencion-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
    align-items: start;
    width: 100%;
    min-width: 0;
  }

  .mp-intervencion-detail-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(240px, 320px);
    gap: 18px;
    align-items: start;
    width: 100%;
    min-width: 0;
  }

  .mp-intervencion-question-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(300px, 440px);
    gap: 24px;
    align-items: start;
    width: 100%;
    min-width: 0;
  }

  .mp-intervencion-legal-block {
    display: grid;
    gap: 16px;
    width: 100%;
    min-width: 0;
  }

  .mp-intervencion-legal-header {
    max-width: 860px;
  }

  .mp-intervencion-legal-title {
    margin: 0;
    color: #611232;
    font-family: "Noto Sans", sans-serif;
    font-size: 0.94rem;
    font-weight: 950;
    line-height: 1.22;
  }

  .mp-intervencion-legal-description {
    margin: 5px 0 0;
    color: #64748b;
    font-family: "Noto Sans", sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    line-height: 1.5;
  }

  @media (max-width: 1080px) {
    .mp-intervencion-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .mp-intervencion-detail-grid,
    .mp-intervencion-question-row {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 720px) {
    .mp-intervencion-form {
      gap: 18px;
    }

    .mp-intervencion-sections {
      gap: 16px;
    }

    .mp-intervencion-card {
      border-radius: 20px;
      padding: 18px;
    }

    .mp-intervencion-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }
`;

IntervencionMultidisciplinariaForm.propTypes = {
  form: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  catalogos: PropTypes.shape({
    entidad_federativa: PropTypes.array.isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
};
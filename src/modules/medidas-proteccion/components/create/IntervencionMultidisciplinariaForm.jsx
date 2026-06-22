import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";

import {
  ACTOR_DERIVACION_OPTIONS,
  LUGAR_INTERVENCION_OPTIONS,
  YES_NO_OPTIONS,
} from "../../constants/medidasCreate.constants";
import DiagnosticosListField from "./DiagnosticosListField";
import {
  MedidasDateField,
  MedidasSelectField,
  MedidasTextField,
} from "./MedidasFormControls";

export default function IntervencionMultidisciplinariaForm({
  form,
  errors,
  catalogos,
  onFieldChange,
}) {
  const diagnosticoActivo = form.diagnostico_elaborado === "si";
  const asesoriaActiva = form.asesoria_legal === "si";
  const representacionActiva = form.representacion_juridica === "si";

  return (
    <Box>
      <SectionTitle
        title="Intervención Multidisciplinaria"
        description="Captura la información de derivación, intervención institucional, diagnósticos, asesoría legal y representación jurídica."
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(3, minmax(0, 1fr))",
          },
          gap: { xs: 2, md: 2.3 },
        }}
      >
        <MedidasSelectField
          label="Actor de derivación"
          name="actor_derivacion"
          value={form.actor_derivacion}
          options={ACTOR_DERIVACION_OPTIONS}
          valueKey="value"
          labelKey="label"
          onChange={onFieldChange}
          error={errors.actor_derivacion}
        />

        <MedidasSelectField
          label="Lugar de intervención"
          name="lugar_intervencion"
          value={form.lugar_intervencion}
          options={LUGAR_INTERVENCION_OPTIONS}
          valueKey="value"
          labelKey="label"
          onChange={onFieldChange}
          error={errors.lugar_intervencion}
        />

        <MedidasTextField
          label="Otro lugar de intervención"
          name="otro_lugar_intervencion"
          value={form.otro_lugar_intervencion}
          onChange={onFieldChange}
          error={errors.otro_lugar_intervencion}
          disabled={form.lugar_intervencion !== "Otras"}
          inputProps={{ maxLength: 200 }}
        />

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

        <MedidasSelectField
          label="Lugar de realización de intervención"
          name="lugar_realizacion_intervencion"
          value={form.lugar_realizacion_intervencion}
          options={catalogos.entidad_federativa}
          valueKey="descripcion"
          labelKey="descripcion"
          onChange={onFieldChange}
          error={errors.lugar_realizacion_intervencion}
        />

        <MedidasSelectField
          label="Diagnóstico elaborado"
          name="diagnostico_elaborado"
          value={form.diagnostico_elaborado}
          options={YES_NO_OPTIONS}
          valueKey="value"
          labelKey="label"
          onChange={onFieldChange}
          error={errors.diagnostico_elaborado}
        />

        <DiagnosticosListField
          value={form.detalles_diagnosticos}
          error={errors.detalles_diagnosticos}
          disabled={!diagnosticoActivo}
          onChange={onFieldChange}
        />

        <MedidasSelectField
          label="Asesoría legal"
          name="asesoria_legal"
          value={form.asesoria_legal}
          options={YES_NO_OPTIONS}
          valueKey="value"
          labelKey="label"
          onChange={onFieldChange}
          error={errors.asesoria_legal}
        />

        <MedidasTextField
          label="Servidor público de asesoría legal"
          name="asesoria_legal_servidor_publico"
          value={form.asesoria_legal_servidor_publico}
          onChange={onFieldChange}
          error={errors.asesoria_legal_servidor_publico}
          disabled={!asesoriaActiva}
          inputProps={{ maxLength: 200 }}
        />

        <MedidasDateField
          label="Fecha de asesoría legal"
          name="asesoria_legal_fecha"
          value={form.asesoria_legal_fecha}
          onChange={onFieldChange}
          error={errors.asesoria_legal_fecha}
        />

        <MedidasSelectField
          label="Representación jurídica"
          name="representacion_juridica"
          value={form.representacion_juridica}
          options={YES_NO_OPTIONS}
          valueKey="value"
          labelKey="label"
          onChange={onFieldChange}
          error={errors.representacion_juridica}
        />

        <MedidasTextField
          label="Servidor público de representación jurídica"
          name="representacion_juridica_servidor_publico"
          value={form.representacion_juridica_servidor_publico}
          onChange={onFieldChange}
          error={errors.representacion_juridica_servidor_publico}
          disabled={!representacionActiva}
          inputProps={{ maxLength: 200 }}
        />

        <MedidasDateField
          label="Fecha de representación jurídica"
          name="representacion_juridica_fecha"
          value={form.representacion_juridica_fecha}
          onChange={onFieldChange}
          error={errors.representacion_juridica_fecha}
        />
      </Box>
    </Box>
  );
}

function SectionTitle({ title, description }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        component="h2"
        sx={{
          fontFamily: "Noto Sans, sans-serif",
          fontWeight: 950,
          color: "#13322e",
          fontSize: { xs: "1.45rem", md: "2rem" },
          letterSpacing: "-0.04em",
          lineHeight: 1.1,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          mt: 0.9,
          maxWidth: 920,
          fontFamily: "Noto Sans, sans-serif",
          color: "#64748b",
          fontWeight: 700,
          lineHeight: 1.65,
          fontSize: "0.94rem",
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}

IntervencionMultidisciplinariaForm.propTypes = {
  form: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  catalogos: PropTypes.shape({
    entidad_federativa: PropTypes.array.isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
};

SectionTitle.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};
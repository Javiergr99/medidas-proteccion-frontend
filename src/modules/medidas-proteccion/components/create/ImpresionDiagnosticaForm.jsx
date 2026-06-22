import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";

import {
  IDIOMA_OPTIONS,
  LENGUA_INDIGENA_OPTIONS,
  YES_NO_OPTIONS,
} from "../../constants/medidasCreate.constants";
import { MedidasSelectField, MedidasTextField } from "./MedidasFormControls";

export default function ImpresionDiagnosticaForm({
  form,
  errors,
  onFieldChange,
}) {
  const tieneEnfermedadCronica = form.enfermedad_cronica === "si";
  const hablaLenguaIndigena = form.habla_lengua_indigena === "si";

  return (
    <Box>
      <SectionHeader
        title="Impresión diagnóstica"
        description="Captura la información médica, religiosa e idiomática del NNA."
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "repeat(2, minmax(0, 1fr))",
          },
          gap: { xs: 2, md: 2.2 },
        }}
      >
        <SectionCard
          title="Condición de salud"
          description="Registra si existe una enfermedad crónica identificada."
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: tieneEnfermedadCronica
                  ? "repeat(2, minmax(0, 1fr))"
                  : "1fr",
              },
              gap: { xs: 2, md: 2.1 },
            }}
          >
            <MedidasSelectField
              label="Enfermedad crónica"
              name="enfermedad_cronica"
              value={form.enfermedad_cronica}
              options={YES_NO_OPTIONS}
              valueKey="value"
              labelKey="label"
              onChange={onFieldChange}
              error={errors.enfermedad_cronica}
            />

            {tieneEnfermedadCronica ? (
              <MedidasTextField
                label="Tipo de enfermedad"
                name="tipo_enfermedad"
                value={form.tipo_enfermedad}
                onChange={onFieldChange}
                error={errors.tipo_enfermedad}
                inputProps={{ maxLength: 100 }}
              />
            ) : null}
          </Box>
        </SectionCard>

        <SectionCard
          title="Idioma y contexto cultural"
          description="Captura religión, idioma principal y lengua indígena cuando aplique."
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
              },
              gap: { xs: 2, md: 2.1 },
            }}
          >
            <MedidasTextField
              label="Religión"
              name="religion"
              value={form.religion}
              onChange={onFieldChange}
              error={errors.religion}
              inputProps={{ maxLength: 100 }}
            />

            <MedidasSelectField
              label="Idioma"
              name="idioma"
              value={form.idioma}
              options={IDIOMA_OPTIONS}
              valueKey="value"
              labelKey="label"
              onChange={onFieldChange}
              error={errors.idioma}
            />

            <MedidasSelectField
              label="Habla lengua indígena"
              name="habla_lengua_indigena"
              value={form.habla_lengua_indigena}
              options={YES_NO_OPTIONS}
              valueKey="value"
              labelKey="label"
              onChange={onFieldChange}
              error={errors.habla_lengua_indigena}
            />

            {hablaLenguaIndigena ? (
              <MedidasSelectField
                label="Tipo de lengua indígena"
                name="tipo_lengua_indigena"
                value={form.tipo_lengua_indigena}
                options={LENGUA_INDIGENA_OPTIONS}
                valueKey="value"
                labelKey="label"
                onChange={onFieldChange}
                error={errors.tipo_lengua_indigena}
              />
            ) : null}
          </Box>
        </SectionCard>
      </Box>
    </Box>
  );
}

function SectionHeader({ title, description }) {
  return (
    <Box sx={{ mb: { xs: 2.4, md: 3 } }}>
      <Typography
        component="h2"
        sx={{
          m: 0,
          fontFamily: "Noto Sans, sans-serif",
          fontWeight: 950,
          color: "#611232",
          fontSize: { xs: "1.55rem", md: "2rem" },
          letterSpacing: "-0.045em",
          lineHeight: 1.08,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          mt: 0.75,
          maxWidth: 760,
          fontFamily: "Noto Sans, sans-serif",
          color: "#64748b",
          fontWeight: 650,
          lineHeight: 1.55,
          fontSize: "0.92rem",
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}

function SectionCard({ title, description, children }) {
  return (
    <Box
      component="section"
      sx={{
        height: "100%",
        borderRadius: { xs: "20px", md: "24px" },
        backgroundColor: "#ffffff",
        border: "1px solid rgba(152,152,154,0.16)",
        boxShadow: "0 10px 26px rgba(19,50,46,0.04)",
        p: { xs: 2, md: 2.35 },
        transition:
          "border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease",
        "&:hover": {
          transform: "translateY(-1px)",
          borderColor: "rgba(188,149,92,0.24)",
          boxShadow: "0 14px 32px rgba(19,50,46,0.055)",
        },
      }}
    >
      <Box sx={{ mb: 2.1 }}>
        <Typography
          component="h3"
          sx={{
            m: 0,
            fontFamily: "Noto Sans, sans-serif",
            color: "#13322e",
            fontWeight: 950,
            fontSize: { xs: "1rem", md: "1.1rem" },
            lineHeight: 1.2,
            letterSpacing: "-0.025em",
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            mt: 0.45,
            fontFamily: "Noto Sans, sans-serif",
            color: "#64748b",
            fontWeight: 600,
            fontSize: "0.82rem",
            lineHeight: 1.45,
          }}
        >
          {description}
        </Typography>
      </Box>

      {children}
    </Box>
  );
}

ImpresionDiagnosticaForm.propTypes = {
  form: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  onFieldChange: PropTypes.func.isRequired,
};

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

SectionCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
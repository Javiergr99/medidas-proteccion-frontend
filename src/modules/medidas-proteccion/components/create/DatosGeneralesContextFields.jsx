import PropTypes from "prop-types";

import {
  CALIDAD_MIGRATORIA_OPTIONS,
  DOCUMENTO_IDENTIFICACION_OPTIONS,
  PARENTESCO_OPTIONS,
  TIPO_IDENTIFICACION_OPTIONS,
  YES_NO_OPTIONS,
} from "../../constants/medidasCreate.constants";
import { MedidasSelectField, MedidasTextField } from "./MedidasFormControls";

export default function DatosGeneralesContextFields({
  form,
  errors,
  catalogos,
  onFieldChange,
}) {
  const tieneDocumentoIdentificacion =
    Boolean(form.documento_identificacion) &&
    form.documento_identificacion !== "sin_documento";

  const estaAcompanado = form.acompanado === "si";

  return (
    <>
      <MedidasSelectField
        label="Asignación de expediente"
        name="asignacion_expediente"
        value={form.asignacion_expediente}
        options={YES_NO_OPTIONS}
        valueKey="value"
        labelKey="label"
        onChange={onFieldChange}
        error={errors.asignacion_expediente}
      />

      <MedidasSelectField
        label="Lugar de apertura"
        name="lugar_apertura"
        value={form.lugar_apertura}
        options={catalogos.entidad_federativa}
        valueKey="descripcion"
        labelKey="descripcion"
        onChange={onFieldChange}
        error={errors.lugar_apertura}
      />

      <MedidasTextField
        label="Región de origen"
        name="region_origen"
        value={form.region_origen}
        onChange={onFieldChange}
        error={errors.region_origen}
        inputProps={{ maxLength: 100 }}
      />

      <MedidasTextField
        label="País de residencia"
        name="pais_residencia"
        value={form.pais_residencia}
        onChange={onFieldChange}
        error={errors.pais_residencia}
        inputProps={{ maxLength: 100 }}
      />

      <MedidasSelectField
        label="Documento de identificación"
        name="documento_identificacion"
        value={form.documento_identificacion}
        options={DOCUMENTO_IDENTIFICACION_OPTIONS}
        valueKey="value"
        labelKey="label"
        onChange={onFieldChange}
        error={errors.documento_identificacion}
      />

      {tieneDocumentoIdentificacion ? (
        <MedidasSelectField
          label="Tipo de identificación"
          name="tipo_identificacion"
          value={form.tipo_identificacion}
          options={TIPO_IDENTIFICACION_OPTIONS}
          valueKey="value"
          labelKey="label"
          onChange={onFieldChange}
          error={errors.tipo_identificacion}
        />
      ) : null}

      <MedidasSelectField
        label="Calidad migratoria"
        name="calidad_migratoria"
        value={form.calidad_migratoria}
        options={CALIDAD_MIGRATORIA_OPTIONS}
        valueKey="value"
        labelKey="label"
        onChange={onFieldChange}
        error={errors.calidad_migratoria}
      />

      <MedidasSelectField
        label="Acompañado"
        name="acompanado"
        value={form.acompanado}
        options={YES_NO_OPTIONS}
        valueKey="value"
        labelKey="label"
        onChange={onFieldChange}
        error={errors.acompanado}
      />

      {estaAcompanado ? (
        <MedidasSelectField
          label="Parentesco del acompañante"
          name="parentesco_acompanante"
          value={form.parentesco_acompanante}
          options={PARENTESCO_OPTIONS}
          valueKey="value"
          labelKey="label"
          onChange={onFieldChange}
          error={errors.parentesco_acompanante}
        />
      ) : null}
    </>
  );
}

DatosGeneralesContextFields.propTypes = {
  form: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  catalogos: PropTypes.shape({
    entidad_federativa: PropTypes.array.isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
};
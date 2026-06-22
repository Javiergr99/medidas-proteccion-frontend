import PropTypes from "prop-types";

import {
  MedidasDateField,
  MedidasSelectField,
  MedidasTextField,
} from "./MedidasFormControls";
import { YES_NO_OPTIONS } from "../../constants/medidasCreate.constants";

function getSiNoValue(value) {
  if (value === "" || value === null || value === undefined) {
    return "";
  }

  if (value === true || value === "true" || value === "si") {
    return "si";
  }

  if (value === false || value === "false" || value === "no") {
    return "no";
  }

  return "";
}

export default function DatosGeneralesIdentityFields({
  form,
  errors,
  catalogos,
  onFieldChange,
}) {
  const cuentaConCurpValue = getSiNoValue(form.cuenta_con_curp);
  const cuentaConCurp = cuentaConCurpValue === "si";

  return (
    <>
      <MedidasTextField
        label="Número de expediente"
        name="numero_expediente"
        value={form.numero_expediente}
        onChange={onFieldChange}
        error={errors.numero_expediente}
        inputProps={{ maxLength: 100 }}
      />

      <MedidasTextField
        label="Nombre"
        name="nombre"
        value={form.nombre}
        onChange={onFieldChange}
        error={errors.nombre}
        inputProps={{ maxLength: 50 }}
      />

      <MedidasTextField
        label="Primer apellido"
        name="primer_apellido"
        value={form.primer_apellido}
        onChange={onFieldChange}
        error={errors.primer_apellido}
        inputProps={{ maxLength: 50 }}
      />

      <MedidasTextField
        label="Segundo apellido"
        name="segundo_apellido"
        value={form.segundo_apellido}
        onChange={onFieldChange}
        error={errors.segundo_apellido}
        inputProps={{ maxLength: 50 }}
      />

      <MedidasDateField
        label="Fecha de nacimiento"
        name="fecha_nacimiento"
        value={form.fecha_nacimiento}
        onChange={onFieldChange}
        error={errors.fecha_nacimiento}
      />

      <MedidasTextField
        label="Edad"
        name="edad"
        value={form.edad}
        onChange={onFieldChange}
        error={errors.edad}
        helperText="Se calcula automáticamente si capturas la fecha de nacimiento."
      />

      <MedidasSelectField
        label="Sexo"
        name="sexo_id"
        value={form.sexo_id}
        options={catalogos.sexo}
        onChange={onFieldChange}
        error={errors.sexo_id}
      />

      <MedidasSelectField
        label="Cuenta con CURP"
        name="cuenta_con_curp"
        value={cuentaConCurpValue}
        options={YES_NO_OPTIONS}
        valueKey="value"
        labelKey="label"
        onChange={onFieldChange}
        error={errors.cuenta_con_curp}
      />

      {cuentaConCurp ? (
        <MedidasTextField
          label="CURP"
          name="curp"
          value={form.curp}
          onChange={onFieldChange}
          error={errors.curp}
          inputProps={{ maxLength: 18 }}
        />
      ) : null}
    </>
  );
}

DatosGeneralesIdentityFields.propTypes = {
  form: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  catalogos: PropTypes.shape({
    sexo: PropTypes.array.isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
};
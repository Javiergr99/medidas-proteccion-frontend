import PropTypes from "prop-types";

import { MedidasSelectField, MedidasTextField } from "./MedidasFormControls";

export default function MediaFiliacionFields({
  form,
  errors,
  catalogos,
  onFieldChange,
}) {
  return (
    <>
      <MedidasTextField
        label="Estatura en centímetros"
        name="estatura"
        value={form.estatura}
        onChange={onFieldChange}
        error={errors.estatura}
        inputProps={{
          inputMode: "numeric",
          maxLength: 3,
        }}
      />

      <MedidasSelectField
        label="Complexión"
        name="complexion_id"
        value={form.complexion_id}
        options={catalogos.complexion}
        onChange={onFieldChange}
        error={errors.complexion_id}
      />

      <MedidasSelectField
        label="Tez"
        name="tez_id"
        value={form.tez_id}
        options={catalogos.tez}
        onChange={onFieldChange}
        error={errors.tez_id}
      />

      <MedidasSelectField
        label="Color de cabello"
        name="color_cabello_id"
        value={form.color_cabello_id}
        options={catalogos.color_cabello}
        onChange={onFieldChange}
        error={errors.color_cabello_id}
      />

      <MedidasSelectField
        label="Largo de cabello"
        name="largo_cabello_id"
        value={form.largo_cabello_id}
        options={catalogos.largo_cabello}
        onChange={onFieldChange}
        error={errors.largo_cabello_id}
      />

      <MedidasSelectField
        label="Tipo de cabello"
        name="tipo_cabello_id"
        value={form.tipo_cabello_id}
        options={catalogos.tipo_cabello}
        onChange={onFieldChange}
        error={errors.tipo_cabello_id}
      />

      <MedidasSelectField
        label="Color de ojos"
        name="color_ojos_id"
        value={form.color_ojos_id}
        options={catalogos.color_ojos}
        onChange={onFieldChange}
        error={errors.color_ojos_id}
      />

      <MedidasSelectField
        label="Tipo de ojos"
        name="tipo_ojos_id"
        value={form.tipo_ojos_id}
        options={catalogos.tipo_ojos}
        onChange={onFieldChange}
        error={errors.tipo_ojos_id}
      />

      <MedidasTextField
        label="Señas particulares"
        name="senas_particulares"
        value={form.senas_particulares}
        onChange={onFieldChange}
        error={errors.senas_particulares}
        inputProps={{ maxLength: 255 }}
      />
    </>
  );
}

MediaFiliacionFields.propTypes = {
  form: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  catalogos: PropTypes.shape({
    complexion: PropTypes.array.isRequired,
    tez: PropTypes.array.isRequired,
    color_cabello: PropTypes.array.isRequired,
    largo_cabello: PropTypes.array.isRequired,
    tipo_cabello: PropTypes.array.isRequired,
    color_ojos: PropTypes.array.isRequired,
    tipo_ojos: PropTypes.array.isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
};
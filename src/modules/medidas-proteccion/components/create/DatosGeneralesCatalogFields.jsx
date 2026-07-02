import PropTypes from "prop-types";

import { MedidasSelectField, MedidasTextField } from "./MedidasFormControls";

function getCatalogItemById(options, value) {
  if (!Array.isArray(options)) return null;

  return options.find((option) => String(option.id) === String(value)) || null;
}

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function isCatalogYesOption(options, value) {
  const selectedOption = getCatalogItemById(options, value);
  return normalizeText(selectedOption?.descripcion) === "si";
}

export default function DatosGeneralesCatalogFields({
  form,
  errors,
  catalogos,
  onFieldChange,
}) {
  const selectedNacionalidad = getCatalogItemById(
    catalogos.nacionalidad,
    form.nacionalidad_id
  );

  const selectedEscolaridad = getCatalogItemById(
    catalogos.escolaridad,
    form.escolaridad_id
  );

  const isMexicana = selectedNacionalidad?.es_mexicana === true;

  const escolaridadRequiereEspecificacion =
    selectedEscolaridad?.requiere_especificacion === true;

  const tienePertenenciaIndigena = isCatalogYesOption(
    catalogos.opcion_respuesta,
    form.pertenencia_indigena_id
  );

  return (
    <>
      <MedidasSelectField
        label="Nacionalidad"
        name="nacionalidad_id"
        value={form.nacionalidad_id}
        options={catalogos.nacionalidad}
        onChange={onFieldChange}
        error={errors.nacionalidad_id}
      />

      {isMexicana ? (
        <MedidasSelectField
          label="Entidad federativa de nacimiento"
          name="entidad_federativa_id"
          value={form.entidad_federativa_id}
          options={catalogos.entidad_federativa}
          onChange={onFieldChange}
          error={errors.entidad_federativa_id}
        />
      ) : (
        <MedidasTextField
          label="Lugar / país de nacimiento"
          name="lugar_nacimiento"
          value={form.lugar_nacimiento}
          onChange={onFieldChange}
          error={errors.lugar_nacimiento}
          inputProps={{ maxLength: 100 }}
        />
      )}

      <MedidasSelectField
        label="Escolaridad"
        name="escolaridad_id"
        value={form.escolaridad_id}
        options={catalogos.escolaridad}
        onChange={onFieldChange}
        error={errors.escolaridad_id}
      />

      {escolaridadRequiereEspecificacion ? (
        <MedidasTextField
          label="Especificación de escolaridad"
          name="especificacion_escolaridad"
          value={form.especificacion_escolaridad}
          onChange={onFieldChange}
          error={errors.especificacion_escolaridad}
          inputProps={{ maxLength: 120 }}
        />
      ) : null}

      <MedidasSelectField
        label="Afrodescendiente o afromexicana(o)"
        name="afrodescendencia_id"
        value={form.afrodescendencia_id}
        options={catalogos.opcion_respuesta}
        onChange={onFieldChange}
        error={errors.afrodescendencia_id}
      />

      <MedidasSelectField
        label="Tiene pertenencia indígena"
        name="pertenencia_indigena_id"
        value={form.pertenencia_indigena_id}
        options={catalogos.opcion_respuesta}
        onChange={onFieldChange}
        error={errors.pertenencia_indigena_id}
      />

      {tienePertenenciaIndigena ? (
        <MedidasSelectField
          label="Pertenencia indígena específica"
          name="pertenencia_indigena_especifica_id"
          value={form.pertenencia_indigena_especifica_id}
          options={catalogos.pertenencia_indigena}
          onChange={onFieldChange}
          error={errors.pertenencia_indigena_especifica_id}
        />
      ) : null}

      <MedidasSelectField
        label="Vivió situación de calle"
        name="id_situacion_calle"
        value={form.id_situacion_calle}
        options={catalogos.opcion_respuesta}
        onChange={onFieldChange}
        error={errors.id_situacion_calle}
      />

      <MedidasSelectField
        label="Reclutamiento por delincuencia organizada"
        name="id_reclutamiento_delincuencia"
        value={form.id_reclutamiento_delincuencia}
        options={catalogos.opcion_respuesta}
        onChange={onFieldChange}
        error={errors.id_reclutamiento_delincuencia}
      />
    </>
  );
}

DatosGeneralesCatalogFields.propTypes = {
  form: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  catalogos: PropTypes.shape({
    nacionalidad: PropTypes.array.isRequired,
    entidad_federativa: PropTypes.array.isRequired,
    escolaridad: PropTypes.array.isRequired,
    opcion_respuesta: PropTypes.array.isRequired,
    pertenencia_indigena: PropTypes.array.isRequired,
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
};
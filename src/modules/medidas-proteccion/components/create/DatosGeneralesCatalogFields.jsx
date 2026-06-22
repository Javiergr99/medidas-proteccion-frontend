import PropTypes from "prop-types";

import { MedidasSelectField, MedidasTextField } from "./MedidasFormControls";

function getCatalogItemById(options, value) {
  if (!Array.isArray(options)) return null;

  return (
    options.find((option) => String(option.id) === String(value)) || null
  );
}

function RequiresSpecificationNotice({ children }) {
  return (
    <div
      style={{
        gridColumn: "1 / -1",
        border: "1px solid rgba(188,149,92,0.28)",
        borderRadius: 14,
        background: "rgba(221,201,163,0.16)",
        color: "#735827",
        fontFamily: "Noto Sans, sans-serif",
        fontSize: "0.82rem",
        fontWeight: 700,
        lineHeight: 1.5,
        padding: "11px 13px",
      }}
    >
      {children}
    </div>
  );
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
          name="lugar_nacimiento"
          value={form.lugar_nacimiento}
          options={catalogos.entidad_federativa}
          valueKey="descripcion"
          labelKey="descripcion"
          onChange={onFieldChange}
          error={errors.lugar_nacimiento}
        />
      ) : (
        <MedidasTextField
          label="Lugar / país de nacimiento"
          name="lugar_nacimiento"
          value={form.lugar_nacimiento}
          onChange={onFieldChange}
          error={errors.lugar_nacimiento}
          inputProps={{ maxLength: 50 }}
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
        <RequiresSpecificationNotice>
          La escolaridad seleccionada requiere especificación. El backend aún no
          recibe una variable para guardar esa especificación en Datos Generales,
          por lo que no se habilita un campo adicional hasta que se confirme el
          contrato.
        </RequiresSpecificationNotice>
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
  }).isRequired,
  onFieldChange: PropTypes.func.isRequired,
};

RequiresSpecificationNotice.propTypes = {
  children: PropTypes.node.isRequired,
};
export const NNA_VERIFICATION_STATUS = {
  IDLE: "idle",
  VERIFYING: "verifying",
  AVAILABLE: "available",
  EXISTING: "existing",
  BLOCKED: "blocked",
  ERROR: "error",
};

export function normalizeCurp(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 18);
}

function toStringOrEmpty(value, fallback = "") {
  if (value === null || value === undefined) {
    return fallback || "";
  }

  return String(value);
}

function toSiNoOrEmpty(value, fallback = "") {
  if (value === true || value === "true" || value === "si") {
    return "si";
  }

  if (value === false || value === "false" || value === "no") {
    return "no";
  }

  return fallback || "";
}

function getCatalogItemById(options, value) {
  if (!Array.isArray(options)) return null;

  return options.find((option) => String(option.id) === String(value)) || null;
}

function getCategoriaIdFromSubtipo({ catalogos, subtipoId, fallback = "" }) {
  const selectedSubtipo = getCatalogItemById(
    catalogos?.subtipo_discapacidad,
    subtipoId
  );

  return selectedSubtipo?.categoria_id || fallback || "";
}

function normalizeDiscapacidadesFromNna({ nna, catalogos }) {
  const discapacidades = Array.isArray(nna?.discapacidades)
    ? nna.discapacidades
    : [];

  return discapacidades.map((item) => {
    const subtipoId =
      item.subtipo_discapacidad_id ||
      item.subtipo_id ||
      item.id_subtipo ||
      "";

    const severidadId =
      item.severidad_discapacidad_id ||
      item.severidad_id ||
      item.id_severidad ||
      "";

    const categoriaId =
      item.categoria_discapacidad_id ||
      item.categoria_id ||
      getCategoriaIdFromSubtipo({
        catalogos,
        subtipoId,
      });

    const selectedSubtipo = getCatalogItemById(
      catalogos?.subtipo_discapacidad,
      subtipoId
    );

    return {
      categoria_discapacidad_id: toStringOrEmpty(categoriaId),
      subtipo_discapacidad_id: toStringOrEmpty(subtipoId),
      severidad_discapacidad_id: toStringOrEmpty(severidadId),
      especifique_otros: item.especifique_otros || "",
      requiere_especificacion:
        selectedSubtipo?.requiere_especificacion === true,
    };
  });
}

function getTieneDiscapacidadValue({ nna, currentForm }) {
  if (Array.isArray(nna?.discapacidades) && nna.discapacidades.length > 0) {
    return "si";
  }

  if (nna?.tiene_discapacidad === true) {
    return "si";
  }

  if (nna?.tiene_discapacidad === false) {
    return "no";
  }

  return currentForm.tiene_discapacidad || "";
}

export function buildDatosGeneralesFromVerifiedNna({
  currentForm,
  nna,
  catalogos = {},
}) {
  if (!nna) {
    return currentForm;
  }

  const especificaciones = nna.especificaciones || {};
  const mediaFiliacion = nna.media_filiacion || {};
  const discapacidades = normalizeDiscapacidadesFromNna({
    nna,
    catalogos,
  });

  return {
    ...currentForm,

    nna_id: nna.id_nna || currentForm.nna_id || "",

    nombre: nna.nombre || currentForm.nombre || "",
    primer_apellido:
      nna.primer_apellido || currentForm.primer_apellido || "",
    segundo_apellido:
      nna.segundo_apellido || currentForm.segundo_apellido || "",

    fecha_nacimiento:
      nna.fecha_nacimiento || currentForm.fecha_nacimiento || "",

    edad:
      nna.edad !== null && nna.edad !== undefined
        ? String(nna.edad)
        : currentForm.edad || "",

    sexo_id: toStringOrEmpty(nna.sexo_id, currentForm.sexo_id),

    lugar_nacimiento:
      nna.lugar_nacimiento || currentForm.lugar_nacimiento || "",

    cuenta_con_curp: toSiNoOrEmpty(
      nna.cuenta_con_curp,
      currentForm.cuenta_con_curp
    ),

    curp: nna.curp || currentForm.curp || "",

    nacionalidad_id: toStringOrEmpty(
      nna.nacionalidad_id,
      currentForm.nacionalidad_id
    ),

    escolaridad_id: toStringOrEmpty(
      nna.escolaridad_id,
      currentForm.escolaridad_id
    ),

    afrodescendencia_id: toStringOrEmpty(
      nna.es_afrodescendiente_id,
      currentForm.afrodescendencia_id
    ),

    pertenencia_indigena_id: toStringOrEmpty(
      nna.tiene_pertenencia_indigena_id,
      currentForm.pertenencia_indigena_id
    ),

    id_situacion_calle: toStringOrEmpty(
      nna.situacion_calle_id,
      currentForm.id_situacion_calle
    ),

    id_reclutamiento_delincuencia: toStringOrEmpty(
      nna.delincuencia_organizada_id,
      currentForm.id_reclutamiento_delincuencia
    ),

    entidad_federativa_id: toStringOrEmpty(
      especificaciones.entidad_federativa_id,
      currentForm.entidad_federativa_id
    ),

    especificacion_escolaridad:
      especificaciones.especificacion_escolaridad ||
      currentForm.especificacion_escolaridad ||
      "",

    pertenencia_indigena_especifica_id: toStringOrEmpty(
      especificaciones.pertenencia_indigena_id ||
        especificaciones.pertenencia_indigena_especifica_id,
      currentForm.pertenencia_indigena_especifica_id
    ),

    tiene_discapacidad: getTieneDiscapacidadValue({
      nna,
      currentForm,
    }),

    discapacidades,

    estatura: toStringOrEmpty(
      mediaFiliacion.estatura,
      currentForm.estatura
    ),

    senas_particulares:
      mediaFiliacion.senas_particulares ||
      currentForm.senas_particulares ||
      "",

    complexion_id: toStringOrEmpty(
      mediaFiliacion.complexion_id,
      currentForm.complexion_id
    ),

    tez_id: toStringOrEmpty(mediaFiliacion.tez_id, currentForm.tez_id),

    color_cabello_id: toStringOrEmpty(
      mediaFiliacion.color_cabello_id,
      currentForm.color_cabello_id
    ),

    largo_cabello_id: toStringOrEmpty(
      mediaFiliacion.largo_cabello_id,
      currentForm.largo_cabello_id
    ),

    tipo_cabello_id: toStringOrEmpty(
      mediaFiliacion.tipo_cabello_id,
      currentForm.tipo_cabello_id
    ),

    color_ojos_id: toStringOrEmpty(
      mediaFiliacion.color_ojos_id,
      currentForm.color_ojos_id
    ),

    tipo_ojos_id: toStringOrEmpty(
      mediaFiliacion.tipo_ojos_id,
      currentForm.tipo_ojos_id
    ),
  };
}

export function buildDatosGeneralesFromVerificationPayload({
  currentForm,
  payload,
}) {
  if (!payload) {
    return currentForm;
  }

  if (payload.curp) {
    return {
      ...currentForm,
      cuenta_con_curp: "si",
      curp: normalizeCurp(payload.curp),
    };
  }

  return {
    ...currentForm,
    nombre: payload.nombre || currentForm.nombre || "",
    primer_apellido:
      payload.primerApellido || currentForm.primer_apellido || "",
    fecha_nacimiento:
      payload.fechaNacimiento || currentForm.fecha_nacimiento || "",
    sexo_id: payload.sexoId || currentForm.sexo_id || "",
  };
}

export function getVerificationSuccessMessage(response) {
  if (response?.mensaje) {
    return response.mensaje;
  }

  if (response?.existe) {
    return "El NNA existe en otros registros. Se autocompletarán los datos disponibles.";
  }

  return "El NNA no existe en el sistema. Puedes continuar con la captura.";
}
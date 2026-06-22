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

export function buildDatosGeneralesFromVerifiedNna({ currentForm, nna }) {
  if (!nna) {
    return currentForm;
  }

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
    sexo_id: nna.sexo_id || currentForm.sexo_id || "",
    lugar_nacimiento:
      nna.lugar_nacimiento || currentForm.lugar_nacimiento || "",
    cuenta_con_curp: nna.cuenta_con_curp ? "si" : "no",
    curp: nna.curp || currentForm.curp || "",
    nacionalidad_id: nna.nacionalidad_id || currentForm.nacionalidad_id || "",
    escolaridad_id: nna.escolaridad_id || currentForm.escolaridad_id || "",
    afrodescendencia_id:
      nna.es_afrodescendiente_id || currentForm.afrodescendencia_id || "",
    pertenencia_indigena_id:
      nna.tiene_pertenencia_indigena_id ||
      currentForm.pertenencia_indigena_id ||
      "",
    id_situacion_calle:
      nna.situacion_calle_id || currentForm.id_situacion_calle || "",
    id_reclutamiento_delincuencia:
      nna.delincuencia_organizada_id ||
      currentForm.id_reclutamiento_delincuencia ||
      "",
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
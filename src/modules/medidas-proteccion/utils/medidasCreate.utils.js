import dayjs from "dayjs";

import {
  INITIAL_MEDIDAS_CREATE_FORMS,
  MEDIDAS_CREATE_SECTIONS,
} from "../constants/medidasCreate.constants";

export function getInitialMedidasCreateForms() {
  return {
    datos_generales: {
      ...INITIAL_MEDIDAS_CREATE_FORMS.datos_generales,
    },
    impresion_diagnostica: {
      ...INITIAL_MEDIDAS_CREATE_FORMS.impresion_diagnostica,
    },
    intervencion_multidisciplinaria: {
      ...INITIAL_MEDIDAS_CREATE_FORMS.intervencion_multidisciplinaria,
      detalles_diagnosticos: [],
    },
  };
}

export function getUserDisplayName(user) {
  const fullName = [
    user?.nombre,
    user?.primer_apellido,
    user?.segundo_apellido,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    user?.nombre_completo ||
    user?.nombreCompleto ||
    fullName ||
    user?.name ||
    user?.correo_electronico ||
    user?.email ||
    "Usuario"
  );
}

export function calculateAgeFromBirthDate(value) {
  if (!value) return "";

  const birthDate = dayjs(value);
  const today = dayjs();

  if (!birthDate.isValid() || birthDate.isAfter(today, "day")) {
    return "";
  }

  return String(today.diff(birthDate, "year"));
}

export function hasCuentaConCurp(value) {
  return value === true || value === "true" || value === "si";
}

export function hasDocumentoIdentificacion(value) {
  return Boolean(value) && value !== "sin_documento";
}

export function isAcompanado(value) {
  return value === "si";
}

export function normalizeDatosGeneralesFieldValue(name, value) {
  if (name === "curp") {
    return String(value || "")
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .slice(0, 18);
  }

  if (
    [
      "nombre",
      "primer_apellido",
      "segundo_apellido",
      "region_origen",
      "numero_expediente",
    ].includes(name)
  ) {
    return String(value || "").toUpperCase();
  }

  if (name === "edad") {
    return String(value || "").replace(/\D/g, "").slice(0, 3);
  }

  return value;
}

export function normalizeImpresionDiagnosticaFieldValue(name, value) {
  if (["religion", "tipo_enfermedad"].includes(name)) {
    return String(value || "").toUpperCase();
  }

  return value;
}

export function normalizeIntervencionMultidisciplinariaFieldValue(name, value) {
  if (
    [
      "otro_lugar_intervencion",
      "asesoria_legal_servidor_publico",
      "representacion_juridica_servidor_publico",
    ].includes(name)
  ) {
    return String(value || "").toUpperCase();
  }

  return value;
}

export function buildNextDatosGeneralesForm({ previousForm, name, value }) {
  const nextForm = {
    ...previousForm,
    [name]: value,
  };

  if (name === "fecha_nacimiento") {
    nextForm.edad = calculateAgeFromBirthDate(value);
  }

  if (name === "nacionalidad_id") {
    nextForm.lugar_nacimiento = "";
  }

  if (name === "cuenta_con_curp" && !hasCuentaConCurp(value)) {
    nextForm.curp = "";
  }

  if (
    name === "documento_identificacion" &&
    !hasDocumentoIdentificacion(value)
  ) {
    nextForm.tipo_identificacion = "";
  }

  if (name === "acompanado" && !isAcompanado(value)) {
    nextForm.parentesco_acompanante = "";
  }

  return nextForm;
}

export function buildNextImpresionDiagnosticaForm({
  previousForm,
  name,
  value,
}) {
  const nextForm = {
    ...previousForm,
    [name]: value,
  };

  if (name === "enfermedad_cronica" && value !== "si") {
    nextForm.tipo_enfermedad = "";
  }

  if (name === "habla_lengua_indigena" && value !== "si") {
    nextForm.tipo_lengua_indigena = "";
  }

  return nextForm;
}

export function buildNextIntervencionMultidisciplinariaForm({
  previousForm,
  name,
  value,
}) {
  const nextForm = {
    ...previousForm,
    [name]: value,
  };

  if (name === "lugar_intervencion" && value !== "Otras") {
    nextForm.otro_lugar_intervencion = "";
  }

  if (name === "diagnostico_elaborado" && value !== "si") {
    nextForm.detalles_diagnosticos = [];
  }

  if (name === "asesoria_legal" && value !== "si") {
    nextForm.asesoria_legal_servidor_publico = "";
    nextForm.asesoria_legal_fecha = "";
  }

  if (name === "representacion_juridica" && value !== "si") {
    nextForm.representacion_juridica_servidor_publico = "";
    nextForm.representacion_juridica_fecha = "";
  }

  return nextForm;
}

export function validateDatosGenerales(form) {
  const errors = {};

  if (!String(form.numero_expediente || "").trim()) {
    errors.numero_expediente = "Captura el número de expediente.";
  }

  if (!String(form.nombre || "").trim()) {
    errors.nombre = "Captura el nombre.";
  }

  if (!String(form.primer_apellido || "").trim()) {
    errors.primer_apellido = "Captura el primer apellido.";
  }

  if (!String(form.edad || "").trim()) {
    errors.edad = "Captura la edad.";
  }

  if (form.fecha_nacimiento) {
    const birthDate = dayjs(form.fecha_nacimiento);

    if (!birthDate.isValid()) {
      errors.fecha_nacimiento = "La fecha no es válida.";
    }

    if (birthDate.isAfter(dayjs(), "day")) {
      errors.fecha_nacimiento = "No se permiten fechas futuras.";
    }
  }

  if (
    hasCuentaConCurp(form.cuenta_con_curp) &&
    !String(form.curp || "").trim()
  ) {
    errors.curp = "Captura la CURP.";
  }

  if (form.curp && form.curp.length !== 18) {
    errors.curp = "La CURP debe tener 18 caracteres.";
  }

  if (
    hasDocumentoIdentificacion(form.documento_identificacion) &&
    !form.tipo_identificacion
  ) {
    errors.tipo_identificacion = "Selecciona el tipo de identificación.";
  }

  if (isAcompanado(form.acompanado) && !form.parentesco_acompanante) {
    errors.parentesco_acompanante =
      "Selecciona el parentesco del acompañante.";
  }

  return errors;
}

export function validateImpresionDiagnostica(form) {
  const errors = {};

  if (
    form.enfermedad_cronica === "si" &&
    !String(form.tipo_enfermedad || "").trim()
  ) {
    errors.tipo_enfermedad = "Especifica el tipo de enfermedad.";
  }

  if (
    form.habla_lengua_indigena === "si" &&
    !String(form.tipo_lengua_indigena || "").trim()
  ) {
    errors.tipo_lengua_indigena = "Selecciona la lengua indígena.";
  }

  return errors;
}

export function validateIntervencionMultidisciplinaria(form) {
  const errors = {};

  if (
    form.lugar_intervencion === "Otras" &&
    !String(form.otro_lugar_intervencion || "").trim()
  ) {
    errors.otro_lugar_intervencion =
      "Especifica el otro lugar de intervención.";
  }

  if (form.diagnostico_elaborado === "si") {
    if (!form.detalles_diagnosticos.length) {
      errors.detalles_diagnosticos =
        "Agrega al menos un detalle de diagnóstico.";
    } else {
      const hasInvalidDetail = form.detalles_diagnosticos.some((item) => {
        return !item.tipo_diagnostico || !item.fecha_diagnostico;
      });

      if (hasInvalidDetail) {
        errors.detalles_diagnosticos =
          "Cada diagnóstico debe tener tipo y fecha.";
      }
    }
  }

  if (form.asesoria_legal === "si") {
    if (!String(form.asesoria_legal_servidor_publico || "").trim()) {
      errors.asesoria_legal_servidor_publico =
        "Captura el servidor público de asesoría legal.";
    }

    if (!form.asesoria_legal_fecha) {
      errors.asesoria_legal_fecha = "Captura la fecha de asesoría legal.";
    }
  }

  if (form.representacion_juridica === "si") {
    if (!String(form.representacion_juridica_servidor_publico || "").trim()) {
      errors.representacion_juridica_servidor_publico =
        "Captura el servidor público de representación jurídica.";
    }

    if (!form.representacion_juridica_fecha) {
      errors.representacion_juridica_fecha =
        "Captura la fecha de representación jurídica.";
    }
  }

  return errors;
}

function toNumberOrNull(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const numberValue = Number(value);

  return Number.isNaN(numberValue) ? null : numberValue;
}

function toStringOrNull(value) {
  const cleanValue = String(value || "").trim();
  return cleanValue || null;
}

function toBooleanFromSiNo(value) {
  return value === "si" || value === true || value === "true";
}

function toNullableBooleanFromSiNo(value) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  return toBooleanFromSiNo(value);
}

export function buildDatosGeneralesPayload(form) {
  const cuentaConCurp = hasCuentaConCurp(form.cuenta_con_curp);

  const tieneDocumento = hasDocumentoIdentificacion(
    form.documento_identificacion
  );

  const estaAcompanado = isAcompanado(form.acompanado);

  return {
    nna_id: toStringOrNull(form.nna_id),

    nombre: String(form.nombre || "").trim(),
    primer_apellido: String(form.primer_apellido || "").trim(),
    segundo_apellido: toStringOrNull(form.segundo_apellido),
    fecha_nacimiento: toStringOrNull(form.fecha_nacimiento),
    lugar_nacimiento: toStringOrNull(form.lugar_nacimiento),

    cuenta_con_curp: toNullableBooleanFromSiNo(form.cuenta_con_curp),
    curp: cuentaConCurp ? toStringOrNull(form.curp) : null,

    sexo_id: toNumberOrNull(form.sexo_id),
    escolaridad_id: toNumberOrNull(form.escolaridad_id),
    nacionalidad_id: toNumberOrNull(form.nacionalidad_id),
    afrodescendencia_id: toNumberOrNull(form.afrodescendencia_id),
    pertenencia_indigena_id: toNumberOrNull(form.pertenencia_indigena_id),

    complexion_id: toNumberOrNull(form.complexion_id),
    tez_id: toNumberOrNull(form.tez_id),
    color_cabello_id: toNumberOrNull(form.color_cabello_id),
    largo_cabello_id: toNumberOrNull(form.largo_cabello_id),
    tipo_cabello_id: toNumberOrNull(form.tipo_cabello_id),
    color_ojos_id: toNumberOrNull(form.color_ojos_id),
    tipo_ojos_id: toNumberOrNull(form.tipo_ojos_id),

    id_situacion_calle: toNumberOrNull(form.id_situacion_calle),
    id_reclutamiento_delincuencia: toNumberOrNull(
      form.id_reclutamiento_delincuencia
    ),

    numero_expediente: String(form.numero_expediente || "").trim(),
    edad: Number(form.edad),

    asignacion_expediente: toStringOrNull(form.asignacion_expediente),
    lugar_apertura: toStringOrNull(form.lugar_apertura),
    region_origen: toStringOrNull(form.region_origen),
    pais_residencia: toStringOrNull(form.pais_residencia),

    documento_identificacion: toStringOrNull(form.documento_identificacion),
    tipo_identificacion: tieneDocumento
      ? toStringOrNull(form.tipo_identificacion)
      : null,

    calidad_migratoria: toStringOrNull(form.calidad_migratoria),

    acompanado: toStringOrNull(form.acompanado),
    parentesco_acompanante: estaAcompanado
      ? toStringOrNull(form.parentesco_acompanante)
      : null,
  };
}

export function buildImpresionDiagnosticaPayload(form) {
  const enfermedadCronica = toNullableBooleanFromSiNo(
    form.enfermedad_cronica
  );

  const hablaLenguaIndigena = toNullableBooleanFromSiNo(
    form.habla_lengua_indigena
  );

  return {
    enfermedad_cronica: enfermedadCronica,
    tipo_enfermedad:
      enfermedadCronica === true
        ? toStringOrNull(form.tipo_enfermedad)
        : null,

    religion: toStringOrNull(form.religion),
    idioma: toStringOrNull(form.idioma),

    habla_lengua_indigena: hablaLenguaIndigena,
    tipo_lengua_indigena:
      hablaLenguaIndigena === true
        ? toStringOrNull(form.tipo_lengua_indigena)
        : null,
  };
}

export function buildIntervencionMultidisciplinariaPayload(form) {
  const diagnosticoElaborado = toNullableBooleanFromSiNo(
    form.diagnostico_elaborado
  );

  const asesoriaLegal = toNullableBooleanFromSiNo(form.asesoria_legal);

  const representacionJuridica = toNullableBooleanFromSiNo(
    form.representacion_juridica
  );

  return {
    actor_derivacion: toStringOrNull(form.actor_derivacion),
    lugar_intervencion: toStringOrNull(form.lugar_intervencion),
    otro_lugar_intervencion:
      form.lugar_intervencion === "Otras"
        ? toStringOrNull(form.otro_lugar_intervencion)
        : null,
    entidad_federativa_conocimiento: toStringOrNull(
      form.entidad_federativa_conocimiento
    ),
    lugar_realizacion_intervencion: toStringOrNull(
      form.lugar_realizacion_intervencion
    ),

    diagnostico_elaborado: diagnosticoElaborado,
    detalles_diagnosticos:
      diagnosticoElaborado === true
        ? form.detalles_diagnosticos.map((item) => ({
            tipo_diagnostico: item.tipo_diagnostico,
            fecha_diagnostico: item.fecha_diagnostico,
          }))
        : [],

    asesoria_legal: asesoriaLegal,
    asesoria_legal_servidor_publico:
      asesoriaLegal === true
        ? toStringOrNull(form.asesoria_legal_servidor_publico)
        : null,
    asesoria_legal_fecha:
      asesoriaLegal === true
        ? toStringOrNull(form.asesoria_legal_fecha)
        : null,

    representacion_juridica: representacionJuridica,
    representacion_juridica_servidor_publico:
      representacionJuridica === true
        ? toStringOrNull(form.representacion_juridica_servidor_publico)
        : null,
    representacion_juridica_fecha:
      representacionJuridica === true
        ? toStringOrNull(form.representacion_juridica_fecha)
        : null,
  };
}

export function getSectionByKey(sectionKey) {
  return (
    MEDIDAS_CREATE_SECTIONS.find((section) => section.key === sectionKey) ||
    MEDIDAS_CREATE_SECTIONS[0]
  );
}

export function getNextSectionKey(activeSection) {
  const currentIndex = MEDIDAS_CREATE_SECTIONS.findIndex(
    (section) => section.key === activeSection
  );

  const nextSection = MEDIDAS_CREATE_SECTIONS[currentIndex + 1];

  return nextSection?.key || activeSection;
}

export function getPreviousSectionKey(activeSection) {
  const currentIndex = MEDIDAS_CREATE_SECTIONS.findIndex(
    (section) => section.key === activeSection
  );

  const previousSection = MEDIDAS_CREATE_SECTIONS[currentIndex - 1];

  return previousSection?.key || activeSection;
}

export function hasPreviousSection(activeSection) {
  const currentIndex = MEDIDAS_CREATE_SECTIONS.findIndex(
    (section) => section.key === activeSection
  );

  return currentIndex > 0;
}
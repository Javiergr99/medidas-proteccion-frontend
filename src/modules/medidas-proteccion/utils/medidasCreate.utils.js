import dayjs from "dayjs";

import {
  DISCAPACIDAD_EMPTY_ITEM,
  EMPTY_MEDIDA_ESPECIAL_ITEM,
  EMPTY_MEDIDA_URGENTE_ITEM,
  INITIAL_MEDIDAS_CREATE_FORMS,
  MEDIDAS_CREATE_SECTIONS,
} from "../constants/medidasCreate.constants";

export function getInitialMedidasCreateForms() {
  return {
    datos_generales: {
      ...(INITIAL_MEDIDAS_CREATE_FORMS.datos_generales || {}),
      discapacidades: [],
    },
    impresion_diagnostica: {
      ...(INITIAL_MEDIDAS_CREATE_FORMS.impresion_diagnostica || {}),
    },
    intervencion_multidisciplinaria: {
      ...(INITIAL_MEDIDAS_CREATE_FORMS.intervencion_multidisciplinaria || {}),
      detalles_diagnosticos: [],
    },
    plan_restitucion: {
      ...(INITIAL_MEDIDAS_CREATE_FORMS.plan_restitucion || {}),
      derechos_vulnerados: [],
    },
    medidas_proteccion: {
      ...(INITIAL_MEDIDAS_CREATE_FORMS.medidas_proteccion || {}),
      medidas_especiales_list: [],
      medidas_urgentes_list: [],
    },
    cierre_caso: {
      ...(INITIAL_MEDIDAS_CREATE_FORMS.cierre_caso || {}),
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

function getEmptyDiscapacidadItem() {
  return {
    ...DISCAPACIDAD_EMPTY_ITEM,
  };
}

function normalizeUppercaseText(value) {
  return String(value || "").toUpperCase();
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
      "lugar_nacimiento",
      "senas_particulares",
      "especificacion_escolaridad",
    ].includes(name)
  ) {
    return normalizeUppercaseText(value);
  }

  if (["edad", "estatura"].includes(name)) {
    return String(value || "").replace(/\D/g, "").slice(0, 3);
  }

  return value;
}

export function normalizeImpresionDiagnosticaFieldValue(name, value) {
  if (
    [
      "religion",
      "tipo_enfermedad",
      "idioma",
      "tipo_lengua_indigena",
    ].includes(name)
  ) {
    return normalizeUppercaseText(value);
  }

  return value;
}

export function normalizeIntervencionMultidisciplinariaFieldValue(name, value) {
  if (
    [
      "actor_derivacion",
      "otro_lugar_intervencion",
      "lugar_realizacion_intervencion",
      "tipo_diagnostico",
      "asesoria_legal_servidor_publico",
      "representacion_juridica_servidor_publico",
    ].includes(name)
  ) {
    return normalizeUppercaseText(value);
  }

  if (name === "detalles_diagnosticos" && Array.isArray(value)) {
    return value.map((item) => ({
      ...item,
      tipo_diagnostico: normalizeUppercaseText(item.tipo_diagnostico),
    }));
  }

  return value;
}

export function normalizePlanRestitucionFieldValue(name, value) {
  if (name === "derechos_vulnerados" && Array.isArray(value)) {
    return value
      .map((item) => String(item || "").trim())
      .filter(Boolean);
  }

  return value;
}

export function normalizeMedidasProteccionFieldValue(name, value) {
  if (name === "medidas_urgentes_list" || name === "medidas_especiales_list") {
    return Array.isArray(value) ? value : [];
  }

  if (
    name === "medida_emitida_procuraduria" ||
    name === "existen_medidas_urgentes"
  ) {
    return value;
  }

  return value;
}

export function normalizeCierreCasoFieldValue(name, value) {
  /*
   * Importante:
   * Los campos select deben conservar exactamente el value de las opciones.
   * Si se convierten a MAYÚSCULAS, el select no encuentra coincidencia
   * y visualmente queda en blanco.
   */
  if (
    [
      "descripcion_egreso",
      "determinacion_interes_superior",
      "descripcion_cierre_imposibilidad",
    ].includes(name)
  ) {
    return normalizeUppercaseText(value);
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
    nextForm.entidad_federativa_id = "";
  }

  if (name === "escolaridad_id") {
    nextForm.especificacion_escolaridad = "";
  }

  if (name === "pertenencia_indigena_id") {
    nextForm.pertenencia_indigena_especifica_id = "";
  }

  if (name === "tiene_discapacidad") {
    if (value === "si") {
      nextForm.discapacidades =
        Array.isArray(previousForm.discapacidades) &&
        previousForm.discapacidades.length
          ? previousForm.discapacidades
          : [getEmptyDiscapacidadItem()];
    } else {
      nextForm.discapacidades = [];
    }
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

  if (name === "diagnostico_elaborado") {
    if (value === "si") {
      nextForm.detalles_diagnosticos =
        Array.isArray(previousForm.detalles_diagnosticos) &&
        previousForm.detalles_diagnosticos.length
          ? previousForm.detalles_diagnosticos
          : [
              {
                tipo_diagnostico: "",
                fecha_diagnostico: "",
              },
            ];
    } else {
      nextForm.detalles_diagnosticos = [];
    }
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

export function buildNextPlanRestitucionForm({ previousForm, name, value }) {
  const nextForm = {
    ...previousForm,
    [name]: value,
  };

  if (name === "derechos_vulnerados") {
    nextForm.derechos_vulnerados = Array.from(
      new Set(
        (Array.isArray(value) ? value : [])
          .map((item) => String(item || "").trim())
          .filter(Boolean)
      )
    );
  }

  return nextForm;
}

export function buildNextMedidasProteccionForm({
  previousForm = {},
  name,
  value,
}) {
  const nextForm = {
    ...(INITIAL_MEDIDAS_CREATE_FORMS.medidas_proteccion || {}),
    ...previousForm,
    [name]: value,
  };

  if (name === "medida_emitida_procuraduria") {
    if (value === "si") {
      nextForm.medidas_especiales_list =
        Array.isArray(previousForm.medidas_especiales_list) &&
        previousForm.medidas_especiales_list.length
          ? previousForm.medidas_especiales_list
          : [{ ...EMPTY_MEDIDA_ESPECIAL_ITEM }];
    } else {
      nextForm.medidas_especiales_list = [];
    }
  }

  if (name === "existen_medidas_urgentes") {
    if (value === "si") {
      nextForm.medidas_urgentes_list =
        Array.isArray(previousForm.medidas_urgentes_list) &&
        previousForm.medidas_urgentes_list.length
          ? previousForm.medidas_urgentes_list
          : [{ ...EMPTY_MEDIDA_URGENTE_ITEM }];
    } else {
      nextForm.medidas_urgentes_list = [];
    }
  }

  if (name === "medidas_urgentes_list") {
    nextForm.medidas_urgentes_list = Array.isArray(value) ? value : [];
  }

  if (name === "medidas_especiales_list") {
    nextForm.medidas_especiales_list = Array.isArray(value) ? value : [];
  }

  return nextForm;
}


export function buildNextCierreCasoForm({ previousForm = {}, name, value }) {
  const nextForm = {
    ...(INITIAL_MEDIDAS_CREATE_FORMS.cierre_caso || {}),
    ...previousForm,
    [name]: value,
  };

  if (name === "tipo_egreso") {
    if (value === "Planificado") {
      nextForm.egreso_no_planificado = "";
    }

    if (value === "No planificado") {
      nextForm.egreso_planificado = "";
    }

    if (!value || value === "Ninguno") {
      nextForm.egreso_planificado = "";
      nextForm.egreso_no_planificado = "";
      nextForm.fecha_egreso = "";
      nextForm.descripcion_egreso = "";
      nextForm.determinacion_interes_superior = "";
    }
  }

  if (name === "existe_cierre_caso" && value !== "si") {
    nextForm.razon_cierre_caso = "";
    nextForm.descripcion_cierre_imposibilidad = "";
  }

  if (
    name === "razon_cierre_caso" &&
    value !== "Imposibilidad material de cumplir la medida"
  ) {
    nextForm.descripcion_cierre_imposibilidad = "";
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

  if (form.estatura) {
    const estatura = Number(form.estatura);

    if (Number.isNaN(estatura) || estatura <= 0 || estatura > 250) {
      errors.estatura = "Captura una estatura válida en centímetros.";
    }
  }

  if (form.tiene_discapacidad === "si") {
    const discapacidades = Array.isArray(form.discapacidades)
      ? form.discapacidades
      : [];

    if (!discapacidades.length) {
      errors.discapacidades = "Agrega al menos una discapacidad.";
    } else {
      const discapacidadErrors = discapacidades.map((item) => {
        const itemErrors = {};

        if (!item.categoria_discapacidad_id) {
          itemErrors.categoria_discapacidad_id =
            "Selecciona la categoría de discapacidad.";
        }

        if (!item.subtipo_discapacidad_id) {
          itemErrors.subtipo_discapacidad_id =
            "Selecciona el subtipo de discapacidad.";
        }

        if (!item.severidad_discapacidad_id) {
          itemErrors.severidad_discapacidad_id = "Selecciona la severidad.";
        }

        if (
          item.requiere_especificacion === true &&
          !String(item.especifique_otros || "").trim()
        ) {
          itemErrors.especifique_otros = "Especifica la discapacidad.";
        }

        return itemErrors;
      });

      const hasDiscapacidadErrors = discapacidadErrors.some((itemErrors) => {
        return Object.keys(itemErrors).length > 0;
      });

      if (hasDiscapacidadErrors) {
        errors.discapacidades = discapacidadErrors;
      }
    }
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
    const detallesDiagnosticos = Array.isArray(form.detalles_diagnosticos)
      ? form.detalles_diagnosticos
      : [];

    if (!detallesDiagnosticos.length) {
      errors.detalles_diagnosticos =
        "Agrega al menos un diagnóstico multidisciplinario.";
    } else {
      const detallesErrors = detallesDiagnosticos.map((item) => {
        const itemErrors = {};

        if (!String(item.tipo_diagnostico || "").trim()) {
          itemErrors.tipo_diagnostico = "Captura el tipo de diagnóstico.";
        }

        if (!item.fecha_diagnostico) {
          itemErrors.fecha_diagnostico = "Captura la fecha de diagnóstico.";
        } else {
          const fechaDiagnostico = dayjs(item.fecha_diagnostico);

          if (!fechaDiagnostico.isValid()) {
            itemErrors.fecha_diagnostico = "La fecha no es válida.";
          }

          if (fechaDiagnostico.isAfter(dayjs(), "day")) {
            itemErrors.fecha_diagnostico = "No se permiten fechas futuras.";
          }
        }

        return itemErrors;
      });

      const hasDetalleErrors = detallesErrors.some((itemErrors) => {
        return Object.keys(itemErrors).length > 0;
      });

      if (hasDetalleErrors) {
        errors.detalles_diagnosticos = detallesErrors;
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
    } else {
      const fechaAsesoria = dayjs(form.asesoria_legal_fecha);

      if (!fechaAsesoria.isValid()) {
        errors.asesoria_legal_fecha = "La fecha no es válida.";
      }

      if (fechaAsesoria.isAfter(dayjs(), "day")) {
        errors.asesoria_legal_fecha = "No se permiten fechas futuras.";
      }
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
    } else {
      const fechaRepresentacion = dayjs(form.representacion_juridica_fecha);

      if (!fechaRepresentacion.isValid()) {
        errors.representacion_juridica_fecha = "La fecha no es válida.";
      }

      if (fechaRepresentacion.isAfter(dayjs(), "day")) {
        errors.representacion_juridica_fecha =
          "No se permiten fechas futuras.";
      }
    }
  }

  return errors;
}

export function validatePlanRestitucion(form) {
  const errors = {};

  if (form.fecha_elaboracion) {
    const fechaElaboracion = dayjs(form.fecha_elaboracion);

    if (!fechaElaboracion.isValid()) {
      errors.fecha_elaboracion = "La fecha no es válida.";
    }

    if (fechaElaboracion.isAfter(dayjs(), "day")) {
      errors.fecha_elaboracion = "No se permiten fechas futuras.";
    }
  }

  if (Array.isArray(form.derechos_vulnerados)) {
    const hasEmptyRights = form.derechos_vulnerados.some((item) => {
      return !String(item || "").trim();
    });

    if (hasEmptyRights) {
      errors.derechos_vulnerados =
        "Elimina o corrige los derechos vulnerados vacíos.";
    }
  }

  return errors;
}

export function validateMedidasProteccion(form = {}) {
  const errors = {};

  const medidasEspeciales = Array.isArray(form.medidas_especiales_list)
    ? form.medidas_especiales_list
    : [];

  const medidasUrgentes = Array.isArray(form.medidas_urgentes_list)
    ? form.medidas_urgentes_list
    : [];

  if (form.medida_emitida_procuraduria === "si") {
    if (!medidasEspeciales.length) {
      errors.medidas_especiales_list =
        "Agrega al menos una medida especial emitida por la Procuraduría.";
    } else {
      const rowErrors = medidasEspeciales.map((item) => {
        const itemErrors = {};

        if (!String(item.numero_medida || "").trim()) {
          itemErrors.numero_medida = "Captura el número de medida.";
        }

        if (!String(item.autoridad_emitio || "").trim()) {
          itemErrors.autoridad_emitio = "Captura la autoridad que emitió.";
        }

        if (!item.fecha_medida) {
          itemErrors.fecha_medida = "Captura la fecha de la medida.";
        } else {
          const fecha = dayjs(item.fecha_medida);

          if (!fecha.isValid()) {
            itemErrors.fecha_medida = "La fecha no es válida.";
          }

          if (fecha.isAfter(dayjs(), "day")) {
            itemErrors.fecha_medida = "No se permiten fechas futuras.";
          }
        }

        return itemErrors;
      });

      if (rowErrors.some((itemErrors) => Object.keys(itemErrors).length > 0)) {
        errors.medidas_especiales_list = rowErrors;
      }
    }
  }

  if (form.existen_medidas_urgentes === "si") {
    if (!medidasUrgentes.length) {
      errors.medidas_urgentes_list =
        "Agrega al menos una medida urgente.";
    } else {
      const rowErrors = medidasUrgentes.map((item) => {
        const itemErrors = {};

        if (!String(item.numero_medida || "").trim()) {
          itemErrors.numero_medida = "Captura el número de medida.";
        }

        if (!String(item.autoridad_emitio || "").trim()) {
          itemErrors.autoridad_emitio = "Captura la autoridad que emitió.";
        }

        if (!item.fecha_medida) {
          itemErrors.fecha_medida = "Captura la fecha de la medida.";
        } else {
          const fecha = dayjs(item.fecha_medida);

          if (!fecha.isValid()) {
            itemErrors.fecha_medida = "La fecha no es válida.";
          }

          if (fecha.isAfter(dayjs(), "day")) {
            itemErrors.fecha_medida = "No se permiten fechas futuras.";
          }
        }

        return itemErrors;
      });

      if (rowErrors.some((itemErrors) => Object.keys(itemErrors).length > 0)) {
        errors.medidas_urgentes_list = rowErrors;
      }
    }
  }

  return errors;
}


export function buildDatosGeneralesPayload(form) {
  const cuentaConCurp = hasCuentaConCurp(form.cuenta_con_curp);

  const tieneDocumento = hasDocumentoIdentificacion(
    form.documento_identificacion
  );

  const estaAcompanado = isAcompanado(form.acompanado);

  const tieneDiscapacidad = toNullableBooleanFromSiNo(
    form.tiene_discapacidad
  );

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

    entidad_federativa_id: toNumberOrNull(form.entidad_federativa_id),
    especificacion_escolaridad: toStringOrNull(
      form.especificacion_escolaridad
    ),
    pertenencia_indigena_especifica_id: toNumberOrNull(
      form.pertenencia_indigena_especifica_id
    ),

    tiene_discapacidad: tieneDiscapacidad,
    discapacidades: buildDiscapacidadesPayload(form),

    estatura: toNumberOrNull(form.estatura),
    senas_particulares: toStringOrNull(form.senas_particulares),
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
    edad: toNumberOrNull(form.edad),

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
    detalles_diagnosticos: buildDetallesDiagnosticosPayload(form),

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

export function buildPlanRestitucionPayload(form) {
  return {
    fecha_elaboracion: toStringOrNull(form.fecha_elaboracion),
    derechos_vulnerados: Array.isArray(form.derechos_vulnerados)
      ? form.derechos_vulnerados
          .map((item) => String(item || "").trim())
          .filter(Boolean)
      : [],
  };
}

export function buildMedidasProteccionPayload(form = {}) {
  const medidaEmitidaProcuraduria = toNullableBooleanFromSiNo(
    form.medida_emitida_procuraduria
  );

  const existenMedidasUrgentes = toNullableBooleanFromSiNo(
    form.existen_medidas_urgentes
  );

  const medidasEspeciales = Array.isArray(form.medidas_especiales_list)
    ? form.medidas_especiales_list
    : [];

  const medidasUrgentes = Array.isArray(form.medidas_urgentes_list)
    ? form.medidas_urgentes_list
    : [];

  return {
    medida_emitida_procuraduria: medidaEmitidaProcuraduria,
    medidas_especiales_list:
      medidaEmitidaProcuraduria === true
        ? medidasEspeciales.map((item) => ({
            numero_medida: toStringOrNull(item.numero_medida),
            autoridad_emitio: toStringOrNull(item.autoridad_emitio),
            fecha_medida: toStringOrNull(item.fecha_medida),
            descripcion: toStringOrNull(item.descripcion),

            medida_alojamiento_cas: toStringOrNull(item.medida_alojamiento_cas),
            tipo_centro: toStringOrNull(item.tipo_centro),
            nombre_razon_social: toStringOrNull(item.nombre_razon_social),

            determinacion_familiar: toStringOrNull(item.determinacion_familiar),
            determinacion_fecha: toStringOrNull(item.determinacion_fecha),
            determinacion_descripcion: toStringOrNull(
              item.determinacion_descripcion
            ),

            pronfac: toStringOrNull(item.pronfac),
            pronfac_fecha: toStringOrNull(item.pronfac_fecha),
            pronfac_descripcion: toStringOrNull(item.pronfac_descripcion),
          }))
        : [],

    existen_medidas_urgentes: existenMedidasUrgentes,
    medidas_urgentes_list:
      existenMedidasUrgentes === true
        ? medidasUrgentes.map((item) => ({
            numero_medida: toStringOrNull(item.numero_medida),
            autoridad_emitio: toStringOrNull(item.autoridad_emitio),
            fecha_medida: toStringOrNull(item.fecha_medida),
            descripcion: toStringOrNull(item.descripcion),
          }))
        : [],
  };
}


export function buildCierreCasoPayload(form = {}) {
  const existeCierreCaso = toNullableBooleanFromSiNo(form.existe_cierre_caso);

  const tipoEgreso = toStringOrNull(form.tipo_egreso);

  const hasEgreso = tipoEgreso && tipoEgreso !== "Ninguno";

  return {
    tipo_egreso: tipoEgreso,
    egreso_planificado:
      tipoEgreso === "Planificado" ? toStringOrNull(form.egreso_planificado) : null,
    egreso_no_planificado:
      tipoEgreso === "No planificado"
        ? toStringOrNull(form.egreso_no_planificado)
        : null,
    fecha_egreso: hasEgreso ? toStringOrNull(form.fecha_egreso) : null,
    descripcion_egreso: hasEgreso
      ? toStringOrNull(form.descripcion_egreso)
      : null,
    determinacion_interes_superior: hasEgreso
      ? toStringOrNull(form.determinacion_interes_superior)
      : null,

    existe_cierre_caso: existeCierreCaso,
    razon_cierre_caso:
      existeCierreCaso === true ? toStringOrNull(form.razon_cierre_caso) : null,
    descripcion_cierre_imposibilidad:
      existeCierreCaso === true &&
      form.razon_cierre_caso === "Imposibilidad material de cumplir la medida"
        ? toStringOrNull(form.descripcion_cierre_imposibilidad)
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

export function validateCierreCaso(form = {}) {
  const errors = {};

  if (form.fecha_egreso) {
    const fechaEgreso = dayjs(form.fecha_egreso);

    if (!fechaEgreso.isValid()) {
      errors.fecha_egreso = "La fecha no es válida.";
    }

    if (fechaEgreso.isAfter(dayjs(), "day")) {
      errors.fecha_egreso = "No se permiten fechas futuras.";
    }
  }

  if (form.tipo_egreso === "Planificado" && !form.egreso_planificado) {
    errors.egreso_planificado = "Selecciona el egreso planificado.";
  }

  if (form.tipo_egreso === "No planificado" && !form.egreso_no_planificado) {
    errors.egreso_no_planificado = "Selecciona el egreso no planificado.";
  }

  if (form.existe_cierre_caso === "si") {
    if (!form.razon_cierre_caso) {
      errors.razon_cierre_caso = "Selecciona la razón de cierre del caso.";
    }

    if (
      form.razon_cierre_caso === "Imposibilidad material de cumplir la medida" &&
      !String(form.descripcion_cierre_imposibilidad || "").trim()
    ) {
      errors.descripcion_cierre_imposibilidad =
        "Describe la imposibilidad material de cumplir la medida.";
    }
  }

  return errors;
}

export const MEDIDAS_CREATE_ROUTE = "/medidas/nuevo";

export const MEDIDAS_CREATE_SECTIONS = [
  {
    key: "datos_generales",
    label: "Datos generales",
    title: "Datos generales",
    description: "Identificación, información general y contexto del expediente.",
  },
  {
    key: "impresion_diagnostica",
    label: "Impresión diagnóstica",
    title: "Impresión diagnóstica",
    description: "Datos médicos, culturales y de comunicación del NNA.",
  },
  {
    key: "intervencion_multidisciplinaria",
    label: "Intervención multidisciplinaria",
    title: "Intervención multidisciplinaria",
    description: "Intervención, diagnósticos, asesoría y representación jurídica.",
  },
  {
    key: "plan_restitucion",
    label: "Plan de restitución",
    title: "Plan de restitución",
    description: "Derechos vulnerados y fecha de elaboración del plan.",
  },
  {
    key: "medidas_proteccion",
    label: "Medidas de protección",
    title: "Medidas de protección",
    description: "Medidas urgentes y especiales dictadas para el expediente.",
  },
  {
    key: "cierre_caso",
    label: "Cierre de caso",
    title: "Cierre de caso",
    description: "Información final del expediente y motivo de cierre.",
  },
];

export const YES_NO_OPTIONS = [
  {
    value: "si",
    label: "Sí",
  },
  {
    value: "no",
    label: "No",
  },
];

export const IDIOMA_OPTIONS = [
  {
    value: "ESPAÑOL",
    label: "Español",
  },
  {
    value: "INGLÉS",
    label: "Inglés",
  },
  {
    value: "FRANCÉS",
    label: "Francés",
  },
  {
    value: "PORTUGUÉS",
    label: "Portugués",
  },
  {
    value: "LENGUA INDÍGENA",
    label: "Lengua indígena",
  },
  {
    value: "OTRO",
    label: "Otro",
  },
  {
    value: "SE DESCONOCE",
    label: "Se desconoce",
  },
];

export const LENGUA_INDIGENA_OPTIONS = [
  {
    value: "NÁHUATL",
    label: "Náhuatl",
  },
  {
    value: "MAYA",
    label: "Maya",
  },
  {
    value: "MIXTECO",
    label: "Mixteco",
  },
  {
    value: "ZAPOTECO",
    label: "Zapoteco",
  },
  {
    value: "TSOTSIL",
    label: "Tsotsil",
  },
  {
    value: "TSELTAL",
    label: "Tseltal",
  },
  {
    value: "OTOMÍ",
    label: "Otomí",
  },
  {
    value: "TOTONACO",
    label: "Totonaco",
  },
  {
    value: "MAZATECO",
    label: "Mazateco",
  },
  {
    value: "CH’OL",
    label: "Ch’ol",
  },
  {
    value: "OTRA",
    label: "Otra",
  },
  {
    value: "SE DESCONOCE",
    label: "Se desconoce",
  },
];

export const TIPO_LENGUA_INDIGENA_OPTIONS = LENGUA_INDIGENA_OPTIONS;

export const DOCUMENTO_IDENTIFICACION_OPTIONS = [
  {
    value: "sin_documento",
    label: "Sin documento",
  },
  {
    value: "con_documento",
    label: "Sí cuenta con documento",
  },
];

export const TIPO_IDENTIFICACION_OPTIONS = [
  {
    value: "acta_nacimiento",
    label: "Acta de nacimiento",
  },
  {
    value: "curp",
    label: "CURP",
  },
  {
    value: "pasaporte",
    label: "Pasaporte",
  },
  {
    value: "documento_migratorio",
    label: "Documento migratorio",
  },
  {
    value: "credencial_escolar",
    label: "Credencial escolar",
  },
  {
    value: "constancia_identidad",
    label: "Constancia de identidad",
  },
  {
    value: "otro",
    label: "Otro",
  },
];

export const IDENTIFICACION_OPTIONS = TIPO_IDENTIFICACION_OPTIONS;

export const CALIDAD_MIGRATORIA_OPTIONS = [
  {
    value: "no_aplica",
    label: "No aplica",
  },
  {
    value: "mexicana",
    label: "Mexicana",
  },
  {
    value: "residente_temporal",
    label: "Residente temporal",
  },
  {
    value: "residente_permanente",
    label: "Residente permanente",
  },
  {
    value: "visitante",
    label: "Visitante",
  },
  {
    value: "solicitante_refugio",
    label: "Solicitante de refugio",
  },
  {
    value: "refugiada",
    label: "Persona refugiada",
  },
  {
    value: "retornada",
    label: "Persona retornada",
  },
  {
    value: "situacion_irregular",
    label: "Situación migratoria irregular",
  },
  {
    value: "se_desconoce",
    label: "Se desconoce",
  },
];

export const PARENTESCO_OPTIONS = [
  {
    value: "madre",
    label: "Madre",
  },
  {
    value: "padre",
    label: "Padre",
  },
  {
    value: "abuela",
    label: "Abuela",
  },
  {
    value: "abuelo",
    label: "Abuelo",
  },
  {
    value: "hermana",
    label: "Hermana",
  },
  {
    value: "hermano",
    label: "Hermano",
  },
  {
    value: "tia",
    label: "Tía",
  },
  {
    value: "tio",
    label: "Tío",
  },
  {
    value: "persona_tutora",
    label: "Persona tutora",
  },
  {
    value: "persona_cuidadora",
    label: "Persona cuidadora",
  },
  {
    value: "otro",
    label: "Otro",
  },
];

export const DISCAPACIDAD_EMPTY_ITEM = {
  categoria_discapacidad_id: "",
  subtipo_discapacidad_id: "",
  severidad_discapacidad_id: "",
  especifique_otros: "",
  requiere_especificacion: false,
};

export const INITIAL_DATOS_GENERALES_FORM = {
  nna_id: "",

  asignacion_expediente: "",
  numero_expediente: "",
  lugar_apertura: "",

  nombre: "",
  primer_apellido: "",
  segundo_apellido: "",
  fecha_nacimiento: "",
  edad: "",
  sexo_id: "",
  lugar_nacimiento: "",

  cuenta_con_curp: "",
  curp: "",

  nacionalidad_id: "",
  entidad_federativa_id: "",

  escolaridad_id: "",
  especificacion_escolaridad: "",

  afrodescendencia_id: "",
  pertenencia_indigena_id: "",
  pertenencia_indigena_especifica_id: "",

  id_situacion_calle: "",
  id_reclutamiento_delincuencia: "",

  tiene_discapacidad: "",
  discapacidades: [],

  estatura: "",
  senas_particulares: "",
  complexion_id: "",
  tez_id: "",
  color_cabello_id: "",
  largo_cabello_id: "",
  tipo_cabello_id: "",
  color_ojos_id: "",
  tipo_ojos_id: "",

  region_origen: "",
  pais_residencia: "",
  documento_identificacion: "",
  tipo_identificacion: "",
  calidad_migratoria: "",
  acompanado: "",
  parentesco_acompanante: "",
};

export const INITIAL_IMPRESION_DIAGNOSTICA_FORM = {
  enfermedad_cronica: "",
  tipo_enfermedad: "",
  religion: "",
  idioma: "",
  habla_lengua_indigena: "",
  tipo_lengua_indigena: "",
};

export const INITIAL_INTERVENCION_MULTIDISCIPLINARIA_FORM = {
  actor_derivacion: "",
  lugar_intervencion: "",
  otro_lugar_intervencion: "",
  entidad_federativa_conocimiento: "",
  lugar_realizacion_intervencion: "",

  diagnostico_elaborado: "",
  detalles_diagnosticos: [],

  asesoria_legal: "",
  asesoria_legal_servidor_publico: "",
  asesoria_legal_fecha: "",

  representacion_juridica: "",
  representacion_juridica_servidor_publico: "",
  representacion_juridica_fecha: "",
};

export const INITIAL_PLAN_RESTITUCION_FORM = {
  fecha_elaboracion: "",
  derechos_vulnerados: [],
};

export const EMPTY_MEDIDA_URGENTE_ITEM = {
  numero_medida: "",
  autoridad_emitio: "",
  fecha_medida: "",
  descripcion: "",
};

export const EMPTY_MEDIDA_ESPECIAL_ITEM = {
  numero_medida: "",
  autoridad_emitio: "",
  fecha_medida: "",
  descripcion: "",
  medida_alojamiento_cas: "",
  tipo_centro: "",
  nombre_razon_social: "",
  determinacion_familiar: "",
  determinacion_fecha: "",
  determinacion_descripcion: "",
  pronfac: "",
  pronfac_fecha: "",
  pronfac_descripcion: "",
};

export const INITIAL_MEDIDAS_PROTECCION_FORM = {
  medida_emitida_procuraduria: "",
  medidas_especiales_list: [],
  existen_medidas_urgentes: "",
  medidas_urgentes_list: [],
};

export const INITIAL_CIERRE_CASO_FORM = {
  tipo_egreso: "",
  egreso_planificado: "",
  egreso_no_planificado: "",
  fecha_egreso: "",
  descripcion_egreso: "",
  determinacion_interes_superior: "",
  existe_cierre_caso: "",
  razon_cierre_caso: "",
  descripcion_cierre_imposibilidad: "",
};

export const TIPO_EGRESO_OPTIONS = [
  { value: "Ninguno", label: "Ninguno" },
  { value: "Planificado", label: "Planificado" },
  { value: "No planificado", label: "No planificado" },
];

export const EGRESO_PLANIFICADO_OPTIONS = [
  { value: "Reintegración familiar", label: "Reintegración familiar" },
  { value: "Canalización institucional", label: "Canalización institucional" },
  { value: "Traslado a centro de asistencia social", label: "Traslado a centro de asistencia social" },
  { value: "Conclusión del seguimiento", label: "Conclusión del seguimiento" },
  { value: "Otro", label: "Otro" },
];

export const EGRESO_NO_PLANIFICADO_OPTIONS = [
  { value: "Abandono voluntario", label: "Abandono voluntario" },
  { value: "Continuó ruta migratoria", label: "Continuó ruta migratoria" },
  { value: "No localización", label: "No localización" },
  { value: "Retiro por familiar o tercero", label: "Retiro por familiar o tercero" },
  { value: "Otro", label: "Otro" },
];

export const RAZON_CIERRE_CASO_OPTIONS = [
  { value: "Cumplimiento del plan de restitución", label: "Cumplimiento del plan de restitución" },
  { value: "Reintegración familiar", label: "Reintegración familiar" },
  { value: "Canalización a autoridad competente", label: "Canalización a autoridad competente" },
  { value: "Imposibilidad material de cumplir la medida", label: "Imposibilidad material de cumplir la medida" },
  { value: "Otro", label: "Otro" },
];

export const MEDIDA_ALOJAMIENTO_CAS_OPTIONS = [
  { value: "si", label: "Sí" },
  { value: "no", label: "No" },
  { value: "no_aplica", label: "No aplica" },
];

export const TIPO_CENTRO_OPTIONS = [
  { value: "centro_asistencial_publico", label: "Centro asistencial público" },
  { value: "centro_asistencial_privado", label: "Centro asistencial privado" },
  { value: "albergue_temporal", label: "Albergue temporal" },
  { value: "otro", label: "Otro" },
];

export const DETERMINACION_FAMILIAR_OPTIONS = [
  { value: "familia_origen", label: "Familia de origen" },
  { value: "familia_extensa", label: "Familia extensa" },
  { value: "familia_acogida", label: "Familia de acogida" },
  { value: "no_viable", label: "No viable" },
  { value: "pendiente", label: "Pendiente" },
];

export const PRONFAC_OPTIONS = [
  { value: "si", label: "Sí" },
  { value: "no", label: "No" },
  { value: "pendiente", label: "Pendiente" },
  { value: "no_aplica", label: "No aplica" },
];

export const INITIAL_MEDIDAS_CREATE_FORMS = {
  datos_generales: INITIAL_DATOS_GENERALES_FORM,
  impresion_diagnostica: INITIAL_IMPRESION_DIAGNOSTICA_FORM,
  intervencion_multidisciplinaria:
    INITIAL_INTERVENCION_MULTIDISCIPLINARIA_FORM,
  plan_restitucion: INITIAL_PLAN_RESTITUCION_FORM,
  medidas_proteccion: INITIAL_MEDIDAS_PROTECCION_FORM,
  cierre_caso: INITIAL_CIERRE_CASO_FORM,
};
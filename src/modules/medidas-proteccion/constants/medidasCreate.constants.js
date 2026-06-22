export const MEDIDAS_CREATE_ROUTE = "/medidas/nuevo";

export const MEDIDAS_CREATE_SECTIONS = [
  {
    key: "datos_generales",
    label: "Datos generales",
    title: "Datos Generales de Identificación",
    description:
      "Captura la información principal de identificación, contexto y catálogos del expediente.",
  },
  {
    key: "impresion_diagnostica",
    label: "Impresión diagnóstica",
    title: "Impresión Diagnóstica",
    description:
      "Registra información médica, religión, idioma y lengua indígena.",
  },
  {
    key: "intervencion_multidisciplinaria",
    label: "Intervención multidisciplinaria",
    title: "Intervención Multidisciplinaria",
    description:
      "Captura la derivación, lugar de intervención, diagnósticos, asesoría legal y representación jurídica.",
  },
  {
    key: "plan_restitucion",
    label: "Plan de restitución",
    title: "Plan de Restitución de Derechos",
    description: "Sección pendiente de integración.",
  },
  {
    key: "medidas_proteccion",
    label: "Medidas de protección",
    title: "Medidas de Protección",
    description: "Sección pendiente de integración.",
  },
  {
    key: "cierre_caso",
    label: "Cierre de caso",
    title: "Cierre de Caso",
    description: "Sección pendiente de integración.",
  },
];

export const YES_NO_OPTIONS = [
  { value: "si", label: "Sí" },
  { value: "no", label: "No" },
];

export const DOCUMENTO_IDENTIFICACION_OPTIONS = [
  { value: "acta_nacimiento", label: "Acta de nacimiento" },
  { value: "curp", label: "CURP" },
  { value: "pasaporte", label: "Pasaporte" },
  { value: "documento_migratorio", label: "Documento migratorio" },
  { value: "constancia_identidad", label: "Constancia de identidad" },
  { value: "sin_documento", label: "Sin documento" },
  { value: "otro", label: "Otro" },
];

export const TIPO_IDENTIFICACION_OPTIONS = [
  { value: "oficial", label: "Oficial" },
  { value: "no_oficial", label: "No oficial" },
  { value: "migratoria", label: "Migratoria" },
  { value: "escolar", label: "Escolar" },
  { value: "medica", label: "Médica" },
  { value: "otro", label: "Otro" },
];

export const IDENTIFICACION_OPTIONS = DOCUMENTO_IDENTIFICACION_OPTIONS;

export const CALIDAD_MIGRATORIA_OPTIONS = [
  { value: "regular", label: "Regular" },
  { value: "irregular", label: "Irregular" },
  { value: "solicitante_refugio", label: "Solicitante de refugio" },
  { value: "refugiado", label: "Refugiado" },
  { value: "no_aplica", label: "No aplica" },
  { value: "sin_informacion", label: "Sin información" },
];

export const PARENTESCO_OPTIONS = [
  { value: "madre", label: "Madre" },
  { value: "padre", label: "Padre" },
  { value: "abuela", label: "Abuela" },
  { value: "abuelo", label: "Abuelo" },
  { value: "hermana", label: "Hermana" },
  { value: "hermano", label: "Hermano" },
  { value: "tia", label: "Tía" },
  { value: "tio", label: "Tío" },
  { value: "tutor", label: "Tutor/a" },
  { value: "otro", label: "Otro" },
];

export const IDIOMA_OPTIONS = [
  { value: "Español", label: "Español" },
  { value: "Inglés", label: "Inglés" },
  { value: "Francés", label: "Francés" },
  { value: "Lengua indígena", label: "Lengua indígena" },
  { value: "Otro", label: "Otro" },
  { value: "Se desconoce", label: "Se desconoce" },
];

export const LENGUA_INDIGENA_OPTIONS = [
  { value: "Náhuatl", label: "Náhuatl" },
  { value: "Maya", label: "Maya" },
  { value: "Mixteco", label: "Mixteco" },
  { value: "Zapoteco", label: "Zapoteco" },
  { value: "Tseltal", label: "Tseltal" },
  { value: "Tsotsil", label: "Tsotsil" },
  { value: "Otomí", label: "Otomí" },
  { value: "Totonaco", label: "Totonaco" },
  { value: "Mazateco", label: "Mazateco" },
  { value: "Chol", label: "Chol" },
  { value: "Otra", label: "Otra" },
];

export const ACTOR_DERIVACION_OPTIONS = [
  { value: "publico", label: "Público" },
  { value: "privado", label: "Privado" },
  { value: "sociedad_civil", label: "Sociedad civil" },
  { value: "autoridad_migratoria", label: "Autoridad migratoria" },
  { value: "procuraduria", label: "Procuraduría" },
  { value: "otro", label: "Otro" },
];

export const LUGAR_INTERVENCION_OPTIONS = [
  { value: "aeropuerto_aicm", label: "Aeropuerto AICM" },
  { value: "estacion_migratoria", label: "Estación migratoria" },
  { value: "centro_asistencia_social", label: "Centro de asistencia social" },
  { value: "oficinas_procuraduria", label: "Oficinas de procuraduría" },
  { value: "domicilio", label: "Domicilio" },
  { value: "hospital", label: "Hospital" },
  { value: "Otras", label: "Otras" },
];

export const DIAGNOSTICO_TIPO_OPTIONS = [
  { value: "inicial_juridico", label: "Inicial jurídico" },
  { value: "psicologico", label: "Psicológico" },
  { value: "trabajo_social", label: "Trabajo social" },
  { value: "medico", label: "Médico" },
  { value: "educativo", label: "Educativo" },
  { value: "otro", label: "Otro" },
];

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
  escolaridad_id: "",
  afrodescendencia_id: "",
  pertenencia_indigena_id: "",
  id_situacion_calle: "",
  id_reclutamiento_delincuencia: "",
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

export const INITIAL_MEDIDAS_CREATE_FORMS = {
  datos_generales: INITIAL_DATOS_GENERALES_FORM,
  impresion_diagnostica: INITIAL_IMPRESION_DIAGNOSTICA_FORM,
  intervencion_multidisciplinaria:
    INITIAL_INTERVENCION_MULTIDISCIPLINARIA_FORM,
};
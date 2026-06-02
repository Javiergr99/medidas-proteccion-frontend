import { MP_ACTIONS } from "../../../utils/rbac";

export const MEDIDAS_ENDPOINT_LIMIT = 500;

export const MEDIDAS_ITEMS_PER_PAGE = 10;

export const MEDIDAS_ESTADOS = {
  EN_CAPTURA: "En captura",
  EN_REVISION: "En revisión",
  REVISADO: "Revisado",
};

export const MEDIDAS_ESTADO_OPTIONS = [
  MEDIDAS_ESTADOS.EN_CAPTURA,
  MEDIDAS_ESTADOS.EN_REVISION,
  MEDIDAS_ESTADOS.REVISADO,
];

export const MEDIDAS_LIST_FILTER_INITIAL_STATE = {
  id: "",
  nombre_completo: "",
  estado_actual: "",
  lugar_apertura: "",
  edad: "",
  sexo: "",
  pais_residencia: "",
  fecha: "",
  calidad_migratoria: "",
};

export const MEDIDAS_PERMISSIONS = {
  READ: MP_ACTIONS.LEER_REGISTRO,
  CREATE: MP_ACTIONS.CREAR_REGISTRO,
  SEND_REVIEW: MP_ACTIONS.ENVIAR_REVISION,
  APPROVE: MP_ACTIONS.APROBAR_REGISTRO,
  RETURN: MP_ACTIONS.DEVOLVER_REGISTRO,
  EDIT_GENERAL_DATA: MP_ACTIONS.EDITAR_DATOS_GENERALES,
};
import http from "../../../api/http";

const CATALOGOS_ENDPOINT = "/catalogos/";

const EMPTY_CATALOGS = {
  sexo: [],
  nacionalidad: [],
  entidad_federativa: [],
  escolaridad: [],
  pertenencia_indigena: [],
  opcion_respuesta: [],
  tipo_registro: [],
  categoria_discapacidad: [],
  subtipo_discapacidad: [],
  severidad_discapacidad: [],
  complexion: [],
  tez: [],
  color_cabello: [],
  largo_cabello: [],
  tipo_cabello: [],
  color_ojos: [],
  tipo_ojos: [],
};

function cloneEmptyCatalogos() {
  return Object.keys(EMPTY_CATALOGS).reduce((catalogos, key) => {
    catalogos[key] = [];
    return catalogos;
  }, {});
}

function normalizeCatalogItem(item) {
  if (!item || typeof item !== "object") {
    return null;
  }

  const id =
    item.id ??
    item.id_sexo ??
    item.id_nacionalidad ??
    item.id_entidad_federativa ??
    item.id_escolaridad ??
    item.id_pertenencia_indigena ??
    item.id_opcion ??
    item.id_tipo_registro ??
    item.id_categoria ??
    item.id_subtipo ??
    item.id_severidad ??
    item.id_complexion ??
    item.id_tez ??
    item.id_color_cabello ??
    item.id_largo_cabello ??
    item.id_tipo_cabello ??
    item.id_color_ojos ??
    item.id_tipo_ojos ??
    null;

  const descripcion =
    item.descripcion ||
    item.nombre ||
    item.nombre_categoria ||
    item.nombre_subtipo ||
    item.valor ||
    "";

  if (id === null || !descripcion) {
    return null;
  }

  return {
    ...item,
    id: Number(id),
    descripcion: String(descripcion),
  };
}

function normalizeCatalogList(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map(normalizeCatalogItem).filter(Boolean);
}

export function normalizeMedidasCatalogos(payload) {
  const data = payload && typeof payload === "object" ? payload : {};
  const emptyCatalogos = cloneEmptyCatalogos();

  return Object.keys(emptyCatalogos).reduce((catalogos, key) => {
    catalogos[key] = normalizeCatalogList(data[key]);
    return catalogos;
  }, emptyCatalogos);
}

export async function getMedidasCatalogosRequest() {
  const response = await http.get(CATALOGOS_ENDPOINT);
  return normalizeMedidasCatalogos(response.data);
}

export function getEmptyMedidasCatalogos() {
  return cloneEmptyCatalogos();
}
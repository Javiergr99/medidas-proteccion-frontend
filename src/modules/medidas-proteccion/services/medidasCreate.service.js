import api from "../../../api/axios";

export function normalizeRegistroSession(response) {
  if (!response) return null;

  return {
    registroId: response.id || response.registro_id || "",
    idMp: response.id_mp || response.idMp || "",
    estadoActual:
      response.estado_actual || response.estadoActual || "En captura",
  };
}

export async function createRegistroRequest(payload) {
  const response = await api.post("/registros/", payload);
  return response.data;
}

export async function updateDatosGeneralesRequest({ registroId, payload }) {
  const response = await api.patch(
    `/registros/${registroId}/datos-generales`,
    payload
  );

  return response.data;
}

export async function saveImpresionDiagnosticaRequest({
  registroId,
  payload,
}) {
  const response = await api.put(
    `/registros/${registroId}/impresion-diagnostica`,
    payload
  );

  return response.data;
}

export async function saveIntervencionMultidisciplinariaRequest({
  registroId,
  payload,
}) {
  const response = await api.put(
    `/registros/${registroId}/intervencion-multidisciplinaria`,
    payload
  );

  return response.data;
}

export async function savePlanRestitucionRequest({ registroId, payload }) {
  const response = await api.put(
    `/registros/${registroId}/plan-restitucion`,
    payload
  );

  return response.data;
}

export async function sendRegistroRevisionRequest(registroId) {
  const response = await api.post(`/registros/${registroId}/enviar-revision`);
  return response.data;
}

export async function saveMedidasProteccionRequest({ registroId, payload }) {
  const response = await api.put(
    `/registros/${registroId}/medidas-proteccion`,
    payload
  );

  return response.data;
}

export async function saveCierreCasoRequest({ registroId, payload }) {
  const response = await api.put(
    `/registros/${registroId}/cierre-caso`,
    payload
  );

  return response.data;
}

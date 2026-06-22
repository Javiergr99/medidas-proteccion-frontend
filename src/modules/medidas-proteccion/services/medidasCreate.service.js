import http from "../../../api/http";

export async function createRegistroRequest(payload) {
  const response = await http.post("/registros/", payload);
  return response.data;
}

export async function updateDatosGeneralesRequest({ registroId, payload }) {
  const response = await http.patch(
    `/registros/${registroId}/datos-generales`,
    payload
  );

  return response.data;
}

export async function saveImpresionDiagnosticaRequest({ registroId, payload }) {
  const response = await http.put(
    `/registros/${registroId}/impresion-diagnostica`,
    payload
  );

  return response.data;
}

export async function saveIntervencionMultidisciplinariaRequest({
  registroId,
  payload,
}) {
  const response = await http.put(
    `/registros/${registroId}/intervencion-multidisciplinaria`,
    payload
  );

  return response.data;
}

export async function savePlanRestitucionRequest({ registroId, payload }) {
  const response = await http.put(
    `/registros/${registroId}/plan-restitucion`,
    payload
  );

  return response.data;
}

export async function saveMedidasProteccionRequest({ registroId, payload }) {
  const response = await http.put(
    `/registros/${registroId}/medidas-proteccion`,
    payload
  );

  return response.data;
}

export async function saveCierreCasoRequest({ registroId, payload }) {
  const response = await http.put(
    `/registros/${registroId}/cierre-caso`,
    payload
  );

  return response.data;
}

export async function sendRegistroRevisionRequest(registroId) {
  const response = await http.post(`/registros/${registroId}/enviar-revision`);
  return response.data;
}

export function normalizeRegistroSession(registro) {
  if (!registro?.id || !registro?.id_mp) {
    return null;
  }

  return {
    registroId: String(registro.id),
    idMp: String(registro.id_mp),
    estadoActual: registro.estado_actual || "En captura",
    registro,
  };
}
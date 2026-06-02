import api from "../../../api/http";
import endpoints from "../../../api/endpoints";
import { MEDIDAS_ENDPOINT_LIMIT } from "../constants/medidas.constants";

function normalizeRegistroId(registroId) {
  return String(registroId || "").trim();
}

function assertRegistroId(registroId) {
  const cleanRegistroId = normalizeRegistroId(registroId);

  if (!cleanRegistroId) {
    throw new Error("No se pudo determinar el ID del registro.");
  }

  return cleanRegistroId;
}

/**
 * GET /registros/
 *
 * Contrato backend:
 * - Requiere MP_LEER_REGISTRO.
 * - Usa paginación offset/limit: skip, limit.
 * - Devuelve arreglo directo, sin total.
 * - En esta fase no acepta filtros ni ordenamiento backend.
 */
export async function fetchMedidasRegistros({
  skip = 0,
  limit = MEDIDAS_ENDPOINT_LIMIT,
} = {}) {
  const response = await api.get(endpoints.registros.list, {
    params: {
      skip,
      limit,
    },
  });

  return Array.isArray(response.data) ? response.data : [];
}

/**
 * POST /registros/
 *
 * Se usará en la fase de captura.
 */
export async function createMedidasRegistro(payload) {
  const response = await api.post(endpoints.registros.create, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
}

/**
 * PATCH /registros/{registro_id}/datos-generales
 *
 * Backend confirmó PATCH para actualización parcial.
 */
export async function updateMedidasDatosGenerales({ registroId, payload }) {
  const cleanRegistroId = assertRegistroId(registroId);

  const response = await api.patch(
    endpoints.registros.updateDatosGenerales(cleanRegistroId),
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

export async function sendMedidasRegistroToReview(registroId) {
  const cleanRegistroId = assertRegistroId(registroId);

  const response = await api.post(
    endpoints.registros.enviarRevision(cleanRegistroId)
  );

  return response.data;
}

export async function approveMedidasRegistro(registroId) {
  const cleanRegistroId = assertRegistroId(registroId);

  const response = await api.post(endpoints.registros.aprobar(cleanRegistroId));

  return response.data;
}

export async function returnMedidasRegistro({ registroId, motivo }) {
  const cleanRegistroId = assertRegistroId(registroId);

  const response = await api.post(
    endpoints.registros.devolver(cleanRegistroId),
    {
      motivo: String(motivo || "").trim(),
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}
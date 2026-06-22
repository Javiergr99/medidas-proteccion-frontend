import http from "../../../api/http";

const VERIFY_NNA_ENDPOINT = "/nna/verificar-nna";

function cleanText(value) {
  return String(value || "").trim();
}

function buildVerifyNnaParams({
  curp = "",
  nombre = "",
  primerApellido = "",
  fechaNacimiento = "",
  sexoId = "",
}) {
  const params = new URLSearchParams();

  const cleanCurp = cleanText(curp).toUpperCase();

  if (cleanCurp) {
    params.set("curp", cleanCurp);
    return params;
  }

  if (cleanText(nombre)) {
    params.set("nombre", cleanText(nombre));
  }

  if (cleanText(primerApellido)) {
    params.set("primer_apellido", cleanText(primerApellido));
  }

  if (cleanText(fechaNacimiento)) {
    params.set("fecha_nacimiento", cleanText(fechaNacimiento));
  }

  if (sexoId) {
    params.set("sexo_id", String(sexoId));
  }

  return params;
}

export async function verifyNnaRequest(payload) {
  const params = buildVerifyNnaParams(payload);

  const response = await http.get(VERIFY_NNA_ENDPOINT, {
    params,
  });

  return response.data;
}
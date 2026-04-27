function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function pickFirstValue(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim() !== "") {
      return value.trim();
    }

    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return null;
}

function unwrapPayload(payload) {
  if (!isPlainObject(payload)) return {};
  return isPlainObject(payload.data) ? payload.data : payload;
}

export function getErrorMessage(
  error,
  fallback = "Ocurrió un error al procesar la solicitud."
) {
  const responseData = error?.response?.data;

  const detail = pickFirstValue(
    responseData?.detail,
    responseData?.message,
    responseData?.error,
    error?.message
  );

  if (typeof detail === "string" && detail.trim()) {
    return detail.trim();
  }

  if (Array.isArray(responseData?.detail)) {
    return responseData.detail
      .map((item) => item?.msg || item?.message || "")
      .filter(Boolean)
      .join(" ");
  }

  if (isPlainObject(responseData?.detail)) {
    return responseData.detail.message || responseData.detail.msg || fallback;
  }

  return fallback;
}

export function getAuthUserDisplayName(user) {
  return (
    user?.nombre ||
    user?.name ||
    user?.full_name ||
    user?.correo ||
    user?.email ||
    user?.username ||
    "Usuario"
  );
}

export function normalizePendingTwoFactor(payload, loginIdentifier = "") {
  const data = unwrapPayload(payload);

  const status = pickFirstValue(data?.status);
  const tempUserId = pickFirstValue(data?.temp_user_id, data?.user_id);
  const message = pickFirstValue(data?.message);

  if (!status || !tempUserId) {
    return null;
  }

  if (status !== "pending_setup" && status !== "pending_2fa") {
    return null;
  }

  return {
    status,
    tempUserId,
    email: loginIdentifier || "",
    userHint: loginIdentifier || "",
    message,
    qrImageUrl: null,
  };
}

export function normalizeFinalSession(payload) {
  const data = unwrapPayload(payload);

  const token = pickFirstValue(
    data?.access_token,
    data?.token,
    data?.accessToken
  );

  if (!token) {
    return null;
  }

  const tokenType =
    pickFirstValue(data?.token_type, data?.tokenType) || "bearer";

  return {
    token,
    tokenType,
  };
}

export function normalizeEnableSuccess(payload) {
  const data = unwrapPayload(payload);
  const message = pickFirstValue(data?.message);

  if (message === "Autenticación de dos factores activada con éxito.") {
    return {
      message,
    };
  }

  return null;
}

export function normalizeUserProfile(payload) {
  const data = unwrapPayload(payload);

  if (!isPlainObject(data)) return null;

  return data;
}

export function resolveLoginFlow(payload, loginIdentifier = "") {
  const pending = normalizePendingTwoFactor(payload, loginIdentifier);

  if (pending) {
    return {
      type: "pending_two_factor",
      challenge: pending,
    };
  }

  throw new Error(
    "La respuesta del login no coincide con el contrato esperado del backend."
  );
}
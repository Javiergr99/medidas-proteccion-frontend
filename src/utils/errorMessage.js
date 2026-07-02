export function getErrorMessage(error, fallback = "Ocurrió un error inesperado.") {
  const data = error?.response?.data;

  if (typeof data?.detail === "string") {
    return data.detail;
  }

  if (Array.isArray(data?.detail)) {
    return data.detail
      .map((item) => item?.msg || item?.message || "")
      .filter(Boolean)
      .join(" ");
  }

  if (typeof data?.message === "string") {
    return data.message;
  }

  if (typeof error?.message === "string") {
    return error.message;
  }

  return fallback;
}

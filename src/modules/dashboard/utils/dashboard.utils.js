import { registryCatalog } from "../data/registryCatalog";

/**
 * Lee el usuario autenticado desde localStorage.
 */
export function getStoredDashboardUser() {
  try {
    return JSON.parse(localStorage.getItem("auth_user") || "null");
  } catch {
    return null;
  }
}

/**
 * Normaliza texto para comparar claves, nombres o códigos de registros.
 */
function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Busca un registro dentro del catálogo visual local.
 */
function getRegistryFromCatalog(value) {
  const normalizedValue = normalizeText(value);

  if (!normalizedValue) return null;

  return (
    Object.values(registryCatalog).find((registry) => {
      const normalizedKey = normalizeText(registry.key);
      const normalizedCode = normalizeText(registry.code);
      const normalizedTitle = normalizeText(registry.title);
      const normalizedSubtitle = normalizeText(registry.subtitle);

      const normalizedAliases = registry.aliases.map((alias) =>
        normalizeText(alias)
      );

      return (
        normalizedValue === normalizedKey ||
        normalizedValue === normalizedCode ||
        normalizedValue === normalizedTitle ||
        normalizedValue === normalizedSubtitle ||
        normalizedAliases.includes(normalizedValue)
      );
    }) || null
  );
}

/**
 * Obtiene el valor candidato de registro desde distintas formas posibles
 * que puede devolver el backend.
 */
function getRegistryCandidateValue(item) {
  if (!item) return "";

  if (typeof item === "string" || typeof item === "number") {
    return item;
  }

  return (
    item.key ||
    item.codigo ||
    item.code ||
    item.clave ||
    item.acro ||
    item.nombre ||
    item.name ||
    item.registro_codigo ||
    item.registroCode ||
    item.registro_key ||
    item.registroKey ||
    item.registro?.key ||
    item.registro?.codigo ||
    item.registro?.code ||
    item.registro?.clave ||
    item.registro?.acro ||
    item.registro?.nombre ||
    item.registro?.name ||
    ""
  );
}

/**
 * Valida si un acceso está activo.
 */
function isActiveAccess(item) {
  if (!item || typeof item !== "object") return true;

  if (typeof item.is_active === "boolean") return item.is_active;
  if (typeof item.isActive === "boolean") return item.isActive;
  if (typeof item.activo === "boolean") return item.activo;
  if (typeof item.active === "boolean") return item.active;

  return true;
}

/**
 * Extrae los registros permitidos desde el usuario autenticado.
 *
 * No asigna tarjetas manualmente.
 * Solo muestra registros si vienen en la respuesta del backend.
 */
export function getAllowedRegistriesFromUser(user) {
  const possibleAccessLists = [
    user?.registros,
    user?.registros_disponibles,
    user?.registrosDisponibles,
    user?.accesos,
    user?.accesses,
    user?.user_access,
    user?.userAccess,
    user?.permissions?.registros,
    user?.permisos?.registros,
  ];

  const rawItems = possibleAccessLists.find((list) => Array.isArray(list)) || [];

  const registriesMap = new Map();

  rawItems.forEach((item) => {
    if (!isActiveAccess(item)) return;

    const candidateValue = getRegistryCandidateValue(item);
    const registry = getRegistryFromCatalog(candidateValue);

    if (registry) {
      registriesMap.set(registry.key, registry);
    }
  });

  return Array.from(registriesMap.values());
}

/**
 * Obtiene el nombre visible del usuario.
 */
export function getDashboardDisplayName(user) {
  return (
    user?.nombre_completo ||
    user?.nombreCompleto ||
    user?.nombre ||
    user?.name ||
    "Usuario"
  );
}

/**
 * Obtiene el rol visible del usuario.
 */
export function getDashboardRoleLabel(user) {
  if (typeof user?.rol === "string") return user.rol;
  if (typeof user?.role === "string") return user.role;

  return (
    user?.rol?.nombre ||
    user?.role?.nombre ||
    user?.rol?.name ||
    user?.role?.name ||
    "Perfil autorizado"
  );
}
import { registryCatalog } from "../data/registryCatalog";
import {
  findPermissionGroup,
  getActionNamesFromGroup,
  getModulesFromGroup,
  getPermissionGroups,
  hasRegistryAccess,
} from "../../../utils/rbac";

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
 * Normaliza texto para comparar claves, nombres o códigos.
 */
function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Busca el grupo real del backend para un registro del catálogo.
 *
 * Primero intenta por groupCode directo:
 * - MP
 * - MH
 * - RNCAS
 * - VF
 *
 * Luego intenta por aliases/descripción para soportar variaciones.
 */
function getRegistryPermissionGroup(user, registry) {
  const directGroup = findPermissionGroup(user, registry.groupCode);

  if (directGroup) {
    return directGroup;
  }

  const groups = getPermissionGroups(user);

  const registryCandidates = [
    registry.groupCode,
    registry.code,
    registry.key,
    registry.title,
    registry.subtitle,
    ...(registry.aliases || []),
  ].map(normalizeText);

  return (
    groups.find((group) => {
      const groupCandidates = [
        group?.nombre,
        group?.name,
        group?.codigo,
        group?.code,
        group?.clave,
        group?.descripcion,
        group?.description,
      ].map(normalizeText);

      return groupCandidates.some((candidate) =>
        registryCandidates.includes(candidate)
      );
    }) || null
  );
}

/**
 * Extrae metadatos útiles del grupo para futuras pantallas.
 */
function buildRegistryAccessFromGroup({ registry, group, canOpen }) {
  const modules = getModulesFromGroup(group);
  const actionNames = getActionNamesFromGroup(group);

  return {
    ...registry,
    groupId: group?.id || null,
    groupCode: group?.nombre || registry.groupCode || registry.code,
    groupDescription: group?.descripcion || registry.title,
    modulesCount: modules.length,
    actionsCount: actionNames.size,
    grantedActions: Array.from(actionNames),

    /**
     * Indica si además de estar asociado al grupo,
     * cumple la regla fina para abrir la ruta.
     *
     * Por ahora la tarjeta se muestra por pertenencia al grupo.
     * La ruta interna sigue protegida por PermissionRoute.
     */
    canOpen,
  };
}

/**
 * Extrae los registros permitidos/asociados desde el usuario autenticado.
 *
 * Regla:
 * - El dashboard muestra tarjetas por pertenencia a user.permisos.grupos.
 * - No oculta la tarjeta solo porque falte una acción específica.
 * - Las acciones específicas se validan al entrar a la ruta con PermissionRoute.
 */
export function getAllowedRegistriesFromUser(user) {
  if (!user) return [];

  const allowedRegistries = [];

  for (const registry of Object.values(registryCatalog)) {
    const group = getRegistryPermissionGroup(user, registry);

    if (!group) {
      continue;
    }

    const canOpen = hasRegistryAccess(user, registry.accessRule);

    allowedRegistries.push(
      buildRegistryAccessFromGroup({
        registry,
        group,
        canOpen,
      })
    );
  }

  return allowedRegistries;
}

/**
 * Obtiene el nombre visible del usuario.
 */
export function getDashboardDisplayName(user) {
  const fullName = [
    user?.nombre,
    user?.primer_apellido,
    user?.segundo_apellido,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    user?.nombre_completo ||
    user?.nombreCompleto ||
    fullName ||
    user?.name ||
    user?.correo_electronico ||
    user?.email ||
    "Usuario"
  );
}

/**
 * Obtiene una etiqueta visible del perfil/contexto institucional.
 */
export function getDashboardRoleLabel(user) {
  if (typeof user?.rol === "string") return user.rol;
  if (typeof user?.role === "string") return user.role;

  const instance = user?.instancia?.siglas || user?.instancia?.nombre;
  const status = user?.estatus?.nombre;

  if (instance && status) {
    return `${instance} · ${status}`;
  }

  if (instance) {
    return instance;
  }

  const groups = getPermissionGroups(user)
    .map((group) => group?.nombre)
    .filter(Boolean);

  if (groups.length > 0) {
    return groups.join(", ");
  }

  return (
    user?.rol?.nombre ||
    user?.role?.nombre ||
    user?.rol?.name ||
    user?.role?.name ||
    "Perfil autorizado"
  );
}
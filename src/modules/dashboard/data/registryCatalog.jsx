import AssignmentTurnedInRoundedIcon from "@mui/icons-material/AssignmentTurnedInRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import HealthAndSafetyRoundedIcon from "@mui/icons-material/HealthAndSafetyRounded";

import routes from "../../../app/routes";
import { REGISTRY_ACCESS_RULES } from "../../../utils/rbac";

/**
 * Catálogo visual local.
 *
 * Importante:
 * Este catálogo NO asigna permisos.
 * Solo traduce los grupos/acciones que vengan del backend a tarjetas visuales.
 *
 * Backend actual:
 * permisos.grupos[].modulos[].acciones[].nombre
 */
export const registryCatalog = {
  rncas: {
    key: "rncas",
    groupCode: REGISTRY_ACCESS_RULES.rncas.groupCode,
    accessRule: REGISTRY_ACCESS_RULES.rncas,
    aliases: [
      "rncas",
      "registro nacional de centros de asistencia social",
      "centros de asistencia social",
      "cas",
    ],
    code: "RNCAS",
    title: "Registro Nacional de Centros de Asistencia Social",
    subtitle: "Centros de asistencia social",
    description:
      "Consulta y da seguimiento a la información relacionada con centros de asistencia social y los registros habilitados para tu perfil.",
    route: routes.rncas || routes.dashboard,
    icon: <AssignmentTurnedInRoundedIcon sx={{ fontSize: 34 }} />,
  },

  rmh: {
    key: "rmh",
    groupCode: REGISTRY_ACCESS_RULES.movilidadHumana.groupCode,
    accessRule: REGISTRY_ACCESS_RULES.movilidadHumana,
    aliases: [
      "mh",
      "rmh",
      "movilidad humana",
      "registro de movilidad humana",
      "registro de ninas ninos y adolescentes en movilidad humana",
      "registro de niñas niños y adolescentes en movilidad humana",
    ],
    code: "MH",
    title: "Registro de Niñas, Niños y Adolescentes en Movilidad Humana",
    subtitle: "Movilidad humana",
    description:
      "Accede al módulo de movilidad humana para consultar información, validar datos y continuar con los flujos habilitados.",
    route: routes.movilidadHumana || routes.dashboard,
    icon: <SyncRoundedIcon sx={{ fontSize: 34 }} />,
  },

  dvf: {
    key: "dvf",
    groupCode: REGISTRY_ACCESS_RULES.vivirEnFamilia.groupCode,
    accessRule: REGISTRY_ACCESS_RULES.vivirEnFamilia,
    aliases: [
      "vf",
      "dvf",
      "vivir en familia",
      "derecho a vivir en familia",
      "registro de derecho a vivir en familia",
      "registro del derecho a vivir en familia",
    ],
    code: "VF",
    title: "Registro del Derecho a Vivir en Familia",
    subtitle: "Derecho a vivir en familia",
    description:
      "Ingresa al registro vinculado con el derecho a vivir en familia y consulta la información disponible según tus privilegios.",
    route: routes.vivirEnFamilia || routes.dashboard,
    icon: <FavoriteBorderRoundedIcon sx={{ fontSize: 34 }} />,
  },

  rmp: {
    key: "rmp",
    groupCode: REGISTRY_ACCESS_RULES.medidasProteccion.groupCode,
    accessRule: REGISTRY_ACCESS_RULES.medidasProteccion,
    aliases: [
      "mp",
      "rmp",
      "medidas",
      "medidas de proteccion",
      "medidas de protección",
      "registro de medidas de proteccion",
      "registro de medidas de protección",
    ],
    code: "MP",
    title: "Registro de Medidas de Protección",
    subtitle: "Medidas de protección",
    description:
      "Accede al registro de medidas de protección para consultar, capturar o dar seguimiento a los casos asociados a tu cuenta.",
    route: routes.medidas || routes.dashboard,
    icon: <HealthAndSafetyRoundedIcon sx={{ fontSize: 34 }} />,
  },
};
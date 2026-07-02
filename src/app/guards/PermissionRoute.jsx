import { useEffect } from "react";
import PropTypes from "prop-types";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import routes from "../routes";
import { useAuth } from "../../hooks/useAuth";
import { getStoredAuthSession } from "../../utils/storage";
import { hasPermissionGroupAccess } from "../../utils/rbac";
import {
  getLoginUniversalRedirectPath,
  redirectToLoginUniversal,
} from "../../utils/externalAuthRedirect";

const EMPTY_ACTIONS = [];

/**
 * Protege rutas por permisos RBAC.
 *
 * Estructura backend esperada:
 * user.permisos.grupos[].modulos[].acciones[].nombre
 */
export default function PermissionRoute({
  children = null,
  accessRule = null,
  groupCode = "",
  allowGroupOnly = false,
  requiredActions = EMPTY_ACTIONS,
  fallbackActions = EMPTY_ACTIONS,
  redirectTo = routes.medidas,
}) {
  const location = useLocation();
  const { user: authUser, isAuthenticated } = useAuth();

  const storedSession = getStoredAuthSession();
  const user = authUser || storedSession.user;
  const hasToken = Boolean(storedSession.token);

  const resolvedGroupCode = accessRule?.groupCode || groupCode;
  const resolvedAllowGroupOnly = accessRule?.allowGroupOnly ?? allowGroupOnly;
  const resolvedRequiredActions =
    accessRule?.requiredActions || requiredActions;
  const resolvedFallbackActions =
    accessRule?.fallbackActions || fallbackActions;

  const hasSession = isAuthenticated || hasToken;

  useEffect(() => {
    if (!hasSession) {
      redirectToLoginUniversal(getLoginUniversalRedirectPath(location));
    }
  }, [hasSession, location]);

  if (!hasSession) {
    return null;
  }

  const hasAccess = hasPermissionGroupAccess({
    user,
    groupCode: resolvedGroupCode,
    allowGroupOnly: resolvedAllowGroupOnly,
    requiredActions: resolvedRequiredActions,
    fallbackActions: resolvedFallbackActions,
  });

  if (!hasAccess) {
    return (
      <Navigate
        to={redirectTo}
        replace
        state={{
          accessDenied: true,
          deniedGroupCode: resolvedGroupCode,
          from: location.pathname,
        }}
      />
    );
  }

  return children || <Outlet />;
}

PermissionRoute.propTypes = {
  children: PropTypes.node,
  accessRule: PropTypes.shape({
    groupCode: PropTypes.string.isRequired,
    allowGroupOnly: PropTypes.bool,
    requiredActions: PropTypes.arrayOf(PropTypes.string),
    fallbackActions: PropTypes.arrayOf(PropTypes.string),
  }),
  groupCode: PropTypes.string,
  allowGroupOnly: PropTypes.bool,
  requiredActions: PropTypes.arrayOf(PropTypes.string),
  fallbackActions: PropTypes.arrayOf(PropTypes.string),
  redirectTo: PropTypes.string,
};
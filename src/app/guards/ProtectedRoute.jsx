import { useEffect } from "react";
import PropTypes from "prop-types";
import { Outlet, useLocation } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import {
  getLoginUniversalRedirectPath,
  redirectToLoginUniversal,
} from "../../utils/externalAuthRedirect";

/**
 * Protege rutas privadas de MP.
 *
 * MP ya no tiene login interno.
 * Si no hay sesión, redirige al Login Universal.
 */
export default function ProtectedRoute({ children = null }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      redirectToLoginUniversal(getLoginUniversalRedirectPath(location));
    }
  }, [isAuthenticated, location]);

  if (!isAuthenticated) {
    return null;
  }

  return children || <Outlet />;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};
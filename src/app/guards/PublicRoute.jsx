import PropTypes from "prop-types";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import routes from "../routes";
import { useAuth } from "../../hooks/useAuth";
import { getPostLoginWelcomeFlag } from "../../utils/storage";

/**
 * Protege rutas públicas como login.
 * Si ya hay sesión, redirige al dashboard o a bienvenida.
 * Si existe reto 2FA pendiente, redirige a verificación.
 *
 * @param {{
 *   children?: import("react").ReactNode,
 *   redirectTo?: string
 * }} props
 * @returns {JSX.Element}
 */
export default function PublicRoute({
  children = null,
  redirectTo = routes.dashboard,
}) {
  const { isAuthenticated, isPendingTwoFactor } = useAuth();
  const location = useLocation();

  const shouldShowPostLoginWelcome = getPostLoginWelcomeFlag();

  if (isPendingTwoFactor && location.pathname !== routes.twoFactor) {
    return <Navigate to={routes.twoFactor} replace />;
  }

  if (isAuthenticated) {
    if (
      shouldShowPostLoginWelcome &&
      location.pathname !== routes.postLoginWelcome
    ) {
      return <Navigate to={routes.postLoginWelcome} replace />;
    }

    return <Navigate to={redirectTo} replace />;
  }

  return children || <Outlet />;
}

PublicRoute.propTypes = {
  children: PropTypes.node,
  redirectTo: PropTypes.string,
};
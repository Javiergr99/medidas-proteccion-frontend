import PropTypes from "prop-types";
import { Navigate, Outlet } from "react-router-dom";

import routes from "../routes";
import { useAuth } from "../../hooks/useAuth";

/**
 * Protege rutas públicas como login.
 * Si ya hay sesión, redirige al dashboard.
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
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children || <Outlet />;
}

PublicRoute.propTypes = {
  children: PropTypes.node,
  redirectTo: PropTypes.string,
};
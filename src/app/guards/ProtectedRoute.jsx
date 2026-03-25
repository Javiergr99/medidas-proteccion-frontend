import PropTypes from "prop-types";
import { Navigate, Outlet } from "react-router-dom";

import routes from "../routes";
import { useAuth } from "../../hooks/useAuth";

/**
 * Protege rutas privadas.
 * Si no hay sesión, redirige al login.
 *
 * @param {{
 *   children?: import("react").ReactNode,
 *   redirectTo?: string
 * }} props
 * @returns {JSX.Element}
 */
export default function ProtectedRoute({
  children = null,
  redirectTo = routes.login,
}) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children || <Outlet />;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node,
  redirectTo: PropTypes.string,
};
import PropTypes from "prop-types";
import { Navigate, Outlet } from "react-router-dom";

import routes from "../routes";
import { useAuth } from "../../hooks/useAuth";
import { getTwoFactorTempSession } from "../../modules/auth/services/auth.service";

/**
 * Protege rutas privadas.
 *
 * Si no hay sesión, redirige al login.
 * Si hay reto 2FA pendiente, redirige a verificación.
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
  const { isAuthenticated, isPendingTwoFactor } = useAuth();

  const storedTwoFactor = getTwoFactorTempSession();

  const hasStoredTwoFactorChallenge =
    Boolean(storedTwoFactor?.userId) &&
    (storedTwoFactor?.status === "pending_setup" ||
      storedTwoFactor?.status === "pending_2fa");

  if (isPendingTwoFactor || hasStoredTwoFactorChallenge) {
    return <Navigate to={routes.twoFactor} replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children || <Outlet />;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node,
  redirectTo: PropTypes.string,
};
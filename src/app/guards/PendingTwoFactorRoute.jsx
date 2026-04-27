import PropTypes from "prop-types";
import { Navigate, Outlet } from "react-router-dom";

import routes from "../routes";
import { useAuth } from "../../hooks/useAuth";
import { getPostLoginWelcomeFlag } from "../../utils/storage";

/**
 * Protege la ruta de verificación 2FA.
 * Solo permite entrar si hay un reto pendiente.
 *
 * @param {{
 *   children?: import("react").ReactNode
 * }} props
 * @returns {JSX.Element}
 */
export default function PendingTwoFactorRoute({ children = null }) {
  const { isAuthenticated, isPendingTwoFactor } = useAuth();

  if (isAuthenticated) {
    if (getPostLoginWelcomeFlag()) {
      return <Navigate to={routes.postLoginWelcome} replace />;
    }

    return <Navigate to={routes.dashboard} replace />;
  }

  if (!isPendingTwoFactor) {
    return <Navigate to={routes.login} replace />;
  }

  return children || <Outlet />;
}

PendingTwoFactorRoute.propTypes = {
  children: PropTypes.node,
};
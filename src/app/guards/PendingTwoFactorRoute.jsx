import PropTypes from "prop-types";
import { Navigate, Outlet } from "react-router-dom";

import routes from "../routes";
import { useAuth } from "../../hooks/useAuth";
import { getPostLoginWelcomeFlag } from "../../utils/storage";
import { getTwoFactorTempSession } from "../../modules/auth/services/auth.service";

/**
 * Protege la ruta de verificación 2FA.
 *
 * Solo permite entrar si hay un reto pendiente.
 * También permite continuar si el reto 2FA existe en localStorage,
 * para evitar que una recarga de página rompa el flujo.
 *
 * @param {{
 *   children?: import("react").ReactNode
 * }} props
 * @returns {JSX.Element}
 */
export default function PendingTwoFactorRoute({ children = null }) {
  const { isAuthenticated, isPendingTwoFactor } = useAuth();

  const storedTwoFactor = getTwoFactorTempSession();

  const hasStoredTwoFactorChallenge =
    Boolean(storedTwoFactor?.userId) &&
    (storedTwoFactor?.status === "pending_setup" ||
      storedTwoFactor?.status === "pending_2fa");

  if (isAuthenticated) {
    if (getPostLoginWelcomeFlag()) {
      return <Navigate to={routes.postLoginWelcome} replace />;
    }

    return <Navigate to={routes.dashboard} replace />;
  }

  if (!isPendingTwoFactor && !hasStoredTwoFactorChallenge) {
    return <Navigate to={routes.login} replace />;
  }

  return children || <Outlet />;
}

PendingTwoFactorRoute.propTypes = {
  children: PropTypes.node,
};
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import routes from "./routes";
import ProtectedRoute from "./guards/ProtectedRoute";
import PublicRoute from "./guards/PublicRoute";
import PendingTwoFactorRoute from "./guards/PendingTwoFactorRoute";

import HomePage from "../modules/landing/pages/HomePage";
import LoginPage from "../modules/auth/pages/LoginPage";
import ForgotPasswordPage from "../modules/auth/pages/ForgotPasswordPage";
import TwoFactorPage from "../modules/auth/pages/TwoFactorPage";
import DashboardPage from "../modules/dashboard/pages/DashboardPage";
import PostLoginWelcomePage from "../modules/auth/pages/PostLoginWelcomePage";

/**
 * Router principal de la aplicación.
 * @returns {JSX.Element}
 */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={routes.root} element={<HomePage />} />

        <Route element={<PublicRoute />}>
          <Route path={routes.login} element={<LoginPage />} />
          <Route path={routes.forgotPassword} element={<ForgotPasswordPage />} />
        </Route>

        <Route element={<PendingTwoFactorRoute />}>
          <Route path={routes.twoFactor} element={<TwoFactorPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path={routes.dashboard} element={<DashboardPage />} />
          <Route path={routes.postLoginWelcome} element={<PostLoginWelcomePage />} />
        </Route>

        <Route path="*" element={<Navigate to={routes.root} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import routes from "./routes";
import ProtectedRoute from "./guards/ProtectedRoute";
import PublicRoute from "./guards/PublicRoute";

import LoginPage from "../modules/auth/pages/LoginPage";
import ForgotPasswordPage from "../modules/auth/pages/ForgotPasswordPage";
import DashboardPage from "../modules/dashboard/pages/DashboardPage";
// Más adelante:
// import MedidasListPage from "../modules/medidas-proteccion/pages/MedidasListPage";

/**
 * Router principal de la aplicación.
 * @returns {JSX.Element}
 */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route element={<PublicRoute />}>
          <Route path={routes.login} element={<LoginPage />} />
          <Route path={routes.forgotPassword} element={<ForgotPasswordPage />} />
        </Route>

        {/* Rutas privadas */}
        <Route element={<ProtectedRoute />}>
          <Route path={routes.root} element={<Navigate to={routes.dashboard} replace />} />
          <Route path={routes.dashboard} element={<DashboardPage />} />
          {/* <Route path={routes.medidas} element={<MedidasListPage />} /> */}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={routes.root} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
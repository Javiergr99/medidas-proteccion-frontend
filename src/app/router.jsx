import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";

import routes from "./routes";
import ProtectedRoute from "./guards/ProtectedRoute";
import PermissionRoute from "./guards/PermissionRoute";

import {
  MP_ACTIONS,
  REGISTRY_ROUTE_ACCESS_RULES,
} from "../utils/rbac";

const MedidasListPage = lazy(() =>
  import("../modules/medidas-proteccion/pages/MedidasListPage")
);

const MedidasCreatePage = lazy(() =>
  import("../modules/medidas-proteccion/pages/MedidasCreatePage")
);

const medidasCreateAccessRule = {
  groupCode: "MP",
  allowGroupOnly: false,
  requiredActions: [MP_ACTIONS.CREAR_REGISTRO],
  fallbackActions: [],
};

function RouteLoadingFallback() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        background:
          "linear-gradient(135deg, #f8fafc 0%, #f3f4f6 46%, #f7f1e9 100%)",
        fontFamily: "Noto Sans, sans-serif",
      }}
    >
      <CircularProgress
        size={42}
        thickness={4.2}
        sx={{
          color: "#8f1538",
        }}
      />

      <Typography
        sx={{
          fontFamily: "Noto Sans, sans-serif",
          fontWeight: 800,
          color: "#8f1538",
          fontSize: "0.95rem",
        }}
      >
        Cargando módulo…
      </Typography>
    </Box>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route
            path={routes.root}
            element={<Navigate to={routes.medidas} replace />}
          />

          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <PermissionRoute
                  accessRule={REGISTRY_ROUTE_ACCESS_RULES.medidasProteccionList}
                  redirectTo={routes.medidas}
                />
              }
            >
              <Route path={routes.medidas} element={<MedidasListPage />} />
            </Route>

            <Route
              element={
                <PermissionRoute
                  accessRule={medidasCreateAccessRule}
                  redirectTo={routes.medidas}
                />
              }
            >
              <Route
                path={routes.medidasNuevo}
                element={<MedidasCreatePage />}
              />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to={routes.medidas} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
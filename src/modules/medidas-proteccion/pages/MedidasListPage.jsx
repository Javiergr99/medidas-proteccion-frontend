import { useMemo, useState } from "react";
import { Box, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

import routes from "../../../app/routes";
import { useAuth } from "../../../hooks/useAuth";
import { getStoredAuthSession } from "../../../utils/storage";
import { hasUserAction } from "../../../utils/rbac";

import { MEDIDAS_PERMISSIONS } from "../constants/medidas.constants";
import { MEDIDAS_CREATE_ROUTE } from "../constants/medidasCreate.constants";
import { useMedidasList } from "../hooks/useMedidasList";

import MedidasListHeader from "../components/list/MedidasListHeader";
import MedidasPagination from "../components/list/MedidasPagination";
import MedidasSummaryCards from "../components/list/MedidasSummaryCards";
import MedidasTable from "../components/list/MedidasTable";
import MedidasModuleHeader from "../components/navigation/MedidasModuleHeader";
import {
  MedidasEmptyState,
  MedidasErrorState,
  MedidasLoadingState,
  MedidasPermissionState,
} from "../components/list/MedidasListState";

function getUserDisplayName(user) {
  const fullName = [
    user?.nombre,
    user?.primer_apellido,
    user?.segundo_apellido,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    user?.nombre_completo ||
    user?.nombreCompleto ||
    fullName ||
    user?.name ||
    user?.correo_electronico ||
    user?.email ||
    "Usuario"
  );
}

export default function MedidasListPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user: authUser, logout } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);

  const storedSession = getStoredAuthSession();
  const user = authUser || storedSession?.user;

  const displayName = useMemo(() => getUserDisplayName(user), [user]);

  const canReadRecords = hasUserAction(user, MEDIDAS_PERMISSIONS.READ);
  const canCreateRecord = hasUserAction(user, MEDIDAS_PERMISSIONS.CREATE);

  const canViewDetail = false;

  const {
    clearFilters,
    currentPage,
    endRecord,
    errorMessage,
    filters,
    hasActiveFilters,
    hasLoaded,
    loadRecords,
    loading,
    pageCount,
    records,
    setFilter,
    setPage,
    startRecord,
    summary,
    visibleRecords,
  } = useMedidasList({
    canRead: canReadRecords,
  });

  function handleGoToDashboard() {
    window.location.assign(routes.loginUniversalDashboard);
  }

  function handleGoToList() {
    navigate(routes.medidas);
  }

  function handleGoToMining() {
    enqueueSnackbar(
      "El módulo de minería de datos se integrará en una fase posterior.",
      {
        variant: "info",
      }
    );
  }

  function handleGoToWorkflow() {
    navigate(MEDIDAS_CREATE_ROUTE);
  }

  function handleViewProfile() {
    window.location.assign(`${routes.loginUniversalProfile}?mode=view`);
  }

  function handleCreateRecord() {
    navigate(MEDIDAS_CREATE_ROUTE);
  }

  function handleViewRecord(record) {
    enqueueSnackbar(
      `El detalle del registro ${record.id} queda pendiente hasta que backend confirme GET /registros/{registro_id}.`,
      {
        variant: "info",
      }
    );
  }

  function handlePageChange(_, nextPage) {
    setPage(nextPage);
  }

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logout();
    } finally {
      window.location.replace(routes.loginUniversalLogout);
      }
  }

  function renderContent() {
    if (!canReadRecords) {
      return <MedidasPermissionState />;
    }

    if (loading && !hasLoaded) {
      return <MedidasLoadingState />;
    }

    if (errorMessage) {
      return <MedidasErrorState message={errorMessage} onRetry={loadRecords} />;
    }

    return (
      <>
        <Box sx={{ width: "100%", minWidth: 0 }}>
          <MedidasSummaryCards summary={summary} />
        </Box>

        {records.length === 0 ? (
          <MedidasEmptyState />
        ) : (
          <Stack spacing={1.8} sx={{ width: "100%", minWidth: 0 }}>
            <Box sx={{ width: "100%", minWidth: 0, overflow: "hidden" }}>
              <MedidasTable
                rows={visibleRecords}
                filters={filters}
                canViewDetail={canViewDetail}
                onFilterChange={setFilter}
                onViewRecord={handleViewRecord}
              />
            </Box>

            <MedidasPagination
              page={currentPage}
              pageCount={pageCount}
              visibleRecords={visibleRecords.length}
              startRecord={startRecord}
              endRecord={endRecord}
              onPageChange={handlePageChange}
            />
          </Stack>
        )}
      </>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        maxWidth: "100vw",
        overflowX: "hidden",
        backgroundColor: "#f7f8fa",
        fontFamily: "Noto Sans, sans-serif",
      }}
    >
      <MedidasModuleHeader
        activeSection="listado"
        displayName={displayName}
        loggingOut={loggingOut}
        onDashboard={handleGoToDashboard}
        onList={handleGoToList}
        onMining={handleGoToMining}
        onWorkflow={handleGoToWorkflow}
        onViewProfile={handleViewProfile}
        onLogout={handleLogout}
      />

      <Box
        component="main"
        sx={{
          width: "100%",
          maxWidth: "1360px",
          mx: "auto",
          px: { xs: 1.6, sm: 2.4, md: 3.2 },
          py: { xs: 2, sm: 2.6, md: 3.2 },
          boxSizing: "border-box",
          minWidth: 0,
          overflowX: "hidden",
        }}
      >
        <Stack
          spacing={{ xs: 1.8, md: 2.2 }}
          sx={{
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
          }}
        >
          <MedidasListHeader
            hasActiveFilters={hasActiveFilters}
            canCreate={canCreateRecord}
            loading={loading}
            onCreateRecord={handleCreateRecord}
            onClearFilters={clearFilters}
            onRefresh={loadRecords}
          />

          <Box
            sx={{
              width: "100%",
              maxWidth: "100%",
              minWidth: 0,
              display: "grid",
              gap: { xs: 1.8, md: 2.1 },
              overflowX: "hidden",
            }}
          >
            {renderContent()}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
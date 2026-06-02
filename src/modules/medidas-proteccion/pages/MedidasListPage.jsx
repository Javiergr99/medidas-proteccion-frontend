import { Box, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

import routes from "../../../app/routes";
import { useAuth } from "../../../hooks/useAuth";
import { getStoredAuthSession } from "../../../utils/storage";
import { hasUserAction } from "../../../utils/rbac";

import {
  MEDIDAS_PERMISSIONS,
} from "../constants/medidas.constants";
import { useMedidasList } from "../hooks/useMedidasList";

import MedidasListHeader from "../components/list/MedidasListHeader";
import MedidasPagination from "../components/list/MedidasPagination";
import MedidasSummaryCards from "../components/list/MedidasSummaryCards";
import MedidasTable from "../components/list/MedidasTable";
import {
  MedidasEmptyState,
  MedidasErrorState,
  MedidasLoadingState,
  MedidasPermissionState,
} from "../components/list/MedidasListState";

export default function MedidasListPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user: authUser } = useAuth();

  const storedSession = getStoredAuthSession();
  const user = authUser || storedSession.user;

  const canReadRecords = hasUserAction(user, MEDIDAS_PERMISSIONS.READ);
  const canCreateRecord = hasUserAction(user, MEDIDAS_PERMISSIONS.CREATE);

  /**
   * Pendiente:
   * Backend aún no confirma GET /registros/{registro_id}
   * ni acción RBAC específica para ver detalle.
   */
  const canViewDetail = false;

  const {
    clearFilters,
    currentPage,
    endRecord,
    errorMessage,
    filters,
    filteredRecords,
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

  function handleBackToDashboard() {
    navigate(routes.dashboard);
  }

  function handleCreateRecord() {
    enqueueSnackbar(
      "La captura de nuevo registro se integrará en la siguiente fase.",
      {
        variant: "info",
      }
    );
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f7f8fa",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, sm: 4, md: 4.5 },
        fontFamily: "Noto Sans, sans-serif",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "1480px",
          mx: "auto",
        }}
      >
        <Stack spacing={2.2}>
          <MedidasListHeader
            totalRecords={records.length}
            filteredRecords={filteredRecords.length}
            hasActiveFilters={hasActiveFilters}
            canCreate={canCreateRecord}
            loading={loading}
            onBack={handleBackToDashboard}
            onCreateRecord={handleCreateRecord}
            onClearFilters={clearFilters}
            onRefresh={loadRecords}
          />

          {!canReadRecords ? (
            <MedidasPermissionState />
          ) : loading && !hasLoaded ? (
            <MedidasLoadingState />
          ) : errorMessage ? (
            <MedidasErrorState message={errorMessage} onRetry={loadRecords} />
          ) : (
            <>
              <MedidasSummaryCards summary={summary} />

              {records.length === 0 ? (
                <MedidasEmptyState />
              ) : (
                <>
                  <MedidasTable
                    rows={visibleRecords}
                    filters={filters}
                    canViewDetail={canViewDetail}
                    onFilterChange={setFilter}
                    onViewRecord={handleViewRecord}
                  />

                  <MedidasPagination
                    page={currentPage}
                    pageCount={pageCount}
                    totalRecords={filteredRecords.length}
                    visibleRecords={visibleRecords.length}
                    startRecord={startRecord}
                    endRecord={endRecord}
                    onPageChange={handlePageChange}
                  />
                </>
              )}
            </>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
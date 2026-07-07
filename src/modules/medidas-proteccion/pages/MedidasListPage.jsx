import { useMemo, useState } from "react";
import { Box, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

import routes from "../../../app/routes";
import { useAuth } from "../../../hooks/useAuth";
import { getStoredAuthSession } from "../../../utils/storage";
import { hasUserAction } from "../../../utils/rbac";

import {
  MEDIDAS_ESTADOS,
  MEDIDAS_PERMISSIONS,
} from "../constants/medidas.constants";
import { MEDIDAS_CREATE_ROUTE } from "../constants/medidasCreate.constants";
import { useMedidasList } from "../hooks/useMedidasList";
import {
  approveMedidasRegistro,
  returnMedidasRegistro,
  sendMedidasRegistroToReview,
} from "../services/medidas.service";

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
  const [actionLoadingId, setActionLoadingId] = useState("");

  const storedSession = getStoredAuthSession();
  const user = authUser || storedSession?.user;

  const displayName = useMemo(() => getUserDisplayName(user), [user]);

  const canReadRecords = hasUserAction(user, MEDIDAS_PERMISSIONS.READ);
  const canCreateRecord = hasUserAction(user, MEDIDAS_PERMISSIONS.CREATE);

  const canViewDetail = true;
  const canSendReviewRecord = hasUserAction(
    user,
    MEDIDAS_PERMISSIONS.SEND_REVIEW
  );
  const canApproveRecord = hasUserAction(user, MEDIDAS_PERMISSIONS.APPROVE);
  const canReturnRecord = hasUserAction(user, MEDIDAS_PERMISSIONS.RETURN);

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

  function getRecordFolio(record) {
    return record?.id_mp || record?.id || "sin folio";
  }

  function handleViewRecord(record) {
    if (!record?.id) {
      enqueueSnackbar("No se pudo determinar el UUID interno del registro.", {
        variant: "error",
      });
      return;
    }

    navigate(`${MEDIDAS_CREATE_ROUTE}?registroId=${record.id}`);
  }

  async function runRecordAction({
    record,
    actionKey,
    successMessage,
    operation,
  }) {
    if (!record?.id) {
      enqueueSnackbar("No se pudo determinar el UUID interno del registro.", {
        variant: "error",
      });
      return;
    }

    const loadingKey = `${actionKey}:${record.id}`;

    if (actionLoadingId) return;

    try {
      setActionLoadingId(loadingKey);

      await operation(record.id);

      enqueueSnackbar(successMessage, {
        variant: "success",
      });

      await loadRecords();
    } catch (error) {
      const detail = error?.response?.data?.detail;

      enqueueSnackbar(
        typeof detail === "string"
          ? detail
          : "No fue posible ejecutar la acción del expediente.",
        {
          variant: "error",
        }
      );

      console.error("Error en acción de expediente:", error);
    } finally {
      setActionLoadingId("");
    }
  }

  async function handleSendReviewRecord(record) {
    if (record.estado_actual !== MEDIDAS_ESTADOS.EN_CAPTURA) {
      enqueueSnackbar("Solo puedes enviar expedientes en captura.", {
        variant: "warning",
      });
      return;
    }

    const confirmed = window.confirm(
      `¿Deseas enviar a revisión el expediente ${getRecordFolio(record)}?`
    );

    if (!confirmed) return;

    await runRecordAction({
      record,
      actionKey: "send",
      successMessage: "Expediente enviado a revisión correctamente.",
      operation: sendMedidasRegistroToReview,
    });
  }

  async function handleApproveRecord(record) {
    if (record.estado_actual !== MEDIDAS_ESTADOS.EN_REVISION) {
      enqueueSnackbar("Solo puedes aprobar expedientes en revisión.", {
        variant: "warning",
      });
      return;
    }

    const confirmed = window.confirm(
      `¿Deseas aprobar el expediente ${getRecordFolio(record)}?`
    );

    if (!confirmed) return;

    await runRecordAction({
      record,
      actionKey: "approve",
      successMessage: "Expediente aprobado correctamente.",
      operation: approveMedidasRegistro,
    });
  }

  async function handleReturnRecord(record) {
    if (record.estado_actual !== MEDIDAS_ESTADOS.EN_REVISION) {
      enqueueSnackbar("Solo puedes devolver expedientes en revisión.", {
        variant: "warning",
      });
      return;
    }

    const motivo = window.prompt(
      `Captura el motivo de devolución del expediente ${getRecordFolio(
        record
      )}:`
    );

    if (motivo === null) return;

    const cleanMotivo = String(motivo || "").trim();

    if (!cleanMotivo) {
      enqueueSnackbar("El motivo de devolución es obligatorio.", {
        variant: "warning",
      });
      return;
    }

    await runRecordAction({
      record,
      actionKey: "return",
      successMessage: "Expediente devuelto a captura correctamente.",
      operation: (registroId) =>
        returnMedidasRegistro({
          registroId,
          motivo: cleanMotivo,
        }),
    });
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
                canSendReview={canSendReviewRecord}
                canApprove={canApproveRecord}
                canReturn={canReturnRecord}
                actionLoadingId={actionLoadingId}
                onFilterChange={setFilter}
                onViewRecord={handleViewRecord}
                onSendReview={handleSendReviewRecord}
                onApprove={handleApproveRecord}
                onReturn={handleReturnRecord}
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
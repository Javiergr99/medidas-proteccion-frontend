import PropTypes from "prop-types";
import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import KeyboardReturnRoundedIcon from "@mui/icons-material/KeyboardReturnRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";

import MedidasStatusChip from "./MedidasStatusChip";
import {
  DATE_FORMATTER,
  tableBodyCellStyles,
} from "./medidasTable.styles";

function formatCellValue(value, fallback = "Sin información") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return String(value);
}

function formatDate(value) {
  if (!value) return "Sin fecha";

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(value).slice(0, 10);
  }

  return DATE_FORMATTER.format(parsedDate);
}

function getRecordFolio(record) {
  return record.id_mp || record.id;
}

export default function MedidasTableRows({
  rows,
  canViewDetail,
  canSendReview,
  canApprove,
  canReturn,
  actionLoadingId,
  onViewRecord,
  onSendReview,
  onApprove,
  onReturn,
}) {
  if (rows.length === 0) {
    return <MedidasTableEmptyRow />;
  }

  return rows.map((record) => (
    <TableRow
      key={record.id}
      hover
      sx={{
        backgroundColor: "#ffffff",
        transition:
          "background-color 180ms ease, box-shadow 180ms ease, transform 180ms ease",

        "&:nth-of-type(even)": {
          backgroundColor: "#fbfcfd",
        },

        "& > td:first-of-type": {
          borderLeft: "4px solid transparent",
          transition: "border-color 180ms ease",
        },

        "&:hover": {
          backgroundColor: "rgba(221,201,163,0.17)",
          boxShadow: "inset 0 0 0 999px rgba(255,255,255,0.08)",
        },

        "&:hover > td:first-of-type": {
          borderLeftColor: "#BC955C",
        },
      }}
    >
      <RecordIdCell record={record} />

      <RecordNameCell record={record} />

      <TableCell sx={tableBodyCellStyles}>
        <MedidasStatusChip status={record.estado_actual} />
      </TableCell>

      <TableCell sx={tableBodyCellStyles}>
        {formatCellValue(record.lugar_apertura)}
      </TableCell>

      <TableCell sx={tableBodyCellStyles}>
        <Box
          component="span"
          sx={{
            fontWeight: 900,
            color: "#334155",
          }}
        >
          {record.edad || record.edad === 0
            ? record.edad + " años"
            : "Sin información"}
        </Box>
      </TableCell>

      <TableCell sx={tableBodyCellStyles}>
        {formatCellValue(record.sexo)}
      </TableCell>

      <TableCell sx={tableBodyCellStyles}>
        {formatCellValue(record.pais_residencia)}
      </TableCell>

      <TableCell sx={tableBodyCellStyles}>{formatDate(record.fecha)}</TableCell>

      <TableCell sx={tableBodyCellStyles}>
        <Box
          component="span"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            px: 1.1,
            py: 0.45,
            borderRadius: 999,
            color: "#611232",
            backgroundColor: "rgba(157,36,73,0.07)",
            border: "1px solid rgba(157,36,73,0.11)",
            fontWeight: 900,
            fontSize: "0.76rem",
          }}
        >
          {formatCellValue(record.calidad_migratoria)}
        </Box>
      </TableCell>

      <TableCell align="center" sx={tableBodyCellStyles}>
        <RecordActionButtons
          record={record}
          canViewDetail={canViewDetail}
          canSendReview={canSendReview}
          canApprove={canApprove}
          canReturn={canReturn}
          actionLoadingId={actionLoadingId}
          onViewRecord={onViewRecord}
          onSendReview={onSendReview}
          onApprove={onApprove}
          onReturn={onReturn}
        />
      </TableCell>
    </TableRow>
  ));
}

function RecordIdCell({ record }) {
  const folio = getRecordFolio(record);

  return (
    <TableCell
      sx={{
        ...tableBodyCellStyles,
        pl: 2.2,
      }}
    >
      <Tooltip title={record.id ? "UUID interno: " + record.id : ""}>
        <Box
          component="span"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            px: 1.05,
            py: 0.45,
            borderRadius: "12px",
            color: "#13322e",
            background:
              "linear-gradient(135deg, rgba(19,50,46,0.08), rgba(221,201,163,0.22))",
            border: "1px solid rgba(19,50,46,0.11)",
            fontFamily: "Noto Sans, sans-serif",
            fontWeight: 950,
            fontSize: "0.78rem",
            letterSpacing: "0.01em",
          }}
        >
          {formatCellValue(folio)}
        </Box>
      </Tooltip>
    </TableCell>
  );
}

function RecordNameCell({ record }) {
  return (
    <TableCell
      sx={{
        ...tableBodyCellStyles,
        color: "#13322e",
        fontWeight: 950,
        letterSpacing: "0.01em",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0.15,
        }}
      >
        <Typography
          component="span"
          sx={{
            fontFamily: "Noto Sans, sans-serif",
            color: "#13322e",
            fontWeight: 950,
            fontSize: "0.86rem",
            lineHeight: 1.2,
          }}
        >
          {formatCellValue(record.nombre_completo)}
        </Typography>

        <Typography
          component="span"
          sx={{
            fontFamily: "Noto Sans, sans-serif",
            color: "#98989A",
            fontWeight: 750,
            fontSize: "0.72rem",
            lineHeight: 1.2,
          }}
        >
          Expediente de Medidas de Protección
        </Typography>
      </Box>
    </TableCell>
  );
}

function RecordActionButtons({
  record,
  canViewDetail,
  canSendReview,
  canApprove,
  canReturn,
  actionLoadingId,
  onViewRecord,
  onSendReview,
  onApprove,
  onReturn,
}) {
  const isBusy = Boolean(actionLoadingId);
  const isEnCaptura = record.estado_actual === "En captura";
  const isEnRevision = record.estado_actual === "En revisión";

  const showSendReview = canSendReview && isEnCaptura;
  const showApprove = canApprove && isEnRevision;
  const showReturn = canReturn && isEnRevision;

  return (
    <Stack
      direction="row"
      spacing={0.75}
      justifyContent="center"
      alignItems="center"
      sx={{ minWidth: 156 }}
    >
      <ActionIconButton
        title={
          canViewDetail
            ? "Ver detalle"
            : "Detalle pendiente de GET /registros/{registro_id}"
        }
        disabled={!canViewDetail || isBusy}
        onClick={() => onViewRecord(record)}
        colorMode="detail"
      >
        <VisibilityRoundedIcon sx={{ fontSize: 18 }} />
      </ActionIconButton>

      {showSendReview ? (
        <ActionIconButton
          title="Enviar a revisión"
          disabled={isBusy}
          onClick={() => onSendReview(record)}
          colorMode="send"
        >
          {actionLoadingId === "send:" + record.id ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            <SendRoundedIcon sx={{ fontSize: 18 }} />
          )}
        </ActionIconButton>
      ) : null}

      {showApprove ? (
        <ActionIconButton
          title="Aprobar expediente"
          disabled={isBusy}
          onClick={() => onApprove(record)}
          colorMode="approve"
        >
          {actionLoadingId === "approve:" + record.id ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            <CheckCircleRoundedIcon sx={{ fontSize: 18 }} />
          )}
        </ActionIconButton>
      ) : null}

      {showReturn ? (
        <ActionIconButton
          title="Devolver a captura"
          disabled={isBusy}
          onClick={() => onReturn(record)}
          colorMode="return"
        >
          {actionLoadingId === "return:" + record.id ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            <KeyboardReturnRoundedIcon sx={{ fontSize: 18 }} />
          )}
        </ActionIconButton>
      ) : null}
    </Stack>
  );
}

function getActionButtonSx(colorMode) {
  const variants = {
    detail: {
      color: "#13322e",
      hoverColor: "#ffffff",
      hoverBackground: "linear-gradient(135deg, #13322e 0%, #0e2724 100%)",
    },
    send: {
      color: "#611232",
      hoverColor: "#ffffff",
      hoverBackground: "linear-gradient(135deg, #611232 0%, #9d2449 100%)",
    },
    approve: {
      color: "#047857",
      hoverColor: "#ffffff",
      hoverBackground: "linear-gradient(135deg, #047857 0%, #065f46 100%)",
    },
    return: {
      color: "#a57f2c",
      hoverColor: "#ffffff",
      hoverBackground: "linear-gradient(135deg, #a57f2c 0%, #7c5f21 100%)",
    },
  };

  const variant = variants[colorMode] || variants.detail;

  return {
    width: 36,
    height: 36,
    color: variant.color,
    background:
      "linear-gradient(135deg, rgba(19,50,46,0.08), rgba(255,255,255,0.92))",
    border: "1px solid rgba(19,50,46,0.12)",
    boxShadow: "0 8px 18px rgba(15,23,42,0.045)",
    "&:hover": {
      color: variant.hoverColor,
      background: variant.hoverBackground,
      boxShadow: "0 12px 24px rgba(19,50,46,0.18)",
    },
    "&.Mui-disabled": {
      color: "rgba(100,116,139,0.35)",
      background: "rgba(100,116,139,0.06)",
      borderColor: "rgba(100,116,139,0.10)",
      boxShadow: "none",
    },
  };
}

function ActionIconButton({ title, disabled, onClick, colorMode, children }) {
  return (
    <Tooltip title={title}>
      <span>
        <IconButton
          size="small"
          disabled={disabled}
          onClick={onClick}
          sx={getActionButtonSx(colorMode)}
        >
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
}

function MedidasTableEmptyRow() {
  return (
    <TableRow>
      <TableCell colSpan={10}>
        <Box sx={{ py: 6, textAlign: "center" }}>
          <Typography
            sx={{
              fontFamily: "Noto Sans, sans-serif",
              color: "#1f2937",
              fontWeight: 950,
              mb: 0.6,
            }}
          >
            No se encontraron registros
          </Typography>

          <Typography
            sx={{
              fontFamily: "Noto Sans, sans-serif",
              color: "#64748b",
              fontSize: "0.9rem",
            }}
          >
            Ajusta los filtros para consultar nuevamente.
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
}

const recordShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  id_mp: PropTypes.string,
  nombre_completo: PropTypes.string.isRequired,
  estado_actual: PropTypes.string.isRequired,
  lugar_apertura: PropTypes.string,
  edad: PropTypes.number,
  sexo: PropTypes.string,
  pais_residencia: PropTypes.string,
  fecha: PropTypes.string.isRequired,
  calidad_migratoria: PropTypes.string,
});

MedidasTableRows.propTypes = {
  rows: PropTypes.arrayOf(recordShape).isRequired,
  canViewDetail: PropTypes.bool.isRequired,
  canSendReview: PropTypes.bool.isRequired,
  canApprove: PropTypes.bool.isRequired,
  canReturn: PropTypes.bool.isRequired,
  actionLoadingId: PropTypes.string,
  onViewRecord: PropTypes.func.isRequired,
  onSendReview: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReturn: PropTypes.func.isRequired,
};

RecordIdCell.propTypes = {
  record: recordShape.isRequired,
};

RecordNameCell.propTypes = {
  record: recordShape.isRequired,
};

RecordActionButtons.propTypes = {
  record: recordShape.isRequired,
  canViewDetail: PropTypes.bool.isRequired,
  canSendReview: PropTypes.bool.isRequired,
  canApprove: PropTypes.bool.isRequired,
  canReturn: PropTypes.bool.isRequired,
  actionLoadingId: PropTypes.string,
  onViewRecord: PropTypes.func.isRequired,
  onSendReview: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReturn: PropTypes.func.isRequired,
};

ActionIconButton.propTypes = {
  title: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  colorMode: PropTypes.string,
  children: PropTypes.node.isRequired,
};

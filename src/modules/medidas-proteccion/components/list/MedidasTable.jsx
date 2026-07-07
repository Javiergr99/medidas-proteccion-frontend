import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "dayjs/locale/es";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";

import MedidasTableFilters from "./MedidasTableFilters";
import MedidasTableRows from "./MedidasTableRows";

const TABLE_MIN_WIDTH = 1180;
const SCROLL_STEP = 420;

const TABLE_COLUMNS = [
  {
    label: "Folio MP",
    sx: { pl: 2.2 },
  },
  {
    label: "Nombre completo",
  },
  {
    label: "Estado",
  },
  {
    label: "Lugar apertura",
  },
  {
    label: "Edad",
  },
  {
    label: "Sexo",
  },
  {
    label: "País residencia",
  },
  {
    label: "Fecha",
  },
  {
    label: "Calidad migratoria",
  },
  {
    label: "Acciones",
    align: "center",
  },
];

const tableHeadCellStyles = {
  py: 1.55,
  px: 1.6,
  borderBottom: "1px solid rgba(152,152,154,0.16)",
  backgroundColor: "#fbfaf8",
  color: "#475569",
  fontFamily: "Noto Sans, sans-serif",
  fontWeight: 900,
  fontSize: "0.72rem",
  lineHeight: 1.2,
  letterSpacing: "0.055em",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
};

const scrollbarSx = {
  "&::-webkit-scrollbar": {
    height: 8,
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "#f8fafc",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(152,152,154,0.46)",
    borderRadius: 999,
    border: "2px solid #f8fafc",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "rgba(97,18,50,0.34)",
  },
};

export default function MedidasTable({
  rows,
  filters,
  canViewDetail,
  canSendReview,
  canApprove,
  canReturn,
  actionLoadingId,
  onFilterChange,
  onViewRecord,
  onSendReview,
  onApprove,
  onReturn,
}) {
  const tableContainerRef = useRef(null);
  const tableRef = useRef(null);

  const [canScroll, setCanScroll] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function updateScrollState() {
    const container = tableContainerRef.current;
    const table = tableRef.current;

    if (!container || !table) return;

    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    const hasHorizontalScroll = maxScrollLeft > 4;

    setCanScroll(hasHorizontalScroll);
    setCanScrollLeft(container.scrollLeft > 4);
    setCanScrollRight(container.scrollLeft < maxScrollLeft - 4);
  }

  useEffect(() => {
    updateScrollState();

    const resizeObserver = new ResizeObserver(updateScrollState);

    if (tableContainerRef.current) {
      resizeObserver.observe(tableContainerRef.current);
    }

    if (tableRef.current) {
      resizeObserver.observe(tableRef.current);
    }

    window.addEventListener("resize", updateScrollState);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScrollState);
    };
  }, [rows, filters]);

  function handleScrollTable(direction) {
    const container = tableContainerRef.current;

    if (!container) return;

    container.scrollBy({
      left: direction === "left" ? -SCROLL_STEP : SCROLL_STEP,
      behavior: "smooth",
    });
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <Box
        sx={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
            borderRadius: { xs: "20px", md: "24px" },
            backgroundColor: "#ffffff",
            border: "1px solid rgba(152,152,154,0.16)",
            boxShadow: "0 10px 28px rgba(19,50,46,0.045)",
            overflow: "hidden",
          }}
        >
          {canScroll ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 0.8,
                px: { xs: 1.4, md: 1.7 },
                py: 1,
                borderBottom: "1px solid rgba(152,152,154,0.12)",
                backgroundColor: "#ffffff",
              }}
            >
              <Tooltip title="Mover columnas a la izquierda">
                <span>
                  <IconButton
                    type="button"
                    size="small"
                    disabled={!canScrollLeft}
                    onClick={() => handleScrollTable("left")}
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: "12px",
                      color: "#611232",
                      border: "1px solid rgba(97,18,50,0.14)",
                      backgroundColor: "#ffffff",
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: "rgba(97,18,50,0.045)",
                        borderColor: "rgba(97,18,50,0.24)",
                      },
                      "&.Mui-disabled": {
                        color: "#cbd5e1",
                        borderColor: "rgba(203,213,225,0.45)",
                        backgroundColor: "#ffffff",
                      },
                    }}
                  >
                    <KeyboardArrowLeftRoundedIcon />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title="Mover columnas a la derecha">
                <span>
                  <IconButton
                    type="button"
                    size="small"
                    disabled={!canScrollRight}
                    onClick={() => handleScrollTable("right")}
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: "12px",
                      color: "#611232",
                      border: "1px solid rgba(97,18,50,0.14)",
                      backgroundColor: "#ffffff",
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: "rgba(97,18,50,0.045)",
                        borderColor: "rgba(97,18,50,0.24)",
                      },
                      "&.Mui-disabled": {
                        color: "#cbd5e1",
                        borderColor: "rgba(203,213,225,0.45)",
                        backgroundColor: "#ffffff",
                      },
                    }}
                  >
                    <KeyboardArrowRightRoundedIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          ) : null}

          <TableContainer
            ref={tableContainerRef}
            onScroll={updateScrollState}
            sx={{
              width: "100%",
              maxWidth: "100%",
              minWidth: 0,
              overflowX: "auto",
              overflowY: "hidden",
              backgroundColor: "#ffffff",
              WebkitOverflowScrolling: "touch",
              ...scrollbarSx,
            }}
          >
            <Table
              ref={tableRef}
              sx={{
                width: "max-content",
                minWidth: TABLE_MIN_WIDTH,
                borderCollapse: "separate",
                borderSpacing: 0,
              }}
            >
              <TableHead>
                <TableRow>
                  {TABLE_COLUMNS.map((column) => (
                    <TableCell
                      key={column.label}
                      align={column.align || "left"}
                      sx={{
                        ...tableHeadCellStyles,
                        ...(column.sx || {}),
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>

                <MedidasTableFilters
                  filters={filters}
                  onFilterChange={onFilterChange}
                />
              </TableHead>

              <TableBody>
                <MedidasTableRows
                  rows={rows}
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
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
}

MedidasTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
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
    })
  ).isRequired,
  filters: PropTypes.shape({
    id: PropTypes.string.isRequired,
    nombre_completo: PropTypes.string.isRequired,
    estado_actual: PropTypes.string.isRequired,
    lugar_apertura: PropTypes.string.isRequired,
    edad: PropTypes.string.isRequired,
    sexo: PropTypes.string.isRequired,
    pais_residencia: PropTypes.string.isRequired,
    fecha: PropTypes.string.isRequired,
    calidad_migratoria: PropTypes.string.isRequired,
  }).isRequired,
  canViewDetail: PropTypes.bool.isRequired,
  canSendReview: PropTypes.bool.isRequired,
  canApprove: PropTypes.bool.isRequired,
  canReturn: PropTypes.bool.isRequired,
  actionLoadingId: PropTypes.string,
  onFilterChange: PropTypes.func.isRequired,
  onViewRecord: PropTypes.func.isRequired,
  onSendReview: PropTypes.func.isRequired,
  onApprove: PropTypes.func.isRequired,
  onReturn: PropTypes.func.isRequired,
};
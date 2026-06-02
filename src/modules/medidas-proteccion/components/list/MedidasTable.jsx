import PropTypes from "prop-types";
import {
  Box,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";

import { MEDIDAS_ESTADO_OPTIONS } from "../../constants/medidas.constants";
import MedidasStatusChip from "./MedidasStatusChip";

const tableHeadCellStyles = {
  fontFamily: "Noto Sans, sans-serif",
  fontWeight: 950,
  color: "#111827",
  fontSize: "0.82rem",
  borderBottom: "1px solid rgba(15,23,42,0.10)",
  whiteSpace: "nowrap",
  backgroundColor: "#ffffff",
};

const tableBodyCellStyles = {
  fontFamily: "Noto Sans, sans-serif",
  color: "#475569",
  fontSize: "0.84rem",
  borderBottom: "1px solid rgba(15,23,42,0.045)",
  whiteSpace: "nowrap",
};

const filterCellStyles = {
  borderBottom: "1px solid rgba(15,23,42,0.06)",
  backgroundColor: "#ffffff",
  pt: 0.4,
  pb: 1.5,
};

const filterInputStyles = {
  minWidth: 130,
  "& .MuiOutlinedInput-root": {
    height: 36,
    borderRadius: "12px",
    backgroundColor: "#f8fafc",
    fontFamily: "Noto Sans, sans-serif",
    fontSize: "0.78rem",
  },
  "& .MuiInputBase-input": {
    py: 0.7,
  },
};

function formatCellValue(value, fallback = "Sin información") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return String(value);
}

function formatDate(value) {
  if (!value) return "Sin fecha";

  try {
    return new Intl.DateTimeFormat("es-MX", {
      timeZone: "America/Mexico_City",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(value));
  } catch {
    return String(value).slice(0, 10);
  }
}

export default function MedidasTable({
  rows,
  filters,
  canViewDetail,
  onFilterChange,
  onViewRecord,
}) {
  function handleFilterChange(event) {
    const { name, value } = event.target;
    onFilterChange(name, value);
  }

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: { xs: "22px", md: "26px" },
        backgroundColor: "#ffffff",
        border: "1px solid rgba(15,23,42,0.06)",
        boxShadow: "0 18px 48px rgba(15,23,42,0.055)",
        overflow: "hidden",
      }}
    >
      <TableContainer
        sx={{
          width: "100%",
          overflowX: "auto",
        }}
      >
        <Table sx={{ minWidth: 1180 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...tableHeadCellStyles, pl: 2.2 }}>
                ID
              </TableCell>
              <TableCell sx={tableHeadCellStyles}>Nombre completo</TableCell>
              <TableCell sx={tableHeadCellStyles}>Estado</TableCell>
              <TableCell sx={tableHeadCellStyles}>Lugar apertura</TableCell>
              <TableCell sx={tableHeadCellStyles}>Edad</TableCell>
              <TableCell sx={tableHeadCellStyles}>Sexo</TableCell>
              <TableCell sx={tableHeadCellStyles}>País residencia</TableCell>
              <TableCell sx={tableHeadCellStyles}>Fecha</TableCell>
              <TableCell sx={tableHeadCellStyles}>
                Calidad migratoria
              </TableCell>
              <TableCell align="center" sx={tableHeadCellStyles}>
                Acciones
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={{ ...filterCellStyles, pl: 2.2 }}>
                <FilterTextField
                  name="id"
                  value={filters.id}
                  placeholder="Buscar ID"
                  onChange={handleFilterChange}
                />
              </TableCell>

              <TableCell sx={filterCellStyles}>
                <FilterTextField
                  name="nombre_completo"
                  value={filters.nombre_completo}
                  placeholder="Buscar nombre"
                  onChange={handleFilterChange}
                  minWidth={230}
                />
              </TableCell>

              <TableCell sx={filterCellStyles}>
                <FilterSelect
                  name="estado_actual"
                  value={filters.estado_actual}
                  options={MEDIDAS_ESTADO_OPTIONS}
                  onChange={handleFilterChange}
                />
              </TableCell>

              <TableCell sx={filterCellStyles}>
                <FilterTextField
                  name="lugar_apertura"
                  value={filters.lugar_apertura}
                  placeholder="Lugar"
                  onChange={handleFilterChange}
                />
              </TableCell>

              <TableCell sx={filterCellStyles}>
                <FilterTextField
                  name="edad"
                  value={filters.edad}
                  placeholder="Edad"
                  onChange={handleFilterChange}
                  minWidth={92}
                />
              </TableCell>

              <TableCell sx={filterCellStyles}>
                <FilterTextField
                  name="sexo"
                  value={filters.sexo}
                  placeholder="Sexo"
                  onChange={handleFilterChange}
                  minWidth={120}
                />
              </TableCell>

              <TableCell sx={filterCellStyles}>
                <FilterTextField
                  name="pais_residencia"
                  value={filters.pais_residencia}
                  placeholder="País"
                  onChange={handleFilterChange}
                />
              </TableCell>

              <TableCell sx={filterCellStyles}>
                <TextField
                  name="fecha"
                  type="date"
                  value={filters.fecha}
                  onChange={handleFilterChange}
                  size="small"
                  sx={{
                    ...filterInputStyles,
                    minWidth: 150,
                  }}
                />
              </TableCell>

              <TableCell sx={filterCellStyles}>
                <FilterTextField
                  name="calidad_migratoria"
                  value={filters.calidad_migratoria}
                  placeholder="Calidad"
                  onChange={handleFilterChange}
                  minWidth={180}
                />
              </TableCell>

              <TableCell sx={filterCellStyles} />
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length > 0 ? (
              rows.map((record) => (
                <TableRow
                  key={record.id}
                  hover
                  sx={{
                    backgroundColor: "#ffffff",
                    transition: "background-color 180ms ease",
                    "&:nth-of-type(even)": {
                      backgroundColor: "#fbfcfd",
                    },
                    "&:hover": {
                      backgroundColor: "rgba(143,21,56,0.025)",
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      ...tableBodyCellStyles,
                      pl: 2.2,
                      color: "#0f4f46",
                      fontWeight: 950,
                    }}
                  >
                    {formatCellValue(record.id)}
                  </TableCell>

                  <TableCell
                    sx={{
                      ...tableBodyCellStyles,
                      color: "#0f4f46",
                      fontWeight: 950,
                      letterSpacing: "0.01em",
                    }}
                  >
                    {formatCellValue(record.nombre_completo)}
                  </TableCell>

                  <TableCell sx={tableBodyCellStyles}>
                    <MedidasStatusChip status={record.estado_actual} />
                  </TableCell>

                  <TableCell sx={tableBodyCellStyles}>
                    {formatCellValue(record.lugar_apertura)}
                  </TableCell>

                  <TableCell sx={tableBodyCellStyles}>
                    {record.edad || record.edad === 0
                      ? `${record.edad} años`
                      : "Sin información"}
                  </TableCell>

                  <TableCell sx={tableBodyCellStyles}>
                    {formatCellValue(record.sexo)}
                  </TableCell>

                  <TableCell sx={tableBodyCellStyles}>
                    {formatCellValue(record.pais_residencia)}
                  </TableCell>

                  <TableCell sx={tableBodyCellStyles}>
                    {formatDate(record.fecha)}
                  </TableCell>

                  <TableCell sx={tableBodyCellStyles}>
                    {formatCellValue(record.calidad_migratoria)}
                  </TableCell>

                  <TableCell align="center" sx={tableBodyCellStyles}>
                    <Tooltip
                      title={
                        canViewDetail
                          ? "Ver detalle"
                          : "Detalle pendiente de endpoint confirmado"
                      }
                    >
                      <span>
                        <IconButton
                          size="small"
                          disabled={!canViewDetail}
                          onClick={() => onViewRecord(record)}
                          sx={{
                            width: 34,
                            height: 34,
                            color: "#0f4f46",
                            backgroundColor: "rgba(15,79,70,0.06)",
                            "&:hover": {
                              backgroundColor: "rgba(15,79,70,0.11)",
                            },
                            "&.Mui-disabled": {
                              color: "rgba(100,116,139,0.35)",
                              backgroundColor: "rgba(100,116,139,0.06)",
                            },
                          }}
                        >
                          <VisibilityRoundedIcon sx={{ fontSize: 19 }} />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
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
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

function FilterTextField({
  name,
  value,
  placeholder,
  onChange,
  minWidth = 140,
}) {
  return (
    <TextField
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      size="small"
      sx={{
        ...filterInputStyles,
        minWidth,
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SearchRoundedIcon
              sx={{
                fontSize: 18,
                color: "#9ca3af",
              }}
            />
          </InputAdornment>
        ),
      }}
    />
  );
}

function FilterSelect({ name, value, options, onChange, minWidth = 150 }) {
  return (
    <TextField
      select
      name={name}
      value={value}
      onChange={onChange}
      size="small"
      SelectProps={{
        displayEmpty: true,
      }}
      sx={{
        ...filterInputStyles,
        minWidth,
      }}
    >
      <MenuItem value="">- Filtrar -</MenuItem>

      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
}

MedidasTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
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
  onFilterChange: PropTypes.func.isRequired,
  onViewRecord: PropTypes.func.isRequired,
};

FilterTextField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  minWidth: PropTypes.number,
};

FilterSelect.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  minWidth: PropTypes.number,
};
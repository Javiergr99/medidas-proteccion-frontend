import PropTypes from "prop-types";
import dayjs from "dayjs";
import {
  InputAdornment,
  MenuItem,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import { MEDIDAS_ESTADO_OPTIONS } from "../../constants/medidas.constants";

const TODAY = dayjs().endOf("day");

const FILTER_COLUMNS = [
  {
    key: "id",
    type: "text",
    placeholder: "ID",
    minWidth: 126,
    cellSx: { pl: 2.2 },
  },
  {
    key: "nombre_completo",
    type: "text",
    placeholder: "Nombre",
    minWidth: 190,
  },
  {
    key: "estado_actual",
    type: "select",
    placeholder: "Estado",
    minWidth: 138,
    options: MEDIDAS_ESTADO_OPTIONS,
  },
  {
    key: "lugar_apertura",
    type: "text",
    placeholder: "Lugar",
    minWidth: 128,
  },
  {
    key: "edad",
    type: "text",
    placeholder: "Edad",
    minWidth: 86,
  },
  {
    key: "sexo",
    type: "text",
    placeholder: "Sexo",
    minWidth: 112,
  },
  {
    key: "pais_residencia",
    type: "text",
    placeholder: "País",
    minWidth: 126,
  },
  {
    key: "fecha",
    type: "date",
    placeholder: "Fecha",
    minWidth: 148,
  },
  {
    key: "calidad_migratoria",
    type: "text",
    placeholder: "Calidad",
    minWidth: 148,
  },
];

const filterCellSx = {
  px: 1.15,
  py: 1.15,
  borderBottom: "1px solid rgba(152,152,154,0.12)",
  backgroundColor: "#ffffff",
  verticalAlign: "middle",
  minWidth: 0,
};

const filterInputSx = {
  width: "100%",
  minWidth: 0,
  maxWidth: "100%",
  "& .MuiOutlinedInput-root": {
    minHeight: 38,
    borderRadius: "14px",
    backgroundColor: "#fbfaf8",
    fontFamily: "Noto Sans, sans-serif",
    color: "#13322e",
    fontWeight: 750,
    fontSize: "0.78rem",
    transition:
      "background-color 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
    "& fieldset": {
      borderColor: "rgba(152,152,154,0.16)",
    },
    "&:hover": {
      backgroundColor: "#ffffff",
    },
    "&:hover fieldset": {
      borderColor: "rgba(188,149,92,0.34)",
    },
    "&.Mui-focused": {
      backgroundColor: "#ffffff",
      boxShadow: "0 0 0 3px rgba(188,149,92,0.10)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "rgba(188,149,92,0.52)",
      borderWidth: "1px",
    },
  },
  "& .MuiOutlinedInput-input": {
    py: 1,
    px: 1.25,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "#94a3b8",
    opacity: 1,
    fontWeight: 750,
  },
  "& .MuiInputAdornment-root": {
    ml: 0.25,
  },
};

const selectMenuProps = {
  PaperProps: {
    sx: {
      mt: 0.8,
      borderRadius: "14px",
      border: "1px solid rgba(152,152,154,0.16)",
      boxShadow: "0 16px 34px rgba(15,23,42,0.12)",
      "& .MuiMenuItem-root": {
        fontFamily: "Noto Sans, sans-serif",
        fontSize: "0.86rem",
        fontWeight: 700,
        color: "#334155",
        minHeight: 38,
      },
      "& .MuiMenuItem-root.Mui-selected": {
        backgroundColor: "rgba(97,18,50,0.07)",
        color: "#611232",
        fontWeight: 900,
      },
      "& .MuiMenuItem-root.Mui-selected:hover": {
        backgroundColor: "rgba(97,18,50,0.10)",
      },
    },
  },
};

function getSafeDateFilterValue(nextDate) {
  if (!nextDate || !nextDate.isValid()) {
    return "";
  }

  if (nextDate.isAfter(TODAY, "day")) {
    return TODAY.format("YYYY-MM-DD");
  }

  return nextDate.format("YYYY-MM-DD");
}

export default function MedidasTableFilters({ filters, onFilterChange }) {
  function handleFilterChange(event) {
    const { name, value } = event.target;
    onFilterChange(name, value);
  }

  function handleDateFilterChange(nextDate) {
    onFilterChange("fecha", getSafeDateFilterValue(nextDate));
  }

  return (
    <TableRow>
      {FILTER_COLUMNS.map((column) => (
        <TableCell
          key={column.key}
          sx={{
            ...filterCellSx,
            minWidth: column.minWidth,
            ...(column.cellSx || {}),
          }}
        >
          <FilterControl
            column={column}
            value={filters[column.key]}
            onChange={handleFilterChange}
            onDateChange={handleDateFilterChange}
          />
        </TableCell>
      ))}

      <TableCell
        sx={{
          ...filterCellSx,
          width: 86,
          minWidth: 86,
        }}
      />
    </TableRow>
  );
}

function FilterControl({ column, value, onChange, onDateChange }) {
  if (column.type === "select") {
    return (
      <FilterSelect
        name={column.key}
        value={value}
        options={column.options}
        placeholder={column.placeholder}
        onChange={onChange}
      />
    );
  }

  if (column.type === "date") {
    return (
      <DatePicker
        value={value ? dayjs(value) : null}
        onChange={onDateChange}
        format="DD/MM/YYYY"
        disableFuture
        maxDate={TODAY}
        reduceAnimations
        slotProps={{
          textField: {
            size: "small",
            placeholder: column.placeholder,
            sx: filterInputSx,
          },
          openPickerButton: {
            sx: {
              color: "#9d2449",
              p: 0.4,
              mr: 0.3,
            },
          },
          popper: {
            sx: {
              "& .MuiPaper-root": {
                borderRadius: "18px",
                border: "1px solid rgba(152,152,154,0.18)",
                boxShadow: "0 18px 42px rgba(15,23,42,0.14)",
              },
            },
          },
        }}
      />
    );
  }

  return (
    <FilterTextField
      name={column.key}
      value={value}
      placeholder={column.placeholder}
      onChange={onChange}
    />
  );
}

function FilterTextField({ name, value, placeholder, onChange }) {
  return (
    <TextField
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      size="small"
      fullWidth
      sx={filterInputSx}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SearchRoundedIcon
              sx={{
                fontSize: 17,
                color: "#9d2449",
              }}
            />
          </InputAdornment>
        ),
      }}
    />
  );
}

function FilterSelect({ name, value, options, placeholder, onChange }) {
  return (
    <TextField
      select
      name={name}
      value={value}
      onChange={onChange}
      size="small"
      fullWidth
      SelectProps={{
        displayEmpty: true,
        MenuProps: selectMenuProps,
      }}
      sx={{
        ...filterInputSx,
        "& .MuiSelect-icon": {
          color: "#9d2449",
          right: 9,
        },
      }}
    >
      <MenuItem value="">{placeholder || "Filtrar"}</MenuItem>

      {options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
}

MedidasTableFilters.propTypes = {
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
  onFilterChange: PropTypes.func.isRequired,
};

FilterControl.propTypes = {
  column: PropTypes.shape({
    key: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    minWidth: PropTypes.number,
    options: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onDateChange: PropTypes.func.isRequired,
};

FilterTextField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

FilterSelect.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
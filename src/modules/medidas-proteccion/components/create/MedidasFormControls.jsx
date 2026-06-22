import PropTypes from "prop-types";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { MenuItem, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const fieldBaseSx = {
  "& .MuiInputLabel-root": {
    fontFamily: "Noto Sans, sans-serif",
    fontWeight: 750,
    color: "#64748b",
    fontSize: "0.9rem",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#611232",
  },
  "& .MuiInputLabel-root.Mui-error": {
    color: "#9d2449",
  },
  "& .MuiOutlinedInput-root": {
    minHeight: 46,
    borderRadius: "13px",
    backgroundColor: "#ffffff",
    fontFamily: "Noto Sans, sans-serif",
    fontWeight: 650,
    color: "#13322e",
    transition:
      "border-color 160ms ease, box-shadow 160ms ease, background 160ms ease",
    "& fieldset": {
      borderColor: "rgba(152,152,154,0.26)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(157,36,73,0.34)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#9d2449",
      borderWidth: "1px",
      boxShadow: "0 0 0 3px rgba(157,36,73,0.08)",
    },
    "&.Mui-error fieldset": {
      borderColor: "rgba(157,36,73,0.68)",
    },
    "&.Mui-disabled": {
      backgroundColor: "#f3f4f6",
      color: "#98989A",
    },
  },
  "& .MuiInputBase-input": {
    fontFamily: "Noto Sans, sans-serif",
    fontWeight: 650,
    fontSize: "0.91rem",
    color: "#13322e",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "rgba(100,116,139,0.62)",
    opacity: 1,
  },
  "& .MuiFormHelperText-root": {
    marginLeft: 0,
    marginTop: "5px",
    fontFamily: "Noto Sans, sans-serif",
    fontSize: "0.75rem",
    fontWeight: 600,
    lineHeight: 1.35,
    color: "#64748b",
  },
  "& .MuiFormHelperText-root.Mui-error": {
    color: "#9d2449",
    fontWeight: 800,
  },
};

const selectMenuProps = {
  PaperProps: {
    sx: {
      mt: 0.6,
      borderRadius: "16px",
      border: "1px solid rgba(152,152,154,0.18)",
      boxShadow: "0 18px 45px rgba(15,23,42,0.14)",
      p: 0.6,
      "& .MuiMenuItem-root": {
        minHeight: 38,
        borderRadius: "11px",
        fontFamily: "Noto Sans, sans-serif",
        fontWeight: 700,
        fontSize: "0.88rem",
        mx: 0.25,
        my: 0.25,
        color: "#13322e",
        "&:hover": {
          backgroundColor: "rgba(97,18,50,0.04)",
        },
        "&.Mui-selected": {
          color: "#611232",
          backgroundColor: "rgba(157,36,73,0.08)",
          fontWeight: 900,
        },
        "&.Mui-selected:hover": {
          backgroundColor: "rgba(157,36,73,0.12)",
        },
      },
    },
  },
};

const datePickerPopperStyles = {
  "& .MuiPaper-root": {
    borderRadius: "18px",
    border: "1px solid rgba(152,152,154,0.18)",
    boxShadow: "0 22px 55px rgba(15,23,42,0.18)",
    overflow: "hidden",
  },
  "& .MuiPickersCalendarHeader-label": {
    fontFamily: "Noto Sans, sans-serif",
    fontWeight: 900,
    color: "#13322e",
  },
  "& .MuiDayCalendar-weekDayLabel": {
    fontFamily: "Noto Sans, sans-serif",
    fontWeight: 800,
    color: "#98989A",
  },
  "& .MuiPickersDay-root": {
    fontFamily: "Noto Sans, sans-serif",
    fontWeight: 750,
  },
  "& .MuiPickersDay-root.Mui-selected": {
    backgroundColor: "#9d2449",
  },
  "& .MuiPickersDay-root.Mui-selected:hover": {
    backgroundColor: "#611232",
  },
  "& .MuiPickersDay-today": {
    borderColor: "#BC955C",
  },
  "& .MuiPickersDay-root.Mui-disabled": {
    color: "rgba(152,152,154,0.45)",
  },
};

function getOptionValue(option, valueKey) {
  if (option && typeof option === "object") {
    return option[valueKey] ?? "";
  }

  return option ?? "";
}

function getOptionLabel(option, labelKey) {
  if (option && typeof option === "object") {
    return option[labelKey] ?? "";
  }

  return option ?? "";
}

export function MedidasTextField({
  label,
  name,
  value,
  onChange,
  error = "",
  disabled = false,
  helperText = "",
  inputProps = undefined,
  multiline = false,
  rows = 1,
}) {
  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      value={value ?? ""}
      onChange={(event) => onChange(name, event.target.value)}
      error={Boolean(error)}
      helperText={error || helperText}
      disabled={disabled}
      inputProps={inputProps}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      size="small"
      sx={{
        ...fieldBaseSx,
        "& .MuiOutlinedInput-root": {
          ...fieldBaseSx["& .MuiOutlinedInput-root"],
          alignItems: multiline ? "flex-start" : "center",
          py: multiline ? 0.7 : undefined,
        },
      }}
    />
  );
}

export function MedidasSelectField({
  label,
  name,
  value,
  options = [],
  onChange,
  error = "",
  disabled = false,
  valueKey = "id",
  labelKey = "descripcion",
}) {
  const safeOptions = Array.isArray(options) ? options : [];

  return (
    <TextField
      select
      fullWidth
      label={label}
      name={name}
      value={value ?? ""}
      onChange={(event) => onChange(name, event.target.value)}
      error={Boolean(error)}
      helperText={error}
      disabled={disabled}
      size="small"
      SelectProps={{
        MenuProps: selectMenuProps,
      }}
      sx={{
        ...fieldBaseSx,
        "& .MuiSelect-icon": {
          color: "#9d2449",
        },
      }}
    >
      <MenuItem value="">Selecciona una opción</MenuItem>

      {safeOptions.map((option) => {
        const optionValue = getOptionValue(option, valueKey);
        const optionLabel = getOptionLabel(option, labelKey);

        return (
          <MenuItem key={`${name}-${optionValue}`} value={optionValue}>
            {optionLabel}
          </MenuItem>
        );
      })}
    </TextField>
  );
}

export function MedidasDateField({
  label,
  name,
  value,
  onChange,
  error = "",
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <DatePicker
        label={label}
        value={value ? dayjs(value) : null}
        onChange={(nextDate) => {
          if (!nextDate || !nextDate.isValid()) {
            onChange(name, "");
            return;
          }

          if (nextDate.isAfter(dayjs(), "day")) {
            onChange(name, "");
            return;
          }

          onChange(name, nextDate.format("YYYY-MM-DD"));
        }}
        format="DD/MM/YYYY"
        disableFuture
        maxDate={dayjs().endOf("day")}
        reduceAnimations
        slotProps={{
          textField: {
            fullWidth: true,
            size: "small",
            error: Boolean(error),
            helperText: error,
            sx: {
              ...fieldBaseSx,
              "& .MuiSvgIcon-root": {
                color: "#9d2449",
                fontSize: "1.25rem",
              },
            },
          },
          popper: {
            sx: datePickerPopperStyles,
          },
        }}
      />
    </LocalizationProvider>
  );
}

MedidasTextField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
  inputProps: PropTypes.object,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
};

MedidasSelectField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  ),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
};

MedidasDateField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};
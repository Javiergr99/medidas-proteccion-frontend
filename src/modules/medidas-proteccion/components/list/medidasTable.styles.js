export const MEDIDAS_TODAY = new Date();

export const DATE_FORMATTER = new Intl.DateTimeFormat("es-MX", {
  timeZone: "America/Mexico_City",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export const tableHeadCellStyles = {
  fontFamily: "Noto Sans, sans-serif",
  fontWeight: 950,
  color: "#ffffff",
  fontSize: "0.8rem",
  letterSpacing: "0.01em",
  borderBottom: "1px solid rgba(255,255,255,0.12)",
  whiteSpace: "nowrap",
  background: "linear-gradient(180deg, #13322e 0%, #0e2724 100%)",
  py: 1.55,
};

export const tableBodyCellStyles = {
  fontFamily: "Noto Sans, sans-serif",
  color: "#475569",
  fontSize: "0.84rem",
  borderBottom: "1px solid rgba(15,23,42,0.055)",
  whiteSpace: "nowrap",
  py: 1.25,
};

export const filterCellStyles = {
  borderBottom: "1px solid rgba(15,23,42,0.07)",
  background:
    "linear-gradient(180deg, #ffffff 0%, rgba(248,250,252,0.96) 100%)",
  pt: 1.2,
  pb: 1.35,
};

export const premiumInputRootStyles = {
  height: 39,
  borderRadius: "15px",
  background:
    "linear-gradient(180deg, #ffffff 0%, rgba(248,250,252,0.96) 100%)",
  fontFamily: "Noto Sans, sans-serif",
  fontSize: "0.78rem",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.95), 0 8px 18px rgba(15,23,42,0.035)",

  "& fieldset": {
    borderColor: "rgba(15,23,42,0.10)",
  },

  "&:hover fieldset": {
    borderColor: "rgba(157,36,73,0.24)",
  },

  "&.Mui-focused fieldset": {
    borderColor: "#9d2449",
    borderWidth: "1px",
    boxShadow: "0 0 0 3px rgba(157,36,73,0.08)",
  },
};

export const filterInputStyles = {
  minWidth: 130,
  "& .MuiOutlinedInput-root": premiumInputRootStyles,
  "& .MuiInputBase-input": {
    py: 0.75,
    color: "#334155",
    fontWeight: 800,
  },
  "& input::placeholder": {
    color: "#98989A",
    opacity: 1,
    fontWeight: 750,
  },
};

export const selectMenuProps = {
  PaperProps: {
    sx: {
      mt: 0.7,
      borderRadius: "20px",
      border: "1px solid rgba(15,23,42,0.08)",
      boxShadow: "0 24px 60px rgba(15,23,42,0.16)",
      p: 0.6,
      "& .MuiMenuItem-root": {
        fontFamily: "Noto Sans, sans-serif",
        fontWeight: 850,
        fontSize: "0.86rem",
        borderRadius: "13px",
        mx: 0.2,
        my: 0.25,
        minHeight: 38,
        "&:hover": {
          backgroundColor: "rgba(221,201,163,0.24)",
        },
        "&.Mui-selected": {
          color: "#611232",
          backgroundColor: "rgba(157,36,73,0.08)",
          fontWeight: 950,
        },
        "&.Mui-selected:hover": {
          backgroundColor: "rgba(157,36,73,0.12)",
        },
      },
    },
  },
};

export const datePickerSlotProps = {
  textField: {
    size: "small",
    placeholder: "Fecha",
    sx: {
      ...filterInputStyles,
      minWidth: 158,
      "& .MuiSvgIcon-root": {
        color: "#9d2449",
      },
    },
  },
  popper: {
    sx: {
      "& .MuiPaper-root": {
        borderRadius: "24px",
        border: "1px solid rgba(15,23,42,0.08)",
        boxShadow: "0 28px 80px rgba(15,23,42,0.20)",
        overflow: "hidden",
      },
      "& .MuiPickersCalendarHeader-label": {
        fontFamily: "Noto Sans, sans-serif",
        fontWeight: 950,
        color: "#13322e",
      },
      "& .MuiDayCalendar-weekDayLabel": {
        fontFamily: "Noto Sans, sans-serif",
        fontWeight: 900,
        color: "#98989A",
      },
      "& .MuiPickersDay-root": {
        fontFamily: "Noto Sans, sans-serif",
        fontWeight: 850,
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
    },
  },
};
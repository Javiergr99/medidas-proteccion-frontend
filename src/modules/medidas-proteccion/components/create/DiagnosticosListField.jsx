import PropTypes from "prop-types";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import { DIAGNOSTICO_TIPO_OPTIONS } from "../../constants/medidasCreate.constants";
import {
  MedidasDateField,
  MedidasSelectField,
} from "./MedidasFormControls";

function createEmptyDiagnostico() {
  return {
    uid: `diagnostico_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    tipo_diagnostico: "",
    fecha_diagnostico: "",
  };
}

export default function DiagnosticosListField({
  value,
  error,
  disabled,
  onChange,
}) {
  function addDiagnostico() {
    onChange("detalles_diagnosticos", [...value, createEmptyDiagnostico()]);
  }

  function updateDiagnostico(uid, fieldName, fieldValue) {
    const nextValue = value.map((item) => {
      if (item.uid !== uid) {
        return item;
      }

      return {
        ...item,
        [fieldName]: fieldValue,
      };
    });

    onChange("detalles_diagnosticos", nextValue);
  }

  function removeDiagnostico(uid) {
    onChange(
      "detalles_diagnosticos",
      value.filter((item) => item.uid !== uid)
    );
  }

  return (
    <Box
      sx={{
        gridColumn: "1 / -1",
        borderRadius: "26px",
        border: error
          ? "1px solid rgba(220,38,38,0.28)"
          : "1px solid rgba(15,23,42,0.07)",
        background:
          "linear-gradient(180deg, #ffffff 0%, rgba(248,250,252,0.96) 100%)",
        boxShadow:
          "0 18px 48px rgba(15,23,42,0.055), inset 0 1px 0 rgba(255,255,255,0.95)",
        p: { xs: 2, md: 2.5 },
        opacity: disabled ? 0.72 : 1,
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={1.5}
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: "Noto Sans, sans-serif",
              color: "#13322e",
              fontWeight: 950,
              fontSize: { xs: "1.05rem", md: "1.2rem" },
              letterSpacing: "-0.025em",
            }}
          >
            Detalles diagnósticos
          </Typography>

          <Typography
            sx={{
              mt: 0.45,
              fontFamily: "Noto Sans, sans-serif",
              color: "#64748b",
              fontWeight: 700,
              fontSize: "0.85rem",
              lineHeight: 1.55,
            }}
          >
            Si existe diagnóstico elaborado, agrega al menos un tipo de
            diagnóstico con su fecha correspondiente.
          </Typography>
        </Box>

        <Button
          type="button"
          startIcon={<AddCircleOutlineRoundedIcon />}
          onClick={addDiagnostico}
          disabled={disabled}
          sx={addButtonStyles}
        >
          Agregar diagnóstico
        </Button>
      </Stack>

      {error ? (
        <Typography
          sx={{
            mb: 1.5,
            fontFamily: "Noto Sans, sans-serif",
            color: "#b91c1c",
            fontWeight: 850,
            fontSize: "0.82rem",
          }}
        >
          {error}
        </Typography>
      ) : null}

      {disabled ? (
        <Box
          sx={{
            borderRadius: "20px",
            backgroundColor: "rgba(152,152,154,0.08)",
            border: "1px dashed rgba(100,116,139,0.20)",
            px: 2,
            py: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: "Noto Sans, sans-serif",
              color: "#64748b",
              fontWeight: 750,
              fontSize: "0.9rem",
            }}
          >
            Activa “Diagnóstico elaborado” para capturar detalles.
          </Typography>
        </Box>
      ) : null}

      {!disabled && value.length === 0 ? (
        <Box
          sx={{
            borderRadius: "20px",
            backgroundColor: "rgba(221,201,163,0.16)",
            border: "1px dashed rgba(188,149,92,0.28)",
            px: 2,
            py: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: "Noto Sans, sans-serif",
              color: "#64748b",
              fontWeight: 750,
              fontSize: "0.9rem",
            }}
          >
            Todavía no hay diagnósticos agregados.
          </Typography>
        </Box>
      ) : null}

      <Stack spacing={1.5}>
        {value.map((item, index) => (
          <Box
            key={item.uid}
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "minmax(0, 1fr) minmax(0, 1fr) auto",
              },
              gap: 1.5,
              alignItems: "center",
              borderRadius: "22px",
              background:
                "linear-gradient(135deg, rgba(248,250,252,0.96), rgba(255,255,255,0.98))",
              border: "1px solid rgba(15,23,42,0.07)",
              p: 1.4,
            }}
          >
            <MedidasSelectField
              label={`Tipo de diagnóstico ${index + 1}`}
              name={`tipo_diagnostico_${item.uid}`}
              value={item.tipo_diagnostico}
              options={DIAGNOSTICO_TIPO_OPTIONS}
              valueKey="value"
              labelKey="label"
              onChange={(_, nextValue) =>
                updateDiagnostico(item.uid, "tipo_diagnostico", nextValue)
              }
            />

            <MedidasDateField
              label="Fecha de diagnóstico"
              name={`fecha_diagnostico_${item.uid}`}
              value={item.fecha_diagnostico}
              onChange={(_, nextValue) =>
                updateDiagnostico(item.uid, "fecha_diagnostico", nextValue)
              }
            />

            <IconButton
              type="button"
              aria-label="Eliminar diagnóstico"
              onClick={() => removeDiagnostico(item.uid)}
              sx={{
                width: 44,
                height: 44,
                borderRadius: "16px",
                color: "#b91c1c",
                backgroundColor: "rgba(220,38,38,0.07)",
                border: "1px solid rgba(220,38,38,0.12)",
                "&:hover": {
                  backgroundColor: "rgba(220,38,38,0.12)",
                },
              }}
            >
              <DeleteOutlineRoundedIcon />
            </IconButton>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

DiagnosticosListField.propTypes = {
  value: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      tipo_diagnostico: PropTypes.string,
      fecha_diagnostico: PropTypes.string,
    })
  ).isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

const addButtonStyles = {
  minHeight: 42,
  borderRadius: 999,
  px: 2.2,
  textTransform: "none",
  fontFamily: "Noto Sans, sans-serif",
  fontWeight: 950,
  color: "#611232",
  backgroundColor: "rgba(221,201,163,0.24)",
  border: "1px solid rgba(188,149,92,0.28)",
  "&:hover": {
    backgroundColor: "rgba(221,201,163,0.36)",
  },
};
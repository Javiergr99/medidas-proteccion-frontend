import { useState } from "react";
import PropTypes from "prop-types";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import { MedidasSelectField, MedidasTextField } from "./MedidasFormControls";

const OTHER_RIGHT_VALUE = "__otro__";

const DERECHOS_VULNERADOS_OPTIONS = [
  {
    value: "Derecho a la vida, supervivencia y desarrollo",
    label: "Derecho a la vida, supervivencia y desarrollo",
  },
  {
    value: "Derecho de prioridad",
    label: "Derecho de prioridad",
  },
  {
    value: "Derecho a la identidad",
    label: "Derecho a la identidad",
  },
  {
    value: "Derecho a vivir en familia",
    label: "Derecho a vivir en familia",
  },
  {
    value: "Derecho a la igualdad sustantiva",
    label: "Derecho a la igualdad sustantiva",
  },
  {
    value: "Derecho a no ser discriminado",
    label: "Derecho a no ser discriminado",
  },
  {
    value: "Derecho a vivir en condiciones de bienestar",
    label: "Derecho a vivir en condiciones de bienestar",
  },
  {
    value: "Derecho a una vida libre de violencia",
    label: "Derecho a una vida libre de violencia",
  },
  {
    value: "Derecho a la protección de la salud",
    label: "Derecho a la protección de la salud",
  },
  {
    value: "Derecho a la educación",
    label: "Derecho a la educación",
  },
  {
    value: "Derecho al descanso y esparcimiento",
    label: "Derecho al descanso y esparcimiento",
  },
  {
    value:
      "Derecho a la libertad de convicciones éticas, pensamiento, conciencia, religión y cultura",
    label: "Derecho a la libertad de convicciones, pensamiento y cultura",
  },
  {
    value: "Derecho a la libertad de expresión y acceso a la información",
    label: "Derecho a la libertad de expresión y acceso a la información",
  },
  {
    value: "Derecho de participación",
    label: "Derecho de participación",
  },
  {
    value: "Derecho de asociación y reunión",
    label: "Derecho de asociación y reunión",
  },
  {
    value: "Derecho a la intimidad",
    label: "Derecho a la intimidad",
  },
  {
    value: "Derecho a la seguridad jurídica y debido proceso",
    label: "Derecho a la seguridad jurídica y debido proceso",
  },
  {
    value: "Derecho de niñas, niños y adolescentes migrantes",
    label: "Derecho de niñas, niños y adolescentes migrantes",
  },
  {
    value:
      "Derecho de acceso a las tecnologías de la información y comunicación",
    label: "Derecho de acceso a tecnologías de la información",
  },
  {
    value: OTHER_RIGHT_VALUE,
    label: "Otro derecho vulnerado",
  },
];

function normalizeDerecho(value) {
  return String(value || "").trim();
}

function getDerechosVulnerados(value) {
  return Array.isArray(value) ? value : [];
}

export default function DerechosVulneradosField({
  value,
  error,
  onFieldChange,
}) {
  const [selectedDerecho, setSelectedDerecho] = useState("");
  const [otroDerecho, setOtroDerecho] = useState("");

  const derechosVulnerados = getDerechosVulnerados(value);
  const isOtherSelected = selectedDerecho === OTHER_RIGHT_VALUE;

  const derechoToAdd = isOtherSelected
    ? normalizeDerecho(otroDerecho)
    : normalizeDerecho(selectedDerecho);

  const canAddDerecho =
    Boolean(derechoToAdd) && !derechosVulnerados.includes(derechoToAdd);

  function handleSelectedDerechoChange(_name, nextValue) {
    setSelectedDerecho(nextValue);

    if (nextValue !== OTHER_RIGHT_VALUE) {
      setOtroDerecho("");
    }
  }

  function handleOtroDerechoChange(_name, nextValue) {
    setOtroDerecho(String(nextValue || "").toUpperCase());
  }

  function handleAddDerecho() {
    if (!canAddDerecho) return;

    onFieldChange("derechos_vulnerados", [
      ...derechosVulnerados,
      derechoToAdd,
    ]);

    setSelectedDerecho("");
    setOtroDerecho("");
  }

  function handleRemoveDerecho(index) {
    const nextDerechos = derechosVulnerados.filter(
      (_, itemIndex) => itemIndex !== index
    );

    onFieldChange("derechos_vulnerados", nextDerechos);
  }

  return (
    <Stack spacing={2.2}>
      <Box className="mp-plan-add-grid">
        <MedidasSelectField
          label="Derecho vulnerado"
          name="derecho_vulnerado"
          value={selectedDerecho}
          options={DERECHOS_VULNERADOS_OPTIONS}
          valueKey="value"
          labelKey="label"
          onChange={handleSelectedDerechoChange}
          error=""
        />

        {isOtherSelected ? (
          <MedidasTextField
            label="Especificar derecho vulnerado"
            name="otro_derecho_vulnerado"
            value={otroDerecho}
            onChange={handleOtroDerechoChange}
            error=""
            inputProps={{ maxLength: 180 }}
          />
        ) : null}

        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            minHeight: 46,
          }}
        >
          <Button
            type="button"
            startIcon={<AddRoundedIcon />}
            disabled={!canAddDerecho}
            onClick={handleAddDerecho}
            sx={{
              minHeight: 42,
              width: { xs: "100%", md: "auto" },
              borderRadius: "999px",
              px: 1.8,
              py: 0.78,
              textTransform: "none",
              fontFamily: "Noto Sans, sans-serif",
              fontWeight: 900,
              color: "#611232",
              border: "1px solid rgba(188,149,92,0.28)",
              backgroundColor: "rgba(221,201,163,0.18)",
              "&:hover": {
                backgroundColor: "rgba(221,201,163,0.28)",
                borderColor: "#BC955C",
              },
              "&.Mui-disabled": {
                color: "rgba(100,116,139,0.72)",
                borderColor: "rgba(148,163,184,0.22)",
                backgroundColor: "rgba(248,250,252,0.9)",
              },
            }}
          >
            Agregar derecho
          </Button>
        </Box>
      </Box>

      {typeof error === "string" && error ? (
        <Typography
          sx={{
            fontFamily: "Noto Sans, sans-serif",
            color: "#b42318",
            fontWeight: 750,
            fontSize: "0.78rem",
          }}
        >
          {error}
        </Typography>
      ) : null}

      <Divider
        sx={{
          borderColor: "rgba(152,152,154,0.14)",
        }}
      />

      {derechosVulnerados.length > 0 ? (
        <Stack spacing={1.2}>
          {derechosVulnerados.map((derecho, index) => (
            <Box key={`${derecho}-${index + 1}`} className="mp-plan-right-item">
              <div>
                <span className="mp-plan-right-index">
                  Derecho {index + 1}
                </span>

                <p className="mp-plan-right-text">{derecho}</p>
              </div>

              <Button
                type="button"
                size="small"
                startIcon={<DeleteOutlineRoundedIcon />}
                onClick={() => handleRemoveDerecho(index)}
                sx={{
                  borderRadius: "999px",
                  color: "#9d2449",
                  fontFamily: "Noto Sans, sans-serif",
                  fontWeight: 850,
                  fontSize: "0.76rem",
                  textTransform: "none",
                  px: 1.35,
                  flex: "0 0 auto",
                  "&:hover": {
                    backgroundColor: "rgba(157,36,73,0.06)",
                  },
                }}
              >
                Quitar
              </Button>
            </Box>
          ))}
        </Stack>
      ) : (
        <Box className="mp-plan-empty">
          Aún no se han agregado derechos vulnerados.
        </Box>
      )}
    </Stack>
  );
}

DerechosVulneradosField.propTypes = {
  value: PropTypes.array,
  error: PropTypes.string,
  onFieldChange: PropTypes.func.isRequired,
};

DerechosVulneradosField.defaultProps = {
  value: [],
  error: "",
};
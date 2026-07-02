import { useState } from "react";
import PropTypes from "prop-types";
import { Box, Button, Divider, Stack, Typography } from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import { MedidasSelectField, MedidasTextField } from "./MedidasFormControls";

const OTHER_VALUE = "__otro__";

const EMPTY_MEDIDAS_PROTECCION_FORM = {
  medidas_urgentes: [],
  medidas_especiales: [],
  observaciones: "",
};

const MEDIDAS_URGENTES_OPTIONS = [
  {
    value: "Atención médica inmediata",
    label: "Atención médica inmediata",
  },
  {
    value: "Atención psicológica inmediata",
    label: "Atención psicológica inmediata",
  },
  {
    value: "Resguardo o protección inmediata",
    label: "Resguardo o protección inmediata",
  },
  {
    value: "Separación de la persona agresora",
    label: "Separación de la persona agresora",
  },
  {
    value: "Canalización a institución competente",
    label: "Canalización a institución competente",
  },
  {
    value: "Localización de familiares o red de apoyo",
    label: "Localización de familiares o red de apoyo",
  },
  {
    value: "Solicitud de auxilio a autoridad competente",
    label: "Solicitud de auxilio a autoridad competente",
  },
  {
    value: OTHER_VALUE,
    label: "Otra medida urgente",
  },
];

const MEDIDAS_ESPECIALES_OPTIONS = [
  {
    value: "Inclusión en programas de asistencia social",
    label: "Inclusión en programas de asistencia social",
  },
  {
    value: "Restitución del derecho a la educación",
    label: "Restitución del derecho a la educación",
  },
  {
    value: "Restitución del derecho a la salud",
    label: "Restitución del derecho a la salud",
  },
  {
    value: "Regularización documental",
    label: "Regularización documental",
  },
  {
    value: "Representación jurídica",
    label: "Representación jurídica",
  },
  {
    value: "Seguimiento por trabajo social",
    label: "Seguimiento por trabajo social",
  },
  {
    value: "Seguimiento psicológico",
    label: "Seguimiento psicológico",
  },
  {
    value: "Reintegración familiar supervisada",
    label: "Reintegración familiar supervisada",
  },
  {
    value: OTHER_VALUE,
    label: "Otra medida especial",
  },
];

function normalizeText(value) {
  return String(value || "").trim();
}

function getArrayValue(value) {
  return Array.isArray(value) ? value : [];
}

export default function MedidasProteccionForm({
  form = EMPTY_MEDIDAS_PROTECCION_FORM,
  errors = {},
  onFieldChange,
}) {
  const safeForm = {
    ...EMPTY_MEDIDAS_PROTECCION_FORM,
    ...(form || {}),
  };

  return (
    <section className="mp-protection-form">
      <style>{styles}</style>

      <header className="mp-protection-header">
        <div>
          <h2 className="mp-protection-title">Medidas de protección</h2>

          <p className="mp-protection-description">
            Registra las medidas urgentes y especiales dictadas para proteger y
            restituir los derechos del NNA.
          </p>
        </div>
      </header>

      <div className="mp-protection-sections">
        <section className="mp-protection-card">
          <div className="mp-protection-card-header">
            <h3 className="mp-protection-card-title">Medidas urgentes</h3>

            <p className="mp-protection-card-description">
              Agrega las medidas que deben atenderse de forma inmediata por la
              situación de riesgo o vulneración detectada.
            </p>
          </div>

          <MedidasListField
            value={safeForm.medidas_urgentes}
            error={errors.medidas_urgentes}
            options={MEDIDAS_URGENTES_OPTIONS}
            selectLabel="Medida urgente"
            otherLabel="Especificar medida urgente"
            emptyText="Aún no se han agregado medidas urgentes."
            itemPrefix="Medida urgente"
            onChange={(nextValue) =>
              onFieldChange("medidas_urgentes", nextValue)
            }
          />
        </section>

        <section className="mp-protection-card">
          <div className="mp-protection-card-header">
            <h3 className="mp-protection-card-title">Medidas especiales</h3>

            <p className="mp-protection-card-description">
              Agrega las medidas de seguimiento, restitución o canalización que
              formarán parte del expediente.
            </p>
          </div>

          <MedidasListField
            value={safeForm.medidas_especiales}
            error={errors.medidas_especiales}
            options={MEDIDAS_ESPECIALES_OPTIONS}
            selectLabel="Medida especial"
            otherLabel="Especificar medida especial"
            emptyText="Aún no se han agregado medidas especiales."
            itemPrefix="Medida especial"
            onChange={(nextValue) =>
              onFieldChange("medidas_especiales", nextValue)
            }
          />
        </section>

        <section className="mp-protection-card">
          <div className="mp-protection-card-header">
            <h3 className="mp-protection-card-title">Observaciones</h3>

            <p className="mp-protection-card-description">
              Captura información adicional relevante sobre las medidas
              dictadas, responsables o seguimiento requerido.
            </p>
          </div>

          <div className="mp-protection-grid">
            <MedidasTextField
              label="Observaciones"
              name="observaciones"
              value={safeForm.observaciones}
              onChange={onFieldChange}
              error={errors.observaciones}
              multiline
              minRows={4}
              inputProps={{ maxLength: 1200 }}
            />
          </div>
        </section>
      </div>
    </section>
  );
}

function MedidasListField({
  value = [],
  error = "",
  options,
  selectLabel,
  otherLabel,
  emptyText,
  itemPrefix,
  onChange,
}) {
  const [selectedValue, setSelectedValue] = useState("");
  const [otherValue, setOtherValue] = useState("");

  const items = getArrayValue(value);
  const isOtherSelected = selectedValue === OTHER_VALUE;

  const itemToAdd = isOtherSelected
    ? normalizeText(otherValue)
    : normalizeText(selectedValue);

  const canAdd = Boolean(itemToAdd) && !items.includes(itemToAdd);

  function handleSelectChange(_name, nextValue) {
    setSelectedValue(nextValue);

    if (nextValue !== OTHER_VALUE) {
      setOtherValue("");
    }
  }

  function handleOtherChange(_name, nextValue) {
    setOtherValue(String(nextValue || "").toUpperCase());
  }

  function handleAdd() {
    if (!canAdd) return;

    onChange([...items, itemToAdd]);

    setSelectedValue("");
    setOtherValue("");
  }

  function handleRemove(index) {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <Stack spacing={2.2}>
      <Box className="mp-protection-add-grid">
        <MedidasSelectField
          label={selectLabel}
          name="medida"
          value={selectedValue}
          options={options}
          valueKey="value"
          labelKey="label"
          onChange={handleSelectChange}
          error=""
        />

        {isOtherSelected ? (
          <MedidasTextField
            label={otherLabel}
            name="otra_medida"
            value={otherValue}
            onChange={handleOtherChange}
            error=""
            inputProps={{ maxLength: 220 }}
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
            disabled={!canAdd}
            onClick={handleAdd}
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
            Agregar medida
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

      <Divider sx={{ borderColor: "rgba(152,152,154,0.14)" }} />

      {items.length > 0 ? (
        <Stack spacing={1.2}>
          {items.map((item, index) => (
            <Box key={`${item}-${index + 1}`} className="mp-protection-item">
              <div>
                <span className="mp-protection-item-index">
                  {itemPrefix} {index + 1}
                </span>

                <p className="mp-protection-item-text">{item}</p>
              </div>

              <Button
                type="button"
                size="small"
                startIcon={<DeleteOutlineRoundedIcon />}
                onClick={() => handleRemove(index)}
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
        <Box className="mp-protection-empty">{emptyText}</Box>
      )}
    </Stack>
  );
}

const styles = `
  .mp-protection-form {
    display: grid;
    gap: 22px;
    width: 100%;
    min-width: 0;
  }

  .mp-protection-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;
    width: 100%;
    min-width: 0;
  }

  .mp-protection-title {
    margin: 0;
    color: #611232;
    font-family: "Noto Sans", sans-serif;
    font-size: clamp(1.35rem, 2vw, 1.85rem);
    font-weight: 950;
    line-height: 1.12;
    letter-spacing: -0.035em;
  }

  .mp-protection-description {
    max-width: 860px;
    margin: 8px 0 0;
    color: #64748b;
    font-family: "Noto Sans", sans-serif;
    font-size: 0.93rem;
    font-weight: 600;
    line-height: 1.6;
  }

  .mp-protection-sections {
    display: grid;
    gap: 18px;
    width: 100%;
    min-width: 0;
  }

  .mp-protection-card {
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    border-radius: 24px;
    background: linear-gradient(180deg, #ffffff 0%, rgba(251,250,248,0.72) 100%);
    border: 1px solid rgba(152,152,154,0.16);
    box-shadow: 0 10px 26px rgba(19,50,46,0.04);
    padding: 24px;
    overflow: hidden;
    transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
  }

  .mp-protection-card:hover {
    transform: translateY(-1px);
    border-color: rgba(188,149,92,0.24);
    box-shadow: 0 14px 32px rgba(19,50,46,0.055);
  }

  .mp-protection-card-header {
    margin-bottom: 20px;
    max-width: 980px;
  }

  .mp-protection-card-title {
    margin: 0;
    color: #13322e;
    font-family: "Noto Sans", sans-serif;
    font-size: clamp(1.02rem, 1.3vw, 1.16rem);
    font-weight: 950;
    line-height: 1.18;
    letter-spacing: -0.025em;
  }

  .mp-protection-card-description {
    max-width: 900px;
    margin: 6px 0 0;
    color: #64748b;
    font-family: "Noto Sans", sans-serif;
    font-size: 0.84rem;
    font-weight: 600;
    line-height: 1.55;
  }

  .mp-protection-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 18px;
    align-items: start;
    width: 100%;
    min-width: 0;
  }

  .mp-protection-add-grid {
    display: grid;
    grid-template-columns: minmax(280px, 1fr) minmax(280px, 1fr) auto;
    gap: 18px;
    align-items: start;
    width: 100%;
    min-width: 0;
  }

  .mp-protection-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    border-radius: 18px;
    border: 1px solid rgba(152,152,154,0.14);
    background: #ffffff;
    box-shadow: 0 8px 22px rgba(19,50,46,0.035);
    padding: 14px 16px;
  }

  .mp-protection-item-index {
    display: block;
    margin-bottom: 4px;
    color: #611232;
    font-family: "Noto Sans", sans-serif;
    font-size: 0.76rem;
    font-weight: 950;
  }

  .mp-protection-item-text {
    margin: 0;
    color: #13322e;
    font-family: "Noto Sans", sans-serif;
    font-size: 0.88rem;
    font-weight: 750;
    line-height: 1.45;
  }

  .mp-protection-empty {
    border-radius: 16px;
    background: rgba(248,250,252,0.86);
    border: 1px dashed rgba(148,163,184,0.36);
    color: #64748b;
    font-family: "Noto Sans", sans-serif;
    font-size: 0.84rem;
    font-weight: 700;
    line-height: 1.5;
    padding: 16px;
  }

  @media (max-width: 1080px) {
    .mp-protection-add-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 720px) {
    .mp-protection-form {
      gap: 18px;
    }

    .mp-protection-sections {
      gap: 16px;
    }

    .mp-protection-card {
      border-radius: 20px;
      padding: 18px;
    }

    .mp-protection-item {
      align-items: flex-start;
      flex-direction: column;
    }
  }
`;

MedidasProteccionForm.propTypes = {
  form: PropTypes.object,
  errors: PropTypes.object,
  onFieldChange: PropTypes.func.isRequired,
};

MedidasListField.propTypes = {
  value: PropTypes.array,
  error: PropTypes.string,
  options: PropTypes.array.isRequired,
  selectLabel: PropTypes.string.isRequired,
  otherLabel: PropTypes.string.isRequired,
  emptyText: PropTypes.string.isRequired,
  itemPrefix: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
import PropTypes from "prop-types";
import { Box, Button, Stack, Typography } from "@mui/material";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

import {
  DETERMINACION_FAMILIAR_OPTIONS,
  EMPTY_MEDIDA_ESPECIAL_ITEM,
  EMPTY_MEDIDA_URGENTE_ITEM,
  MEDIDA_ALOJAMIENTO_CAS_OPTIONS,
  PRONFAC_OPTIONS,
  TIPO_CENTRO_OPTIONS,
  YES_NO_OPTIONS,
} from "../../constants/medidasCreate.constants";

import {
  MedidasDateField,
  MedidasSelectField,
  MedidasTextField,
} from "./MedidasFormControls";

const EMPTY_FORM = {
  medida_emitida_procuraduria: "",
  medidas_especiales_list: [],
  existen_medidas_urgentes: "",
  medidas_urgentes_list: [],
};

function getList(value) {
  return Array.isArray(value) ? value : [];
}

function getRowErrors(errors, name, index) {
  return Array.isArray(errors?.[name]) ? errors[name][index] || {} : {};
}

function updateListItem(list, index, fieldName, fieldValue) {
  return list.map((item, itemIndex) => {
    if (itemIndex !== index) return item;

    return {
      ...item,
      [fieldName]: fieldValue,
    };
  });
}

export default function MedidasProteccionForm({
  form = EMPTY_FORM,
  errors = {},
  onFieldChange,
}) {
  const safeForm = {
    ...EMPTY_FORM,
    ...(form || {}),
  };

  const medidasEspeciales = getList(safeForm.medidas_especiales_list);
  const medidasUrgentes = getList(safeForm.medidas_urgentes_list);

  function addMedidaEspecial() {
    onFieldChange("medidas_especiales_list", [
      ...medidasEspeciales,
      { ...EMPTY_MEDIDA_ESPECIAL_ITEM },
    ]);
  }

  function updateMedidaEspecial(index, fieldName, fieldValue) {
    onFieldChange(
      "medidas_especiales_list",
      updateListItem(medidasEspeciales, index, fieldName, fieldValue)
    );
  }

  function removeMedidaEspecial(index) {
    onFieldChange(
      "medidas_especiales_list",
      medidasEspeciales.filter((_, itemIndex) => itemIndex !== index)
    );
  }

  function addMedidaUrgente() {
    onFieldChange("medidas_urgentes_list", [
      ...medidasUrgentes,
      { ...EMPTY_MEDIDA_URGENTE_ITEM },
    ]);
  }

  function updateMedidaUrgente(index, fieldName, fieldValue) {
    onFieldChange(
      "medidas_urgentes_list",
      updateListItem(medidasUrgentes, index, fieldName, fieldValue)
    );
  }

  function removeMedidaUrgente(index) {
    onFieldChange(
      "medidas_urgentes_list",
      medidasUrgentes.filter((_, itemIndex) => itemIndex !== index)
    );
  }

  const showEspeciales = safeForm.medida_emitida_procuraduria === "si";
  const showUrgentes = safeForm.existen_medidas_urgentes === "si";

  return (
    <section className="mp-protection-form">
      <style>{styles}</style>

      <header className="mp-protection-header">
        <div>
          <h2 className="mp-protection-title">Medidas de protección</h2>

          <p className="mp-protection-description">
            Registra las medidas especiales emitidas por la Procuraduría y las
            medidas urgentes asociadas al expediente.
          </p>
        </div>
      </header>

      <div className="mp-protection-sections">
        <section className="mp-protection-card">
          <div className="mp-protection-card-header">
            <h3 className="mp-protection-card-title">
              Medidas emitidas por Procuraduría
            </h3>

            <p className="mp-protection-card-description">
              Si existe una medida emitida por Procuraduría, agrega al menos un
              registro con la información correspondiente.
            </p>
          </div>

          <div className="mp-protection-grid mp-protection-grid--small">
            <MedidasSelectField
              label="¿La Procuraduría emitió medida?"
              name="medida_emitida_procuraduria"
              value={safeForm.medida_emitida_procuraduria}
              options={YES_NO_OPTIONS}
              valueKey="value"
              labelKey="label"
              onChange={onFieldChange}
              error={errors.medida_emitida_procuraduria}
            />
          </div>

          {typeof errors.medidas_especiales_list === "string" ? (
            <Typography className="mp-protection-error">
              {errors.medidas_especiales_list}
            </Typography>
          ) : null}

          {showEspeciales ? (
            <MedidasEspecialesList
              items={medidasEspeciales}
              errors={errors}
              onAdd={addMedidaEspecial}
              onUpdate={updateMedidaEspecial}
              onRemove={removeMedidaEspecial}
            />
          ) : (
            <Box className="mp-protection-empty">
              Selecciona “Sí” para capturar medidas especiales.
            </Box>
          )}
        </section>

        <section className="mp-protection-card">
          <div className="mp-protection-card-header">
            <h3 className="mp-protection-card-title">Medidas urgentes</h3>

            <p className="mp-protection-card-description">
              Si existen medidas urgentes, agrega al menos una medida con su
              número, autoridad, fecha y descripción.
            </p>
          </div>

          <div className="mp-protection-grid mp-protection-grid--small">
            <MedidasSelectField
              label="¿Existen medidas urgentes?"
              name="existen_medidas_urgentes"
              value={safeForm.existen_medidas_urgentes}
              options={YES_NO_OPTIONS}
              valueKey="value"
              labelKey="label"
              onChange={onFieldChange}
              error={errors.existen_medidas_urgentes}
            />
          </div>

          {typeof errors.medidas_urgentes_list === "string" ? (
            <Typography className="mp-protection-error">
              {errors.medidas_urgentes_list}
            </Typography>
          ) : null}

          {showUrgentes ? (
            <MedidasUrgentesList
              items={medidasUrgentes}
              errors={errors}
              onAdd={addMedidaUrgente}
              onUpdate={updateMedidaUrgente}
              onRemove={removeMedidaUrgente}
            />
          ) : (
            <Box className="mp-protection-empty">
              Selecciona “Sí” para capturar medidas urgentes.
            </Box>
          )}
        </section>
      </div>
    </section>
  );
}

function MedidasUrgentesList({ items, errors, onAdd, onUpdate, onRemove }) {
  return (
    <Stack spacing={1.6} sx={{ mt: 2 }}>
      <Button type="button" startIcon={<AddRoundedIcon />} onClick={onAdd} className="mp-protection-add-button">
        Agregar medida urgente
      </Button>

      {items.length ? (
        items.map((item, index) => {
          const rowErrors = getRowErrors(errors, "medidas_urgentes_list", index);

          return (
            <Box key={`urgente-${index + 1}`} className="mp-protection-item-card">
              <div className="mp-protection-item-header">
                <strong>Medida urgente {index + 1}</strong>

                <Button
                  type="button"
                  size="small"
                  startIcon={<DeleteOutlineRoundedIcon />}
                  onClick={() => onRemove(index)}
                  className="mp-protection-remove-button"
                >
                  Quitar
                </Button>
              </div>

              <div className="mp-protection-grid">
                <MedidasTextField
                  label="Número de medida"
                  name="numero_medida"
                  value={item.numero_medida}
                  onChange={(_name, value) => onUpdate(index, "numero_medida", value)}
                  error={rowErrors.numero_medida}
                  inputProps={{ maxLength: 50 }}
                />

                <MedidasTextField
                  label="Autoridad que emitió"
                  name="autoridad_emitio"
                  value={item.autoridad_emitio}
                  onChange={(_name, value) => onUpdate(index, "autoridad_emitio", value)}
                  error={rowErrors.autoridad_emitio}
                  inputProps={{ maxLength: 200 }}
                />

                <MedidasDateField
                  label="Fecha de la medida"
                  name="fecha_medida"
                  value={item.fecha_medida}
                  onChange={(_name, value) => onUpdate(index, "fecha_medida", value)}
                  error={rowErrors.fecha_medida}
                />

                <div className="mp-protection-grid-span">
                  <MedidasTextField
                    label="Descripción"
                    name="descripcion"
                    value={item.descripcion}
                    onChange={(_name, value) => onUpdate(index, "descripcion", value)}
                    error={rowErrors.descripcion}
                    multiline
                    rows={3}
                  />
                </div>
              </div>
            </Box>
          );
        })
      ) : (
        <Box className="mp-protection-empty">Aún no se han agregado medidas urgentes.</Box>
      )}
    </Stack>
  );
}

function MedidasEspecialesList({ items, errors, onAdd, onUpdate, onRemove }) {
  return (
    <Stack spacing={1.6} sx={{ mt: 2 }}>
      <Button type="button" startIcon={<AddRoundedIcon />} onClick={onAdd} className="mp-protection-add-button">
        Agregar medida especial
      </Button>

      {items.length ? (
        items.map((item, index) => {
          const rowErrors = getRowErrors(errors, "medidas_especiales_list", index);

          return (
            <Box key={`especial-${index + 1}`} className="mp-protection-item-card">
              <div className="mp-protection-item-header">
                <strong>Medida especial {index + 1}</strong>

                <Button
                  type="button"
                  size="small"
                  startIcon={<DeleteOutlineRoundedIcon />}
                  onClick={() => onRemove(index)}
                  className="mp-protection-remove-button"
                >
                  Quitar
                </Button>
              </div>

              <div className="mp-protection-grid">
                <MedidasTextField
                  label="Número de medida"
                  name="numero_medida"
                  value={item.numero_medida}
                  onChange={(_name, value) => onUpdate(index, "numero_medida", value)}
                  error={rowErrors.numero_medida}
                  inputProps={{ maxLength: 50 }}
                />

                <MedidasTextField
                  label="Autoridad que emitió"
                  name="autoridad_emitio"
                  value={item.autoridad_emitio}
                  onChange={(_name, value) => onUpdate(index, "autoridad_emitio", value)}
                  error={rowErrors.autoridad_emitio}
                  inputProps={{ maxLength: 200 }}
                />

                <MedidasDateField
                  label="Fecha de la medida"
                  name="fecha_medida"
                  value={item.fecha_medida}
                  onChange={(_name, value) => onUpdate(index, "fecha_medida", value)}
                  error={rowErrors.fecha_medida}
                />

                <div className="mp-protection-grid-span">
                  <MedidasTextField
                    label="Descripción"
                    name="descripcion"
                    value={item.descripcion}
                    onChange={(_name, value) => onUpdate(index, "descripcion", value)}
                    error={rowErrors.descripcion}
                    multiline
                    rows={3}
                  />
                </div>

                <MedidasSelectField
                  label="Medida de alojamiento CAS"
                  name="medida_alojamiento_cas"
                  value={item.medida_alojamiento_cas}
                  options={MEDIDA_ALOJAMIENTO_CAS_OPTIONS}
                  valueKey="value"
                  labelKey="label"
                  onChange={(_name, value) => onUpdate(index, "medida_alojamiento_cas", value)}
                />

                <MedidasSelectField
                  label="Tipo de centro"
                  name="tipo_centro"
                  value={item.tipo_centro}
                  options={TIPO_CENTRO_OPTIONS}
                  valueKey="value"
                  labelKey="label"
                  onChange={(_name, value) => onUpdate(index, "tipo_centro", value)}
                />

                <MedidasTextField
                  label="Nombre o razón social"
                  name="nombre_razon_social"
                  value={item.nombre_razon_social}
                  onChange={(_name, value) => onUpdate(index, "nombre_razon_social", value)}
                  inputProps={{ maxLength: 200 }}
                />

                <MedidasSelectField
                  label="Determinación familiar"
                  name="determinacion_familiar"
                  value={item.determinacion_familiar}
                  options={DETERMINACION_FAMILIAR_OPTIONS}
                  valueKey="value"
                  labelKey="label"
                  onChange={(_name, value) => onUpdate(index, "determinacion_familiar", value)}
                />

                <MedidasDateField
                  label="Fecha de determinación"
                  name="determinacion_fecha"
                  value={item.determinacion_fecha}
                  onChange={(_name, value) => onUpdate(index, "determinacion_fecha", value)}
                />

                <div className="mp-protection-grid-span">
                  <MedidasTextField
                    label="Descripción de determinación"
                    name="determinacion_descripcion"
                    value={item.determinacion_descripcion}
                    onChange={(_name, value) => onUpdate(index, "determinacion_descripcion", value)}
                    multiline
                    rows={3}
                  />
                </div>

                <MedidasSelectField
                  label="PRONFAC"
                  name="pronfac"
                  value={item.pronfac}
                  options={PRONFAC_OPTIONS}
                  valueKey="value"
                  labelKey="label"
                  onChange={(_name, value) => onUpdate(index, "pronfac", value)}
                />

                <MedidasDateField
                  label="Fecha PRONFAC"
                  name="pronfac_fecha"
                  value={item.pronfac_fecha}
                  onChange={(_name, value) => onUpdate(index, "pronfac_fecha", value)}
                />

                <div className="mp-protection-grid-span">
                  <MedidasTextField
                    label="Descripción PRONFAC"
                    name="pronfac_descripcion"
                    value={item.pronfac_descripcion}
                    onChange={(_name, value) => onUpdate(index, "pronfac_descripcion", value)}
                    multiline
                    rows={3}
                  />
                </div>
              </div>
            </Box>
          );
        })
      ) : (
        <Box className="mp-protection-empty">Aún no se han agregado medidas especiales.</Box>
      )}
    </Stack>
  );
}

const styles = `
  .mp-protection-form,
  .mp-protection-sections {
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

  .mp-protection-card,
  .mp-protection-item-card {
    box-sizing: border-box;
    border-radius: 24px;
    background: linear-gradient(180deg, #ffffff 0%, rgba(251,250,248,0.72) 100%);
    border: 1px solid rgba(152,152,154,0.16);
    box-shadow: 0 10px 26px rgba(19,50,46,0.04);
    padding: 24px;
    overflow: hidden;
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
    grid-template-columns: repeat(3, minmax(220px, 1fr));
    gap: 18px;
    align-items: start;
    width: 100%;
    min-width: 0;
  }

  .mp-protection-grid--small {
    grid-template-columns: minmax(260px, 360px);
  }

  .mp-protection-grid-span {
    grid-column: 1 / -1;
  }

  .mp-protection-add-button {
    align-self: flex-start;
    border-radius: 999px !important;
    padding: 8px 16px !important;
    text-transform: none !important;
    font-family: "Noto Sans", sans-serif !important;
    font-weight: 900 !important;
    color: #611232 !important;
    border: 1px solid rgba(188,149,92,0.28) !important;
    background: rgba(221,201,163,0.18) !important;
  }

  .mp-protection-remove-button {
    border-radius: 999px !important;
    text-transform: none !important;
    font-family: "Noto Sans", sans-serif !important;
    font-weight: 850 !important;
    color: #9d2449 !important;
  }

  .mp-protection-item-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 18px;
    color: #611232;
    font-family: "Noto Sans", sans-serif;
  }

  .mp-protection-empty {
    margin-top: 16px;
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

  .mp-protection-error {
    margin: 10px 0 0 !important;
    color: #b42318 !important;
    font-family: "Noto Sans", sans-serif !important;
    font-size: 0.78rem !important;
    font-weight: 800 !important;
  }

  @media (max-width: 980px) {
    .mp-protection-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 720px) {
    .mp-protection-card,
    .mp-protection-item-card {
      border-radius: 20px;
      padding: 18px;
    }

    .mp-protection-item-header {
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

MedidasUrgentesList.propTypes = {
  items: PropTypes.array.isRequired,
  errors: PropTypes.object,
  onAdd: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

MedidasEspecialesList.propTypes = MedidasUrgentesList.propTypes;

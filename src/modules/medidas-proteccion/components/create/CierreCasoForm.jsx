import PropTypes from "prop-types";

import {
  EGRESO_NO_PLANIFICADO_OPTIONS,
  EGRESO_PLANIFICADO_OPTIONS,
  RAZON_CIERRE_CASO_OPTIONS,
  TIPO_EGRESO_OPTIONS,
  YES_NO_OPTIONS,
} from "../../constants/medidasCreate.constants";

import {
  MedidasDateField,
  MedidasSelectField,
  MedidasTextField,
} from "./MedidasFormControls";

const EMPTY_FORM = {
  tipo_egreso: "",
  egreso_planificado: "",
  egreso_no_planificado: "",
  fecha_egreso: "",
  descripcion_egreso: "",
  determinacion_interes_superior: "",
  existe_cierre_caso: "",
  razon_cierre_caso: "",
  descripcion_cierre_imposibilidad: "",
};

export default function CierreCasoForm({ form = EMPTY_FORM, errors = {}, onFieldChange }) {
  const safeForm = {
    ...EMPTY_FORM,
    ...(form || {}),
  };

  const showEgreso = safeForm.tipo_egreso && safeForm.tipo_egreso !== "Ninguno";
  const showPlanificado = safeForm.tipo_egreso === "Planificado";
  const showNoPlanificado = safeForm.tipo_egreso === "No planificado";
  const showCierre = safeForm.existe_cierre_caso === "si";
  const showImposibilidad =
    safeForm.razon_cierre_caso === "Imposibilidad material de cumplir la medida";

  return (
    <section className="mp-cierre-form">
      <style>{styles}</style>

      <header className="mp-cierre-header">
        <div>
          <h2 className="mp-cierre-title">Cierre de caso</h2>

          <p className="mp-cierre-description">
            Captura la información de egreso y el motivo de cierre del caso,
            cuando corresponda.
          </p>
        </div>
      </header>

      <div className="mp-cierre-sections">
        <section className="mp-cierre-card">
          <div className="mp-cierre-card-header">
            <h3 className="mp-cierre-card-title">Información de egreso</h3>

            <p className="mp-cierre-card-description">
              Define si el egreso fue planificado, no planificado o si aún no
              aplica para el expediente.
            </p>
          </div>

          <div className="mp-cierre-grid">
            <MedidasSelectField
              label="Tipo de egreso"
              name="tipo_egreso"
              value={safeForm.tipo_egreso}
              options={TIPO_EGRESO_OPTIONS}
              valueKey="value"
              labelKey="label"
              onChange={onFieldChange}
              error={errors.tipo_egreso}
            />

            {showPlanificado ? (
              <MedidasSelectField
                label="Egreso planificado"
                name="egreso_planificado"
                value={safeForm.egreso_planificado}
                options={EGRESO_PLANIFICADO_OPTIONS}
                valueKey="value"
                labelKey="label"
                onChange={onFieldChange}
                error={errors.egreso_planificado}
              />
            ) : null}

            {showNoPlanificado ? (
              <MedidasSelectField
                label="Egreso no planificado"
                name="egreso_no_planificado"
                value={safeForm.egreso_no_planificado}
                options={EGRESO_NO_PLANIFICADO_OPTIONS}
                valueKey="value"
                labelKey="label"
                onChange={onFieldChange}
                error={errors.egreso_no_planificado}
              />
            ) : null}

            {showEgreso ? (
              <>
                <MedidasDateField
                  label="Fecha de egreso"
                  name="fecha_egreso"
                  value={safeForm.fecha_egreso}
                  onChange={onFieldChange}
                  error={errors.fecha_egreso}
                />

                <div className="mp-cierre-grid-span">
                  <MedidasTextField
                    label="Descripción del egreso"
                    name="descripcion_egreso"
                    value={safeForm.descripcion_egreso}
                    onChange={onFieldChange}
                    error={errors.descripcion_egreso}
                    multiline
                    rows={3}
                  />
                </div>

                <div className="mp-cierre-grid-span">
                  <MedidasTextField
                    label="Determinación del interés superior"
                    name="determinacion_interes_superior"
                    value={safeForm.determinacion_interes_superior}
                    onChange={onFieldChange}
                    error={errors.determinacion_interes_superior}
                    multiline
                    rows={3}
                    inputProps={{ maxLength: 200 }}
                  />
                </div>
              </>
            ) : null}
          </div>
        </section>

        <section className="mp-cierre-card">
          <div className="mp-cierre-card-header">
            <h3 className="mp-cierre-card-title">Cierre del caso</h3>

            <p className="mp-cierre-card-description">
              Indica si existe cierre formal del caso y registra la razón
              correspondiente.
            </p>
          </div>

          <div className="mp-cierre-grid">
            <MedidasSelectField
              label="¿Existe cierre de caso?"
              name="existe_cierre_caso"
              value={safeForm.existe_cierre_caso}
              options={YES_NO_OPTIONS}
              valueKey="value"
              labelKey="label"
              onChange={onFieldChange}
              error={errors.existe_cierre_caso}
            />

            {showCierre ? (
              <>
                <MedidasSelectField
                  label="Razón de cierre"
                  name="razon_cierre_caso"
                  value={safeForm.razon_cierre_caso}
                  options={RAZON_CIERRE_CASO_OPTIONS}
                  valueKey="value"
                  labelKey="label"
                  onChange={onFieldChange}
                  error={errors.razon_cierre_caso}
                />

                {showImposibilidad ? (
                  <div className="mp-cierre-grid-span">
                    <MedidasTextField
                      label="Descripción de imposibilidad material"
                      name="descripcion_cierre_imposibilidad"
                      value={safeForm.descripcion_cierre_imposibilidad}
                      onChange={onFieldChange}
                      error={errors.descripcion_cierre_imposibilidad}
                      multiline
                      rows={4}
                    />
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        </section>
      </div>
    </section>
  );
}

const styles = `
  .mp-cierre-form,
  .mp-cierre-sections {
    display: grid;
    gap: 22px;
    width: 100%;
    min-width: 0;
  }

  .mp-cierre-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;
  }

  .mp-cierre-title {
    margin: 0;
    color: #611232;
    font-family: "Noto Sans", sans-serif;
    font-size: clamp(1.35rem, 2vw, 1.85rem);
    font-weight: 950;
    line-height: 1.12;
    letter-spacing: -0.035em;
  }

  .mp-cierre-description {
    max-width: 860px;
    margin: 8px 0 0;
    color: #64748b;
    font-family: "Noto Sans", sans-serif;
    font-size: 0.93rem;
    font-weight: 600;
    line-height: 1.6;
  }

  .mp-cierre-card {
    box-sizing: border-box;
    border-radius: 24px;
    background: linear-gradient(180deg, #ffffff 0%, rgba(251,250,248,0.72) 100%);
    border: 1px solid rgba(152,152,154,0.16);
    box-shadow: 0 10px 26px rgba(19,50,46,0.04);
    padding: 24px;
    overflow: hidden;
  }

  .mp-cierre-card-header {
    margin-bottom: 20px;
    max-width: 980px;
  }

  .mp-cierre-card-title {
    margin: 0;
    color: #13322e;
    font-family: "Noto Sans", sans-serif;
    font-size: clamp(1.02rem, 1.3vw, 1.16rem);
    font-weight: 950;
    line-height: 1.18;
    letter-spacing: -0.025em;
  }

  .mp-cierre-card-description {
    max-width: 900px;
    margin: 6px 0 0;
    color: #64748b;
    font-family: "Noto Sans", sans-serif;
    font-size: 0.84rem;
    font-weight: 600;
    line-height: 1.55;
  }

  .mp-cierre-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(220px, 1fr));
    gap: 18px;
    align-items: start;
    width: 100%;
    min-width: 0;
  }

  .mp-cierre-grid-span {
    grid-column: 1 / -1;
  }

  @media (max-width: 980px) {
    .mp-cierre-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 720px) {
    .mp-cierre-card {
      border-radius: 20px;
      padding: 18px;
    }
  }
`;

CierreCasoForm.propTypes = {
  form: PropTypes.object,
  errors: PropTypes.object,
  onFieldChange: PropTypes.func.isRequired,
};

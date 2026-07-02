import PropTypes from "prop-types";

import DerechosVulneradosField from "./DerechosVulneradosField";
import { MedidasDateField } from "./MedidasFormControls";

export default function PlanRestitucionForm({ form, errors, onFieldChange }) {
  return (
    <section className="mp-plan-form">
      <style>{styles}</style>

      <header className="mp-plan-header">
        <div>
          <h2 className="mp-plan-title">Plan de restitución de derechos</h2>

          <p className="mp-plan-description">
            Registra la fecha de elaboración del plan y los derechos vulnerados
            identificados para el NNA.
          </p>
        </div>
      </header>

      <div className="mp-plan-sections">
        <section className="mp-plan-card">
          <div className="mp-plan-card-header">
            <h3 className="mp-plan-card-title">Datos del plan</h3>

            <p className="mp-plan-card-description">
              Información general del plan de restitución asociado al
              expediente.
            </p>
          </div>

          <div className="mp-plan-grid">
            <MedidasDateField
              label="Fecha de elaboración"
              name="fecha_elaboracion"
              value={form.fecha_elaboracion}
              onChange={onFieldChange}
              error={errors.fecha_elaboracion}
            />
          </div>
        </section>

        <section className="mp-plan-card">
          <div className="mp-plan-card-header">
            <h3 className="mp-plan-card-title">Derechos vulnerados</h3>

            <p className="mp-plan-card-description">
              Selecciona uno o más derechos vulnerados. También puedes capturar
              un derecho adicional si no aparece en la lista.
            </p>
          </div>

          <DerechosVulneradosField
            value={form.derechos_vulnerados}
            error={errors.derechos_vulnerados}
            onFieldChange={onFieldChange}
          />
        </section>
      </div>
    </section>
  );
}

const styles = `
  .mp-plan-form {
    display: grid;
    gap: 22px;
    width: 100%;
    min-width: 0;
  }

  .mp-plan-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;
    width: 100%;
    min-width: 0;
  }

  .mp-plan-title {
    margin: 0;
    color: #611232;
    font-family: "Noto Sans", sans-serif;
    font-size: clamp(1.35rem, 2vw, 1.85rem);
    font-weight: 950;
    line-height: 1.12;
    letter-spacing: -0.035em;
  }

  .mp-plan-description {
    max-width: 840px;
    margin: 8px 0 0;
    color: #64748b;
    font-family: "Noto Sans", sans-serif;
    font-size: 0.93rem;
    font-weight: 600;
    line-height: 1.6;
  }

  .mp-plan-sections {
    display: grid;
    gap: 18px;
    width: 100%;
    min-width: 0;
  }

  .mp-plan-card {
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

  .mp-plan-card:hover {
    transform: translateY(-1px);
    border-color: rgba(188,149,92,0.24);
    box-shadow: 0 14px 32px rgba(19,50,46,0.055);
  }

  .mp-plan-card-header {
    margin-bottom: 20px;
    max-width: 980px;
  }

  .mp-plan-card-title {
    margin: 0;
    color: #13322e;
    font-family: "Noto Sans", sans-serif;
    font-size: clamp(1.02rem, 1.3vw, 1.16rem);
    font-weight: 950;
    line-height: 1.18;
    letter-spacing: -0.025em;
  }

  .mp-plan-card-description {
    max-width: 900px;
    margin: 6px 0 0;
    color: #64748b;
    font-family: "Noto Sans", sans-serif;
    font-size: 0.84rem;
    font-weight: 600;
    line-height: 1.55;
  }

  .mp-plan-grid {
    display: grid;
    grid-template-columns: minmax(260px, 360px);
    gap: 18px;
    align-items: start;
    width: 100%;
    min-width: 0;
  }

  .mp-plan-add-grid {
    display: grid;
    grid-template-columns: minmax(280px, 1fr) minmax(280px, 1fr) auto;
    gap: 18px;
    align-items: start;
    width: 100%;
    min-width: 0;
  }

  .mp-plan-right-item {
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

  .mp-plan-right-index {
    display: block;
    margin-bottom: 4px;
    color: #611232;
    font-family: "Noto Sans", sans-serif;
    font-size: 0.76rem;
    font-weight: 950;
  }

  .mp-plan-right-text {
    margin: 0;
    color: #13322e;
    font-family: "Noto Sans", sans-serif;
    font-size: 0.88rem;
    font-weight: 750;
    line-height: 1.45;
  }

  .mp-plan-empty {
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
    .mp-plan-add-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 720px) {
    .mp-plan-form {
      gap: 18px;
    }

    .mp-plan-sections {
      gap: 16px;
    }

    .mp-plan-card {
      border-radius: 20px;
      padding: 18px;
    }

    .mp-plan-grid {
      grid-template-columns: 1fr;
    }

    .mp-plan-right-item {
      align-items: flex-start;
      flex-direction: column;
    }
  }
`;

PlanRestitucionForm.propTypes = {
  form: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  onFieldChange: PropTypes.func.isRequired,
};
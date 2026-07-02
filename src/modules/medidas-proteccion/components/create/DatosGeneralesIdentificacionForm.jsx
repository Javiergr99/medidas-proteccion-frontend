import PropTypes from "prop-types";

import DatosGeneralesCatalogFields from "./DatosGeneralesCatalogFields";
import DatosGeneralesContextFields from "./DatosGeneralesContextFields";
import DatosGeneralesDiscapacidadFields from "./DatosGeneralesDiscapacidadFields";
import DatosGeneralesIdentityFields from "./DatosGeneralesIdentityFields";
import DatosGeneralesSectionCard from "./DatosGeneralesSectionCard";
import MediaFiliacionFields from "./MediaFiliacionFields";

export default function DatosGeneralesIdentificacionForm({
  form,
  errors,
  catalogos,
  onFieldChange,
}) {
  return (
    <section className="mp-datos-form">
      <style>{styles}</style>

      <header className="mp-datos-header">
        <div>
          <h2 className="mp-datos-title">Datos generales</h2>

          <p className="mp-datos-description">
            Captura la información inicial del expediente, los datos de
            identificación del NNA y los elementos generales para continuar con
            el registro.
          </p>
        </div>
      </header>

      <div className="mp-datos-sections">
        <DatosGeneralesSectionCard
          title="Identificación del NNA"
          description="Información base para identificar a la niña, niño o adolescente."
        >
          <DatosGeneralesIdentityFields
            form={form}
            errors={errors}
            catalogos={catalogos}
            onFieldChange={onFieldChange}
          />
        </DatosGeneralesSectionCard>

        <DatosGeneralesSectionCard
          title="Información general"
          description="Catálogos principales y condiciones generales asociadas al registro."
        >
          <DatosGeneralesCatalogFields
            form={form}
            errors={errors}
            catalogos={catalogos}
            onFieldChange={onFieldChange}
          />
        </DatosGeneralesSectionCard>

        <section className="mp-discapacidad-card">
          <div className="mp-discapacidad-card-header">
            <h3 className="mp-discapacidad-card-title">
              Discapacidad del NNA
            </h3>

            <p className="mp-discapacidad-card-description">
              Registra si el NNA presenta discapacidad. Si aplica, podrás
              capturar una o más discapacidades con subtipo, severidad y
              especificación cuando sea requerida.
            </p>
          </div>

          <DatosGeneralesDiscapacidadFields
            form={form}
            errors={errors}
            catalogos={catalogos}
            onFieldChange={onFieldChange}
          />
        </section>

        <DatosGeneralesSectionCard
          title="Media filiación"
          description="Rasgos físicos del NNA. Esta información puede completarse si está disponible."
        >
          <MediaFiliacionFields
            form={form}
            errors={errors}
            catalogos={catalogos}
            onFieldChange={onFieldChange}
          />
        </DatosGeneralesSectionCard>

        <DatosGeneralesSectionCard
          title="Contexto del expediente"
          description="Información operativa, documental y migratoria relacionada con la apertura del expediente."
        >
          <DatosGeneralesContextFields
            form={form}
            errors={errors}
            catalogos={catalogos}
            onFieldChange={onFieldChange}
          />
        </DatosGeneralesSectionCard>
      </div>
    </section>
  );
}

const styles = `
  .mp-datos-form {
    display: grid;
    gap: 22px;
    width: 100%;
    min-width: 0;
  }

  .mp-datos-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;
    width: 100%;
    min-width: 0;
  }

  .mp-datos-title {
    margin: 0;
    color: #611232;
    font-family: "Noto Sans", sans-serif;
    font-size: clamp(1.35rem, 2vw, 1.85rem);
    font-weight: 950;
    line-height: 1.12;
    letter-spacing: -0.035em;
  }

  .mp-datos-description {
    max-width: 820px;
    margin: 8px 0 0;
    color: #64748b;
    font-family: "Noto Sans", sans-serif;
    font-size: 0.93rem;
    font-weight: 600;
    line-height: 1.6;
  }

  .mp-datos-sections {
    display: grid;
    gap: 18px;
    width: 100%;
    min-width: 0;
  }

  .mp-discapacidad-card {
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

  .mp-discapacidad-card:hover {
    transform: translateY(-1px);
    border-color: rgba(188,149,92,0.24);
    box-shadow: 0 14px 32px rgba(19,50,46,0.055);
  }

  .mp-discapacidad-card-header {
    margin-bottom: 20px;
    max-width: 980px;
  }

  .mp-discapacidad-card-title {
    margin: 0;
    color: #13322e;
    font-family: "Noto Sans", sans-serif;
    font-size: clamp(1.02rem, 1.3vw, 1.16rem);
    font-weight: 950;
    line-height: 1.18;
    letter-spacing: -0.025em;
  }

  .mp-discapacidad-card-description {
    max-width: 900px;
    margin: 6px 0 0;
    color: #64748b;
    font-family: "Noto Sans", sans-serif;
    font-size: 0.84rem;
    font-weight: 600;
    line-height: 1.55;
  }

  @media (max-width: 720px) {
    .mp-datos-form {
      gap: 18px;
    }

    .mp-datos-sections {
      gap: 16px;
    }

    .mp-discapacidad-card {
      border-radius: 20px;
      padding: 18px;
    }
  }
`;

DatosGeneralesIdentificacionForm.propTypes = {
  form: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  catalogos: PropTypes.object.isRequired,
  onFieldChange: PropTypes.func.isRequired,
};
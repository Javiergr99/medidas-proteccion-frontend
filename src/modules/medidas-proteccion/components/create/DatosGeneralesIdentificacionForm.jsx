import PropTypes from "prop-types";

import DatosGeneralesCatalogFields from "./DatosGeneralesCatalogFields";
import DatosGeneralesContextFields from "./DatosGeneralesContextFields";
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
  }

  .mp-datos-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;
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
  }

  @media (max-width: 720px) {
    .mp-datos-form {
      gap: 18px;
    }

    .mp-datos-sections {
      gap: 16px;
    }
  }
`;

DatosGeneralesIdentificacionForm.propTypes = {
  form: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  catalogos: PropTypes.object.isRequired,
  onFieldChange: PropTypes.func.isRequired,
};
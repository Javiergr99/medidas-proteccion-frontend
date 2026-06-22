import PropTypes from "prop-types";

export default function DatosGeneralesSectionCard({
  title,
  description,
  children,
}) {
  return (
    <section className="mp-datos-card">
      <style>{styles}</style>

      <header className="mp-datos-card-header">
        <div>
          <h3 className="mp-datos-card-title">{title}</h3>

          {description ? (
            <p className="mp-datos-card-description">{description}</p>
          ) : null}
        </div>
      </header>

      <div className="mp-datos-card-grid">{children}</div>
    </section>
  );
}

const styles = `
  .mp-datos-card {
    border: 1px solid rgba(152, 152, 154, 0.16);
    border-radius: 20px;
    background: #ffffff;
    padding: clamp(16px, 2vw, 22px);
    box-shadow: 0 8px 22px rgba(19, 50, 46, 0.035);
  }

  .mp-datos-card-header {
    margin-bottom: 18px;
  }

  .mp-datos-card-title {
    margin: 0;
    color: #13322e;
    font-family: "Noto Sans", sans-serif;
    font-size: clamp(1rem, 1.4vw, 1.16rem);
    font-weight: 900;
    line-height: 1.25;
    letter-spacing: -0.02em;
  }

  .mp-datos-card-description {
    max-width: 780px;
    margin: 5px 0 0;
    color: #64748b;
    font-family: "Noto Sans", sans-serif;
    font-size: 0.84rem;
    font-weight: 600;
    line-height: 1.55;
  }

  .mp-datos-card-grid {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 14px;
  }

  .mp-datos-card-grid > * {
    grid-column: span 4;
  }

  @media (max-width: 1180px) {
    .mp-datos-card-grid > * {
      grid-column: span 6;
    }
  }

  @media (max-width: 720px) {
    .mp-datos-card {
      border-radius: 18px;
      padding: 16px;
    }

    .mp-datos-card-header {
      margin-bottom: 15px;
    }

    .mp-datos-card-grid {
      grid-template-columns: 1fr;
      gap: 13px;
    }

    .mp-datos-card-grid > * {
      grid-column: auto;
    }
  }
`;

DatosGeneralesSectionCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
};
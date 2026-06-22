import PropTypes from "prop-types";
import { CircularProgress } from "@mui/material";

export default function MedidasCreateActionBar({
  canGoBack,
  canSendReview,
  isEditable,
  reviewing,
  saving,
  onBack,
  onExit,
  onSave,
  onNext,
  onSendReview,
}) {
  const busy = saving || reviewing;

  return (
    <footer className="mp-actionbar">
      <style>{styles}</style>

      <div className="mp-actionbar-review">
        <button
          type="button"
          className="mp-actionbar-button mp-actionbar-button--review"
          onClick={onSendReview}
          disabled={busy || !canSendReview || !isEditable}
        >
          {reviewing ? (
            <CircularProgress size={16} color="inherit" />
          ) : null}
          {reviewing ? "Enviando..." : "Enviar a revisión"}
        </button>
      </div>

      <div className="mp-actionbar-actions">
        <button
          type="button"
          className="mp-actionbar-button mp-actionbar-button--secondary"
          onClick={onExit}
          disabled={busy}
        >
          Salir
        </button>

        {canGoBack ? (
          <button
            type="button"
            className="mp-actionbar-button mp-actionbar-button--secondary"
            onClick={onBack}
            disabled={busy}
          >
            Regresar
          </button>
        ) : null}

        <button
          type="button"
          className="mp-actionbar-button mp-actionbar-button--save"
          onClick={onSave}
          disabled={busy || !isEditable}
        >
          {saving ? "Guardando..." : "Guardar"}
        </button>

        <button
          type="button"
          className="mp-actionbar-button mp-actionbar-button--primary"
          onClick={onNext}
          disabled={busy || !isEditable}
        >
          {saving ? (
            <CircularProgress size={16} color="inherit" />
          ) : null}
          Siguiente
        </button>
      </div>
    </footer>
  );
}

const styles = `
  .mp-actionbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-top: 26px;
    padding-top: 20px;
    border-top: 1px solid rgba(152, 152, 154, 0.16);
  }

  .mp-actionbar-review,
  .mp-actionbar-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .mp-actionbar-actions {
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .mp-actionbar-button {
    min-height: 40px;
    border-radius: 12px;
    border: 1px solid transparent;
    padding: 0 15px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: "Noto Sans", sans-serif;
    font-size: 0.82rem;
    font-weight: 900;
    line-height: 1;
    cursor: pointer;
    white-space: nowrap;
    transition:
      transform 160ms ease,
      box-shadow 160ms ease,
      background 160ms ease,
      border-color 160ms ease,
      color 160ms ease,
      opacity 160ms ease;
  }

  .mp-actionbar-button:hover {
    transform: translateY(-1px);
  }

  .mp-actionbar-button:disabled {
    cursor: not-allowed;
    transform: none;
    opacity: 0.58;
    box-shadow: none;
  }

  .mp-actionbar-button--primary {
    background: #611232;
    color: #ffffff;
    box-shadow: 0 10px 22px rgba(97, 18, 50, 0.15);
  }

  .mp-actionbar-button--primary:hover {
    background: #9d2449;
  }

  .mp-actionbar-button--secondary {
    border-color: rgba(152, 152, 154, 0.22);
    background: #ffffff;
    color: #475569;
  }

  .mp-actionbar-button--secondary:hover {
    border-color: rgba(157, 36, 73, 0.28);
    color: #611232;
    background: rgba(97, 18, 50, 0.03);
  }

  .mp-actionbar-button--save {
    border-color: rgba(188, 149, 92, 0.30);
    background: rgba(221, 201, 163, 0.16);
    color: #611232;
  }

  .mp-actionbar-button--save:hover {
    border-color: rgba(188, 149, 92, 0.54);
    background: rgba(221, 201, 163, 0.26);
  }

  .mp-actionbar-button--review {
    border-color: rgba(157, 36, 73, 0.24);
    background: rgba(157, 36, 73, 0.07);
    color: #611232;
  }

  .mp-actionbar-button--review:hover {
    border-color: rgba(157, 36, 73, 0.38);
    background: rgba(157, 36, 73, 0.11);
  }

  .mp-actionbar-button--review:disabled {
    background: rgba(152, 152, 154, 0.10);
    border-color: rgba(152, 152, 154, 0.18);
    color: #64748b;
  }

  @media (max-width: 860px) {
    .mp-actionbar {
      align-items: stretch;
      flex-direction: column;
    }

    .mp-actionbar-review,
    .mp-actionbar-actions {
      width: 100%;
    }

    .mp-actionbar-review .mp-actionbar-button {
      width: 100%;
    }

    .mp-actionbar-actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .mp-actionbar-button {
      width: 100%;
    }
  }

  @media (max-width: 520px) {
    .mp-actionbar-actions {
      grid-template-columns: 1fr;
    }
  }
`;

MedidasCreateActionBar.propTypes = {
  canGoBack: PropTypes.bool.isRequired,
  canSendReview: PropTypes.bool.isRequired,
  isEditable: PropTypes.bool.isRequired,
  reviewing: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
  onExit: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onSendReview: PropTypes.func.isRequired,
};
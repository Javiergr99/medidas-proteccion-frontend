import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { Alert, CircularProgress } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import ManageSearchRoundedIcon from "@mui/icons-material/ManageSearchRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";

import {
  NNA_VERIFICATION_STATUS,
  normalizeCurp,
} from "../../utils/nnaVerification.utils";

const VERIFICATION_MODES = {
  CURP: "curp",
  DEMOGRAPHIC: "demographic",
};

const INITIAL_FORM = {
  curp: "",
  nombre: "",
  primerApellido: "",
  fechaNacimiento: "",
  sexoId: "",
};

export default function NnaVerificationPanel({
  catalogos,
  catalogosLoading,
  catalogosError,
  verification,
  onVerify,
  onReset,
}) {
  const [mode, setMode] = useState(VERIFICATION_MODES.CURP);
  const [form, setForm] = useState(INITIAL_FORM);

  const canVerify = useMemo(() => {
    if (verification.isVerifying) return false;

    if (mode === VERIFICATION_MODES.CURP) {
      return form.curp.trim().length === 18;
    }

    return Boolean(
      form.nombre.trim() &&
        form.primerApellido.trim() &&
        form.fechaNacimiento &&
        form.sexoId
    );
  }, [form, mode, verification.isVerifying]);

  function updateField(name, value) {
    setForm((prevForm) => ({
      ...prevForm,
      [name]: name === "curp" ? normalizeCurp(value) : value,
    }));
  }

  function handleModeChange(nextMode) {
    if (!nextMode || nextMode === mode) return;
    setMode(nextMode);
  }

  function handleVerify() {
    if (!canVerify) return;

    if (mode === VERIFICATION_MODES.CURP) {
      onVerify({
        curp: form.curp,
      });
      return;
    }

    onVerify({
      nombre: form.nombre,
      primerApellido: form.primerApellido,
      fechaNacimiento: form.fechaNacimiento,
      sexoId: form.sexoId,
    });
  }

  function handleReset() {
    setForm(INITIAL_FORM);
    onReset();
  }

  return (
    <section className="mp-nna-card">
      <style>{panelStyles}</style>

      <header className="mp-nna-header">
        <div className="mp-nna-heading">
          <h2 className="mp-nna-title">Validación previa del NNA</h2>

          <p className="mp-nna-description">
            Antes de crear el expediente, verifica si la niña, niño o adolescente
            ya existe en el sistema.
          </p>
        </div>

        {verification.isVerified ? (
          <button
            type="button"
            className="mp-nna-button mp-nna-button--secondary"
            onClick={handleReset}
          >
            <RestartAltRoundedIcon fontSize="small" />
            Nueva validación
          </button>
        ) : null}
      </header>

      {verification.message ? (
        <VerificationAlert verification={verification} />
      ) : null}

      {!verification.isVerified && !verification.isBlocked ? (
        <>
          <ModeSelector mode={mode} onChange={handleModeChange} />

          {catalogosError && mode === VERIFICATION_MODES.DEMOGRAPHIC ? (
            <Alert severity="warning" sx={alertStyles}>
              {catalogosError}
            </Alert>
          ) : null}

          <div className="mp-nna-form-area">
            {mode === VERIFICATION_MODES.CURP ? (
              <CurpVerificationForm form={form} onChange={updateField} />
            ) : (
              <DemographicVerificationForm
                form={form}
                catalogos={catalogos}
                catalogosLoading={catalogosLoading}
                onChange={updateField}
              />
            )}
          </div>

          <footer className="mp-nna-actions">
            <button
              type="button"
              className="mp-nna-button mp-nna-button--secondary"
              onClick={handleReset}
              disabled={verification.isVerifying}
            >
              Limpiar
            </button>

            <button
              type="button"
              className="mp-nna-button mp-nna-button--primary"
              disabled={!canVerify}
              onClick={handleVerify}
            >
              {verification.isVerifying ? (
                <CircularProgress size={17} color="inherit" />
              ) : (
                <ManageSearchRoundedIcon fontSize="small" />
              )}

              {verification.isVerifying ? "Verificando..." : "Verificar NNA"}
            </button>
          </footer>
        </>
      ) : null}
    </section>
  );
}

function ModeSelector({ mode, onChange }) {
  return (
    <div className="mp-nna-mode-selector" role="tablist">
      <button
        type="button"
        className={[
          "mp-nna-mode-button",
          mode === VERIFICATION_MODES.CURP ? "is-active" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={() => onChange(VERIFICATION_MODES.CURP)}
      >
        CURP
      </button>

      <button
        type="button"
        className={[
          "mp-nna-mode-button",
          mode === VERIFICATION_MODES.DEMOGRAPHIC ? "is-active" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={() => onChange(VERIFICATION_MODES.DEMOGRAPHIC)}
      >
        Datos demográficos
      </button>
    </div>
  );
}

function CurpVerificationForm({ form, onChange }) {
  return (
    <div className="mp-nna-grid mp-nna-grid--curp">
      <label className="mp-nna-field" htmlFor="nna-curp">
        <span className="mp-nna-label">CURP</span>

        <input
          id="nna-curp"
          className="mp-nna-input mp-nna-input--curp"
          type="text"
          value={form.curp}
          onChange={(event) => onChange("curp", event.target.value)}
          maxLength={18}
          placeholder="Ingresa la CURP"
          autoComplete="off"
        />

        <span className="mp-nna-help">Debe contener 18 caracteres.</span>
      </label>
    </div>
  );
}

function DemographicVerificationForm({
  form,
  catalogos,
  catalogosLoading,
  onChange,
}) {
  const sexOptions = catalogos?.sexo ?? [];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <div className="mp-nna-grid">
        <label className="mp-nna-field" htmlFor="nna-nombre">
          <span className="mp-nna-label">Nombre</span>

          <input
            id="nna-nombre"
            className="mp-nna-input"
            type="text"
            value={form.nombre}
            onChange={(event) => onChange("nombre", event.target.value)}
            placeholder="Nombre"
            autoComplete="off"
          />
        </label>

        <label className="mp-nna-field" htmlFor="nna-primer-apellido">
          <span className="mp-nna-label">Primer apellido</span>

          <input
            id="nna-primer-apellido"
            className="mp-nna-input"
            type="text"
            value={form.primerApellido}
            onChange={(event) => onChange("primerApellido", event.target.value)}
            placeholder="Primer apellido"
            autoComplete="off"
          />
        </label>

        <div className="mp-nna-field">
          <span className="mp-nna-label">Fecha de nacimiento</span>

          <DatePicker
            value={form.fechaNacimiento ? dayjs(form.fechaNacimiento) : null}
            onChange={(nextDate) => {
              onChange(
                "fechaNacimiento",
                nextDate?.isValid() ? nextDate.format("YYYY-MM-DD") : ""
              );
            }}
            format="DD/MM/YYYY"
            disableFuture
            maxDate={dayjs().endOf("day")}
            slotProps={{
              textField: {
                fullWidth: true,
                placeholder: "DD/MM/AAAA",
                sx: dateFieldStyles,
              },
            }}
          />
        </div>

        <label className="mp-nna-field" htmlFor="nna-sexo">
          <span className="mp-nna-label">Sexo</span>

          <select
            id="nna-sexo"
            className="mp-nna-input mp-nna-select"
            value={form.sexoId}
            onChange={(event) => onChange("sexoId", event.target.value)}
            disabled={catalogosLoading}
          >
            <option value="">
              {catalogosLoading ? "Cargando catálogo..." : "Selecciona sexo"}
            </option>

            {sexOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.descripcion}
              </option>
            ))}
          </select>
        </label>
      </div>
    </LocalizationProvider>
  );
}

function VerificationAlert({ verification }) {
  const severity =
    verification.status === NNA_VERIFICATION_STATUS.BLOCKED
      ? "error"
      : verification.status === NNA_VERIFICATION_STATUS.ERROR
        ? "warning"
        : "success";

  const icon =
    verification.status === NNA_VERIFICATION_STATUS.AVAILABLE ||
    verification.status === NNA_VERIFICATION_STATUS.EXISTING ? (
      <VerifiedRoundedIcon />
    ) : undefined;

  return (
    <Alert severity={severity} icon={icon} sx={alertStyles}>
      {verification.message}

      {verification.registrosPrevios.length > 0 ? (
        <span className="mp-nna-alert-extra">
          Registros previos: {verification.registrosPrevios.join(", ")}
        </span>
      ) : null}
    </Alert>
  );
}

const dateFieldStyles = {
  "& .MuiOutlinedInput-root": {
    minHeight: 44,
    borderRadius: "12px",
    backgroundColor: "#ffffff",
    fontFamily: "Noto Sans, sans-serif",
    fontWeight: 650,
    color: "#13322e",
    "& fieldset": {
      borderColor: "rgba(152,152,154,0.25)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(157,36,73,0.34)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#9d2449",
      boxShadow: "0 0 0 3px rgba(157,36,73,0.08)",
    },
  },
  "& .MuiInputBase-input": {
    padding: "10px 12px",
    fontFamily: "Noto Sans, sans-serif",
    fontWeight: 650,
    fontSize: "0.9rem",
  },
};

const alertStyles = {
  mt: 2,
  mb: 2,
  borderRadius: "14px",
  border: "1px solid rgba(152,152,154,0.16)",
  fontFamily: "Noto Sans, sans-serif",
  fontWeight: 700,
  "& .MuiAlert-message": {
    width: "100%",
  },
};

const panelStyles = `
  .mp-nna-card {
    border: 1px solid rgba(152, 152, 154, 0.16);
    border-radius: 22px;
    background: #ffffff;
    box-shadow: 0 10px 28px rgba(19, 50, 46, 0.05);
    padding: clamp(20px, 2.2vw, 28px);
    color: #13322e;
  }

  .mp-nna-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;
    margin-bottom: 20px;
  }

  .mp-nna-heading {
    min-width: 0;
  }

  .mp-nna-title {
    margin: 0;
    color: #611232;
    font-family: "Noto Sans", sans-serif;
    font-size: clamp(1.35rem, 2vw, 1.8rem);
    font-weight: 950;
    line-height: 1.12;
    letter-spacing: -0.035em;
  }

  .mp-nna-description {
    max-width: 720px;
    margin: 8px 0 0;
    color: #64748b;
    font-family: "Noto Sans", sans-serif;
    font-size: 0.92rem;
    font-weight: 600;
    line-height: 1.55;
  }

  .mp-nna-mode-selector {
    display: inline-grid;
    grid-template-columns: repeat(2, minmax(0, auto));
    gap: 4px;
    border: 1px solid rgba(152, 152, 154, 0.16);
    border-radius: 14px;
    background: #f8f6f2;
    padding: 4px;
    margin-bottom: 16px;
  }

  .mp-nna-mode-button {
    min-height: 36px;
    border: 0;
    border-radius: 10px;
    background: transparent;
    color: #64748b;
    padding: 0 15px;
    font-family: "Noto Sans", sans-serif;
    font-size: 0.82rem;
    font-weight: 850;
    cursor: pointer;
    transition:
      background 160ms ease,
      color 160ms ease,
      box-shadow 160ms ease;
  }

  .mp-nna-mode-button:hover {
    color: #611232;
    background: rgba(97, 18, 50, 0.04);
  }

  .mp-nna-mode-button.is-active {
    background: #ffffff;
    color: #611232;
    box-shadow: 0 6px 14px rgba(97, 18, 50, 0.07);
  }

  .mp-nna-form-area {
    border-radius: 18px;
    border: 1px solid rgba(152, 152, 154, 0.13);
    background: #fbfaf8;
    padding: clamp(16px, 1.8vw, 20px);
  }

  .mp-nna-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
  }

  .mp-nna-grid--curp {
    grid-template-columns: minmax(0, 460px);
  }

  .mp-nna-field {
    display: grid;
    gap: 7px;
    min-width: 0;
  }

  .mp-nna-label {
    color: #13322e;
    font-family: "Noto Sans", sans-serif;
    font-size: 0.8rem;
    font-weight: 850;
    line-height: 1.3;
  }

  .mp-nna-input {
    width: 100%;
    min-height: 44px;
    box-sizing: border-box;
    border: 1px solid rgba(152, 152, 154, 0.25);
    border-radius: 12px;
    background: #ffffff;
    color: #13322e;
    padding: 0 12px;
    outline: none;
    font-family: "Noto Sans", sans-serif;
    font-size: 0.9rem;
    font-weight: 650;
    transition:
      border-color 160ms ease,
      box-shadow 160ms ease,
      background 160ms ease;
  }

  .mp-nna-input--curp {
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .mp-nna-input::placeholder {
    color: rgba(100, 116, 139, 0.66);
    font-weight: 500;
  }

  .mp-nna-input:focus {
    border-color: rgba(157, 36, 73, 0.58);
    box-shadow: 0 0 0 3px rgba(157, 36, 73, 0.08);
  }

  .mp-nna-input:disabled {
    cursor: not-allowed;
    background: #f1f5f9;
    color: #98989a;
  }

  .mp-nna-select {
    appearance: auto;
  }

  .mp-nna-help {
    color: #64748b;
    font-family: "Noto Sans", sans-serif;
    font-size: 0.76rem;
    font-weight: 600;
    line-height: 1.4;
  }

  .mp-nna-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 18px;
  }

  .mp-nna-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 40px;
    border-radius: 12px;
    padding: 0 15px;
    border: 1px solid transparent;
    font-family: "Noto Sans", sans-serif;
    font-size: 0.82rem;
    font-weight: 900;
    cursor: pointer;
    transition:
      transform 160ms ease,
      box-shadow 160ms ease,
      background 160ms ease,
      border-color 160ms ease,
      color 160ms ease;
  }

  .mp-nna-button:hover {
    transform: translateY(-1px);
  }

  .mp-nna-button:disabled {
    cursor: not-allowed;
    transform: none;
    opacity: 0.62;
    box-shadow: none;
  }

  .mp-nna-button--primary {
    background: #611232;
    color: #ffffff;
    box-shadow: 0 10px 22px rgba(97, 18, 50, 0.15);
  }

  .mp-nna-button--primary:hover {
    background: #9d2449;
  }

  .mp-nna-button--secondary {
    border-color: rgba(152, 152, 154, 0.22);
    background: #ffffff;
    color: #475569;
  }

  .mp-nna-button--secondary:hover {
    border-color: rgba(157, 36, 73, 0.28);
    color: #611232;
    background: rgba(97, 18, 50, 0.03);
  }

  .mp-nna-alert-extra {
    display: block;
    margin-top: 4px;
    font-weight: 800;
  }

  @media (max-width: 1100px) {
    .mp-nna-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .mp-nna-grid--curp {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 720px) {
    .mp-nna-header {
      flex-direction: column;
      margin-bottom: 18px;
    }

    .mp-nna-mode-selector {
      width: 100%;
      grid-template-columns: 1fr;
    }

    .mp-nna-mode-button {
      width: 100%;
    }

    .mp-nna-grid {
      grid-template-columns: 1fr;
    }

    .mp-nna-actions {
      flex-direction: column-reverse;
    }

    .mp-nna-button {
      width: 100%;
    }
  }
`;

NnaVerificationPanel.propTypes = {
  catalogos: PropTypes.shape({
    sexo: PropTypes.array.isRequired,
  }).isRequired,
  catalogosLoading: PropTypes.bool.isRequired,
  catalogosError: PropTypes.string.isRequired,
  verification: PropTypes.shape({
    status: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    registrosPrevios: PropTypes.array.isRequired,
    isVerifying: PropTypes.bool.isRequired,
    isVerified: PropTypes.bool.isRequired,
    isBlocked: PropTypes.bool.isRequired,
  }).isRequired,
  onVerify: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

ModeSelector.propTypes = {
  mode: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

CurpVerificationForm.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

DemographicVerificationForm.propTypes = {
  form: PropTypes.object.isRequired,
  catalogos: PropTypes.shape({
    sexo: PropTypes.array.isRequired,
  }).isRequired,
  catalogosLoading: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

VerificationAlert.propTypes = {
  verification: PropTypes.shape({
    status: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    registrosPrevios: PropTypes.array.isRequired,
  }).isRequired,
};
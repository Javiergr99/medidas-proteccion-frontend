import { useMemo, useState } from "react";
import { Alert, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

import routes from "../../../app/routes";
import { useAuth } from "../../../hooks/useAuth";
import { getStoredAuthSession } from "../../../utils/storage";

import DatosGeneralesIdentificacionForm from "../components/create/DatosGeneralesIdentificacionForm";
import ImpresionDiagnosticaForm from "../components/create/ImpresionDiagnosticaForm";
import IntervencionMultidisciplinariaForm from "../components/create/IntervencionMultidisciplinariaForm";
import MedidasCreateActionBar from "../components/create/MedidasCreateActionBar";
import MedidasCreatePendingSection from "../components/create/MedidasCreatePendingSection";
import MedidasCreateProgress from "../components/create/MedidasCreateProgress";
import MedidasCreateRecordHero from "../components/create/MedidasCreateRecordHero";
import MedidasModuleHeader from "../components/navigation/MedidasModuleHeader";
import NnaVerificationPanel from "../components/create/NnaVerificationPanel";
import PlanRestitucionForm from "../components/create/PlanRestitucionForm";
import MedidasProteccionForm from "../components/create/MedidasProteccionForm";

import { useMedidasCatalogos } from "../hooks/useMedidasCatalogos";
import { useNnaVerification } from "../hooks/useNnaVerification";

import "../styles/medidasCreate.ui.css";

import {
  MEDIDAS_CREATE_ROUTE,
  MEDIDAS_CREATE_SECTIONS,
} from "../constants/medidasCreate.constants";

import {
  createRegistroRequest,
  normalizeRegistroSession,
  saveImpresionDiagnosticaRequest,
  saveIntervencionMultidisciplinariaRequest,
  saveMedidasProteccionRequest,
  savePlanRestitucionRequest,
  sendRegistroRevisionRequest,
  updateDatosGeneralesRequest,
} from "../services/medidasCreate.service";

import {
  buildDatosGeneralesPayload,
  buildImpresionDiagnosticaPayload,
  buildIntervencionMultidisciplinariaPayload,
  buildMedidasProteccionPayload,
  buildNextDatosGeneralesForm,
  buildNextImpresionDiagnosticaForm,
  buildNextIntervencionMultidisciplinariaForm,
  buildNextMedidasProteccionForm,
  buildNextPlanRestitucionForm,
  buildPlanRestitucionPayload,
  getInitialMedidasCreateForms,
  getNextSectionKey,
  getPreviousSectionKey,
  getSectionByKey,
  getUserDisplayName,
  hasPreviousSection,
  normalizeDatosGeneralesFieldValue,
  normalizeImpresionDiagnosticaFieldValue,
  normalizeIntervencionMultidisciplinariaFieldValue,
  normalizeMedidasProteccionFieldValue,
  normalizePlanRestitucionFieldValue,
  validateDatosGenerales,
  validateImpresionDiagnostica,
  validateIntervencionMultidisciplinaria,
  validateMedidasProteccion,
  validatePlanRestitucion,
} from "../utils/medidasCreate.utils";

import {
  buildDatosGeneralesFromVerificationPayload,
  buildDatosGeneralesFromVerifiedNna,
} from "../utils/nnaVerification.utils";

function getEmptyMedidasProteccionForm() {
  return {
    medidas_urgentes: [],
    medidas_especiales: [],
    observaciones: "",
  };
}

export default function MedidasCreatePage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user: authUser, logout } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [registroSession, setRegistroSession] = useState(null);
  const [activeSection, setActiveSection] = useState("datos_generales");
  const [completedSections, setCompletedSections] = useState([]);
  const [forms, setForms] = useState(getInitialMedidasCreateForms);
  const [errorsBySection, setErrorsBySection] = useState({});

  const storedSession = getStoredAuthSession();
  const user = authUser || storedSession?.user || {};

  const {
    catalogos,
    loading: catalogosLoading,
    error: catalogosError,
  } = useMedidasCatalogos();

  const verification = useNnaVerification();

  const displayName = useMemo(() => getUserDisplayName(user), [user]);
  const currentSection = getSectionByKey(activeSection);
  const canGoBack = hasPreviousSection(activeSection);
  const activeErrors = errorsBySection[activeSection] || {};

  const canShowCaptureFlow =
    verification.isVerified && !verification.isBlocked;

  const estadoActual = registroSession?.estadoActual || "En captura";
  const isEditable = estadoActual === "En captura";
  const canSendReview = Boolean(registroSession?.registroId);

  function handleGoToDashboard() {
    window.location.assign(routes.loginUniversalDashboard);
  }

  function handleGoToList() {
    navigate(routes.medidas);
  }

  function handleGoToMining() {
    enqueueSnackbar(
      "El módulo de minería de datos se integrará en una fase posterior.",
      {
        variant: "info",
      }
    );
  }

  function handleGoToWorkflow() {
    navigate(MEDIDAS_CREATE_ROUTE);
  }

  function handleViewProfile() {
   window.location.assign(`${routes.loginUniversalProfile}?mode=view`);
  }

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await logout();
    } finally {
        window.location.replace(routes.loginUniversalLogout);
      }
  }

  async function handleVerifyNna(payload) {
    const result = await verification.verifyNna(payload);

    if (!result.ok) return;

    const verifiedNna = result.response?.nna || null;

    setForms((previousForms) => ({
      ...previousForms,
      datos_generales: verifiedNna
        ? buildDatosGeneralesFromVerifiedNna({
            currentForm: previousForms.datos_generales,
            nna: verifiedNna,
            catalogos,
          })
        : buildDatosGeneralesFromVerificationPayload({
            currentForm: previousForms.datos_generales,
            payload,
          }),
    }));

    if (verifiedNna) {
      enqueueSnackbar(
        "Se localizaron datos del NNA. Revisa la información precargada antes de continuar.",
        {
          variant: "info",
          autoHideDuration: 3500,
        }
      );
      return;
    }

    enqueueSnackbar("El NNA no existe. Puedes continuar con el registro.", {
      variant: "success",
      autoHideDuration: 3500,
    });
  }

  function handleResetVerification() {
    verification.resetVerification();
    setRegistroSession(null);
    setForms(getInitialMedidasCreateForms());
    setErrorsBySection({});
    setCompletedSections([]);
    setActiveSection("datos_generales");
  }

  function updateField(name, rawValue) {
    setForms((previousForms) => {
      if (activeSection === "datos_generales") {
        const value = normalizeDatosGeneralesFieldValue(name, rawValue);

        return {
          ...previousForms,
          datos_generales: buildNextDatosGeneralesForm({
            previousForm: previousForms.datos_generales,
            name,
            value,
          }),
        };
      }

      if (activeSection === "impresion_diagnostica") {
        const value = normalizeImpresionDiagnosticaFieldValue(name, rawValue);

        return {
          ...previousForms,
          impresion_diagnostica: buildNextImpresionDiagnosticaForm({
            previousForm: previousForms.impresion_diagnostica,
            name,
            value,
          }),
        };
      }

      if (activeSection === "intervencion_multidisciplinaria") {
        const value = normalizeIntervencionMultidisciplinariaFieldValue(
          name,
          rawValue
        );

        return {
          ...previousForms,
          intervencion_multidisciplinaria:
            buildNextIntervencionMultidisciplinariaForm({
              previousForm: previousForms.intervencion_multidisciplinaria,
              name,
              value,
            }),
        };
      }

      if (activeSection === "plan_restitucion") {
        const value = normalizePlanRestitucionFieldValue(name, rawValue);

        return {
          ...previousForms,
          plan_restitucion: buildNextPlanRestitucionForm({
            previousForm: previousForms.plan_restitucion,
            name,
            value,
          }),
        };
      }

      if (activeSection === "medidas_proteccion") {
        const value = normalizeMedidasProteccionFieldValue(name, rawValue);

        return {
          ...previousForms,
          medidas_proteccion: buildNextMedidasProteccionForm({
            previousForm:
              previousForms.medidas_proteccion ||
              getEmptyMedidasProteccionForm(),
            name,
            value,
          }),
        };
      }

      return previousForms;
    });

    setErrorsBySection((previousErrors) => ({
      ...previousErrors,
      [activeSection]: {
        ...(previousErrors[activeSection] || {}),
        [name]: "",
      },
    }));
  }

  function validateCurrentSection() {
    if (activeSection === "datos_generales") {
      return validateDatosGenerales(forms.datos_generales);
    }

    if (activeSection === "impresion_diagnostica") {
      return validateImpresionDiagnostica(forms.impresion_diagnostica);
    }

    if (activeSection === "intervencion_multidisciplinaria") {
      return validateIntervencionMultidisciplinaria(
        forms.intervencion_multidisciplinaria
      );
    }

    if (activeSection === "plan_restitucion") {
      return validatePlanRestitucion(forms.plan_restitucion);
    }

    if (activeSection === "medidas_proteccion") {
      return validateMedidasProteccion(
        forms.medidas_proteccion || getEmptyMedidasProteccionForm()
      );
    }

    return {};
  }

  async function saveDatosGeneralesSection() {
    const payload = buildDatosGeneralesPayload(forms.datos_generales);

    if (registroSession?.registroId) {
      const patchPayload = {
        ...payload,
      };

      delete patchPayload.nna_id;

      const response = await updateDatosGeneralesRequest({
        registroId: registroSession.registroId,
        payload: patchPayload,
      });

      const nextSession = normalizeRegistroSession(response);

      if (nextSession) {
        setRegistroSession(nextSession);
      }

      return response;
    }

    const response = await createRegistroRequest(payload);
    const nextSession = normalizeRegistroSession(response);

    if (nextSession) {
      setRegistroSession(nextSession);
    }

    return response;
  }

  async function saveImpresionDiagnosticaSection() {
    if (!registroSession?.registroId) {
      enqueueSnackbar(
        "Primero debes guardar Datos Generales para obtener el UUID del expediente.",
        {
          variant: "warning",
        }
      );
      return null;
    }

    const payload = buildImpresionDiagnosticaPayload(
      forms.impresion_diagnostica
    );

    const response = await saveImpresionDiagnosticaRequest({
      registroId: registroSession.registroId,
      payload,
    });

    const nextSession = normalizeRegistroSession(response);

    if (nextSession) {
      setRegistroSession(nextSession);
    }

    return response;
  }

  async function saveIntervencionMultidisciplinariaSection() {
    if (!registroSession?.registroId) {
      enqueueSnackbar(
        "Primero debes guardar Datos Generales para obtener el UUID del expediente.",
        {
          variant: "warning",
        }
      );
      return null;
    }

    const payload = buildIntervencionMultidisciplinariaPayload(
      forms.intervencion_multidisciplinaria
    );

    const response = await saveIntervencionMultidisciplinariaRequest({
      registroId: registroSession.registroId,
      payload,
    });

    const nextSession = normalizeRegistroSession(response);

    if (nextSession) {
      setRegistroSession(nextSession);
    }

    return response;
  }

  async function savePlanRestitucionSection() {
    if (!registroSession?.registroId) {
      enqueueSnackbar(
        "Primero debes guardar Datos Generales para obtener el UUID del expediente.",
        {
          variant: "warning",
        }
      );
      return null;
    }

    const payload = buildPlanRestitucionPayload(forms.plan_restitucion);

    const response = await savePlanRestitucionRequest({
      registroId: registroSession.registroId,
      payload,
    });

    const nextSession = normalizeRegistroSession(response);

    if (nextSession) {
      setRegistroSession(nextSession);
    }

    return response;
  }

  async function saveMedidasProteccionSection() {
    if (!registroSession?.registroId) {
      enqueueSnackbar(
        "Primero debes guardar Datos Generales para obtener el UUID del expediente.",
        {
          variant: "warning",
        }
      );
      return null;
    }

    const payload = buildMedidasProteccionPayload(
      forms.medidas_proteccion || getEmptyMedidasProteccionForm()
    );

    const response = await saveMedidasProteccionRequest({
      registroId: registroSession.registroId,
      payload,
    });

    const nextSession = normalizeRegistroSession(response);

    if (nextSession) {
      setRegistroSession(nextSession);
    }

    return response;
  }

  async function saveCurrentSection() {
    if (saving) return false;

    if (!canShowCaptureFlow) {
      enqueueSnackbar("Primero debes validar si el NNA existe.", {
        variant: "warning",
      });
      return false;
    }

    if (!isEditable) {
      enqueueSnackbar(
        "El expediente ya no está en captura. La edición está bloqueada.",
        {
          variant: "warning",
        }
      );
      return false;
    }

    if (
      activeSection !== "datos_generales" &&
      activeSection !== "impresion_diagnostica" &&
      activeSection !== "intervencion_multidisciplinaria" &&
      activeSection !== "plan_restitucion" &&
      activeSection !== "medidas_proteccion"
    ) {
      enqueueSnackbar("Esta sección se integrará en una fase posterior.", {
        variant: "info",
      });
      return false;
    }

    const nextErrors = validateCurrentSection();

    setErrorsBySection((previousErrors) => ({
      ...previousErrors,
      [activeSection]: nextErrors,
    }));

    if (Object.keys(nextErrors).length > 0) {
      enqueueSnackbar("Revisa los campos obligatorios antes de continuar.", {
        variant: "warning",
      });
      return false;
    }

    try {
      setSaving(true);

      let response = null;

      if (activeSection === "datos_generales") {
        response = await saveDatosGeneralesSection();
      }

      if (activeSection === "impresion_diagnostica") {
        response = await saveImpresionDiagnosticaSection();
      }

      if (activeSection === "intervencion_multidisciplinaria") {
        response = await saveIntervencionMultidisciplinariaSection();
      }

      if (activeSection === "plan_restitucion") {
        response = await savePlanRestitucionSection();
      }

      if (activeSection === "medidas_proteccion") {
        response = await saveMedidasProteccionSection();
      }

      if (!response) {
        return false;
      }

      setCompletedSections((previousSections) => {
        if (previousSections.includes(activeSection)) {
          return previousSections;
        }

        return [...previousSections, activeSection];
      });

      enqueueSnackbar("Sección guardada correctamente.", {
        variant: "success",
      });

      return true;
    } catch (error) {
      const detail = error?.response?.data?.detail;

      enqueueSnackbar(
        typeof detail === "string"
          ? detail
          : "No fue posible guardar la sección.",
        {
          variant: "error",
        }
      );

      console.error("Error al guardar sección:", error);

      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveSection() {
    await saveCurrentSection();
  }

  async function handleNextSection() {
    const canContinue = await saveCurrentSection();

    if (!canContinue) return;

    setActiveSection(getNextSectionKey(activeSection));
  }

  function handlePreviousSection() {
    setActiveSection(getPreviousSectionKey(activeSection));
  }

  function handleExitRecord() {
    navigate(routes.medidas);
  }

  async function handleSendReview() {
    if (!registroSession?.registroId) {
      enqueueSnackbar(
        "Primero debes guardar Datos Generales para crear el expediente.",
        {
          variant: "warning",
        }
      );
      return;
    }

    if (!isEditable) {
      enqueueSnackbar("El expediente ya fue enviado o revisado.", {
        variant: "info",
      });
      return;
    }

    const confirmed = window.confirm(
      "¿Deseas enviar este expediente a revisión? Una vez enviado, la edición quedará bloqueada hasta que un supervisor lo devuelva a captura."
    );

    if (!confirmed) return;

    try {
      setReviewing(true);

      const response = await sendRegistroRevisionRequest(
        registroSession.registroId
      );

      const nextSession = normalizeRegistroSession(response);

      if (nextSession) {
        setRegistroSession(nextSession);
      }

      enqueueSnackbar("Expediente enviado a revisión correctamente.", {
        variant: "success",
      });
    } catch (error) {
      const detail = error?.response?.data?.detail;

      enqueueSnackbar(
        typeof detail === "string"
          ? detail
          : "No fue posible enviar el expediente a revisión.",
        {
          variant: "error",
        }
      );

      console.error("Error al enviar a revisión:", error);
    } finally {
      setReviewing(false);
    }
  }

  function renderCurrentSection() {
    if (activeSection === "datos_generales") {
      return (
        <DatosGeneralesIdentificacionForm
          form={forms.datos_generales}
          errors={activeErrors}
          catalogos={catalogos}
          onFieldChange={updateField}
        />
      );
    }

    if (activeSection === "impresion_diagnostica") {
      return (
        <ImpresionDiagnosticaForm
          form={forms.impresion_diagnostica}
          errors={activeErrors}
          onFieldChange={updateField}
        />
      );
    }

    if (activeSection === "intervencion_multidisciplinaria") {
      return (
        <IntervencionMultidisciplinariaForm
          form={forms.intervencion_multidisciplinaria}
          errors={activeErrors}
          catalogos={catalogos}
          onFieldChange={updateField}
        />
      );
    }

    if (activeSection === "plan_restitucion") {
      return (
        <PlanRestitucionForm
          form={forms.plan_restitucion}
          errors={activeErrors}
          onFieldChange={updateField}
        />
      );
    }

    if (activeSection === "medidas_proteccion") {
      return (
        <MedidasProteccionForm
          form={forms.medidas_proteccion || getEmptyMedidasProteccionForm()}
          errors={activeErrors}
          onFieldChange={updateField}
        />
      );
    }

    return (
      <MedidasCreatePendingSection
        title={currentSection.title}
        description={currentSection.description}
      />
    );
  }

  return (
    <Box className="mp-create-page">
      <MedidasModuleHeader
        activeSection="flujo"
        displayName={displayName}
        loggingOut={loggingOut}
        onDashboard={handleGoToDashboard}
        onList={handleGoToList}
        onMining={handleGoToMining}
        onWorkflow={handleGoToWorkflow}
        onViewProfile={handleViewProfile}
        onLogout={handleLogout}
      />

      <main className="mp-create-shell">
        <div className="mp-create-stack">
          {!canShowCaptureFlow ? (
            <NnaVerificationPanel
              catalogos={catalogos}
              catalogosLoading={catalogosLoading}
              catalogosError={catalogosError}
              verification={verification}
              onVerify={handleVerifyNna}
              onReset={handleResetVerification}
            />
          ) : (
            <>
              <MedidasCreateRecordHero
                idMp={registroSession?.idMp || ""}
                numeroExpediente={forms.datos_generales.numero_expediente}
                estadoActual={estadoActual}
                activeSectionTitle={currentSection.title}
              />

              <MedidasCreateProgress
                sections={MEDIDAS_CREATE_SECTIONS}
                activeSection={activeSection}
                completedSections={completedSections}
                onSectionChange={setActiveSection}
              />

              <section className="mp-create-form-shell">
                {!isEditable ? (
                  <Alert
                    severity="warning"
                    sx={{
                      mb: 2.2,
                      borderRadius: "14px",
                      border: "1px solid rgba(188,149,92,0.28)",
                      backgroundColor: "rgba(221,201,163,0.18)",
                      color: "#735827",
                      fontFamily: "Noto Sans, sans-serif",
                      fontWeight: 750,
                    }}
                  >
                    Este expediente se encuentra en estado “{estadoActual}”. La
                    captura quedó bloqueada hasta que sea devuelto a captura.
                  </Alert>
                ) : null}

                <div
                  className={
                    isEditable
                      ? "mp-create-section-content"
                      : "mp-create-section-content is-disabled"
                  }
                >
                  {renderCurrentSection()}
                </div>

                <MedidasCreateActionBar
                  canGoBack={canGoBack}
                  canSendReview={canSendReview}
                  isEditable={isEditable}
                  reviewing={reviewing}
                  saving={saving}
                  onBack={handlePreviousSection}
                  onExit={handleExitRecord}
                  onSave={handleSaveSection}
                  onNext={handleNextSection}
                  onSendReview={handleSendReview}
                />
              </section>
            </>
          )}
        </div>
      </main>
    </Box>
  );
}
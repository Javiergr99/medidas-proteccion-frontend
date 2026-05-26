import { useMemo, useReducer, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

import routes from "../../../app/routes";
import { useAuth } from "../../../hooks/useAuth";
import { getStoredAuthSession } from "../../../utils/storage";
import { getErrorMessage } from "../../auth/helpers/auth.helper";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import {
  buildUserUpdatePayload,
  updateUserProfileRequest,
} from "../services/profile.service";
import {
  canSubmitPasswordChange,
  evaluatePasswordStrength,
} from "../utils/passwordStrength";

const PROFILE_ACTIONS = {
  SET_FIELD: "SET_FIELD",
  SET_LOADING: "SET_LOADING",
  SYNC_USER: "SYNC_USER",
};

function getInitialForm(user) {
  return {
    nombre: user?.nombre || "",
    primer_apellido: user?.primer_apellido || "",
    segundo_apellido: user?.segundo_apellido || "",
    correo_electronico: user?.correo_electronico || "",
    curp: user?.curp || "",
    entidad_federativa_id: user?.entidad_federativa_id || "",
    numero_telefono: user?.numero_telefono || "",
    password: "",
    confirmPassword: "",
  };
}

function profileReducer(state, action) {
  switch (action.type) {
    case PROFILE_ACTIONS.SET_FIELD:
      return {
        ...state,
        form: {
          ...state.form,
          [action.field]: action.value,
        },
      };

    case PROFILE_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: Boolean(action.payload),
      };

    case PROFILE_ACTIONS.SYNC_USER:
      return {
        ...state,
        form: getInitialForm(action.payload),
        loading: false,
      };

    default:
      return state;
  }
}

function getFullName(user) {
  return [user?.nombre, user?.primer_apellido, user?.segundo_apellido]
    .filter(Boolean)
    .join(" ")
    .trim();
}

function getProfileMode(searchParams) {
  return searchParams.get("mode") === "edit" ? "edit" : "view";
}

function mergeUpdatedUserWithCurrentPermissions({ currentUser, updatedUser }) {
  return {
    ...(currentUser || {}),
    ...(updatedUser || {}),
    permisos: updatedUser?.permisos || currentUser?.permisos || null,
  };
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { enqueueSnackbar } = useSnackbar();
  const { user: authUser, completeLogin } = useAuth();

  const storedSession = getStoredAuthSession();
  const currentUser = authUser || storedSession.user;

  const mode = getProfileMode(searchParams);
  const isEditMode = mode === "edit";

  const [state, dispatch] = useReducer(profileReducer, {
    form: getInitialForm(currentUser),
    loading: false,
  });

  const { form, loading } = state;

  const passwordStrength = useMemo(() => {
    return evaluatePasswordStrength(form.password);
  }, [form.password]);

  const passwordSubmitState = useMemo(() => {
    return canSubmitPasswordChange({
      password: form.password,
      confirmPassword: form.confirmPassword,
    });
  }, [form.password, form.confirmPassword]);

  const fullName = useMemo(() => {
    return getFullName(currentUser) || "Usuario";
  }, [currentUser]);

  function updateField(event) {
    const { name, value } = event.target;

    dispatch({
      type: PROFILE_ACTIONS.SET_FIELD,
      field: name,
      value:
        name === "curp"
          ? value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 18)
          : value,
    });
  }

  function goToViewMode() {
    navigate(`${routes.profile}?mode=view`, { replace: true });
  }

  function goToEditMode() {
    navigate(`${routes.profile}?mode=edit`, { replace: true });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!currentUser?.id) {
      enqueueSnackbar("No se pudo determinar el usuario actual.", {
        variant: "error",
      });
      return;
    }

    if (!passwordSubmitState.canSubmit) {
      enqueueSnackbar(passwordSubmitState.reason, {
        variant: "warning",
      });
      return;
    }

    try {
      dispatch({
        type: PROFILE_ACTIONS.SET_LOADING,
        payload: true,
      });

      const payload = buildUserUpdatePayload(form);

      const updatedUser = await updateUserProfileRequest({
        userId: currentUser.id,
        payload,
      });

      const nextUser = mergeUpdatedUserWithCurrentPermissions({
        currentUser,
        updatedUser,
      });

      completeLogin({
        token: storedSession.token,
        refreshToken: storedSession.refreshToken,
        tokenType: storedSession.tokenType || "bearer",
        user: nextUser,
      });

      dispatch({
        type: PROFILE_ACTIONS.SYNC_USER,
        payload: nextUser,
      });

      enqueueSnackbar("Datos actualizados correctamente.", {
        variant: "success",
      });

      navigate(`${routes.profile}?mode=view`, { replace: true });
    } catch (error) {
      enqueueSnackbar(
        getErrorMessage(error, "No fue posible actualizar tus datos."),
        {
          variant: "error",
        }
      );

      console.error("Error al actualizar perfil:", error);
    } finally {
      dispatch({
        type: PROFILE_ACTIONS.SET_LOADING,
        payload: false,
      });
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, sm: 4, md: 5 },
        background:
          "radial-gradient(circle at 10% 8%, rgba(159,34,65,0.12) 0%, transparent 28%), radial-gradient(circle at 90% 12%, rgba(188,149,92,0.15) 0%, transparent 30%), linear-gradient(135deg, #f8fafc 0%, #f3f4f6 52%, #f7f1e9 100%)",
        fontFamily: "Noto Sans, sans-serif",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "980px",
          mx: "auto",
        }}
      >
        <Button
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate(routes.dashboard)}
          sx={{
            mb: 2,
            textTransform: "none",
            fontWeight: 900,
            color: "#8f1538",
            borderRadius: 999,
          }}
        >
          Volver al dashboard
        </Button>

        <Box
          sx={{
            borderRadius: { xs: "26px", md: "34px" },
            background: "rgba(255,255,255,0.78)",
            border: "1px solid rgba(255,255,255,0.82)",
            boxShadow:
              "0 28px 80px rgba(15,23,42,0.10), inset 0 1px 0 rgba(255,255,255,0.9)",
            backdropFilter: "blur(20px)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              p: { xs: 3, sm: 4 },
              background:
                "linear-gradient(135deg, rgba(159,34,65,0.10), rgba(188,149,92,0.08))",
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <BadgeRoundedIcon sx={{ color: "#8f1538" }} />

              <Typography
                component="h1"
                sx={{
                  fontWeight: 950,
                  color: "#111827",
                  fontSize: { xs: "1.65rem", sm: "2rem" },
                  letterSpacing: "-0.04em",
                }}
              >
                Perfil de usuario
              </Typography>
            </Stack>

            <Typography
              sx={{
                mt: 1,
                color: "#64748b",
                lineHeight: 1.6,
                fontSize: "0.95rem",
              }}
            >
              Consulta o actualiza la información de tu cuenta institucional.
            </Typography>
          </Box>

          <Box sx={{ p: { xs: 3, sm: 4 } }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={2}
              sx={{ mb: 3 }}
            >
              <Box>
                <Typography
                  sx={{
                    fontWeight: 950,
                    color: "#1f2937",
                    fontSize: "1.2rem",
                  }}
                >
                  {fullName}
                </Typography>

                <Typography
                  sx={{
                    color: "#64748b",
                    fontSize: "0.9rem",
                    mt: 0.3,
                  }}
                >
                  {currentUser?.correo_electronico || "Correo no registrado"}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1}>
                <Button
                  startIcon={<VisibilityRoundedIcon />}
                  onClick={goToViewMode}
                  variant={!isEditMode ? "contained" : "outlined"}
                  sx={{
                    textTransform: "none",
                    borderRadius: 999,
                    fontWeight: 900,
                    bgcolor: !isEditMode ? "#8f1538" : "transparent",
                    borderColor: "rgba(159,34,65,0.30)",
                    color: !isEditMode ? "#ffffff" : "#8f1538",
                    "&:hover": {
                      bgcolor: !isEditMode
                        ? "#7a1230"
                        : "rgba(159,34,65,0.06)",
                      borderColor: "#8f1538",
                    },
                  }}
                >
                  Ver
                </Button>

                <Button
                  startIcon={<EditRoundedIcon />}
                  onClick={goToEditMode}
                  variant={isEditMode ? "contained" : "outlined"}
                  sx={{
                    textTransform: "none",
                    borderRadius: 999,
                    fontWeight: 900,
                    bgcolor: isEditMode ? "#8f1538" : "transparent",
                    borderColor: "rgba(159,34,65,0.30)",
                    color: isEditMode ? "#ffffff" : "#8f1538",
                    "&:hover": {
                      bgcolor: isEditMode
                        ? "#7a1230"
                        : "rgba(159,34,65,0.06)",
                      borderColor: "#8f1538",
                    },
                  }}
                >
                  Actualizar datos
                </Button>
              </Stack>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Box component="form" onSubmit={handleSubmit}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                  },
                  gap: 2,
                }}
              >
                <ProfileField
                  label="Nombre"
                  name="nombre"
                  value={form.nombre}
                  onChange={updateField}
                  disabled={!isEditMode}
                />

                <ProfileField
                  label="Primer apellido"
                  name="primer_apellido"
                  value={form.primer_apellido}
                  onChange={updateField}
                  disabled={!isEditMode}
                />

                <ProfileField
                  label="Segundo apellido"
                  name="segundo_apellido"
                  value={form.segundo_apellido}
                  onChange={updateField}
                  disabled={!isEditMode}
                />

                <ProfileField
                  label="Correo electrónico"
                  name="correo_electronico"
                  value={form.correo_electronico}
                  onChange={updateField}
                  disabled={!isEditMode}
                />

                <ProfileField
                  label="CURP"
                  name="curp"
                  value={form.curp}
                  onChange={updateField}
                  disabled={!isEditMode}
                  inputProps={{ maxLength: 18 }}
                />

                <ProfileField
                  label="Entidad federativa ID"
                  name="entidad_federativa_id"
                  value={String(form.entidad_federativa_id || "")}
                  onChange={updateField}
                  disabled={!isEditMode}
                />

                <ProfileField
                  label="Teléfono"
                  name="numero_telefono"
                  value={form.numero_telefono}
                  onChange={updateField}
                  disabled={!isEditMode}
                />

                {isEditMode ? (
                  <>
                    <ProfilePasswordField
                      label="Nueva contraseña"
                      name="password"
                      value={form.password}
                      onChange={updateField}
                      disabled={loading}
                    />

                    <ProfilePasswordField
                      label="Confirmar contraseña"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={updateField}
                      disabled={loading}
                    />

                    <PasswordStrengthMeter strength={passwordStrength} />
                  </>
                ) : null}
              </Box>

              {isEditMode ? (
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  justifyContent="flex-end"
                  spacing={1.2}
                  sx={{ mt: 3 }}
                >
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={goToViewMode}
                    disabled={loading}
                    sx={{
                      textTransform: "none",
                      borderRadius: 999,
                      fontWeight: 900,
                      borderColor: "rgba(100,116,139,0.32)",
                      color: "#475569",
                    }}
                  >
                    Cancelar
                  </Button>

                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveRoundedIcon />}
                    disabled={loading || !passwordSubmitState.canSubmit}
                    sx={{
                      textTransform: "none",
                      borderRadius: 999,
                      fontWeight: 950,
                      bgcolor: "#8f1538",
                      "&:hover": {
                        bgcolor: "#7a1230",
                      },
                    }}
                  >
                    {loading ? "Guardando..." : "Guardar cambios"}
                  </Button>
                </Stack>
              ) : null}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function ProfileField({
  label,
  name = "",
  value,
  onChange = undefined,
  disabled = false,
  type = "text",
  inputProps = undefined,
}) {
  return (
    <TextField
      label={label}
      name={name}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      type={type}
      fullWidth
      inputProps={inputProps}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "14px",
          backgroundColor: disabled ? "rgba(248,250,252,0.76)" : "#ffffff",
        },
      }}
    />
  );
}

function ProfilePasswordField({
  label,
  name,
  value,
  onChange,
  disabled = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  function togglePasswordVisibility() {
    setShowPassword((prev) => !prev);
  }

  return (
    <TextField
      label={label}
      name={name}
      value={value || ""}
      onChange={onChange}
      disabled={disabled}
      type={showPassword ? "text" : "password"}
      fullWidth
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              type="button"
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
              onClick={togglePasswordVisibility}
              edge="end"
              disabled={disabled}
              sx={{
                color: "#8f1538",
              }}
            >
              {showPassword ? (
                <VisibilityOffRoundedIcon />
              ) : (
                <VisibilityRoundedIcon />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "14px",
          backgroundColor: disabled ? "rgba(248,250,252,0.76)" : "#ffffff",
        },
      }}
    />
  );
}

ProfileField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  inputProps: PropTypes.object,
};

ProfilePasswordField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
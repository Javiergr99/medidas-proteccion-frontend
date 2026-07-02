import PropTypes from "prop-types";
import { Box, ButtonBase, Stack, Typography } from "@mui/material";

import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import PsychologyAltRoundedIcon from "@mui/icons-material/PsychologyAltRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import HealthAndSafetyRoundedIcon from "@mui/icons-material/HealthAndSafetyRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";

const SECTION_ICONS = {
  datos_generales: <AssignmentRoundedIcon />,
  impresion_diagnostica: <PsychologyAltRoundedIcon />,
  intervencion_multidisciplinaria: <GroupsRoundedIcon />,
  plan_restitucion: <FactCheckRoundedIcon />,
  medidas_proteccion: <HealthAndSafetyRoundedIcon />,
  cierre_caso: <TaskAltRoundedIcon />,
};

export default function MedidasCreateProgress({
  sections,
  activeSection,
  completedSections,
  onSectionChange,
}) {
  const activeIndex = Math.max(
    sections.findIndex((section) => section.key === activeSection),
    0
  );

  const progressPercent =
    sections.length > 1 ? (activeIndex / (sections.length - 1)) * 100 : 0;

  return (
    <Box
      component="nav"
      aria-label="Flujo del expediente"
      sx={{
        borderRadius: { xs: "22px", md: "26px" },
        backgroundColor: "#ffffff",
        border: "1px solid rgba(152,152,154,0.16)",
        boxShadow: "0 10px 28px rgba(19,50,46,0.045)",
        px: { xs: 1.6, sm: 2.2, md: 2.8 },
        py: { xs: 1.2, md: 1.45 },
        overflow: "visible",
      }}
    >
      <style>{animations}</style>

      <Box
        sx={{
          position: "relative",
          overflowX: "auto",
          overflowY: "hidden",
          pt: 1.25,
          pb: 1.3,
          px: 0.2,
          "&::-webkit-scrollbar": {
            height: 6,
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            borderRadius: 999,
            backgroundColor: "rgba(152,152,154,0.34)",
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 45,
            left: 76,
            right: 76,
            height: 9,
            borderRadius: 999,
            backgroundColor: "rgba(152,152,154,0.15)",
            display: { xs: "none", md: "block" },
            overflow: "hidden",
            boxShadow: "inset 0 1px 3px rgba(15,23,42,0.08)",
          }}
        >
          <Box
            sx={{
              position: "relative",
              width: `${progressPercent}%`,
              height: "100%",
              borderRadius: 999,
              background:
                "linear-gradient(90deg, #611232 0%, #9d2449 48%, #BC955C 100%)",
              backgroundSize: "220% 100%",
              animation:
                progressPercent > 0
                  ? "mpProgressFlow 1.35s linear infinite"
                  : "none",
              transition:
                "width 560ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 260ms ease",
              boxShadow:
                progressPercent > 0
                  ? "0 0 18px rgba(157,36,73,0.22)"
                  : "none",
              "&::after": {
                content: '""',
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(115deg, transparent 0%, rgba(255,255,255,0) 28%, rgba(255,255,255,0.42) 45%, rgba(255,255,255,0) 62%, transparent 100%)",
                transform: "translateX(-100%)",
                animation:
                  progressPercent > 0
                    ? "mpProgressShine 1.15s ease-in-out infinite"
                    : "none",
              },
              "&::before": {
                content: '""',
                position: "absolute",
                top: "50%",
                right: -4,
                width: 15,
                height: 15,
                borderRadius: "50%",
                transform: "translateY(-50%)",
                backgroundColor: "#ffffff",
                border: "3px solid #BC955C",
                boxShadow: "0 0 0 5px rgba(188,149,92,0.14)",
                display:
                  progressPercent > 0 && progressPercent < 100
                    ? "block"
                    : "none",
                animation: "mpProgressDotPulse 1.35s ease-in-out infinite",
              },
            }}
          />
        </Box>

        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={{ xs: 1.2, md: 1.8 }}
          sx={{
            position: "relative",
            minWidth: { xs: 900, md: "auto" },
            overflow: "visible",
          }}
        >
          {sections.map((section, index) => {
            const isActive = activeSection === section.key;
            const isCompleted = completedSections.includes(section.key);
            const isPast = index < activeIndex;

            return (
              <StepItem
                key={section.key}
                section={section}
                index={index}
                isActive={isActive}
                isCompleted={isCompleted}
                isPast={isPast}
                onClick={() => onSectionChange(section.key)}
              />
            );
          })}
        </Stack>
      </Box>
    </Box>
  );
}

function StepItem({
  section,
  index,
  isActive,
  isCompleted,
  isPast,
  onClick,
}) {
  const circleColor = isActive || isCompleted || isPast ? "#ffffff" : "#64748b";

  const circleBackground = isActive
    ? "linear-gradient(135deg, #611232 0%, #9d2449 100%)"
    : isCompleted || isPast
      ? "linear-gradient(135deg, #BC955C 0%, #a57f2c 100%)"
      : "#ffffff";

  const circleBorder = isActive
    ? "1px solid rgba(97,18,50,0.34)"
    : isCompleted || isPast
      ? "1px solid rgba(188,149,92,0.36)"
      : "1px solid rgba(152,152,154,0.22)";

  return (
    <ButtonBase
      type="button"
      disableRipple
      disableTouchRipple
      onClick={onClick}
      sx={{
        width: 145,
        borderRadius: "20px",
        p: 0.85,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0.85,
        overflow: "visible",
        outline: "none",
        backgroundColor: "transparent !important",
        boxShadow: "none !important",
        WebkitTapHighlightColor: "transparent",
        transition: "transform 220ms cubic-bezier(0.22, 1, 0.36, 1)",

        "&:hover": {
          transform: "translateY(-4px)",
          backgroundColor: "transparent !important",
          boxShadow: "none !important",
        },

        "&:active": {
          backgroundColor: "transparent !important",
          boxShadow: "none !important",
        },

        "&:focus": {
          outline: "none",
          backgroundColor: "transparent !important",
          boxShadow: "none !important",
        },

        "&:focus-visible": {
          outline: "none",
          backgroundColor: "transparent !important",
          boxShadow: "none !important",
        },

        "&.Mui-focusVisible": {
          outline: "none",
          backgroundColor: "transparent !important",
          boxShadow: "none !important",
        },

        "& .MuiTouchRipple-root": {
          display: "none !important",
        },

        "&:hover .mp-step-circle": {
          transform: isActive ? "translateY(-1px) scale(1.045)" : "scale(1.04)",
          boxShadow: isActive
            ? "0 16px 34px rgba(97,18,50,0.24)"
            : "0 12px 26px rgba(15,23,42,0.10)",
        },

        "&:active .mp-step-circle": {
          transform: "scale(0.98)",
        },
      }}
    >
      <Box
        className="mp-step-circle"
        sx={{
          position: "relative",
          width: 62,
          height: 62,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: circleColor,
          background: circleBackground,
          border: circleBorder,
          boxShadow: isActive
            ? "0 14px 30px rgba(97,18,50,0.22)"
            : isCompleted || isPast
              ? "0 12px 24px rgba(188,149,92,0.18)"
              : "0 8px 18px rgba(15,23,42,0.055)",
          transform: isActive ? "translateY(-1px)" : "none",
          overflow: "visible",
          transition:
            "transform 220ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 220ms ease, background 220ms ease, border-color 220ms ease",
          animation: isActive
            ? "mpActiveStepFloat 2.2s ease-in-out infinite"
            : "none",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: -4,
            borderRadius: "50%",
            border: isActive
              ? "2px solid rgba(157,36,73,0.18)"
              : "2px solid transparent",
            opacity: isActive ? 1 : 0,
            pointerEvents: "none",
            animation: isActive
              ? "mpActiveStepPulse 1.8s ease-in-out infinite"
              : "none",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 7,
            borderRadius: "50%",
            background:
              isActive || isCompleted || isPast
                ? "linear-gradient(135deg, rgba(255,255,255,0.20), rgba(255,255,255,0))"
                : "transparent",
            pointerEvents: "none",
          },
          "& svg": {
            position: "relative",
            zIndex: 1,
            fontSize: 25,
            transition: "transform 220ms ease",
          },
        }}
      >
        {isCompleted ? (
          <CheckRoundedIcon />
        ) : (
          SECTION_ICONS[section.key] || <AssignmentRoundedIcon />
        )}
      </Box>

      <Typography
        sx={{
          fontFamily: "Noto Sans, sans-serif",
          color: isActive ? "#611232" : "#475569",
          fontWeight: isActive ? 950 : 800,
          fontSize: "0.78rem",
          lineHeight: 1.25,
          textAlign: "center",
          minHeight: 32,
          letterSpacing: "-0.01em",
          userSelect: "none",
          transition: "color 180ms ease",
        }}
      >
        {section.label}
      </Typography>

      <Typography
        sx={{
          borderRadius: 999,
          px: 0.95,
          py: 0.38,
          backgroundColor: isActive
            ? "rgba(97,18,50,0.08)"
            : isCompleted
              ? "rgba(188,149,92,0.14)"
              : isPast
                ? "rgba(188,149,92,0.10)"
                : "rgba(152,152,154,0.10)",
          color: isActive
            ? "#611232"
            : isCompleted || isPast
              ? "#735827"
              : "#64748b",
          fontFamily: "Noto Sans, sans-serif",
          fontWeight: 900,
          fontSize: "0.66rem",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          lineHeight: 1,
          userSelect: "none",
          transition: "background-color 180ms ease, color 180ms ease",
        }}
      >
        {isCompleted
          ? "Listo"
          : isActive
            ? "Actual"
            : String(index + 1).padStart(2, "0")}
      </Typography>
    </ButtonBase>
  );
}

const animations = `
  @keyframes mpProgressFlow {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 220% 50%;
    }
  }

  @keyframes mpProgressShine {
    0% {
      transform: translateX(-120%);
      opacity: 0;
    }
    35% {
      opacity: 0.75;
    }
    100% {
      transform: translateX(120%);
      opacity: 0;
    }
  }

  @keyframes mpProgressDotPulse {
    0%, 100% {
      transform: translateY(-50%) scale(1);
      box-shadow: 0 0 0 5px rgba(188,149,92,0.14);
    }
    50% {
      transform: translateY(-50%) scale(1.08);
      box-shadow: 0 0 0 7px rgba(188,149,92,0.08);
    }
  }

  @keyframes mpActiveStepPulse {
    0%, 100% {
      transform: scale(0.98);
      opacity: 0.45;
    }
    50% {
      transform: scale(1.12);
      opacity: 0.95;
    }
  }

  @keyframes mpActiveStepFloat {
    0%, 100% {
      transform: translateY(-1px);
    }
    50% {
      transform: translateY(-3px);
    }
  }
`;

MedidasCreateProgress.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  activeSection: PropTypes.string.isRequired,
  completedSections: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSectionChange: PropTypes.func.isRequired,
};

StepItem.propTypes = {
  section: PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  isCompleted: PropTypes.bool.isRequired,
  isPast: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};
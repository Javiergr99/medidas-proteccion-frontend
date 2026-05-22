import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";

import routes from "../../../app/routes";
import { useAuth } from "../../../hooks/useAuth";

import DashboardHero from "../components/DashboardHero";
import DashboardModulesPanel from "../components/DashboardModulesPanel";
import {
  getAllowedRegistriesFromUser,
  getDashboardDisplayName,
  getDashboardRoleLabel,
  getStoredDashboardUser,
} from "../utils/dashboard.utils";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [loggingOut, setLoggingOut] = useState(false);

  const user = useMemo(() => getStoredDashboardUser(), []);

  const displayName = useMemo(() => getDashboardDisplayName(user), [user]);
  const role = useMemo(() => getDashboardRoleLabel(user), [user]);

  const availableRegistries = useMemo(() => {
    return getAllowedRegistriesFromUser(user);
  }, [user]);

  function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    logout();

    navigate(routes.login, {
      replace: true,
    });
  }

  function handleSelectRegistry(route) {
    navigate(route);
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, sm: 4, md: 5 },
        fontFamily: "Noto Sans, sans-serif",
        background:
          "radial-gradient(circle at 10% 8%, rgba(159,34,65,0.13) 0%, transparent 27%), radial-gradient(circle at 88% 12%, rgba(188,149,92,0.16) 0%, transparent 30%), radial-gradient(circle at 50% 105%, rgba(15,23,42,0.08) 0%, transparent 34%), linear-gradient(135deg, #f8fafc 0%, #f3f4f6 46%, #f7f1e9 100%)",

        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          opacity: 0.32,
          backgroundImage:
            "linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)",
          backgroundSize: "42px 42px",
          maskImage:
            "radial-gradient(circle at center, black 0%, transparent 76%)",
          pointerEvents: "none",
        },

        "&::after": {
          content: '""',
          position: "absolute",
          width: 520,
          height: 520,
          right: -260,
          top: 120,
          borderRadius: "50%",
          background:
            "linear-gradient(135deg, rgba(159,34,65,0.10), rgba(188,149,92,0.08))",
          filter: "blur(10px)",
          pointerEvents: "none",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "1200px",
          mx: "auto",
        }}
      >
        <DashboardHero
          displayName={displayName}
          role={role}
          registriesCount={availableRegistries.length}
          loggingOut={loggingOut}
          onLogout={handleLogout}
        />

        <DashboardModulesPanel
          registries={availableRegistries}
          onSelectRegistry={handleSelectRegistry}
        />
      </Box>
    </Box>
  );
}
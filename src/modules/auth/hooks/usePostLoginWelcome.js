import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import routes from "../../../app/routes";
import { useAuth } from "../../../hooks/useAuth";
import {
  clearPostLoginWelcomeFlag,
  getStoredAuthSession,
} from "../../../utils/storage";
import { getAuthUserDisplayName } from "../helpers/auth.helper";

const POST_LOGIN_REDIRECT_DELAY_MS = 2200;

const loadingMessages = [
  "Verificando permisos de acceso...",
  "Preparando módulos disponibles...",
  "Cargando tu espacio de trabajo...",
];

export function usePostLoginWelcome() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [messageIndex, setMessageIndex] = useState(0);

  const sessionUser = useMemo(() => {
    return user || getStoredAuthSession().user;
  }, [user]);

  const displayName = getAuthUserDisplayName(sessionUser);
  const currentMessage = loadingMessages[messageIndex];

  useEffect(() => {
    const messageTimer = window.setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 620);

    const redirectTimer = window.setTimeout(() => {
      clearPostLoginWelcomeFlag();
      navigate(routes.dashboard, { replace: true });
    }, POST_LOGIN_REDIRECT_DELAY_MS);

    return () => {
      window.clearInterval(messageTimer);
      window.clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return {
    currentMessage,
    displayName,
    redirectDelayMs: POST_LOGIN_REDIRECT_DELAY_MS,
  };
}
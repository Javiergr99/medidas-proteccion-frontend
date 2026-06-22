import { useCallback, useEffect, useRef, useState } from "react";

import {
  getEmptyMedidasCatalogos,
  getMedidasCatalogosRequest,
} from "../services/catalogos.service";

const INITIAL_STATE = {
  catalogos: getEmptyMedidasCatalogos(),
  loading: false,
  error: "",
  hasLoaded: false,
};

function getCatalogosErrorMessage(error) {
  const status = error?.response?.status;
  const detail = error?.response?.data?.detail;

  if (status === 404) {
    return "No fue posible cargar los catálogos. Verifica que el backend de Medidas de Protección esté activo y que exista el endpoint /catalogos/.";
  }

  if (status === 401 || status === 403) {
    return "Tu sesión no tiene permisos para consultar los catálogos o expiró. Inicia sesión nuevamente.";
  }

  if (status >= 500) {
    return "El servidor presentó un problema al cargar los catálogos. Intenta nuevamente en unos momentos.";
  }

  if (typeof detail === "string" && detail.trim() && detail !== "Not Found") {
    return detail;
  }

  if (error?.code === "ERR_NETWORK") {
    return "No fue posible conectar con el backend de Medidas de Protección. Verifica que el servidor esté encendido.";
  }

  return "No fue posible cargar los catálogos. Verifica la conexión con el backend.";
}

export function useMedidasCatalogos() {
  const [state, setState] = useState(INITIAL_STATE);
  const hasRequestedRef = useRef(false);

  const loadCatalogos = useCallback(async ({ force = false } = {}) => {
    if (hasRequestedRef.current && !force) {
      return;
    }

    hasRequestedRef.current = true;

    try {
      setState((prevState) => ({
        ...prevState,
        loading: true,
        error: "",
      }));

      const catalogos = await getMedidasCatalogosRequest();

      setState({
        catalogos,
        loading: false,
        error: "",
        hasLoaded: true,
      });
    } catch (error) {
      console.error("Error al cargar catálogos de Medidas:", error);

      setState((prevState) => ({
        ...prevState,
        catalogos: prevState.catalogos || getEmptyMedidasCatalogos(),
        loading: false,
        error: getCatalogosErrorMessage(error),
        hasLoaded: true,
      }));
    }
  }, []);

  useEffect(() => {
    loadCatalogos();
  }, [loadCatalogos]);

  return {
    ...state,
    reloadCatalogos: () => loadCatalogos({ force: true }),
  };
}
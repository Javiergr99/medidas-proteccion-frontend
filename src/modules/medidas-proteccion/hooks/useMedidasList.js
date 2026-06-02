import { useCallback, useEffect, useMemo, useReducer } from "react";

import { getErrorMessage } from "../../auth/helpers/auth.helper";
import {
  MEDIDAS_ESTADOS,
  MEDIDAS_ITEMS_PER_PAGE,
  MEDIDAS_LIST_FILTER_INITIAL_STATE,
} from "../constants/medidas.constants";
import { fetchMedidasRegistros } from "../services/medidas.service";

const MEDIDAS_LIST_ACTIONS = {
  FETCH_STARTED: "FETCH_STARTED",
  FETCH_SUCCEEDED: "FETCH_SUCCEEDED",
  FETCH_FAILED: "FETCH_FAILED",
  SET_FILTER: "SET_FILTER",
  CLEAR_FILTERS: "CLEAR_FILTERS",
  SET_PAGE: "SET_PAGE",
};

const initialState = {
  records: [],
  filters: MEDIDAS_LIST_FILTER_INITIAL_STATE,
  page: 1,
  loading: false,
  errorMessage: "",
  hasLoaded: false,
};

function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function includesText(source, searchValue) {
  const normalizedSearch = normalizeText(searchValue);

  if (!normalizedSearch) {
    return true;
  }

  return normalizeText(source).includes(normalizedSearch);
}

function getDateInputValue(value) {
  if (!value) return "";

  return String(value).slice(0, 10);
}

function matchesRecordFilters(record, filters) {
  const matchesId = includesText(record.id, filters.id);
  const matchesName = includesText(
    record.nombre_completo,
    filters.nombre_completo
  );
  const matchesStatus =
    !filters.estado_actual || record.estado_actual === filters.estado_actual;
  const matchesPlace = includesText(
    record.lugar_apertura,
    filters.lugar_apertura
  );
  const matchesAge = includesText(record.edad, filters.edad);
  const matchesSex = includesText(record.sexo, filters.sexo);
  const matchesCountry = includesText(
    record.pais_residencia,
    filters.pais_residencia
  );
  const matchesDate =
    !filters.fecha || getDateInputValue(record.fecha) === filters.fecha;
  const matchesMigrationQuality = includesText(
    record.calidad_migratoria,
    filters.calidad_migratoria
  );

  return (
    matchesId &&
    matchesName &&
    matchesStatus &&
    matchesPlace &&
    matchesAge &&
    matchesSex &&
    matchesCountry &&
    matchesDate &&
    matchesMigrationQuality
  );
}

function buildSummary(records) {
  return {
    total: records.length,
    enCaptura: records.filter(
      (record) => record.estado_actual === MEDIDAS_ESTADOS.EN_CAPTURA
    ).length,
    enRevision: records.filter(
      (record) => record.estado_actual === MEDIDAS_ESTADOS.EN_REVISION
    ).length,
    revisados: records.filter(
      (record) => record.estado_actual === MEDIDAS_ESTADOS.REVISADO
    ).length,
  };
}

function medidasListReducer(state, action) {
  switch (action.type) {
    case MEDIDAS_LIST_ACTIONS.FETCH_STARTED:
      return {
        ...state,
        loading: true,
        errorMessage: "",
      };

    case MEDIDAS_LIST_ACTIONS.FETCH_SUCCEEDED:
      return {
        ...state,
        records: action.payload,
        loading: false,
        errorMessage: "",
        hasLoaded: true,
        page: 1,
      };

    case MEDIDAS_LIST_ACTIONS.FETCH_FAILED:
      return {
        ...state,
        loading: false,
        errorMessage: action.payload,
        hasLoaded: true,
      };

    case MEDIDAS_LIST_ACTIONS.SET_FILTER:
      return {
        ...state,
        page: 1,
        filters: {
          ...state.filters,
          [action.name]: action.value,
        },
      };

    case MEDIDAS_LIST_ACTIONS.CLEAR_FILTERS:
      return {
        ...state,
        page: 1,
        filters: MEDIDAS_LIST_FILTER_INITIAL_STATE,
      };

    case MEDIDAS_LIST_ACTIONS.SET_PAGE:
      return {
        ...state,
        page: action.page,
      };

    default:
      return state;
  }
}

export function useMedidasList({ canRead }) {
  const [state, dispatch] = useReducer(medidasListReducer, initialState);

  const loadRecords = useCallback(async () => {
    if (!canRead) return;

    try {
      dispatch({
        type: MEDIDAS_LIST_ACTIONS.FETCH_STARTED,
      });

      const records = await fetchMedidasRegistros();

      dispatch({
        type: MEDIDAS_LIST_ACTIONS.FETCH_SUCCEEDED,
        payload: records,
      });
    } catch (error) {
      dispatch({
        type: MEDIDAS_LIST_ACTIONS.FETCH_FAILED,
        payload: getErrorMessage(
          error,
          "No fue posible cargar los registros de Medidas de Protección."
        ),
      });
    }
  }, [canRead]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const filteredRecords = useMemo(() => {
    return state.records.filter((record) =>
      matchesRecordFilters(record, state.filters)
    );
  }, [state.filters, state.records]);

  const summary = useMemo(() => {
    return buildSummary(state.records);
  }, [state.records]);

  const hasActiveFilters = useMemo(() => {
    return Object.values(state.filters).some((value) => Boolean(value));
  }, [state.filters]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredRecords.length / MEDIDAS_ITEMS_PER_PAGE)
  );

  const currentPage = Math.min(state.page, pageCount);

  const visibleRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * MEDIDAS_ITEMS_PER_PAGE;
    const endIndex = startIndex + MEDIDAS_ITEMS_PER_PAGE;

    return filteredRecords.slice(startIndex, endIndex);
  }, [currentPage, filteredRecords]);

  const startRecord =
    filteredRecords.length > 0
      ? (currentPage - 1) * MEDIDAS_ITEMS_PER_PAGE + 1
      : 0;

  const endRecord = Math.min(
    currentPage * MEDIDAS_ITEMS_PER_PAGE,
    filteredRecords.length
  );

  function setFilter(name, value) {
    dispatch({
      type: MEDIDAS_LIST_ACTIONS.SET_FILTER,
      name,
      value,
    });
  }

  function clearFilters() {
    dispatch({
      type: MEDIDAS_LIST_ACTIONS.CLEAR_FILTERS,
    });
  }

  function setPage(page) {
    dispatch({
      type: MEDIDAS_LIST_ACTIONS.SET_PAGE,
      page,
    });
  }

  return {
    clearFilters,
    currentPage,
    endRecord,
    errorMessage: state.errorMessage,
    filters: state.filters,
    filteredRecords,
    hasActiveFilters,
    hasLoaded: state.hasLoaded,
    loadRecords,
    loading: state.loading,
    pageCount,
    records: state.records,
    setFilter,
    setPage,
    startRecord,
    summary,
    visibleRecords,
  };
}
import { useCallback, useState } from "react";

import { getErrorMessage } from "../../../utils/errorMessage";
import { verifyNnaRequest } from "../services/nna.service";
import {
  getVerificationSuccessMessage,
  NNA_VERIFICATION_STATUS,
} from "../utils/nnaVerification.utils";

const INITIAL_STATE = {
  status: NNA_VERIFICATION_STATUS.IDLE,
  message: "",
  nna: null,
  registrosPrevios: [],
  error: "",
};

export function useNnaVerification() {
  const [state, setState] = useState(INITIAL_STATE);

  const resetVerification = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const verifyNna = useCallback(async (payload) => {
    try {
      setState({
        ...INITIAL_STATE,
        status: NNA_VERIFICATION_STATUS.VERIFYING,
      });

      const response = await verifyNnaRequest(payload);

      const nextStatus = response?.existe
        ? NNA_VERIFICATION_STATUS.EXISTING
        : NNA_VERIFICATION_STATUS.AVAILABLE;

      setState({
        status: nextStatus,
        message: getVerificationSuccessMessage(response),
        nna: response?.nna || null,
        registrosPrevios: response?.registros_previos || [],
        error: "",
      });

      return {
        ok: true,
        response,
        status: nextStatus,
      };
    } catch (error) {
      const status = error?.response?.status;
      const responseData = error?.response?.data || {};
      const message = getErrorMessage(
        error,
        "No fue posible verificar la existencia del NNA."
      );

      if (status === 409) {
        const isExistingMpRecord =
          responseData?.code === "NNA_ALREADY_IN_MP" &&
          Boolean(responseData?.registro_id);

        /*
         * Cuando el NNA ya tiene expediente MP, no pintamos el estado
         * bloqueado. MedidasCreatePage recibirá el UUID y redirigirá
         * directamente al expediente existente.
         */
        if (isExistingMpRecord) {
          return {
            ok: false,
            blocked: false,
            existingMpRecord: true,
            error,
            response: responseData,
            status,
            message,
          };
        }

        setState({
          ...INITIAL_STATE,
          status: NNA_VERIFICATION_STATUS.BLOCKED,
          message,
          error: message,
        });

        return {
          ok: false,
          blocked: true,
          existingMpRecord: false,
          error,
          response: responseData,
          status,
          message,
        };
      }

      setState({
        ...INITIAL_STATE,
        status: NNA_VERIFICATION_STATUS.ERROR,
        message,
        error: message,
      });

      return {
        ok: false,
        blocked: false,
        error,
        response: responseData,
        status,
        message,
      };
    }
  }, []);

  return {
    ...state,
    isVerifying: state.status === NNA_VERIFICATION_STATUS.VERIFYING,
    isVerified:
      state.status === NNA_VERIFICATION_STATUS.AVAILABLE ||
      state.status === NNA_VERIFICATION_STATUS.EXISTING,
    isBlocked: state.status === NNA_VERIFICATION_STATUS.BLOCKED,
    verifyNna,
    resetVerification,
  };
}
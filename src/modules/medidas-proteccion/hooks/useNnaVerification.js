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
      const message = getErrorMessage(
        error,
        "No fue posible verificar la existencia del NNA."
      );

      if (status === 409) {
        setState({
          ...INITIAL_STATE,
          status: NNA_VERIFICATION_STATUS.BLOCKED,
          message,
          error: message,
        });

        return {
          ok: false,
          blocked: true,
          error,
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
import { useCallback, useState } from "react";
import { getErrorMessage, isNetworkError, isAuthError } from "@/constants/error-messages";

interface UseAsyncErrorState {
  error: Error | null;
  isLoading: boolean;
}

interface UseAsyncErrorOptions {
  onError?: (error: Error) => void;
  onSuccess?: () => void;
}

/**
 * Hook for handling async errors in components
 * Manages error state and provides utilities for error handling
 */
export function useAsyncError(options: UseAsyncErrorOptions = {}) {
  const { onError, onSuccess } = options;
  const [state, setState] = useState<UseAsyncErrorState>({
    error: null,
    isLoading: false,
  });

  /**
   * Execute async function with error handling
   */
  const execute = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T | null> => {
      try {
        setState({ error: null, isLoading: true });
        const result = await fn();
        setState({ error: null, isLoading: false });
        onSuccess?.();
        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        setState({ error: err, isLoading: false });
        onError?.(err);
        return null;
      }
    },
    [onError, onSuccess]
  );

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  /**
   * Get user-friendly error message
   */
  const getErrorText = useCallback(() => {
    if (!state.error) return "";
    return getErrorMessage(state.error);
  }, [state.error]);

  /**
   * Check error type
   */
  const isNetworkErr = useCallback(() => {
    return state.error ? isNetworkError(state.error) : false;
  }, [state.error]);

  const isAuthErr = useCallback(() => {
    return state.error ? isAuthError(state.error) : false;
  }, [state.error]);

  return {
    ...state,
    execute,
    clearError,
    getErrorText,
    isNetworkErr,
    isAuthErr,
  };
}

export default useAsyncError;

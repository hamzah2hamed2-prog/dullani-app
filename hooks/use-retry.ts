import { useCallback, useRef, useState } from "react";
import { isRetryableError } from "@/constants/error-messages";

interface UseRetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number, error: Error) => void;
  onMaxRetriesExceeded?: (error: Error) => void;
}

interface UseRetryState {
  isRetrying: boolean;
  retryCount: number;
  lastError: Error | null;
}

/**
 * Hook for retry logic with exponential backoff
 * Automatically retries failed operations with increasing delays
 */
export function useRetry(options: UseRetryOptions = {}) {
  const {
    maxRetries = 3,
    initialDelayMs = 1000,
    maxDelayMs = 10000,
    backoffMultiplier = 2,
    onRetry,
    onMaxRetriesExceeded,
  } = options;

  const [state, setState] = useState<UseRetryState>({
    isRetrying: false,
    retryCount: 0,
    lastError: null,
  });

  const timeoutRef = useRef<NodeJS.Timeout>();

  /**
   * Calculate delay with exponential backoff
   */
  const calculateDelay = useCallback(
    (attempt: number): number => {
      const delay = initialDelayMs * Math.pow(backoffMultiplier, attempt - 1);
      return Math.min(delay, maxDelayMs);
    },
    [initialDelayMs, maxDelayMs, backoffMultiplier]
  );

  /**
   * Execute function with retry logic
   */
  const executeWithRetry = useCallback(
    async <T,>(fn: () => Promise<T>): Promise<T> => {
      let lastError: Error | null = null;
      let attempt = 0;

      while (attempt < maxRetries) {
        try {
          setState((prev) => ({
            ...prev,
            isRetrying: attempt > 0,
            retryCount: attempt,
          }));

          const result = await fn();
          setState((prev) => ({
            ...prev,
            isRetrying: false,
            retryCount: 0,
            lastError: null,
          }));
          return result;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));

          // Check if error is retryable
          if (!isRetryableError(lastError)) {
            setState((prev) => ({
              ...prev,
              isRetrying: false,
              lastError,
            }));
            throw lastError;
          }

          attempt++;

          // If max retries exceeded, throw error
          if (attempt >= maxRetries) {
            setState((prev) => ({
              ...prev,
              isRetrying: false,
              lastError,
            }));
            onMaxRetriesExceeded?.(lastError);
            throw lastError;
          }

          // Calculate delay and wait
          const delay = calculateDelay(attempt);
          onRetry?.(attempt, lastError);

          await new Promise((resolve) => {
            timeoutRef.current = setTimeout(resolve, delay);
          });
        }
      }

      throw lastError || new Error("Unknown error");
    },
    [maxRetries, calculateDelay, onRetry, onMaxRetriesExceeded]
  );

  /**
   * Reset retry state
   */
  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setState({
      isRetrying: false,
      retryCount: 0,
      lastError: null,
    });
  }, []);

  /**
   * Cancel pending retry
   */
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setState((prev) => ({
      ...prev,
      isRetrying: false,
    }));
  }, []);

  return {
    ...state,
    executeWithRetry,
    reset,
    cancel,
  };
}

export default useRetry;

"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseResilientFetchOptions<TResponse> {
  /** Request input passed to fetch */
  input: RequestInfo | URL;
  /** Additional fetch configuration */
  init?: RequestInit;
  /** Optional transform applied to the successful response */
  parser?: (response: Response) => Promise<TResponse>;
  /** Number of retry attempts before surfacing an error */
  retryCount?: number;
  /** Base delay in milliseconds (exponential backoff) */
  retryDelayMs?: number;
  /** Abort the request when the component unmounts */
  abortOnUnmount?: boolean;
  /** When false, skip the initial fetch until `refetch` is called */
  enabled?: boolean;
}

type FetchOverride = {
  input?: RequestInfo | URL;
  init?: RequestInit;
};

interface UseResilientFetchState<TResponse> {
  data: TResponse | null;
  loading: boolean;
  error: Error | null;
  refetch: (override?: FetchOverride) => Promise<TResponse | null>;
}

const DEFAULT_RETRY_COUNT = 3;
const DEFAULT_RETRY_DELAY_MS = 750;

export function useResilientFetch<TResponse>(
  options: UseResilientFetchOptions<TResponse>
): UseResilientFetchState<TResponse> {
  const {
    input,
    init,
    parser = (res: Response) => res.json() as Promise<TResponse>,
    retryCount = DEFAULT_RETRY_COUNT,
    retryDelayMs = DEFAULT_RETRY_DELAY_MS,
    abortOnUnmount = true,
    enabled = true,
  } = options;

  const [data, setData] = useState<TResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<Error | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const retriesRef = useRef<number>(0);
  const onlineListenerRef = useRef<(() => void) | null>(null);
  const isMountedRef = useRef<boolean>(true);
  const lastRequestRef = useRef<{ input: RequestInfo | URL; init?: RequestInit }>(
    { input, init }
  );

  const clearAbortController = () => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  };

  const detachOnlineListener = () => {
    const listener = onlineListenerRef.current;
    if (listener) {
      window.removeEventListener("online", listener);
      onlineListenerRef.current = null;
    }
  };

  const executeFetch = useCallback(async (override?: FetchOverride) => {
    clearAbortController();
    detachOnlineListener();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const requestInput = override?.input ?? lastRequestRef.current.input ?? input;
    const requestInit = override?.init ?? lastRequestRef.current.init ?? init;
    lastRequestRef.current = { input: requestInput, init: requestInit };

    const scheduleOnlineRetry = () => {
      if (typeof window === "undefined") {
        return;
      }

      if (onlineListenerRef.current) {
        return;
      }

      const handleOnline = () => {
        if (!isMountedRef.current) return;
        window.removeEventListener("online", handleOnline);
        onlineListenerRef.current = null;
        retriesRef.current = 0;
        void executeFetch(lastRequestRef.current);
      };

      onlineListenerRef.current = handleOnline;
      window.addEventListener("online", handleOnline, { once: true });
    };

    const isNavigatorDefined = typeof navigator !== "undefined";
    const isOffline = isNavigatorDefined && navigator.onLine === false;

    if (isOffline) {
      const offlineError = new Error(
        "No internet connection. Please check your network and try again."
      );
      retriesRef.current = retryCount;
      setError(offlineError);
      setLoading(false);
      scheduleOnlineRetry();
      return null;
    }

    setLoading(true);
    setError(null);

    let result: TResponse | null = null;

    try {
      const response = await fetch(requestInput, {
        cache: "no-store",
        ...requestInit,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Fetch failed with status ${response.status}`);
      }

      const parsed = await parser(response);
      if (isMountedRef.current) {
        setData(parsed);
        setError(null);
      }
      result = parsed;
    } catch (err) {
      if (!isMountedRef.current || controller.signal.aborted) {
        return result;
      }

      const nextError = err instanceof Error ? err : new Error("Fetch failed");
      setError(nextError);

      if (retriesRef.current < retryCount) {
        const attempt = retriesRef.current + 1;
        retriesRef.current = attempt;
        const delay = retryDelayMs * Math.pow(2, attempt - 1);
        window.setTimeout(() => {
          if (isMountedRef.current) {
            void executeFetch(lastRequestRef.current);
          }
        }, delay);
      }

      scheduleOnlineRetry();
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
    return result;
  }, [input, init, parser, retryCount, retryDelayMs]);

  const refetch = useCallback(
    async (override?: FetchOverride) => {
      retriesRef.current = 0;
      return await executeFetch(override ?? lastRequestRef.current);
    },
    [executeFetch]
  );

  useEffect(() => {
    lastRequestRef.current = { input, init };
  }, [input, init]);

  useEffect(() => {
    isMountedRef.current = true;
    retriesRef.current = 0;

    if (enabled) {
      void executeFetch();
    } else {
      setLoading(false);
      if (abortOnUnmount) {
        clearAbortController();
      }
    }

    return () => {
      isMountedRef.current = false;
      detachOnlineListener();
      if (abortOnUnmount) {
        clearAbortController();
      }
    };
  }, [executeFetch, abortOnUnmount, enabled]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}

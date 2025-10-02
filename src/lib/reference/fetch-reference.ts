import { resolveInternalApiBase } from "@/lib/internal-api-base";
import { logError, logInfo } from "@/lib/logger";
import type { ListingDetails } from "@/types/property";

export interface ReferenceLookupResult {
  reference: string;
  url: string;
  isValid: boolean;
  source: "api" | "cache";
  cachedAt?: string;
  propertyData?: ListingDetails | null;
  error?: string;
  statusCode?: number;
}

interface LookupOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 6000;
const MAX_LOOKUP_ATTEMPTS = 2;
const RETRY_DELAY_MS = 150;

export async function fetchReferenceLookup(
  reference: string,
  options: LookupOptions = {}
): Promise<ReferenceLookupResult> {
  const { signal, timeoutMs = DEFAULT_TIMEOUT_MS } = options;
  const cleanReference = reference.trim();

  if (!cleanReference) {
    return {
      reference: "",
      url: "",
      isValid: false,
      source: "api",
      error: "Please enter a reference number",
    };
  }

  const isServer = typeof window === "undefined";
  const baseUrl = resolveInternalApiBase(isServer);
  const fetchUrl = `${baseUrl}/api/reference?ref=${encodeURIComponent(cleanReference)}`;
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= MAX_LOOKUP_ATTEMPTS; attempt++) {
    const supportsAbortController = typeof AbortController !== "undefined";
    const controller = supportsAbortController ? new AbortController() : null;

    if (controller && signal) {
      if (signal.aborted) {
        controller.abort();
      } else {
        signal.addEventListener("abort", () => controller.abort(), { once: true });
      }
    }

    const timeoutId = controller
      ? setTimeout(() => {
          controller.abort();
        }, timeoutMs)
      : null;

    try {
      const response = await fetch(fetchUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        signal: controller?.signal ?? signal,
      });

      const payload = (await response.json()) as ReferenceLookupResult;

      if (!response.ok) {
        logError("Reference lookup returned non-OK response", null, {
          component: "ReferenceLookup",
          reference: cleanReference,
          status: response.status,
        });

        return {
          ...payload,
          isValid: false,
          source: payload.source ?? "api",
          error: payload.error ?? "Reference lookup failed",
          statusCode: payload.statusCode ?? response.status,
        };
      }

      logInfo("Reference lookup succeeded", {
        component: "ReferenceLookup",
        reference: cleanReference,
        source: payload.source,
      });

      return {
        ...payload,
        statusCode: payload.statusCode ?? response.status,
      };
    } catch (error) {
      lastError = error;
      logError("Reference lookup attempt failed", error, {
        component: "ReferenceLookup",
        reference: cleanReference,
        attempt,
      });

      if (attempt === MAX_LOOKUP_ATTEMPTS) {
        break;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, attempt * RETRY_DELAY_MS)
      );
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  const message =
    lastError instanceof Error ? lastError.message : "Reference lookup failed";

  return {
    reference: cleanReference,
    url: "",
    isValid: false,
    source: "api",
    error: message,
    statusCode: undefined,
  };
}

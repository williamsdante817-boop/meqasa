import { resolveInternalApiBase } from "@/lib/internal-api-base";
import type { UnitDetails } from "@/lib/get-unit-details";
import { cleanUnitReference } from "@/lib/unit-reference-url-generator";

export interface UnitReferenceLookupResult {
  reference: string;
  url: string;
  isValid: boolean;
  source: "api" | "cache";
  cachedAt?: string;
  unitData?: UnitDetails | null;
  error?: string;
  statusCode?: number;
}

interface LookupOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 6000;

export async function fetchUnitReferenceLookup(
  reference: string,
  options: LookupOptions = {}
): Promise<UnitReferenceLookupResult> {
  const { signal, timeoutMs = DEFAULT_TIMEOUT_MS } = options;
  const cleanRef = cleanUnitReference(reference);

  if (!cleanRef) {
    return {
      reference: reference.trim(),
      url: "",
      isValid: false,
      source: "api",
      error: "Please enter a unit reference number",
      statusCode: 400,
    };
  }

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
    ? setTimeout(() => controller.abort(), timeoutMs)
    : null;

  const isServer = typeof window === "undefined";
  const baseUrl = resolveInternalApiBase(isServer);
  const fetchUrl = `${baseUrl}/api/unit-reference?ref=${encodeURIComponent(cleanRef)}`;

  try {
    const response = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller?.signal ?? signal,
    });

    const payload = (await response.json()) as UnitReferenceLookupResult;

    if (!response.ok) {
      return {
        ...payload,
        isValid: false,
        source: payload.source ?? "api",
        statusCode: payload.statusCode ?? response.status,
        error: payload.error ?? "Unit reference lookup failed",
      };
    }

    return {
      ...payload,
      statusCode: payload.statusCode ?? response.status,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unit reference lookup failed";
    return {
      reference: cleanRef,
      url: "",
      isValid: false,
      source: "api",
      error: message,
      statusCode: undefined,
    };
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

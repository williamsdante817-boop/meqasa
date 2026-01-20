import type { UnitDetails } from "@/lib/get-unit-details";
import {
  cleanUnitReference,
  constructUnitUrlFromData,
  generateGenericUnitSlug,
} from "@/lib/unit-reference-url-generator";

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
const MEQASA_UNIT_ENDPOINT = "https://meqasa.com/developer-units/details";

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
      signal.addEventListener("abort", () => controller.abort(), {
        once: true,
      });
    }
  }

  const timeoutId = controller
    ? setTimeout(() => controller.abort(), timeoutMs)
    : null;

  // Direct call to Meqasa API (server-side only)
  const slug = generateGenericUnitSlug(cleanRef).replace(
    "/developer-unit/",
    ""
  );
  const fetchUrl = `${MEQASA_UNIT_ENDPOINT}/${slug}?app=vercel`;

  try {
    const response = await fetch(fetchUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller?.signal ?? signal,
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    if (!response.ok) {
      return {
        reference: cleanRef,
        url: "",
        isValid: false,
        source: "api",
        error: "Unit reference lookup failed",
        statusCode: response.status,
      };
    }

    const unitData = (await response.json()) as UnitDetails & {
      status?: string;
      msg?: string;
    };

    if ("status" in unitData && unitData.status === "fail") {
      return {
        reference: cleanRef,
        url: "",
        isValid: false,
        source: "api",
        error: unitData.msg ?? "Unit not available",
        statusCode: 404,
      };
    }

    const urlPath = constructUnitUrlFromData(unitData as UnitDetails);

    return {
      reference: cleanRef.toUpperCase(),
      url: urlPath,
      isValid: true,
      source: "api",
      cachedAt: new Date().toISOString(),
      unitData: unitData as UnitDetails,
      statusCode: 200,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unit reference lookup failed";
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

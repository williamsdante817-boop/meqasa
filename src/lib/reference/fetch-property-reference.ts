import type { ListingDetails } from "@/types/property";

const MEQASA_REFERENCE_ENDPOINT = "https://meqasa.com/mqrouter/ref";

export interface PropertyReferenceLookupResult {
  reference: string;
  url: string;
  isValid: boolean;
  propertyData?: ListingDetails | null;
  error?: string;
  statusCode?: number;
}

function normalizeReference(reference: string | null): string | null {
  if (!reference) return null;
  const clean = reference.replace(/[^a-zA-Z0-9]/g, "").trim();
  if (!clean || clean.length > 20 || /^0+$/.test(clean)) return null;
  return clean.toUpperCase();
}

function buildPropertyUrl(data: ListingDetails, fallbackRef: string): string {
  const {
    detailreq,
    type = "property",
    contract = "rent",
    location = "Ghana",
    locationstring,
    listingid,
  } = data;

  if (detailreq) {
    const cleanPath = detailreq.replace(/^https?:\/\/[^/]+\//, "");
    if (/^\/listings\/[a-zA-Z0-9-_]+/.test(cleanPath)) {
      return cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
    }
  }

  const locationName = locationstring || location;
  const typeSlug = type.toLowerCase().replace(/\s+/g, "-");
  const contractSlug = contract.toLowerCase();
  const locationSlug = locationName
    .split(" ")
    .join("-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .toLowerCase();

  const id = listingid ?? fallbackRef;
  return `/listings/${typeSlug}-for-${contractSlug}-at-${locationSlug}-${id}`;
}

/**
 * Server-side function to lookup property by reference
 * Calls Meqasa API directly (no proxy needed)
 */
export async function fetchPropertyReferenceLookup(
  reference: string
): Promise<PropertyReferenceLookupResult> {
  const normalized = normalizeReference(reference);

  if (!normalized) {
    return {
      reference: reference ?? "",
      url: "",
      isValid: false,
      error:
        "Invalid or missing reference. Use only letters and numbers (max 20).",
      statusCode: 400,
    };
  }

  try {
    const response = await fetch(MEQASA_REFERENCE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ refref: normalized, app: "vercel" }),
      next: { revalidate: 1800 }, // Cache for 30 minutes
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Upstream error: ${response.status}`);
    }

    const payload = (await response.json()) as
      | ListingDetails
      | { status?: string; msg?: string };

    if ("status" in payload && payload.status === "fail") {
      return {
        reference: normalized,
        url: "",
        isValid: false,
        error: payload.msg ?? "Listing not available",
        statusCode: 404,
      };
    }

    const listingDetails = payload as ListingDetails;
    const urlPath = buildPropertyUrl(listingDetails, normalized);

    return {
      reference: normalized,
      url: urlPath,
      isValid: true,
      propertyData: listingDetails,
      statusCode: 200,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Reference lookup failed";
    const status =
      message.includes("not available") || message.includes("not found")
        ? 404
        : 502;

    return {
      reference: normalized,
      url: "",
      isValid: false,
      error:
        status === 404
          ? "Property not found. Please check the reference number."
          : message,
      statusCode: status,
    };
  }
}

import { logError, logInfo } from "@/lib/logger";
import {
  MEQASA_RENT_PERIODS,
  MEQASA_SHORT_LET_DURATIONS,
  MEQASA_SORT_OPTIONS,
} from "@/lib/search/constants";
import { isShortLetQuery } from "@/lib/search/short-let";
import type {
  MeqasaLoadMoreParams,
  MeqasaSearchParams,
  MeqasaSearchResponse,
} from "@/types/meqasa";

const MEQASA_API_BASE = "https://meqasa.com";

const VALID_PROPERTY_TYPES = [
  "apartment",
  "house",
  "office",
  "warehouse",
  "townhouse",
  "land",
  "shop",
  "retail",
  "commercial space",
  "guest house",
  "beach house",
  "hotel",
  "studio apartment",
] as const;

function mapPropertyTypeForAPI(propertyType: string): string {
  const propertyTypeMap: Record<string, string> = {
    "beach house": "Beachhouse",
  };
  return propertyTypeMap[propertyType] || propertyType;
}

/**
 * Server-side function to search properties directly from Meqasa API
 * Use this in Server Components only
 */
export async function searchPropertiesServer(
  contract: string,
  locality: string,
  params: MeqasaSearchParams
): Promise<MeqasaSearchResponse> {
  const requestStartTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

  try {
    const postParams = new URLSearchParams();
    postParams.set("app", "vercel");

    const isShortLet = isShortLetQuery(params);
    let finalUrl: string;

    if (isShortLet) {
      finalUrl = `${MEQASA_API_BASE}/short-lease-properties-for-rent-in-${locality}`;
    } else if (
      params.ftype &&
      VALID_PROPERTY_TYPES.includes(params.ftype) &&
      params.ftype !== "beach house" &&
      params.ftype !== "commercial space" &&
      params.ftype !== "guest house" &&
      params.ftype !== "studio apartment"
    ) {
      const mappedPropertyType = mapPropertyTypeForAPI(params.ftype);
      const propertyTypeSlug = mappedPropertyType
        .toLowerCase()
        .replace(/\s+/g, "-");

      const pluralMap: Record<string, string> = {
        apartment: "apartments",
        house: "houses",
        office: "offices",
        warehouse: "warehouses",
        townhouse: "townhouses",
        villa: "villas",
        land: "lands",
        shop: "shops",
        hotel: "hotels",
        retail: "retails",
        "commercial-space": "commercial-spaces",
        "guest-house": "guest-houses",
        beachhouse: "beachhouse",
        "studio-apartment": "studio-apartments",
      };
      const pluralSlug = pluralMap[propertyTypeSlug] || propertyTypeSlug;

      finalUrl = `${MEQASA_API_BASE}/${pluralSlug}-for-${contract}-in-${locality}`;
    } else {
      finalUrl = `${MEQASA_API_BASE}/properties-for-${contract}-in-${locality}`;
    }

    if (params.fbeds && params.fbeds !== "- Any -") {
      const fbedsNum = Number(params.fbeds);
      if (!isNaN(fbedsNum)) {
        postParams.set("fbeds", String(fbedsNum));
      }
    }

    if (params.fbaths && params.fbaths !== "- Any -") {
      const fbathsNum = Number(params.fbaths);
      if (!isNaN(fbathsNum)) {
        postParams.set("fbaths", String(fbathsNum));
      }
    }

    if (params.fmin && Number(params.fmin) > 0) {
      postParams.set("fmin", String(params.fmin));
    }

    if (params.fmax && Number(params.fmax) > 0) {
      postParams.set("fmax", String(params.fmax));
    }

    if (params.fminarea && Number(params.fminarea) > 0) {
      postParams.set("fminarea", String(params.fminarea));
    }

    if (params.fmaxarea && Number(params.fmaxarea) > 0) {
      postParams.set("fmaxarea", String(params.fmaxarea));
    }

    if (params.fisfurnished === "1") {
      postParams.set("fisfurnished", "1");
    }

    if (params.ffsbo === "1") {
      postParams.set("ffsbo", "1");
    }

    if (params.frentperiod && MEQASA_RENT_PERIODS.includes(params.frentperiod)) {
      postParams.set("frentperiod", params.frentperiod);
    }

    if (params.fsort && MEQASA_SORT_OPTIONS.includes(params.fsort)) {
      postParams.set("fsort", params.fsort);
    }

    if (isShortLet) {
      postParams.set("frentperiod", "shortrent");
      postParams.set("ftype", "- Any -");

      if (
        params.fhowshort &&
        MEQASA_SHORT_LET_DURATIONS.includes(params.fhowshort)
      ) {
        postParams.set("fhowshort", params.fhowshort);
      }
    } else {
      if (params.ftype && VALID_PROPERTY_TYPES.includes(params.ftype)) {
        const mappedPropertyType = mapPropertyTypeForAPI(params.ftype);
        postParams.set("ftype", mappedPropertyType);
      }
    }

    if (!isShortLet && !postParams.has("ftype")) {
      postParams.set("ftype", "- Any -");
    }

    logInfo("Server-side search initiated", {
      requestId,
      url: finalUrl,
      contract,
      locality,
      isShortLet,
      component: "MeqasaServerUtil",
    });

    const backendRequestTime = Date.now();
    const actualRequestBody = Array.from(postParams.entries())
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    const response = await fetch(finalUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: actualRequestBody,
      cache: "no-store",
    });

    const backendDuration = Date.now() - backendRequestTime;

    if (!response.ok) {
      const errorText = await response.text();
      logError(
        "Meqasa API error - SEARCH",
        new Error(`Meqasa API error: ${response.statusText}`),
        {
          requestId,
          url: finalUrl,
          status: response.status,
          errorResponse: errorText,
          backendDuration: `${backendDuration}ms`,
          component: "MeqasaServerUtil",
        }
      );
      throw new Error(`Meqasa API error: ${response.statusText}`);
    }

    const raw = (await response.json()) as MeqasaSearchResponse & {
      resultcount?: number | string | null;
    };

    const normalized: MeqasaSearchResponse = {
      ...raw,
      resultcount: (() => {
        let count = raw.resultcount;
        if (typeof count === "string") {
          count = parseInt(count, 10);
        }
        if (typeof count === "number" && Number.isFinite(count)) {
          return count;
        }
        if (Array.isArray(raw.results)) {
          return raw.results.length;
        }
        return 0;
      })(),
    };

    const totalRequestTime = Date.now() - requestStartTime;

    logInfo("Server-side search completed", {
      requestId,
      searchId: normalized.searchid,
      totalResults: normalized.resultcount,
      returnedResults: normalized.results.length,
      totalDuration: `${totalRequestTime}ms`,
      component: "MeqasaServerUtil",
    });

    return normalized;
  } catch (error) {
    const totalRequestTime = Date.now() - requestStartTime;

    logError("Server-side search failed", error, {
      requestId,
      contract,
      locality,
      totalDuration: `${totalRequestTime}ms`,
      component: "MeqasaServerUtil",
    });

    throw error;
  }
}

/**
 * Server-side function to load more properties directly from Meqasa API
 * Use this in Server Components only
 */
export async function loadMorePropertiesServer(
  contract: string,
  locality: string,
  params: MeqasaLoadMoreParams & MeqasaSearchParams
): Promise<MeqasaSearchResponse> {
  const requestStartTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

  try {
    const { y: searchId, w: pageNumber, ...loadMoreParams } = params;

    if (!searchId || !pageNumber) {
      throw new Error("Missing required fields: searchId and pageNumber");
    }

    const postParams = new URLSearchParams();
    postParams.set("y", String(searchId));
    postParams.set("w", String(pageNumber));
    postParams.set("app", "vercel");

    const isShortLet = isShortLetQuery(loadMoreParams);
    let finalUrl: string;

    if (isShortLet) {
      finalUrl = `${MEQASA_API_BASE}/short-lease-properties-for-rent-in-${locality}`;
    } else if (
      loadMoreParams.ftype &&
      VALID_PROPERTY_TYPES.includes(loadMoreParams.ftype) &&
      loadMoreParams.ftype !== "beach house" &&
      loadMoreParams.ftype !== "commercial space" &&
      loadMoreParams.ftype !== "guest house" &&
      loadMoreParams.ftype !== "studio apartment"
    ) {
      const mappedPropertyType = mapPropertyTypeForAPI(loadMoreParams.ftype);
      const propertyTypeSlug = mappedPropertyType
        .toLowerCase()
        .replace(/\s+/g, "-");

      const pluralMap: Record<string, string> = {
        apartment: "apartments",
        house: "houses",
        office: "offices",
        warehouse: "warehouses",
        townhouse: "townhouses",
        villa: "villas",
        land: "lands",
        shop: "shops",
        hotel: "hotels",
        retail: "retails",
        "commercial-space": "commercial-spaces",
        "guest-house": "guest-houses",
        beachhouse: "beachhouse",
        "studio-apartment": "studio-apartments",
      };
      const pluralSlug = pluralMap[propertyTypeSlug] || propertyTypeSlug;

      finalUrl = `${MEQASA_API_BASE}/${pluralSlug}-for-${contract}-in-${locality}`;
    } else {
      finalUrl = `${MEQASA_API_BASE}/properties-for-${contract}-in-${locality}`;
    }

    if (
      loadMoreParams.ftype &&
      VALID_PROPERTY_TYPES.includes(loadMoreParams.ftype)
    ) {
      const mappedPropertyType = mapPropertyTypeForAPI(loadMoreParams.ftype);
      postParams.set("ftype", mappedPropertyType);
    }

    if (loadMoreParams.fbeds && loadMoreParams.fbeds !== "- Any -") {
      const fbedsNum = Number(loadMoreParams.fbeds);
      if (!isNaN(fbedsNum)) {
        postParams.set("fbeds", String(fbedsNum));
      }
    }

    if (loadMoreParams.fbaths && loadMoreParams.fbaths !== "- Any -") {
      const fbathsNum = Number(loadMoreParams.fbaths);
      if (!isNaN(fbathsNum)) {
        postParams.set("fbaths", String(fbathsNum));
      }
    }

    if (loadMoreParams.fmin && Number(loadMoreParams.fmin) > 0) {
      postParams.set("fmin", String(loadMoreParams.fmin));
    }

    if (loadMoreParams.fmax && Number(loadMoreParams.fmax) > 0) {
      postParams.set("fmax", String(loadMoreParams.fmax));
    }

    if (loadMoreParams.fminarea && Number(loadMoreParams.fminarea) > 0) {
      postParams.set("fminarea", String(loadMoreParams.fminarea));
    }

    if (loadMoreParams.fmaxarea && Number(loadMoreParams.fmaxarea) > 0) {
      postParams.set("fmaxarea", String(loadMoreParams.fmaxarea));
    }

    if (loadMoreParams.fisfurnished === "1") {
      postParams.set("fisfurnished", "1");
    }

    if (loadMoreParams.ffsbo === "1") {
      postParams.set("ffsbo", "1");
    }

    if (
      loadMoreParams.frentperiod &&
      MEQASA_RENT_PERIODS.includes(loadMoreParams.frentperiod)
    ) {
      postParams.set("frentperiod", loadMoreParams.frentperiod);
    }

    if (
      loadMoreParams.fsort &&
      MEQASA_SORT_OPTIONS.includes(loadMoreParams.fsort)
    ) {
      postParams.set("fsort", loadMoreParams.fsort);
    }

    if (isShortLet) {
      postParams.set("frentperiod", "shortrent");
      postParams.set("ftype", "- Any -");

      if (
        loadMoreParams.fhowshort &&
        MEQASA_SHORT_LET_DURATIONS.includes(loadMoreParams.fhowshort)
      ) {
        postParams.set("fhowshort", loadMoreParams.fhowshort);
      }
    }

    if (!isShortLet && !postParams.has("ftype")) {
      postParams.set("ftype", "- Any -");
    }

    logInfo("Server-side load more initiated", {
      requestId,
      url: finalUrl,
      searchId,
      pageNumber,
      component: "MeqasaServerUtil",
    });

    const backendRequestTime = Date.now();
    const actualRequestBody = Array.from(postParams.entries())
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    const response = await fetch(finalUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: actualRequestBody,
      cache: "no-store",
    });

    const backendDuration = Date.now() - backendRequestTime;

    if (!response.ok) {
      const errorText = await response.text();
      logError(
        "Meqasa API error - LOAD_MORE",
        new Error(`Meqasa API error: ${response.statusText}`),
        {
          requestId,
          url: finalUrl,
          status: response.status,
          errorResponse: errorText,
          backendDuration: `${backendDuration}ms`,
          component: "MeqasaServerUtil",
        }
      );
      throw new Error(`Meqasa API error: ${response.statusText}`);
    }

    const raw = (await response.json()) as MeqasaSearchResponse & {
      resultcount?: number | string | null;
    };

    const normalized: MeqasaSearchResponse = {
      ...raw,
      resultcount: (() => {
        let count = raw.resultcount;
        if (typeof count === "string") {
          count = parseInt(count, 10);
        }
        if (typeof count === "number" && Number.isFinite(count)) {
          return count;
        }
        if (Array.isArray(raw.results)) {
          return raw.results.length;
        }
        return 0;
      })(),
    };

    const totalRequestTime = Date.now() - requestStartTime;

    logInfo("Server-side load more completed", {
      requestId,
      searchId: normalized.searchid,
      pageNumber,
      returnedResults: normalized.results.length,
      totalDuration: `${totalRequestTime}ms`,
      component: "MeqasaServerUtil",
    });

    return normalized;
  } catch (error) {
    const totalRequestTime = Date.now() - requestStartTime;

    logError("Server-side load more failed", error, {
      requestId,
      contract,
      locality,
      totalDuration: `${totalRequestTime}ms`,
      component: "MeqasaServerUtil",
    });

    throw error;
  }
}

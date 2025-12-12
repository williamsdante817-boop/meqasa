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
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const MEQASA_API_BASE = "https://meqasa.com";

const isDebugLoggingEnabled = process.env.NODE_ENV !== "production";
const debugLog = (...args: Parameters<typeof console.log>) => {
  if (isDebugLoggingEnabled) {
    console.log(...args);
  }
};

// Valid contract types according to API docs
const VALID_CONTRACTS = ["rent", "sale"] as const;

// Valid property types according to API testing (all confirmed working)
const VALID_PROPERTY_TYPES = [
  "apartment", // ✅ 6,949 results
  "house", // ✅ 5,199 results
  "office", // ✅ 709 results
  "warehouse", // ✅ 125 results
  "townhouse", // ✅ 1,471 results
  "land", // ✅ 1 result
  "shop", // ✅ 363 results
  "retail", // ✅ 229 results
  "commercial space", // ✅ 203 results
  "guest house", // ✅ 13 results
  "beach house", // Frontend type (maps to "Beachhouse")
  "hotel", // ✅ 1 result
  "studio apartment", // ✅ 11 results
] as const;

interface RequestBody {
  type: "search" | "loadMore";
  params: (MeqasaSearchParams | MeqasaLoadMoreParams) & {
    contract: string;
    locality: string;
  };
}

// Map frontend property types to backend API types
function mapPropertyTypeForAPI(propertyType: string): string {
  const propertyTypeMap: Record<string, string> = {
    // Confirmed via API testing:
    // "guest house" -> works as-is (13 results)
    // "shop" -> works as-is (363 results)
    // "retail" -> works as-is (229 results)
    // "commercial space" -> works as-is

    // Only map the one that needs it:
    "beach house": "Beachhouse", // Frontend "beach house" -> Backend "Beachhouse" (5 results)
  };

  return propertyTypeMap[propertyType] || propertyType;
}

export async function POST(request: NextRequest) {
  const requestStartTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;

  // Extract request metadata for logging
  const userAgent = request.headers.get("user-agent") || "unknown";
  const referer = request.headers.get("referer") || "unknown";
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const contentType = request.headers.get("content-type") || "unknown";

  logInfo("API Request started", {
    requestId,
    method: "POST",
    url: "/api/properties",
    userAgent,
    referer,
    ip,
    contentType,
    timestamp: new Date().toISOString(),
    component: "PropertiesAPI",
  });

  try {
    const body = (await request.json()) as RequestBody;
    const { type, params } = body;

    logInfo("Request body parsed", {
      requestId,
      requestType: type,
      paramKeys: Object.keys(params),
      hasContract: !!params.contract,
      hasLocality: !!params.locality,
      component: "PropertiesAPI",
    });

    if (type === "search") {
      const { contract, locality, ...searchParams } =
        params as MeqasaSearchParams & {
          contract: string;
          locality: string;
        };

      // Validate required fields
      if (!contract || !locality) {
        return NextResponse.json(
          { error: "Missing required fields: contract and locality" },
          { status: 400 }
        );
      }

      // Validate contract type
      if (!VALID_CONTRACTS.includes(contract as "rent" | "sale")) {
        return NextResponse.json(
          { error: "Invalid contract type. Must be 'rent' or 'sale'" },
          { status: 400 }
        );
      }

      // Build POST parameters according to API docs
      const postParams = new URLSearchParams();
      postParams.set("app", "vercel");

      // Check if this is a short-let request
      const isShortLet = isShortLetQuery(searchParams);

      // Build URL - use property-type-specific endpoints when available for better result counts
      // Meqasa has two patterns:
      // 1. /apartments-for-rent-in-{location} (returns more results, e.g., 3734)
      // 2. /properties-for-rent-in-{location}?ftype=apartment (returns fewer, e.g., 2902)
      // We prefer pattern 1 when a specific property type is selected
      let finalUrl: string;
      
      if (isShortLet) {
        // Short-let always uses its specific endpoint
        finalUrl = `${MEQASA_API_BASE}/short-lease-properties-for-rent-in-${locality}`;
      } else if (searchParams.ftype && VALID_PROPERTY_TYPES.includes(searchParams.ftype) && searchParams.ftype !== 'beach house' && searchParams.ftype !== 'commercial space' && searchParams.ftype !== 'guest house' && searchParams.ftype !== 'studio apartment') {
        // Use property-type-specific endpoint when available (except types that don't have dedicated endpoints)
        const mappedPropertyType = mapPropertyTypeForAPI(searchParams.ftype);
        const propertyTypeSlug = mappedPropertyType.toLowerCase().replace(/\s+/g, '-');
        
        // Pluralize common property types for the URL
        const pluralMap: Record<string, string> = {
          'apartment': 'apartments',
          'house': 'houses',
          'office': 'offices',
          'warehouse': 'warehouses',
          'townhouse': 'townhouses',
          'villa': 'villas',
          'land': 'lands',
          'shop': 'shops',
          'hotel': 'hotels',
          'retail': 'retails',
          'commercial-space': 'commercial-spaces',
          'guest-house': 'guest-houses',
          'beachhouse': 'beachhouse',
          'studio-apartment': 'studio-apartments',
        };
        const pluralSlug = pluralMap[propertyTypeSlug] || propertyTypeSlug;
        
        finalUrl = `${MEQASA_API_BASE}/${pluralSlug}-for-${contract}-in-${locality}`;
        // Don't add ftype to POST params when using specific endpoint
      } else {
        // Generic endpoint when no specific property type
        finalUrl = `${MEQASA_API_BASE}/properties-for-${contract}-in-${locality}`;
      }

      if (searchParams.fbeds && searchParams.fbeds !== "- Any -") {
        const fbedsNum = Number(searchParams.fbeds);
        if (!isNaN(fbedsNum)) {
          postParams.set("fbeds", String(fbedsNum));
        }
      }

      if (searchParams.fbaths && searchParams.fbaths !== "- Any -") {
        const fbathsNum = Number(searchParams.fbaths);
        if (!isNaN(fbathsNum)) {
          postParams.set("fbaths", String(fbathsNum));
        }
      }

      if (searchParams.fmin && Number(searchParams.fmin) > 0) {
        const fminNum = Number(searchParams.fmin);
        if (!isNaN(fminNum) && fminNum > 0) {
          postParams.set("fmin", String(fminNum));
        }
      }

      if (searchParams.fmax && Number(searchParams.fmax) > 0) {
        const fmaxNum = Number(searchParams.fmax);
        if (!isNaN(fmaxNum) && fmaxNum > 0) {
          postParams.set("fmax", String(fmaxNum));
        }
      }

      if (searchParams.fminarea && Number(searchParams.fminarea) > 0) {
        const fminareanNum = Number(searchParams.fminarea);
        if (!isNaN(fminareanNum) && fminareanNum > 0) {
          postParams.set("fminarea", String(fminareanNum));
        }
      }

      if (searchParams.fmaxarea && Number(searchParams.fmaxarea) > 0) {
        const fmaxareaNum = Number(searchParams.fmaxarea);
        if (!isNaN(fmaxareaNum) && fmaxareaNum > 0) {
          postParams.set("fmaxarea", String(fmaxareaNum));
        }
      }

      if (searchParams.fisfurnished === "1") {
        postParams.set("fisfurnished", "1");
      }

      if (searchParams.ffsbo === "1") {
        postParams.set("ffsbo", "1");
      }

      if (
        searchParams.frentperiod &&
        MEQASA_RENT_PERIODS.includes(searchParams.frentperiod)
      ) {
        postParams.set("frentperiod", searchParams.frentperiod);
      }

      if (
        searchParams.fsort &&
        MEQASA_SORT_OPTIONS.includes(searchParams.fsort)
      ) {
        postParams.set("fsort", searchParams.fsort);
      }

      // Short-let specific parameters
      if (isShortLet) {
        // Set required short-let parameters
        postParams.set("frentperiod", "shortrent");
        postParams.set("ftype", "- Any -"); // Required for short-let searches according to API docs

        // Add ALL regular search parameters for short-let requests (as per API documentation)
        if (searchParams.fbeds && searchParams.fbeds !== "- Any -") {
          const fbedsNum = Number(searchParams.fbeds);
          if (!isNaN(fbedsNum)) {
            postParams.set("fbeds", String(fbedsNum));
          }
        }

        if (searchParams.fbaths && searchParams.fbaths !== "- Any -") {
          const fbathsNum = Number(searchParams.fbaths);
          if (!isNaN(fbathsNum)) {
            postParams.set("fbaths", String(fbathsNum));
          }
        }

        if (searchParams.fmin && Number(searchParams.fmin) > 0) {
          const fminNum = Number(searchParams.fmin);
          if (!isNaN(fminNum) && fminNum > 0) {
            postParams.set("fmin", String(fminNum));
          }
        }

        if (searchParams.fmax && Number(searchParams.fmax) > 0) {
          const fmaxNum = Number(searchParams.fmax);
          if (!isNaN(fmaxNum) && fmaxNum > 0) {
            postParams.set("fmax", String(fmaxNum));
          }
        }

        if (searchParams.fminarea && Number(searchParams.fminarea) > 0) {
          const fminareanNum = Number(searchParams.fminarea);
          if (!isNaN(fminareanNum) && fminareanNum > 0) {
            postParams.set("fminarea", String(fminareanNum));
          }
        }

        if (searchParams.fmaxarea && Number(searchParams.fmaxarea) > 0) {
          const fmaxareaNum = Number(searchParams.fmaxarea);
          if (!isNaN(fmaxareaNum) && fmaxareaNum > 0) {
            postParams.set("fmaxarea", String(fmaxareaNum));
          }
        }

        if (searchParams.fisfurnished === "1") {
          postParams.set("fisfurnished", "1");
        }

        if (searchParams.ffsbo === "1") {
          postParams.set("ffsbo", "1");
        }

        if (
          searchParams.fsort &&
          MEQASA_SORT_OPTIONS.includes(searchParams.fsort)
        ) {
          postParams.set("fsort", searchParams.fsort);
        }

        // Only send fhowshort when user explicitly selects a duration
        // Omitting fhowshort shows all short-let properties (matching live Meqasa behavior)
        if (
          searchParams.fhowshort &&
          MEQASA_SHORT_LET_DURATIONS.includes(searchParams.fhowshort)
        ) {
          postParams.set("fhowshort", searchParams.fhowshort);
        }

        if (isDebugLoggingEnabled) {
          const serializedParams = postParams.toString();
          debugLog("🏠 SHORT-LET SEARCH REQUEST:");
          debugLog("  📍 URL:", finalUrl);
          debugLog("  📝 Method: POST");
          debugLog("  🔧 Raw Parameters:", {
            originalSearchParams: searchParams,
            finalPostParams: Object.fromEntries(postParams.entries()),
            postBody: serializedParams,
          });
          debugLog(
            "  🎯 Duration Filter:",
            searchParams.fhowshort ||
              "NONE (showing all short-let properties)"
          );
          debugLog("  📊 Full Request Body:", serializedParams);
        }
      } else {
        // For non-short-let searches, handle ftype parameter
        if (
          searchParams.ftype &&
        VALID_PROPERTY_TYPES.includes(searchParams.ftype)
        ) {
          // Map frontend property type to backend API type
          const mappedPropertyType = mapPropertyTypeForAPI(searchParams.ftype);
          postParams.set("ftype", mappedPropertyType);

          // Property type mapping for non-short-let searches
          if (mappedPropertyType !== searchParams.ftype) {
            // Mapping applied silently
          }
        }
      }
      // Ensure default ftype for non–short-let when not explicitly provided
      if (!isShortLet && !postParams.has("ftype")) {
        postParams.set("ftype", "- Any -");
      }

      const requestPayload = {
        url: finalUrl,
        contract,
        locality,
        isShortLet,
        postParams: Object.fromEntries(postParams.entries()),
        rawParams: searchParams,
        fhowshort: searchParams.fhowshort,
        frentperiod: searchParams.frentperiod,
      };

      logInfo("Backend API call initiated - SEARCH", {
        requestId,
        backendUrl: finalUrl,
        method: "POST",
        contract,
        locality,
        isShortLet,
        totalPostParams: postParams.size,
        postParamsDetail: Object.fromEntries(postParams.entries()),
        originalSearchParams: searchParams,
        filterBreakdown: {
          propertyType: searchParams.ftype,
          bedrooms: searchParams.fbeds,
          bathrooms: searchParams.fbaths,
          priceMin: searchParams.fmin,
          priceMax: searchParams.fmax,
          furnished: searchParams.fisfurnished,
          ownerDirect: searchParams.ffsbo,
          rentPeriod: searchParams.frentperiod,
          sortBy: searchParams.fsort,
          shortLetDuration: searchParams.fhowshort,
        },
        debugInfo: {
          environment: process.env.NODE_ENV,
          timestamp: new Date().toISOString(),
          processedTime: Date.now() - requestStartTime,
        },
        component: "PropertiesAPI",
      });


      const backendRequestTime = Date.now();
      const actualRequestBody = Array.from(postParams.entries()).map(([key, value]) => `${key}=${value}`).join('&');

      // DEBUG: Log all API requests
      console.log("🔍 DEBUG - API REQUEST:");
      console.log("  URL:", finalUrl);
      console.log("  Body:", actualRequestBody);

      const response = await fetch(finalUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: actualRequestBody,
      });

      const backendResponseTime = Date.now();
      const backendDuration = backendResponseTime - backendRequestTime;

      logInfo("Backend API response received - SEARCH", {
        requestId,
        backendUrl: finalUrl,
        httpStatus: response.status,
        httpStatusText: response.statusText,
        backendDuration: `${backendDuration}ms`,
        responseHeaders: Object.fromEntries(response.headers.entries()),
        component: "PropertiesAPI",
      });

      if (!response.ok) {
        const errorText = await response.text();
        logError(
          "Backend API error - SEARCH",
          new Error(`Meqasa API error: ${response.statusText}`),
          {
            requestId,
            backendUrl: finalUrl,
            httpStatus: response.status,
            httpStatusText: response.statusText,
            errorResponse: errorText,
            requestPayload,
            backendDuration: `${backendDuration}ms`,
            component: "PropertiesAPI",
          }
        );
        throw new Error(`Meqasa API error: ${response.statusText}`);
      }

      const raw = (await response.json()) as MeqasaSearchResponse & {
        resultcount?: number | string | null;
      };

      // DETAILED SHORT-LET LOGGING - Response Details (only for short-let searches)
      if (isShortLet && isDebugLoggingEnabled) {
        debugLog("🏠 SHORT-LET SEARCH RESPONSE:");
        debugLog("  ✅ HTTP Status:", response.status, response.statusText);
        debugLog("  ⏱️  Response Time:", `${backendDuration}ms`);
        debugLog(
          "  📊 Raw Response Headers:",
          Object.fromEntries(response.headers.entries())
        );
        debugLog(
          "  📦 Raw Response Body (UNMODIFIED):",
          JSON.stringify(raw, null, 2)
        );
        debugLog(
          "  🔢 Raw Result Count:",
          raw.resultcount,
          "(type:",
          typeof raw.resultcount,
          ")"
        );
        debugLog("  📋 Raw Results Array Length:", raw.results?.length || 0);
        debugLog("  🏷️  Search ID:", raw.searchid);
        debugLog("  📝 Search Description:", raw.searchdesc);
        debugLog("  🎯 Top Ads Count:", raw.topads?.length || 0);
        debugLog("  📌 Bottom Ads Count:", raw.bottomads?.length || 0);
        if (raw.results && raw.results.length > 0) {
          const firstResults = raw.results.slice(0, 3).map((property) => ({
            listingid: property.listingid,
            summary: property.summary,
            pricepart1: property.pricepart1,
            pricepart2: property.pricepart2,
            type: property.type,
            contract: property.contract,
            locationstring: property.locationstring,
          }));
          debugLog("  🏡 First 3 Properties (Raw):", firstResults);
        }
      }

      // Normalize result count in case the upstream API returns a string or 0 while results exist
      const normalized: MeqasaSearchResponse = {
        ...raw,
        resultcount: (() => {
          // First, try to get the resultcount from the API response
          let count = raw.resultcount;

          // Convert string to number if needed
          if (typeof count === "string") {
            count = parseInt(count, 10);
          }

          // If we have a valid number (including 0), use it
          if (typeof count === "number" && Number.isFinite(count)) {
            return count;
          }

          // Fallback: if resultcount is missing/invalid, use the actual results length
          // This handles cases where the API doesn't provide resultcount but has results
          if (Array.isArray(raw.results)) {
            return raw.results.length;
          }

          // Final fallback: no results
          return 0;
        })(),
      };

      const totalRequestTime = Date.now() - requestStartTime;

      logInfo("Backend API response processed - SEARCH", {
        requestId,
        backendUrl: finalUrl,
        searchId: normalized.searchid,
        totalResults: normalized.resultcount,
        returnedResults: normalized.results.length,
        searchDescription: normalized.searchdesc,
        dataQuality: {
          rawResultCountType: typeof raw.resultcount,
          rawResultCount: raw.resultcount,
          normalizedResultCount: normalized.resultcount,
          hasResults: normalized.results.length > 0,
          hasTopAds: (normalized.topads?.length || 0) > 0,
          hasBottomAds: (normalized.bottomads?.length || 0) > 0,
          hasProject1: normalized.project1 && !("empty" in normalized.project1),
          hasProject2: normalized.project2 && !("empty" in normalized.project2),
        },
        performance: {
          backendDuration: `${backendDuration}ms`,
          totalDuration: `${totalRequestTime}ms`,
          processingTime: `${totalRequestTime - backendDuration}ms`,
        },
        sampleResult: normalized.results[0]
          ? {
              listingId: normalized.results[0].listingid,
              summary: normalized.results[0].summary?.substring(0, 50) + "...",
              price: normalized.results[0].pricepart1,
              type: normalized.results[0].type,
              hasImages: parseInt(normalized.results[0].photocount || "0") > 0,
            }
          : null,
        component: "PropertiesAPI",
      });



      return NextResponse.json(normalized);
    } else if (type === "loadMore") {
      const {
        contract,
        locality,
        y: searchId,
        w: pageNumber,
        ...loadMoreParams
      } = params as MeqasaLoadMoreParams &
        MeqasaSearchParams & {
          contract: string;
          locality: string;
        };

      // Validate required fields
      if (!contract || !locality || !searchId || !pageNumber) {
        return NextResponse.json(
          {
            error:
              "Missing required fields: contract, locality, searchId, and pageNumber",
          },
          { status: 400 }
        );
      }

      // Validate contract type
      if (!VALID_CONTRACTS.includes(contract as "rent" | "sale")) {
        return NextResponse.json(
          { error: "Invalid contract type. Must be 'rent' or 'sale'" },
          { status: 400 }
        );
      }

      // Validate searchId and page number
      if (searchId <= 0 || pageNumber < 1) {
        return NextResponse.json(
          { error: "Invalid searchId or page number" },
          { status: 400 }
        );
      }

      // Build POST parameters - include ALL original search filters
      const postParams = new URLSearchParams();
      postParams.set("y", String(searchId));
      postParams.set("w", String(pageNumber));
      postParams.set("app", "vercel");

      // Check if this is a short-let request
      const isShortLet = isShortLetQuery(loadMoreParams);

      // Build URL - use same property-type-specific endpoint logic as search
      let finalUrl: string;
      
      if (isShortLet) {
        finalUrl = `${MEQASA_API_BASE}/short-lease-properties-for-rent-in-${locality}`;
      } else if (loadMoreParams.ftype && VALID_PROPERTY_TYPES.includes(loadMoreParams.ftype) && loadMoreParams.ftype !== 'beach house' && loadMoreParams.ftype !== 'commercial space' && loadMoreParams.ftype !== 'guest house' && loadMoreParams.ftype !== 'studio apartment') {
        const mappedPropertyType = mapPropertyTypeForAPI(loadMoreParams.ftype);
        const propertyTypeSlug = mappedPropertyType.toLowerCase().replace(/\s+/g, '-');
        
        const pluralMap: Record<string, string> = {
          'apartment': 'apartments',
          'house': 'houses',
          'office': 'offices',
          'warehouse': 'warehouses',
          'townhouse': 'townhouses',
          'villa': 'villas',
          'land': 'lands',
          'shop': 'shops',
          'hotel': 'hotels',
          'retail': 'retails',
          'commercial-space': 'commercial-spaces',
          'guest-house': 'guest-houses',
          'beachhouse': 'beachhouse',
          'studio-apartment': 'studio-apartments',
        };
        const pluralSlug = pluralMap[propertyTypeSlug] || propertyTypeSlug;
        
        finalUrl = `${MEQASA_API_BASE}/${pluralSlug}-for-${contract}-in-${locality}`;
      } else {
        finalUrl = `${MEQASA_API_BASE}/properties-for-${contract}-in-${locality}`;
      }

      // Add all the same filter parameters from the original search
      // Add ftype to POST params to match search behavior
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
        const fminNum = Number(loadMoreParams.fmin);
        if (!isNaN(fminNum) && fminNum > 0) {
          postParams.set("fmin", String(fminNum));
        }
      }

      if (loadMoreParams.fmax && Number(loadMoreParams.fmax) > 0) {
        const fmaxNum = Number(loadMoreParams.fmax);
        if (!isNaN(fmaxNum) && fmaxNum > 0) {
          postParams.set("fmax", String(fmaxNum));
        }
      }

      if (loadMoreParams.fminarea && Number(loadMoreParams.fminarea) > 0) {
        const fminareanNum = Number(loadMoreParams.fminarea);
        if (!isNaN(fminareanNum) && fminareanNum > 0) {
          postParams.set("fminarea", String(fminareanNum));
        }
      }

      if (loadMoreParams.fmaxarea && Number(loadMoreParams.fmaxarea) > 0) {
        const fmaxareaNum = Number(loadMoreParams.fmaxarea);
        if (!isNaN(fmaxareaNum) && fmaxareaNum > 0) {
          postParams.set("fmaxarea", String(fmaxareaNum));
        }
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

      // Short-let specific parameters
      if (isShortLet) {
        // Set required short-let parameters
        postParams.set("frentperiod", "shortrent");
        postParams.set("ftype", "- Any -"); // Required for short-let searches (property type filtering not supported)

        // Only send fhowshort when user explicitly selects a duration
        // Omitting fhowshort shows all short-let properties (matching live Meqasa behavior)
        if (
          loadMoreParams.fhowshort &&
          MEQASA_SHORT_LET_DURATIONS.includes(loadMoreParams.fhowshort)
        ) {
          postParams.set("fhowshort", loadMoreParams.fhowshort);
        }

        if (isDebugLoggingEnabled) {
          const serializedParams = postParams.toString();
          debugLog("🏠 SHORT-LET LOAD-MORE REQUEST:");
          debugLog("  📍 URL:", finalUrl);
          debugLog("  📝 Method: POST");
          debugLog("  🔄 Load More Details:", { searchId, pageNumber });
          debugLog("  🔧 Raw Parameters:", {
            originalLoadMoreParams: loadMoreParams,
            finalPostParams: Object.fromEntries(postParams.entries()),
            postBody: serializedParams,
          });
          debugLog(
            "  🎯 Duration Filter:",
            loadMoreParams.fhowshort ||
              "NONE (showing all short-let properties)"
          );
          debugLog("  📊 Full Request Body:", serializedParams);
        }
      }
      // Ensure default ftype for non–short-let when not explicitly provided
      if (!isShortLet && !postParams.has("ftype")) {
        postParams.set("ftype", "- Any -");
      }

      const loadMorePayload = {
        url: finalUrl,
        contract,
        locality,
        searchId,
        pageNumber,
        isShortLet,
        postParams: Object.fromEntries(postParams.entries()),
        rawParams: params,
      };

      logInfo("Backend API call initiated - LOAD_MORE", {
        requestId,
        backendUrl: finalUrl,
        method: "POST",
        contract,
        locality,
        searchId,
        pageNumber,
        isShortLet,
        totalPostParams: postParams.size,
        postParamsDetail: Object.fromEntries(postParams.entries()),
        originalLoadMoreParams: params,
        paginationInfo: {
          searchId,
          requestedPage: pageNumber,
          isFirstPage: pageNumber === 1,
        },
        debugInfo: {
          environment: process.env.NODE_ENV,
          timestamp: new Date().toISOString(),
          processedTime: Date.now() - requestStartTime,
        },
        component: "PropertiesAPI",
      });


      const backendRequestTime = Date.now();
      const actualRequestBody = Array.from(postParams.entries()).map(([key, value]) => `${key}=${value}`).join('&');

      // DEBUG: Log all API requests
      console.log("🔍 DEBUG - API REQUEST:");
      console.log("  URL:", finalUrl);
      console.log("  Body:", actualRequestBody);

      const response = await fetch(finalUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: actualRequestBody,
      });

      const backendResponseTime = Date.now();
      const backendDuration = backendResponseTime - backendRequestTime;

      logInfo("Backend API response received - LOAD_MORE", {
        requestId,
        backendUrl: finalUrl,
        httpStatus: response.status,
        httpStatusText: response.statusText,
        backendDuration: `${backendDuration}ms`,
        responseHeaders: Object.fromEntries(response.headers.entries()),
        paginationContext: {
          searchId,
          pageNumber,
        },
        component: "PropertiesAPI",
      });

      if (!response.ok) {
        const errorText = await response.text();
        logError(
          "Backend API error - LOAD_MORE",
          new Error(`Meqasa API error: ${response.statusText}`),
          {
            requestId,
            backendUrl: finalUrl,
            httpStatus: response.status,
            httpStatusText: response.statusText,
            errorResponse: errorText,
            requestPayload: loadMorePayload,
            backendDuration: `${backendDuration}ms`,
            paginationContext: {
              searchId,
              pageNumber,
            },
            component: "PropertiesAPI",
          }
        );
        throw new Error(`Meqasa API error: ${response.statusText}`);
      }

      const raw = (await response.json()) as MeqasaSearchResponse & {
        resultcount?: number | string | null;
      };

      // DETAILED SHORT-LET LOGGING - LoadMore Response Details (only for short-let loadMore)
      if (isShortLet && isDebugLoggingEnabled) {
        debugLog("🏠 SHORT-LET LOAD-MORE RESPONSE:");
        debugLog("  ✅ HTTP Status:", response.status, response.statusText);
        debugLog("  ⏱️  Response Time:", `${backendDuration}ms`);
        debugLog(
          "  📊 Raw Response Headers:",
          Object.fromEntries(response.headers.entries())
        );
        debugLog(
          "  📦 Raw Response Body (UNMODIFIED):",
          JSON.stringify(raw, null, 2)
        );
        debugLog(
          "  🔢 Raw Result Count:",
          raw.resultcount,
          "(type:",
          typeof raw.resultcount,
          ")"
        );
        debugLog("  📋 Raw Results Array Length:", raw.results?.length || 0);
        debugLog("  🏷️  Search ID:", raw.searchid);
        debugLog("  📄 Page Number:", pageNumber);
        debugLog("  🎯 Top Ads Count:", raw.topads?.length || 0);
        debugLog("  📌 Bottom Ads Count:", raw.bottomads?.length || 0);
        if (raw.results && raw.results.length > 0) {
          const firstResults = raw.results.slice(0, 3).map((property) => ({
            listingid: property.listingid,
            summary: property.summary,
            pricepart1: property.pricepart1,
            pricepart2: property.pricepart2,
            type: property.type,
            contract: property.contract,
            locationstring: property.locationstring,
          }));
          debugLog("  🏡 First 3 Properties from Page (Raw):", firstResults);
        }
      }

      const normalized: MeqasaSearchResponse = {
        ...raw,
        resultcount: (() => {
          // First, try to get the resultcount from the API response
          let count = raw.resultcount;

          // Convert string to number if needed
          if (typeof count === "string") {
            count = parseInt(count, 10);
          }

          // If we have a valid number (including 0), use it
          if (typeof count === "number" && Number.isFinite(count)) {
            return count;
          }

          // Fallback: if resultcount is missing/invalid, use the actual results length
          // This handles cases where the API doesn't provide resultcount but has results
          if (Array.isArray(raw.results)) {
            return raw.results.length;
          }

          // Final fallback: no results
          return 0;
        })(),
      };
      const totalRequestTime = Date.now() - requestStartTime;

      logInfo("Backend API response processed - LOAD_MORE", {
        requestId,
        backendUrl: finalUrl,
        searchId: normalized.searchid,
        pageNumber,
        totalResults: normalized.resultcount,
        returnedResults: normalized.results.length,
        dataQuality: {
          rawResultCountType: typeof raw.resultcount,
          rawResultCount: raw.resultcount,
          normalizedResultCount: normalized.resultcount,
          hasResults: normalized.results.length > 0,
          hasTopAds: (normalized.topads?.length || 0) > 0,
          hasBottomAds: (normalized.bottomads?.length || 0) > 0,
        },
        performance: {
          backendDuration: `${backendDuration}ms`,
          totalDuration: `${totalRequestTime}ms`,
          processingTime: `${totalRequestTime - backendDuration}ms`,
        },
        paginationInfo: {
          searchId,
          pageNumber,
          hasMoreResults: normalized.results.length > 0,
        },
        component: "PropertiesAPI",
      });



      return NextResponse.json(normalized);
    } else {
      return NextResponse.json(
        { error: "Invalid request type. Must be 'search' or 'loadMore'" },
        { status: 400 }
      );
    }
  } catch (error) {
    const totalRequestTime = Date.now() - requestStartTime;

    logError("API Request failed", error, {
      requestId,
      url: "/api/properties",
      method: "POST",
      userAgent,
      referer,
      ip,
      totalDuration: `${totalRequestTime}ms`,
      errorType: error instanceof Error ? error.name : "UnknownError",
      errorMessage: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      component: "PropertiesAPI",
    });


    return NextResponse.json(
      { error: "Failed to fetch properties", requestId },
      { status: 500 }
    );
  }
}

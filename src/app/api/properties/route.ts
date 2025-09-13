import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type {
  MeqasaSearchParams,
  MeqasaLoadMoreParams,
  MeqasaSearchResponse,
} from "@/types/meqasa";
import { logInfo, logError, logWarn } from "@/lib/logger";

const MEQASA_API_BASE = "https://meqasa.com";

// Valid contract types according to API docs
const VALID_CONTRACTS = ["rent", "sale"] as const;

// Valid property types according to API testing (all confirmed working)
const VALID_PROPERTY_TYPES = [
  "apartment",      // ✅ 6,949 results
  "house",          // ✅ 5,199 results  
  "office",         // ✅ 709 results
  "warehouse",      // ✅ 125 results
  "townhouse",      // ✅ 1,471 results
  "land",           // ✅ 1 result
  "shop",           // ✅ 363 results
  "retail",         // ✅ 229 results
  "commercial space", // ✅ 203 results
  "guest house",    // ✅ 13 results
  "beach house",    // Frontend type (maps to "Beachhouse")
  "hotel",          // ✅ 1 result
  "studio apartment", // ✅ 11 results
] as const;

// Valid sort options according to API docs
const VALID_SORT_OPTIONS = ["date", "date2", "price", "price2"] as const;

// Valid rent period options according to API docs
const VALID_RENT_PERIODS = ["- Any -", "shortrent", "longrent"] as const;

// Valid short-let duration options according to API docs
const VALID_SHORT_LET_DURATIONS = [
  "day",
  "week",
  "month",
  "month3",
  "month6",
] as const;

interface RequestBody {
  type: "search" | "loadMore";
  params: (MeqasaSearchParams | MeqasaLoadMoreParams) & {
    contract: string;
    locality: string;
  };
}

// Helper function to detect short-let requests
function isShortLetRequest(params: MeqasaSearchParams): boolean {
  return params.frentperiod === "shortrent" || params.fhowshort !== undefined;
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
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const referer = request.headers.get('referer') || 'unknown';
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const contentType = request.headers.get('content-type') || 'unknown';
  
  logInfo('API Request started', {
    requestId,
    method: 'POST',
    url: '/api/properties',
    userAgent,
    referer,
    ip,
    contentType,
    timestamp: new Date().toISOString(),
    component: 'PropertiesAPI'
  });

  try {
    const body = (await request.json()) as RequestBody;
    const { type, params } = body;
    
    logInfo('Request body parsed', {
      requestId,
      requestType: type,
      paramKeys: Object.keys(params),
      hasContract: !!params.contract,
      hasLocality: !!params.locality,
      component: 'PropertiesAPI'
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

      // Build URL according to API docs: /properties-for-[contract]-in-[locality]
      const url = `${MEQASA_API_BASE}/properties-for-${contract}-in-${locality}`;

      // Build POST parameters according to API docs
      const postParams = new URLSearchParams();
      postParams.set("app", "vercel");

      // Check if this is a short-let request
      const isShortLet = isShortLetRequest(searchParams);

      // Use short-let endpoint if applicable
      const finalUrl = isShortLet
        ? `${MEQASA_API_BASE}/short-lease-properties-for-rent-in-${locality}`
        : url;

      // Add optional parameters if they exist and are valid
      if (
        searchParams.ftype &&
        VALID_PROPERTY_TYPES.includes(searchParams.ftype) &&
        !isShortLet // Don't send regular ftype for short-let requests
      ) {
        postParams.set("ftype", searchParams.ftype);
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

      if (searchParams.fisfurnished === "1") {
        postParams.set("fisfurnished", "1");
      }

      if (searchParams.ffsbo === "1") {
        postParams.set("ffsbo", "1");
      }

      if (
        searchParams.frentperiod &&
        VALID_RENT_PERIODS.includes(searchParams.frentperiod)
      ) {
        postParams.set("frentperiod", searchParams.frentperiod);
      }

      if (
        searchParams.fsort &&
        VALID_SORT_OPTIONS.includes(searchParams.fsort)
      ) {
        postParams.set("fsort", searchParams.fsort);
      }

      // Short-let specific parameters
      if (isShortLet) {
        // Set required short-let parameters
        postParams.set("frentperiod", "shortrent");
        
        postParams.set("ftype", "- Any -"); // Required for short-let searches (property type filtering not supported)

        // Add short-let duration only if provided
        if (
          searchParams.fhowshort &&
          VALID_SHORT_LET_DURATIONS.includes(searchParams.fhowshort)
        ) {
          postParams.set("fhowshort", searchParams.fhowshort);
          console.log(
            "🔍 Sending fhowshort parameter:",
            searchParams.fhowshort
          );
        } else {
          console.log(
            "🔍 No fhowshort parameter sent - using default behavior"
          );
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
          
          // Log property type mapping for debugging
          if (mappedPropertyType !== searchParams.ftype) {
            console.log(`🔄 Property type mapped: "${searchParams.ftype}" → "${mappedPropertyType}"`);
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
      
      logInfo('Backend API call initiated - SEARCH', {
        requestId,
        backendUrl: finalUrl,
        method: 'POST',
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
          shortLetDuration: searchParams.fhowshort
        },
        debugInfo: {
          environment: process.env.NODE_ENV,
          timestamp: new Date().toISOString(),
          processedTime: Date.now() - requestStartTime
        },
        component: 'PropertiesAPI'
      });
      
      console.log("🚀 API Request: POST", finalUrl, {
        params: searchParams,
        data: Object.fromEntries(postParams.entries())
      });

      const backendRequestTime = Date.now();
      const response = await fetch(finalUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: postParams.toString(),
      });
      
      const backendResponseTime = Date.now();
      const backendDuration = backendResponseTime - backendRequestTime;
      
      logInfo('Backend API response received - SEARCH', {
        requestId,
        backendUrl: finalUrl,
        httpStatus: response.status,
        httpStatusText: response.statusText,
        backendDuration: `${backendDuration}ms`,
        responseHeaders: Object.fromEntries(response.headers.entries()),
        component: 'PropertiesAPI'
      });

      if (!response.ok) {
        const errorText = await response.text();
        logError('Backend API error - SEARCH', new Error(`Meqasa API error: ${response.statusText}`), {
          requestId,
          backendUrl: finalUrl,
          httpStatus: response.status,
          httpStatusText: response.statusText,
          errorResponse: errorText,
          requestPayload,
          backendDuration: `${backendDuration}ms`,
          component: 'PropertiesAPI'
        });
        throw new Error(`Meqasa API error: ${response.statusText}`);
      }

      const raw = (await response.json()) as MeqasaSearchResponse & {
        resultcount?: number | string | null;
      };
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
      
      const responseInfo = {
        searchId: normalized.searchid,
        resultCount: normalized.resultcount,
        resultsLength: normalized.results.length,
        searchDesc: normalized.searchdesc,
        rawResultCount: raw.resultcount,
        rawResultCountType: typeof raw.resultcount,
        firstResult: normalized.results[0]
          ? {
              listingid: normalized.results[0].listingid,
              summary: normalized.results[0].summary,
              pricepart1: normalized.results[0].pricepart1,
              pricepart2: normalized.results[0].pricepart2,
            }
          : null,
      };
      
      logInfo('Backend API response processed - SEARCH', {
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
          hasProject1: normalized.project1 && !('empty' in normalized.project1),
          hasProject2: normalized.project2 && !('empty' in normalized.project2)
        },
        performance: {
          backendDuration: `${backendDuration}ms`,
          totalDuration: `${totalRequestTime}ms`,
          processingTime: `${totalRequestTime - backendDuration}ms`
        },
        sampleResult: normalized.results[0] ? {
          listingId: normalized.results[0].listingid,
          summary: normalized.results[0].summary?.substring(0, 50) + '...',
          price: normalized.results[0].pricepart1,
          type: normalized.results[0].type,
          hasImages: (normalized.results[0].imagelist?.length || 0) > 0
        } : null,
        component: 'PropertiesAPI'
      });
      
      console.log("✅ API Response: POST", finalUrl, {
        status: response.status,
        duration: `${backendDuration}ms`,
        data: responseInfo
      });

      // Log detailed search results data for development purposes
      console.log("Detailed search results data:", {
        searchId: normalized.searchid,
        contract,
        locality,
        searchDesc: normalized.searchdesc,
        totalResults: normalized.resultcount,
        resultsPage: normalized.results.length,
        topAdsCount: normalized.topads?.length || 0,
        bottomAdsCount: normalized.bottomads?.length || 0,
        hasProject1: normalized.project1 && !("empty" in normalized.project1),
        hasProject2: normalized.project2 && !("empty" in normalized.project2),
        results: normalized.results.map((result, index) => ({
          index,
          listingid: result.listingid,
          summary: result.summary,
          pricepart1: result.pricepart1,
          pricepart2: result.pricepart2,
          type: result.type,
          contract: result.contract,
          location: result.location,
          beds: result.beds,
          baths: result.baths,
          garages: result.garages,
          floorarea: result.floorarea,
          ownerName: result.owner?.name,
          ownerType: result.owner?.type,
          imageCount: result.imagelist?.length || 0,
        })),
        component: "SearchAPI",
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

      // Build URL according to API docs: /properties-for-[contract]-in-[locality]
      const url = `${MEQASA_API_BASE}/properties-for-${contract}-in-${locality}`;

      // Build POST parameters - include ALL original search filters
      const postParams = new URLSearchParams();
      postParams.set("y", String(searchId));
      postParams.set("w", String(pageNumber));
      postParams.set("app", "vercel");

      // Check if this is a short-let request
      const isShortLet = isShortLetRequest(loadMoreParams);

      // Use short-let endpoint if applicable
      const finalUrl = isShortLet
        ? `${MEQASA_API_BASE}/short-lease-properties-for-rent-in-${locality}`
        : url;

      // Add all the same filter parameters from the original search
      // Do not forward regular ftype if short-let; short-let forces ftype="- Any -" below
      if (
        loadMoreParams.ftype &&
        VALID_PROPERTY_TYPES.includes(loadMoreParams.ftype) &&
        !isShortLet
      ) {
        // Map frontend property type to backend API type
        const mappedPropertyType = mapPropertyTypeForAPI(loadMoreParams.ftype);
        postParams.set("ftype", mappedPropertyType);
        
        // Log property type mapping for debugging
        if (mappedPropertyType !== loadMoreParams.ftype) {
          console.log(`🔄 LoadMore property type mapped: "${loadMoreParams.ftype}" → "${mappedPropertyType}"`);
        }
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

      if (loadMoreParams.fisfurnished === "1") {
        postParams.set("fisfurnished", "1");
      }

      if (loadMoreParams.ffsbo === "1") {
        postParams.set("ffsbo", "1");
      }

      if (
        loadMoreParams.frentperiod &&
        VALID_RENT_PERIODS.includes(loadMoreParams.frentperiod)
      ) {
        postParams.set("frentperiod", loadMoreParams.frentperiod);
      }

      if (
        loadMoreParams.fsort &&
        VALID_SORT_OPTIONS.includes(loadMoreParams.fsort)
      ) {
        postParams.set("fsort", loadMoreParams.fsort);
      }

      // Short-let specific parameters
      if (isShortLet) {
        // Set required short-let parameters
        postParams.set("frentperiod", "shortrent");
        
        postParams.set("ftype", "- Any -"); // Required for short-let searches (property type filtering not supported)

        // Add short-let duration only if provided
        if (
          loadMoreParams.fhowshort &&
          VALID_SHORT_LET_DURATIONS.includes(loadMoreParams.fhowshort)
        ) {
          postParams.set("fhowshort", loadMoreParams.fhowshort);
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
      
      logInfo('Backend API call initiated - LOAD_MORE', {
        requestId,
        backendUrl: finalUrl,
        method: 'POST',
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
          isFirstPage: pageNumber === 1
        },
        debugInfo: {
          environment: process.env.NODE_ENV,
          timestamp: new Date().toISOString(),
          processedTime: Date.now() - requestStartTime
        },
        component: 'PropertiesAPI'
      });
      
      console.log("🚀 API Request: POST", finalUrl, {
        params: { searchId, pageNumber },
        data: Object.fromEntries(postParams.entries())
      });

      const backendRequestTime = Date.now();
      const response = await fetch(finalUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: postParams.toString(),
      });
      
      const backendResponseTime = Date.now();
      const backendDuration = backendResponseTime - backendRequestTime;
      
      logInfo('Backend API response received - LOAD_MORE', {
        requestId,
        backendUrl: finalUrl,
        httpStatus: response.status,
        httpStatusText: response.statusText,
        backendDuration: `${backendDuration}ms`,
        responseHeaders: Object.fromEntries(response.headers.entries()),
        paginationContext: {
          searchId,
          pageNumber
        },
        component: 'PropertiesAPI'
      });

      if (!response.ok) {
        const errorText = await response.text();
        logError('Backend API error - LOAD_MORE', new Error(`Meqasa API error: ${response.statusText}`), {
          requestId,
          backendUrl: finalUrl,
          httpStatus: response.status,
          httpStatusText: response.statusText,
          errorResponse: errorText,
          requestPayload: loadMorePayload,
          backendDuration: `${backendDuration}ms`,
          paginationContext: {
            searchId,
            pageNumber
          },
          component: 'PropertiesAPI'
        });
        throw new Error(`Meqasa API error: ${response.statusText}`);
      }

      const raw = (await response.json()) as MeqasaSearchResponse & {
        resultcount?: number | string | null;
      };
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
      
      const loadMoreResponseInfo = {
        searchId: normalized.searchid,
        resultCount: normalized.resultcount,
        resultsLength: normalized.results.length,
        rawResultCount: raw.resultcount,
        rawResultCountType: typeof raw.resultcount,
        data: normalized,
      };
      
      logInfo('Backend API response processed - LOAD_MORE', {
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
          hasBottomAds: (normalized.bottomads?.length || 0) > 0
        },
        performance: {
          backendDuration: `${backendDuration}ms`,
          totalDuration: `${totalRequestTime}ms`,
          processingTime: `${totalRequestTime - backendDuration}ms`
        },
        paginationInfo: {
          searchId,
          pageNumber,
          hasMoreResults: normalized.results.length > 0
        },
        component: 'PropertiesAPI'
      });
      
      console.log("✅ API Response: POST", finalUrl, {
        status: response.status,
        duration: `${backendDuration}ms`,
        data: loadMoreResponseInfo
      });

      // Log detailed loadMore results data for development purposes
      console.log("Detailed loadMore results data:", {
        searchId: normalized.searchid,
        pageNumber,
        contract,
        locality,
        totalResults: normalized.resultcount,
        resultsPage: normalized.results.length,
        topAdsCount: normalized.topads?.length || 0,
        bottomAdsCount: normalized.bottomads?.length || 0,
        hasProject1: normalized.project1 && !("empty" in normalized.project1),
        hasProject2: normalized.project2 && !("empty" in normalized.project2),
        results: normalized.results.map((result, index) => ({
          index,
          listingid: result.listingid,
          summary: result.summary,
          pricepart1: result.pricepart1,
          pricepart2: result.pricepart2,
          type: result.type,
          contract: result.contract,
          location: result.location,
          beds: result.beds,
          baths: result.baths,
          garages: result.garages,
          floorarea: result.floorarea,
          ownerName: result.owner?.name,
          ownerType: result.owner?.type,
          imageCount: result.imagelist?.length || 0,
        })),
        component: "LoadMoreAPI",
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
    
    logError('API Request failed', error, {
      requestId,
      url: '/api/properties',
      method: 'POST',
      userAgent,
      referer,
      ip,
      totalDuration: `${totalRequestTime}ms`,
      errorType: error instanceof Error ? error.name : 'UnknownError',
      errorMessage: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      component: 'PropertiesAPI'
    });
    
    console.error("❌ API Error: POST /api/properties", {
      requestId,
      duration: `${totalRequestTime}ms`,
      error: error instanceof Error ? error.message : String(error)
    });
    
    return NextResponse.json(
      { error: "Failed to fetch properties", requestId },
      { status: 500 }
    );
  }
}

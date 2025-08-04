import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type {
  MeqasaSearchParams,
  MeqasaLoadMoreParams,
  MeqasaSearchResponse,
} from "@/types/meqasa";

const MEQASA_API_BASE = "https://meqasa.com";

// Valid contract types according to API docs
const VALID_CONTRACTS = ["rent", "sale"] as const;

// Valid property types according to API docs
const VALID_PROPERTY_TYPES = [
  "apartment",
  "house",
  "office",
  "warehouse",
  "guesthouse",
  "townhouse",
  "land",
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

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RequestBody;
    const { type, params } = body;

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
          { status: 400 },
        );
      }

      // Validate contract type
      if (!VALID_CONTRACTS.includes(contract as "rent" | "sale")) {
        return NextResponse.json(
          { error: "Invalid contract type. Must be 'rent' or 'sale'" },
          { status: 400 },
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

      if (searchParams.fisfurnished === 1) {
        postParams.set("fisfurnished", "1");
      }

      if (searchParams.ffsbo === 1) {
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
        postParams.set("ftype", "- Any -"); // Required for short-let searches

        // Add short-let duration only if provided
        if (
          searchParams.fhowshort &&
          VALID_SHORT_LET_DURATIONS.includes(searchParams.fhowshort)
        ) {
          postParams.set("fhowshort", searchParams.fhowshort);
          console.log(
            "🔍 Sending fhowshort parameter:",
            searchParams.fhowshort,
          );
        } else {
          console.log(
            "🔍 No fhowshort parameter sent - using default behavior",
          );
        }
      } else {
        // For non-short-let searches, handle ftype parameter
        if (
          searchParams.ftype &&
          VALID_PROPERTY_TYPES.includes(searchParams.ftype)
        ) {
          postParams.set("ftype", searchParams.ftype);
        }
      }

      console.log("Search API call:", {
        url: finalUrl,
        contract,
        locality,
        isShortLet,
        postParams: Object.fromEntries(postParams.entries()),
        rawParams: searchParams,
        fhowshort: searchParams.fhowshort,
        frentperiod: searchParams.frentperiod,
      });

      const response = await fetch(finalUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: postParams.toString(),
      });

      if (!response.ok) {
        throw new Error(`Meqasa API error: ${response.statusText}`);
      }

      const data = (await response.json()) as MeqasaSearchResponse;
      console.log("Search response:", {
        searchId: data.searchid,
        resultCount: data.resultcount,
        resultsLength: data.results.length,
        searchDesc: data.searchdesc,
        // Log first few results to see what type of properties are returned
        firstResult: data.results[0]
          ? {
              listingid: data.results[0].listingid,
              summary: data.results[0].summary,
              pricepart1: data.results[0].pricepart1,
              pricepart2: data.results[0].pricepart2,
            }
          : null,
      });

      return NextResponse.json(data);
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
          { status: 400 },
        );
      }

      // Validate contract type
      if (!VALID_CONTRACTS.includes(contract as "rent" | "sale")) {
        return NextResponse.json(
          { error: "Invalid contract type. Must be 'rent' or 'sale'" },
          { status: 400 },
        );
      }

      // Validate searchId and page number
      if (searchId <= 0 || pageNumber < 1) {
        return NextResponse.json(
          { error: "Invalid searchId or page number" },
          { status: 400 },
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
      if (
        loadMoreParams.ftype &&
        VALID_PROPERTY_TYPES.includes(loadMoreParams.ftype)
      ) {
        postParams.set("ftype", loadMoreParams.ftype);
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

      if (loadMoreParams.fisfurnished === 1) {
        postParams.set("fisfurnished", "1");
      }

      if (loadMoreParams.ffsbo === 1) {
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
        postParams.set("ftype", "- Any -"); // Required for short-let searches

        // Add short-let duration only if provided
        if (
          loadMoreParams.fhowshort &&
          VALID_SHORT_LET_DURATIONS.includes(loadMoreParams.fhowshort)
        ) {
          postParams.set("fhowshort", loadMoreParams.fhowshort);
        }
      }

      console.log("LoadMore API call:", {
        url: finalUrl,
        contract,
        locality,
        searchId,
        pageNumber,
        isShortLet,
        postParams: Object.fromEntries(postParams.entries()),
        rawParams: params,
      });

      const response = await fetch(finalUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: postParams.toString(),
      });

      if (!response.ok) {
        throw new Error(`Meqasa API error: ${response.statusText}`);
      }

      const data = (await response.json()) as MeqasaSearchResponse;
      console.log("LoadMore response:", {
        searchId: data.searchid,
        resultCount: data.resultcount,
        resultsLength: data.results.length,
        data,
      });

      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { error: "Invalid request type. Must be 'search' or 'loadMore'" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error in properties API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 },
    );
  }
}

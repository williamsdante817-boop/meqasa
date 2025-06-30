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

interface RequestBody {
  type: "search" | "loadMore";
  params: (MeqasaSearchParams | MeqasaLoadMoreParams) & {
    contract: string;
    locality: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RequestBody;
    const { type, params } = body;

    console.log("API Route - Request:", { type, params });

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

      // Add optional parameters if they exist and are valid
      if (
        searchParams.ftype &&
        VALID_PROPERTY_TYPES.includes(searchParams.ftype)
      ) {
        postParams.set("ftype", searchParams.ftype);
      }

      if (searchParams.fbeds && searchParams.fbeds !== "- Any -") {
        postParams.set("fbeds", String(searchParams.fbeds));
      }

      if (searchParams.fbaths && searchParams.fbaths !== "- Any -") {
        postParams.set("fbaths", String(searchParams.fbaths));
      }

      if (searchParams.fmin && searchParams.fmin > 0) {
        postParams.set("fmin", String(searchParams.fmin));
      }

      if (searchParams.fmax && searchParams.fmax > 0) {
        postParams.set("fmax", String(searchParams.fmax));
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

      console.log("Search API call:", {
        url,
        params: Object.fromEntries(postParams.entries()),
      });

      const response = await fetch(url, {
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
      });

      return NextResponse.json(data);
    } else if (type === "loadMore") {
      const {
        contract,
        locality,
        y: searchId,
        w: pageNumber,
      } = params as MeqasaLoadMoreParams & {
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

      // Build POST parameters according to API docs
      const postParams = new URLSearchParams();
      postParams.set("y", String(searchId));
      postParams.set("w", String(pageNumber));
      postParams.set("app", "vercel");

      console.log("LoadMore API call:", {
        url,
        params: Object.fromEntries(postParams.entries()),
      });

      const response = await fetch(url, {
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

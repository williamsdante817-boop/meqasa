import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type {
  MeqasaSearchParams,
  MeqasaLoadMoreParams,
  MeqasaSearchResponse,
} from "@/types/meqasa";

const MEQASA_API_BASE = "https://meqasa.com";

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

    console.log("API Route - Request body:", body);

    let url: string;
    let searchParams: URLSearchParams;

    if (type === "search") {
      const { contract, locality, ...restParams } =
        params as MeqasaSearchParams & {
          contract: string;
          locality: string;
        };

      // Validate required fields
      if (!contract || !locality) {
        console.error("Missing required fields in search request:", {
          contract,
          locality,
        });
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 },
        );
      }

      url = `${MEQASA_API_BASE}/properties-for-${contract}-in-${locality}`;

      console.log("this is locality", locality);
      console.log("API Route - Formatted URL:", url);

      searchParams = new URLSearchParams();
      const searchParamsObj: Record<
        string,
        string | number | boolean | undefined
      > = {
        ...restParams,
        app: "vercel",
        locality,
      };

      // Only add boolean parameters if they are checked (value is 1)
      if (restParams.fisfurnished === 1) {
        searchParamsObj.fisfurnished = 1;
      }
      if (restParams.ffsbo === 1) {
        searchParamsObj.ffsbo = 1;
      }

      Object.entries(searchParamsObj).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, String(value));
        }
      });

      console.log("API Route - Search URL:", url);
      console.log(
        "API Route - Search params:",
        Object.fromEntries(searchParams.entries()),
      );
    } else if (type === "loadMore") {
      const { contract, locality, ...loadMoreParams } =
        params as MeqasaLoadMoreParams & {
          contract: string;
          locality: string;
        };

      // Validate required fields
      if (!contract || !locality || !loadMoreParams.y || !loadMoreParams.w) {
        console.error("Missing required fields in loadMore request:", {
          contract,
          locality,
          loadMoreParams,
        });
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 },
        );
      }

      url = `${MEQASA_API_BASE}/properties-for-${contract}-in-${locality}`;

      console.log("API Route - Formatted URL:", url);

      searchParams = new URLSearchParams();
      const searchParamsObj = {
        y: loadMoreParams.y,
        w: loadMoreParams.w,
        locality,
        app: "vercel",
      };

      Object.entries(searchParamsObj).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          searchParams.append(key, String(value));
        }
      });

      console.log("API Route - LoadMore URL:", url);
      console.log(
        "API Route - LoadMore params:",
        Object.fromEntries(searchParams.entries()),
      );
    } else {
      console.error("Invalid request type:", type);
      return NextResponse.json(
        { error: "Invalid request type" },
        { status: 400 },
      );
    }

    const response = await fetch(`${url}?${searchParams.toString()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: searchParams.toString(),
    });

    if (!response.ok) {
      console.error("Meqasa API error:", response.statusText);
      throw new Error(`Meqasa API error: ${response.statusText}`);
    }

    const data = (await response.json()) as MeqasaSearchResponse;
    console.log("API Route - Response data:", {
      resultCount: data.resultcount,
      searchId: data.searchid,
      resultsCount: data.results.length,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 },
    );
  }
}

import type { ListingDetails } from "@/types";

const LISTING_ENDPOINT = "https://meqasa.com/mqrouter/ref";
const DEFAULT_TIMEOUT_MS = 5000;
const REVALIDATE_SECONDS = 300;

interface ListingErrorResponse {
  status: string;
  msg?: string;
}

export async function fetchListingDetails(
  id: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<ListingDetails> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(LISTING_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        refref: id,
        app: "vercel",
      }),
      signal: controller.signal,
      cache: "force-cache",
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: ["listing-details"],
      },
    });

    if (!response.ok) {
      throw new Error(`Listing request failed: ${response.status}`);
    }

    const payload = (await response.json()) as ListingDetails | ListingErrorResponse;

    if ((payload as ListingErrorResponse).status === "fail") {
      throw new Error((payload as ListingErrorResponse).msg ?? "Listing not available");
    }

    return payload as ListingDetails;
  } finally {
    clearTimeout(timeout);
  }
}

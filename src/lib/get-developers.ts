export interface Developer {
  developerid: string;
  about: string;
  email: string;
  logo: string;
  subdomain: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  hero: string;
  city: string;
  address: string;
  website: string;
  companyname: string;
  name: string;
  unitcount: number;
  landcount: number;
  prcount: number;
}

export interface DevelopersResponse {
  developers: Developer[];
}

/**
 * Fetches the list of developers from the MeQasa server.
 *
 * @returns A promise that resolves with a {@link DevelopersResponse} object,
 *          containing an array of developer details.
 * @throws An error if the request fails or the server returns an error.
 */
export async function getDevelopers(): Promise<DevelopersResponse> {
  const url = "https://meqasa.com/real-estate-developers?app=vercel";

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as unknown;

    // Validate the response structure
    if (
      !data ||
      typeof data !== "object" ||
      !Array.isArray((data as Record<string, unknown>).developers)
    ) {
      throw new Error("Invalid response format from server");
    }

    return data as DevelopersResponse;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request timed out. Please try again.");
      }
      throw error;
    }

    throw new Error("Failed to fetch developers. Please try again later.");
  }
}

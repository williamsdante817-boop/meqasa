import type { DeveloperDetails } from "@/types";

/**
 * Fetches the developer profile details for a specific developer ID from the MeQasa server.
 *
 * @param developerId - The unique identifier for the developer to retrieve details for.
 * @returns A promise that resolves with an object of type {@link DeveloperDetails},
 *          which includes various details such as the developer's name, logo, contact details,
 *          and an array of project IDs.
 * @throws An error if the request fails or the server returns an error.
 */
export async function getDeveloperProfile(
  developerId: number
): Promise<DeveloperDetails> {
  const url = `https://meqasa.com/developer-developer/${developerId}?app=vercel`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      signal: controller.signal,
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as DeveloperDetails;
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }
    throw error;
  }
}

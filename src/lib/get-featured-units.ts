import { apiClient } from "./axios-client";
import type { Unit } from "@/types";

/**
 * Fetches the featured units from the MeQasa server.
 *
 * @returns A promise that resolves with an array of {@link Unit} objects.
 * @throws An error if the request fails or the server returns an error.
 */

export async function getFeaturedUnits(): Promise<Unit[]> {
  const url = "https://meqasa.com/hp-3";

  return await apiClient.post<Unit[]>(
    url,
    {
      app: "vercel",
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
}

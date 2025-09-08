import { apiClient } from "./axios-client";
import type { FeaturedProject } from "@/types";

/**
 * Fetches the featured projects from the MeQasa server.
 *
 * @returns A promise that resolves with an array of {@link FeaturedProject} objects.
 * @throws An error if the request fails or the server returns an error.
 */

export async function getFeaturedProjects(): Promise<FeaturedProject[]> {
  const url = "https://meqasa.com/hp-1";

  return await apiClient.post<FeaturedProject[]>(
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

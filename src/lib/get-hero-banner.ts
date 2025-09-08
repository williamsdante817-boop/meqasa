import { apiClient } from "./axios-client";
import type { AdLink } from "@/types";

/**
 * Fetches the hero banner ad from the MeQasa server.
 *
 * @returns A promise that resolves with an object containing the ad link and image URLs.
 */
export async function getHeroBanner(): Promise<AdLink> {
  const url = "https://meqasa.com/hp-0";

  return await apiClient.post<AdLink>(
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

import { apiClient } from "./axios-client";
import type { BrokerDetail } from "@/types";

/**
 * Fetches the list of agents' logos.
 *
 * @returns A promise that resolves with an array of {@link BrokerDetail} objects.
 */
export async function getAgentLogos(): Promise<BrokerDetail[]> {
  const url = "https://meqasa.com/hp-9";

  return await apiClient.post<BrokerDetail[]>(
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

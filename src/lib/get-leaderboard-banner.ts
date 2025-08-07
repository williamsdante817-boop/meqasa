import { apiClient } from "./axios-client";

interface LeaderboardBanner {
  html: string;
  type: "leaderboard" | "sidebar";
}

/**
 * Fetches the leaderboard banner ads from the MeQasa server.
 *
 * @returns A promise that resolves with an array of banner objects containing HTML and type.
 */
export async function getLeaderboardBanner(): Promise<LeaderboardBanner[]> {
  const url = "https://meqasa.com/hp-6";

  const response = await apiClient.post<LeaderboardBanner[]>(
    url,
    {
      app: "vercel",
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return response || [];
}

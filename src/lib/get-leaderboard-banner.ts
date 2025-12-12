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

  try {
    // The API might return a raw string (HTML) or an array
    // We use 'any' here to safely check the response type at runtime
    const response = await apiClient.post<any>(
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

    if (!response) {
      return [];
    }

    // If response is a string (raw HTML), wrap it
    if (typeof response === "string") {
      return [
        {
          html: response,
          type: "leaderboard",
        },
      ] as LeaderboardBanner[];
    }

    // If it's already an array, return it (assuming it matches the shape)
    if (Array.isArray(response)) {
      return response as LeaderboardBanner[];
    }

    return [];
  } catch (error) {
    console.error("Error fetching leaderboard banner:", error);
    return [];
  }
}

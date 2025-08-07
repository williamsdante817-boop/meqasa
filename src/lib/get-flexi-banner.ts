import { apiClient } from "./axios-client";

/**
 * Fetches the flexi banner HTML markup from the server.
 *
 * @returns A promise that resolves with the HTML markup for the flexi banner.
 */
export async function getFlexiBanner(): Promise<string> {
  try {
    const response = await apiClient.post<string>(
      "https://meqasa.com/hp-10",
      { app: "vercel" },
      {
        headers: {
          Accept: "text/html, application/xhtml+xml",
          "Content-Type": "application/json",
        },
        responseType: "text", // Ensure we get text response
      },
    );

    console.log("Flexi banner response:", response);
    return response;
  } catch (error) {
    console.error("Error fetching flexi banner:", error);
    throw error;
  }
}

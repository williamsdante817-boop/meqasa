import { apiClient } from "./axios-client";
import type { PopupData, PopupDataWithUrls } from "@/types";

/**
 * Fetches the homepage popup data from the MeQasa server.
 *
 * @returns A promise that resolves with the popup data including full URLs.
 */
export async function getHomepagePopup(): Promise<PopupDataWithUrls> {
  const url = "https://meqasa.com/hp-11";

  const popupData = await apiClient.post<PopupData>(
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

  // Transform the data to include full URLs
  return {
    ...popupData,
    imageUrl: popupData.src ? `https://dve7rykno93gs.cloudfront.net${popupData.src}` : "",
    linkUrl: popupData.href ? `https://meqasa.com${popupData.href}` : "",
  };
}

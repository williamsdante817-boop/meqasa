import { apiFetch } from "./api-client";
import type { PopupData, PopupDataWithUrls } from "@/types";

export interface ResultsPopupParams {
  type: string; // house | apartment | ...
  contract: "rent" | "sale";
}

/**
 * Fetches the results page popup data from the MeQasa server.
 *
 * @param params - The parameters for the results page popup
 * @param params.type - The property type (house, apartment, etc.)
 * @param params.contract - The contract type (rent or sale)
 * @returns A promise that resolves with the popup data including full URLs.
 */
export async function getResultsPopup(
  params: ResultsPopupParams,
): Promise<PopupDataWithUrls> {
  const url = "https://meqasa.com/rp-11";

  const popupData = await apiFetch<PopupData>({
    url,
    method: "POST",
    params: {
      type: params.type,
      contract: params.contract,
      app: "vercel",
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  // Transform the data to include full URLs
  return {
    ...popupData,
    imageUrl: `https://dve7rykno93gs.cloudfront.net${popupData.src}`,
    linkUrl: `https://meqasa.com${popupData.href}`,
  };
}

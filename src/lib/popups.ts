import { getHomepagePopup } from "./get-homepage-popup";
import { getResultsPopup, type ResultsPopupParams } from "./get-results-popup";
import type { PopupDataWithUrls } from "@/types";

export { getHomepagePopup, getResultsPopup };
export type { ResultsPopupParams, PopupDataWithUrls };

/**
 * Utility function to check if popup data is valid
 * @param popupData - The popup data to validate
 * @returns boolean indicating if the popup data is valid
 */
export function isValidPopupData(popupData: PopupDataWithUrls): boolean {
  return !!(
    popupData?.imageUrl &&
    popupData?.linkUrl &&
    popupData?.title &&
    popupData?.alt
  );
}

/**
 * Utility function to get popup data based on the current page context
 * @param pageType - The type of page ('homepage' | 'results')
 * @param resultsParams - Optional parameters for results page
 * @returns Promise that resolves to popup data or null if not available
 */
export async function getPopupData(
  pageType: "homepage" | "results",
  resultsParams?: ResultsPopupParams
): Promise<PopupDataWithUrls | null> {
  try {
    if (pageType === "homepage") {
      const popupData = await getHomepagePopup();
      return isValidPopupData(popupData) ? popupData : null;
    } else if (pageType === "results" && resultsParams) {
      const popupData = await getResultsPopup(resultsParams);
      return isValidPopupData(popupData) ? popupData : null;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch popup data:", error);
    return null;
  }
}

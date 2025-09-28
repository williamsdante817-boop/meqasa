/**
 * Data utilities for listing detail page
 * Handles data transformation, URL building, and business logic
 */

import type { ListingDetails } from "@/types/property";

// Extract numeric price from price string
export function extractNumericPrice(text: string): string {
  if (!text || typeof text !== "string") return "0";

  const plainNumberRegex = /([0-9]+(?:\.[0-9]+)?)/;
  const plainMatch = plainNumberRegex.exec(text);

  return plainMatch?.[1] ?? "0";
}

// Build similar listings search URL
export function buildSimilarSearchHref(listingDetail: ListingDetails): string {
  const contract = listingDetail.contract.toLowerCase();
  const location = listingDetail.location.toLowerCase();
  const type = listingDetail.type.toLowerCase();

  const similarSearchParams = new URLSearchParams({
    q: location,
    page: "1",
    ftype: type,
  });

  const numBeds = Number.parseInt(listingDetail.beds, 10);
  const numBaths = Number.parseInt(listingDetail.baths, 10);

  if (!Number.isNaN(numBeds) && numBeds > 0)
    similarSearchParams.set("fbeds", String(numBeds));
  if (!Number.isNaN(numBaths) && numBaths > 0)
    similarSearchParams.set("fbaths", String(numBaths));

  return `/search/${contract}?${similarSearchParams.toString()}`;
}

// Build agent profile URL
export function buildAgentHref(ownerName: string, ownerPageUrl: string): string {
  const agentNameEncoded = encodeURIComponent(ownerName);

  let agentIdFromPage = "";
  const qMarkIndex = ownerPageUrl.indexOf("?");

  if (qMarkIndex !== -1) {
    const queryString = ownerPageUrl.slice(qMarkIndex + 1);
    const sp = new URLSearchParams(queryString);
    agentIdFromPage = sp.get("g") ?? "";
  } else {
    const execResult = /[?&]g=([^&]+)/.exec(ownerPageUrl);
    agentIdFromPage = execResult?.[1] ?? "";
  }

  return agentIdFromPage
    ? `/agents/${agentNameEncoded}?g=${encodeURIComponent(agentIdFromPage)}`
    : `/agents/${agentNameEncoded}`;
}

// Determine if property is furnished
export function getIsFurnished(isfurnished: boolean | string | undefined): boolean {
  if (typeof isfurnished === "boolean") return isfurnished;

  if (typeof isfurnished === "string") {
    return ["1", "true", "yes", "y"].includes(isfurnished.toLowerCase());
  }

  return false;
}

// Build property details array
export function buildPropertyDetails(listingDetail: ListingDetails) {
  return [
    { title: "Type", value: listingDetail.type || "Not specified" },
    { title: "Contract", value: listingDetail.contract || "Not specified" },
    { title: "Location", value: listingDetail.location || "Not specified" },
    { title: "Bedrooms", value: listingDetail.beds || "Not specified" },
    { title: "Bathrooms", value: listingDetail.baths || "Not specified" },
    { title: "Garages", value: listingDetail.garages || "Not specified" },
    {
      title: "Area",
      value: listingDetail.floorarea
        ? `${listingDetail.floorarea} ㎡`
        : "Not specified",
    },
    {
      title: "Furnished",
      value: listingDetail.isfurnished !== ""
        ? listingDetail.isfurnished
        : "Not specified",
    },
    {
      title: "Date Registered",
      value: listingDetail.datelisted || "Not specified",
    },
  ];
}

// Validate listing data
export function validateListingData(listingDetail: ListingDetails | null): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!listingDetail) {
    errors.push("No listing data provided");
    return { isValid: false, errors };
  }

  // Check required fields
  if (!listingDetail.listingid) errors.push("Missing listing ID");
  if (!listingDetail.title) errors.push("Missing listing title");
  if (!listingDetail.owner?.name) errors.push("Missing owner information");

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Constants
export const CONTRACT_TYPES = {
  SALE: "sale",
  RENT: "rent",
} as const;

export const PROPERTY_TYPES = {
  LAND: "land",
} as const;
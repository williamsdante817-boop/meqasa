export interface MeqasaOwner {
  name: string;
  first: string;
  image: string;
}

export interface MeqasaListing {
  photocount: string;
  recency: string;
  detailrequest: string;
  image: string;
  streetaddress: string;
  locationstring: string;
  floorarea: string;
  bathroomcount: string;
  bedroomcount: string;
  garagecount: string;
  listingid: string;
  type: string;
  contract: "rent" | "sale";
  summary: string;
  description: string;
  owner: MeqasaOwner;
  pricepart1: string;
  pricepart2: string;
  availability: string;
}

export interface MeqasaDefaultResponse {
  featuredforrent: MeqasaListing[];
  featuredforsale: MeqasaListing[];
  latestforrent: MeqasaListing[];
  latestforsale: MeqasaListing[];
  badge: string;
}

export interface MeqasaSimilarResponse {
  similar: MeqasaListing[];
}

export interface MeqasaSearchResponse {
  resultcount: number;
  results: MeqasaListing[];
  searchid: number;
}

export type PropertyType =
  | "apartment"
  | "house"
  | "office"
  | "warehouse"
  | "guesthouse"
  | "townhouse"
  | "land";
export type ContractType = "rent" | "sale";
export type RentPeriod = "shortrent" | "longrent";
export type SortOrder = "date" | "date2" | "price" | "price2";

export interface MeqasaSearchParams {
  ftype?: PropertyType;
  fbeds?: number | "- Any -";
  fbaths?: number | "- Any -";
  fmin?: number;
  fmax?: number;
  fisfurnished?: 0 | 1;
  ffsbo?: 0 | 1;
  frentperiod?: RentPeriod | "- Any -";
  fsort?: SortOrder;
  app: "vercel";
}

export interface MeqasaLoadMoreParams {
  y: number; // searchid from previous search
  w: number; // page number
}

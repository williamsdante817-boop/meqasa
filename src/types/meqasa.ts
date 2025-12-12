export interface MeqasaOwner {
  haswan: boolean;
  name: string;
  first: string;
  image: string;
  verification: string;
  type: string;
  page: string;
}

export interface MeqasaListing {
  istopad: boolean;
  photocount: string;
  recency: string;
  detailreq: string;
  image: string;
  image2: string;
  streetaddress: string;
  locationstring: string;
  floorarea: string;
  bathroomcount: string;
  bedroomcount: string;
  garagecount: string;
  listingid: string;
  isunit: boolean;
  type: string;
  contract: "rent" | "sale";
  summary: string;
  description: string | null;
  owner: MeqasaOwner;
  pdr: string;
  priceval: number;
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

export interface MeqasaProject {
  city: string;
  projectname: string;
  projectid: string;
  photo: string;
  logo: string;
  name: string;
}

export interface MeqasaEmptyProject {
  empty: boolean;
}

export interface MeqasaSearchResponse {
  searchid: number;
  resultcount: number;
  topads: MeqasaListing[];
  project1: MeqasaProject | MeqasaEmptyProject;
  results: MeqasaListing[];
  project2: MeqasaProject | MeqasaEmptyProject;
  bottomads: MeqasaListing[];
  searchdesc: string;
  hasError?: boolean;
}

export type PropertyType =
  | "apartment"
  | "house"
  | "office"
  | "land"
  | "townhouse"
  | "commercial space"
  | "warehouse"
  | "guest house"
  | "shop"
  | "retail"
  | "beach house"
  | "hotel"
  | "studio apartment";
export type ContractType = "rent" | "sale";
export type RentPeriod = "shortrent" | "longrent" | "- Any -";
export type SortOrder = "date" | "date2" | "price" | "price2";
export type ShortLetDuration = "day" | "week" | "month" | "month3" | "month6";

export interface MeqasaSearchParams {
  ftype?: PropertyType;
  fbeds?: number | "- Any -";
  fbaths?: number | "- Any -";
  fmin?: number;
  fmax?: number;
  fminarea?: number;
  fmaxarea?: number;
  fisfurnished?: "1";
  ffsbo?: "1";
  frentperiod?: RentPeriod;
  fsort?: SortOrder;
  fhowshort?: ShortLetDuration; // New parameter for short-let duration
  app: "vercel";
}

export interface MeqasaLoadMoreParams {
  y: number; // searchid from previous search
  w: number; // page number
}

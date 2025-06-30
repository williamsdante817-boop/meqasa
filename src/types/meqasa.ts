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
export type RentPeriod = "shortrent" | "longrent" | "- Any -";
export type SortOrder = "date" | "date2" | "price" | "price2";

export interface MeqasaSearchParams {
  ftype?: PropertyType;
  fbeds?: number | "- Any -";
  fbaths?: number | "- Any -";
  fmin?: number;
  fmax?: number;
  fisfurnished?: 1;
  ffsbo?: 1;
  frentperiod?: RentPeriod;
  fsort?: SortOrder;
  app: "vercel";
}

export interface MeqasaLoadMoreParams {
  y: number; // searchid from previous search
  w: number; // page number
}

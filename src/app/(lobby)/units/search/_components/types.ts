// Shared types for units search module

export interface DeveloperUnit {
  id: string;
  unitid?: number;
  title: string;
  price: string;
  location: string;
  address?: string;
  city?: string;
  bedrooms: number;
  beds?: number;
  bathrooms: number;
  baths?: number;
  unittype: string;
  unittypename?: string;
  terms: "sale" | "rent" | "preselling";
  image?: string;
  coverphoto?: string;
  developer?: string;
  companyname?: string;
  name?: string;
  area?: string;
  floorarea?: number;
  featured?: boolean;
  description?: string;
  developermobile?: string;
  developeremail?: string;
  developerlogo?: string;
  timestamp?: string;
  dateadded?: string;
  updated_at?: string;
  sellingprice?: number;
  sellingpricecsign?: string;
  rentpricepermonth?: number;
  rentpricecsignpermonth?: string;
  [key: string]: any;
}

export interface SearchParams {
  terms?: "sale" | "rent" | "preselling";
  unittype?: string;
  address?: string;
  maxprice?: string;
  beds?: string;
  baths?: string;
  page?: string;
  sort?: string;
  [key: string]: string | string[] | undefined;
}

export interface SearchResultsProps {
  initialUnits: DeveloperUnit[];
  searchParams: SearchParams;
  totalCount?: number;
  hasMore?: boolean;
}

export interface ApiSearchParams {
  app: string;
  terms?: string;
  unittype?: string;
  address?: string;
  maxprice?: number;
  beds?: number;
  baths?: number;
  page?: number;
  limit?: number;
}

export interface MetadataGeneratorParams {
  terms?: string | string[];
  unittype?: string | string[];
  address?: string | string[];
  beds?: string | string[];
  baths?: string | string[];
  maxprice?: string | string[];
}

export interface LocationLink {
  title: string;
  href: string;
  aria?: string;
}

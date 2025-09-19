// Shared types for the projects module

export interface SearchParams {
  terms?: "sale" | "rent" | "preselling";
  unittype?: string;
  address?: string;
  maxprice?: string;
  beds?: string;
  baths?: string;
  category?: "featured" | "new";
  sort?: "newest" | "price-low" | "price-high" | "bedrooms" | "popularity";
  [key: string]: string | string[] | undefined;
}

export interface ApiParams {
  app: string;
  terms?: string;
  unittype?: string;
  address?: string;
  maxprice?: number;
  beds?: number;
  baths?: number;
}

export interface FilterOption {
  value: string;
  label: string;
}

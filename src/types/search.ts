export interface FormState {
  search: string;
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  minPrice: string;
  maxPrice: string;
  minArea: string;
  maxArea: string;
  period: string;
  sort: string;
  furnished: boolean;
  owner: boolean;
  howShort?: string; // New field for short-let duration
}

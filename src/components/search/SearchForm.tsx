"use client";

import { type FormState } from "@/types/search";
import { SearchInput } from "./SearchInput";
import { useRouter, usePathname } from "next/navigation";

interface SearchFormProps {
  type: string;
  children: React.ReactNode;
  formState: FormState;
  updateFormState: (updates: Partial<FormState>) => void;
}

export function SearchForm({
  type,
  children,
  formState,
  updateFormState,
}: SearchFormProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Map UI contract types to API contract types
  const contractMap: Record<string, string> = {
    rent: "rent",
    buy: "sale",
    land: "sale",
    "short-let": "rent",
  };

  // Get the actual contract type from URL path if available
  const getContractType = () => {
    if (pathname.includes("/search/")) {
      const pathSegments = pathname.split("/");
      const urlContractType = pathSegments[pathSegments.length - 1];
      return urlContractType ?? type;
    }
    return type;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Set default location to 'ghana' if not provided
    const searchValue =
      formState.search && formState.search.trim() !== ""
        ? formState.search.toLowerCase()
        : "ghana";

    // Get the API-compliant contract type
    const apiContract = contractMap[getContractType()] ?? getContractType();

    // Build search params according to API documentation
    const searchParams = new URLSearchParams();
    searchParams.set("q", searchValue);

    // Property type
    if (formState.propertyType && formState.propertyType !== "all") {
      searchParams.set("ftype", formState.propertyType);
    }

    // Bedrooms and bathrooms - only add if they have valid numeric values
    if (formState.bedrooms && formState.bedrooms !== "- Any -") {
      const bedsNum = Number(formState.bedrooms);
      if (!isNaN(bedsNum) && bedsNum > 0) {
        searchParams.set("fbeds", String(bedsNum));
      }
    }
    if (formState.bathrooms && formState.bathrooms !== "- Any -") {
      const bathsNum = Number(formState.bathrooms);
      if (!isNaN(bathsNum) && bathsNum > 0) {
        searchParams.set("fbaths", String(bathsNum));
      }
    }

    // Price range - only add if they have valid numeric values
    if (formState.minPrice && formState.minPrice.trim() !== "") {
      const minPriceNum = Number(formState.minPrice);
      if (!isNaN(minPriceNum) && minPriceNum > 0) {
        searchParams.set("fmin", String(minPriceNum));
      }
    }
    if (formState.maxPrice && formState.maxPrice.trim() !== "") {
      const maxPriceNum = Number(formState.maxPrice);
      if (!isNaN(maxPriceNum) && maxPriceNum > 0) {
        searchParams.set("fmax", String(maxPriceNum));
      }
    }

    // Rent period
    if (formState.period && formState.period !== "- Any -") {
      searchParams.set("frentperiod", formState.period);
    }

    // Sort order
    if (formState.sort) {
      searchParams.set("fsort", formState.sort);
    }

    // Boolean filters
    if (formState.furnished) {
      searchParams.set("fisfurnished", "1");
    }
    if (formState.owner) {
      searchParams.set("ffsbo", "1");
    }

    // Short-let specific parameters
    if (type === "short-let") {
      // Set required short-let parameters
      searchParams.set("frentperiod", "shortrent");
      searchParams.set("ftype", "- Any -"); // Required for short-let searches

      // fhowshort is REQUIRED for short-let searches according to API docs
      // Send user's actual selection, don't force defaults
      if (formState.howShort && formState.howShort !== "- Any -") {
        searchParams.set("fhowshort", formState.howShort);
      }
      // Don't send fhowshort when user selects "- Any -" - let API route handle the default
    }

    // console.log("Search Params:", Object.fromEntries(searchParams.entries()));

    // Navigate to search page with parameters (no y or page for new search)
    router.push(`/search/${apiContract}?${searchParams.toString()}`);
  };

  return (
    <form
      id={`search-form-${type}`}
      onSubmit={handleSubmit}
      role="search"
      aria-label={`Search for properties to ${type === "buy" ? "purchase" : type}`}
    >
      <input type="hidden" name="searchType" value={type} />
      <SearchInput
        onSubmit={(e) => e.preventDefault()}
        searchValue={formState.search}
        onSearchChange={(value) => updateFormState({ search: value })}
      />
      {children}
    </form>
  );
}

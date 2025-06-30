"use client";

import { Input } from "@/components/ui/input";
import { type FormState } from "@/types/search";
import { SearchInput } from "./SearchInput";
import { useRouter } from "next/navigation";

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

  // Map UI contract types to API contract types
  const contractMap: Record<string, string> = {
    rent: "rent",
    buy: "sale",
    land: "sale",
    "short-let": "rent",
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Set default location to 'ghana' if not provided
    const searchValue =
      formState.search && formState.search.trim() !== ""
        ? formState.search
        : "ghana";

    // Get the API-compliant contract type
    const apiContract = contractMap[type] ?? type;

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

    console.log("Search Params:", Object.fromEntries(searchParams.entries()));

    // Set a flag in sessionStorage to indicate this is a manual search update
    // This will be checked by the SearchResults component to prevent duplicate API calls
    sessionStorage.setItem("manualSearchUpdate", "true");

    // Navigate to search page with parameters
    router.push(`/search/${apiContract}?${searchParams.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="radio"
        value={type}
        name={type}
        className="hidden"
        checked
        readOnly
      />
      <SearchInput
        onSubmit={(e) => e.preventDefault()}
        searchValue={formState.search}
        onSearchChange={(value) => updateFormState({ search: value })}
      />
      {children}
    </form>
  );
}

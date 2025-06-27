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
  onSubmit: () => void;
}

export function SearchForm({
  type,
  children,
  formState,
  updateFormState,
}: SearchFormProps) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Set default location to 'ghana' if not provided
    const searchValue =
      formState.search && formState.search.trim() !== ""
        ? formState.search
        : "ghana";

    // Build search params
    const searchParams = new URLSearchParams();
    searchParams.set("contract", type);
    searchParams.set("q", searchValue);

    // Add property type if not default
    if (formState.propertyType && formState.propertyType !== "all") {
      searchParams.set("ftype", formState.propertyType);
      searchParams.set("type", formState.propertyType);
    }

    // Add bedrooms if not default
    if (formState.bedrooms && formState.bedrooms !== "-Any-") {
      searchParams.set("fbeds", formState.bedrooms);
    }

    // Add bathrooms if not default
    if (formState.bathrooms && formState.bathrooms !== "-Any-") {
      searchParams.set("fbaths", formState.bathrooms);
    }

    // Add price range if present
    if (formState.minPrice) {
      searchParams.set("fmin", formState.minPrice);
    }
    if (formState.maxPrice) {
      searchParams.set("fmax", formState.maxPrice);
    }

    // Add period if present
    if (formState.period && formState.period !== "all") {
      searchParams.set("frentperiod", formState.period);
    }

    // Add sort if present
    if (formState.sort) {
      searchParams.set("fsort", formState.sort);
    }

    // Add boolean filters
    if (formState.furnished) {
      searchParams.set("fisfurnished", "1");
    }
    if (formState.owner) {
      searchParams.set("ffsbo", "1");
    }

    // Navigate to search page with parameters
    router.push(`/search/${type}?${searchParams.toString()}`);
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

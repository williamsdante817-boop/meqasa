"use client";

import { SearchInputWithSuggestions } from "@/components/ui/search-input-with-suggestions";

interface SearchInputProps {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void; // Make optional for backward compatibility
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function SearchInput({
  onSubmit,
  searchValue,
  onSearchChange,
}: SearchInputProps) {
  return (
    <SearchInputWithSuggestions
      variant="home"
      value={searchValue}
      onChange={onSearchChange}
      onSubmit={onSubmit}
      placeholder="Search for location"
      showButton={true}
      buttonText="Search"
      maxSuggestions={5}
    />
  );
}

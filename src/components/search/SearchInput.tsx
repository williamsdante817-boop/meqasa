/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { mockLocations } from "@/config/locations";

interface SearchInputProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function SearchInput({
  onSubmit,
  searchValue,
  onSearchChange,
}: SearchInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      if (searchQuery.length > 0) {
        const filtered = mockLocations.filter((location) =>
          location.toLowerCase().includes(searchQuery.toLowerCase()),
        );
        setSuggestions(filtered.slice(0, 5));
        if (isInputFocused) {
          setShowSuggestions(true);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    },
    [isInputFocused],
  );

  // Debounce utility function
  function debounce<T>(func: (arg: T) => void, wait: number): (arg: T) => void {
    let timeout: NodeJS.Timeout;
    return function executedFunction(arg: T) {
      const later = () => {
        clearTimeout(timeout);
        func(arg);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  useEffect(() => {
    const debouncedFn = debounce(debouncedSearch, 300);
    debouncedFn(searchValue);
  }, [searchValue, debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          selectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const selectSuggestion = (location: string) => {
    onSearchChange(location);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
    if (searchValue && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
    // Small delay to allow for suggestion click
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 200);
  };

  // Handle clicks outside the component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".search-input-container")) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative search-input-container">
      <div className="relative mt-3 hidden h-[60px] w-full items-center rounded-xl bg-white shadow-sm lg:flex">
        <Label htmlFor="query" className="sr-only">
          search
        </Label>
        <SearchIcon className="absolute left-4 z-10" />
        <Input
          id="query"
          name="search"
          placeholder="Search for location"
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="h-full rounded-xl border-none py-4 pl-[52px] pr-4 text-base font-light text-b-accent shadow-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 lg:rounded-l-xl lg:rounded-r-none"
        />
        <Button
          type="submit"
          className="my-1.5 mr-1.5 hidden h-12 w-[115px] rounded-lg bg-rose-500 hover:bg-rose-500/90 font-bold md:block"
        >
          Search
        </Button>
      </div>

      {/* Location Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          className="absolute top-[75px] left-0 right-0 z-[100] hidden lg:block"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
            {suggestions.map((location, index) => (
              <div
                key={location}
                className={`px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                  index === selectedIndex
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700"
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectSuggestion(location);
                }}
              >
                <div className="flex items-center">
                  <Search className="w-4 h-4 mr-3 text-gray-400" />
                  <span className="text-sm">{location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

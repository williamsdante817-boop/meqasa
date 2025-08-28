"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, MapPin, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { mockLocations } from "@/config/locations";

interface MobileSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function MobileSearchInput({
  value,
  onChange,
  placeholder = "Search for location",
  className,
}: MobileSearchInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search function
  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      if (searchQuery.length > 0) {
        const filtered = mockLocations.filter((location) =>
          location.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSuggestions(filtered.slice(0, 8)); // Show more suggestions on mobile
        setShowSuggestions(isFocused && filtered.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    },
    [isFocused]
  );

  // Debounce utility
  const debounce = useCallback(<T,>(func: (arg: T) => void, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function executedFunction(arg: T) {
      const later = () => {
        clearTimeout(timeout);
        func(arg);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }, []);

  useEffect(() => {
    const debouncedFn = debounce(debouncedSearch, 200); // Faster response on mobile
    debouncedFn(value);
  }, [value, debouncedSearch, debounce]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
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
        inputRef.current?.blur();
        break;
    }
  };

  const selectSuggestion = (location: string) => {
    onChange(location);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (value && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for selection
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }, 150);
  };

  const clearInput = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn(
            "h-12 pl-10 pr-10 text-base bg-gray-50 border-gray-200 rounded-lg",
            "focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20",
            "placeholder:text-gray-500 placeholder:text-base"
          )}
          aria-describedby={showSuggestions ? "search-suggestions" : undefined}
          aria-expanded={showSuggestions}
          aria-autocomplete="list"
          role="combobox"
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearInput}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
          >
            <X className="h-4 w-4 text-gray-400" />
          </Button>
        )}
      </div>

      {/* Mobile-optimized Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-[1000001] mt-1" role="listbox" aria-label="Location suggestions">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-y-auto">
            {suggestions.map((location, index) => (
              <button
                key={location}
                type="button"
                className={cn(
                  "w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0",
                  "focus:outline-none focus:bg-gray-50",
                  index === selectedIndex && "bg-rose-50 text-rose-600"
                )}
                role="option"
                aria-selected={index === selectedIndex}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectSuggestion(location);
                }}
              >
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-3 text-gray-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {location}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
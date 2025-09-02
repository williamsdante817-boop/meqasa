/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, SearchIcon, MapPin, Clock, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { mockLocations } from "@/config/locations";

// Enhanced suggestion types
interface Suggestion {
  text: string;
  type: 'location' | 'recent' | 'popular';
  icon: React.ComponentType<{ className?: string }>;
}

// Popular searches - can be dynamic from API later
const popularSearches = [
  "East Legon", "Airport Residential", "Cantonments", 
  "Labone", "Roman Ridge", "Dzorwulu"
];

// Recent searches helper (localStorage)
const getRecentSearches = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const recent = localStorage.getItem('meqasa_recent_searches');
    if (recent) {
      const parsed = JSON.parse(recent) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.slice(0, 3) as string[];
      }
    }
    return [];
  } catch {
    return [];
  }
};

const saveRecentSearch = (search: string) => {
  if (typeof window === 'undefined' || !search.trim()) return;
  try {
    const recent = getRecentSearches();
    const updated = [search, ...recent.filter(r => r !== search)].slice(0, 5);
    localStorage.setItem('meqasa_recent_searches', JSON.stringify(updated));
  } catch {
    // Silently fail if localStorage is not available
  }
};

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
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [justSelected, setJustSelected] = useState(false);

  // Generate enhanced suggestions
  const generateSuggestions = useCallback((searchQuery: string): Suggestion[] => {
    const suggestions: Suggestion[] = [];
    
    if (searchQuery.length === 0) {
      // Show recent searches and popular when no query
      const recent = getRecentSearches();
      recent.forEach(search => {
        suggestions.push({
          text: search,
          type: 'recent',
          icon: Clock
        });
      });
      
      // Add popular searches if we have space
      const remaining = 5 - suggestions.length;
      popularSearches.slice(0, remaining).forEach(search => {
        if (!suggestions.some(s => s.text === search)) {
          suggestions.push({
            text: search,
            type: 'popular',
            icon: TrendingUp
          });
        }
      });
    } else if (searchQuery.length > 0) {
      // Filter locations based on query
      const filtered = mockLocations?.filter((location) =>
        location.toLowerCase().includes(searchQuery.toLowerCase())
      ) || [];
      
      
      filtered.slice(0, 5).forEach(location => {
        suggestions.push({
          text: location,
          type: 'location',
          icon: MapPin
        });
      });
    }
    
    return suggestions;
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      // Don't show suggestions immediately after a selection
      if (justSelected) return;
      
      const enhancedSuggestions = generateSuggestions(searchQuery);
      setSuggestions(enhancedSuggestions);
      if (isInputFocused && enhancedSuggestions.length > 0) {
        setShowSuggestions(true);
      } else if (enhancedSuggestions.length === 0) {
        setShowSuggestions(false);
      }
    },
    [isInputFocused, generateSuggestions, justSelected],
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
    if (!showSuggestions || suggestions.length === 0) return;

    // Create flat suggestions array for navigation (same as in render)
    const groupedSuggestions = {
      recent: suggestions.filter(s => s.type === 'recent'),
      popular: suggestions.filter(s => s.type === 'popular'),
      location: suggestions.filter(s => s.type === 'location')
    };
    
    const flatSuggestions = [
      ...groupedSuggestions.recent,
      ...groupedSuggestions.popular,
      ...groupedSuggestions.location
    ];

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < flatSuggestions.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && flatSuggestions[selectedIndex]) {
          selectSuggestion(flatSuggestions[selectedIndex].text);
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
    saveRecentSearch(location); // Save to recent searches
    setShowSuggestions(false);
    setSelectedIndex(-1);
    setIsInputFocused(false); // Prevent suggestions from showing immediately after selection
    setJustSelected(true); // Flag to prevent immediate re-triggering of suggestions
    
    // Reset the flag after a shorter delay to allow typing sooner
    setTimeout(() => {
      setJustSelected(false);
    }, 300);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
    // Don't show suggestions immediately after selection
    if (justSelected) return;
    
    // Generate fresh suggestions when focused (including recent/popular)
    const freshSuggestions = generateSuggestions(searchValue);
    setSuggestions(freshSuggestions);
    if (freshSuggestions.length > 0) {
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
      <div className={`relative mt-3 hidden h-[60px] w-full items-center rounded-lg bg-white shadow-sm lg:flex transition-all duration-200 ${
        isInputFocused 
          ? 'ring-2 ring-brand-primary/50 ring-offset-2 shadow-lg' 
          : 'hover:shadow-md'
      }`}>
        <Label htmlFor="query" className="sr-only">
          search
        </Label>
        <SearchIcon className={`absolute left-4 z-10 transition-colors duration-200 ${
          isInputFocused ? 'text-brand-primary' : 'text-gray-400'
        }`} />
        <Input
          id="query"
          name="search"
          type="search"
          placeholder="Search for location"
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="h-full rounded-lg border-none py-4 pl-[52px] pr-4 text-base font-light text-b-accent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none lg:rounded-l-xl lg:rounded-r-none placeholder:text-base placeholder:text-gray-400 transition-all duration-200"
          role="combobox"
          aria-expanded={showSuggestions}
          aria-haspopup="listbox"
          aria-controls="location-suggestions"
          aria-activedescendant={selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined}
          aria-autocomplete="list"
          aria-describedby="search-instructions"
        />
        <Button
          type="submit"
          className="my-1.5 mr-1.5 hidden h-12 w-[115px] rounded-lg bg-rose-500 hover:bg-rose-500/90 font-bold md:block"
          aria-label="Search for properties"
        >
          Search
        </Button>
        <div id="search-instructions" className="sr-only">
          Use arrow keys to navigate suggestions, press Enter to select, or Escape to close.
        </div>
      </div>

      {/* Location Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          className="absolute top-[75px] left-0 right-0 z-[100] hidden lg:block"
          onMouseDown={(e) => e.preventDefault()}
        >
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
            {(() => {
              // Group suggestions by type
              const groupedSuggestions = {
                recent: suggestions.filter(s => s.type === 'recent'),
                popular: suggestions.filter(s => s.type === 'popular'),
                location: suggestions.filter(s => s.type === 'location')
              };

              // Create flat array for keyboard navigation but keep grouped display
              const flatSuggestions = [
                ...groupedSuggestions.recent,
                ...groupedSuggestions.popular,
                ...groupedSuggestions.location
              ];

              let currentIndex = 0;

              return (
                <ul id="location-suggestions" role="listbox" aria-label="Location suggestions">
                  {/* Recent Searches Section */}
                  {groupedSuggestions.recent.length > 0 && (
                    <>
                      <li className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                          Recent Searches
                        </span>
                      </li>
                      {groupedSuggestions.recent.map((suggestion) => {
                        const IconComponent = suggestion.icon;
                        const isSelected = currentIndex === selectedIndex;
                        currentIndex++;
                        
                        return (
                          <li
                            key={`${suggestion.type}-${suggestion.text}`}
                            id={`suggestion-${currentIndex - 1}`}
                            role="option"
                            aria-selected={isSelected}
                            className={`pl-8 pr-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                              isSelected
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-700"
                            }`}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              selectSuggestion(suggestion.text);
                            }}
                          >
                            <div className="flex items-center">
                              <IconComponent className="w-4 h-4 mr-3 text-orange-500" aria-hidden="true" />
                              <span className="text-sm font-medium">{suggestion.text}</span>
                            </div>
                          </li>
                        );
                      })}
                    </>
                  )}

                  {/* Popular Locations Section */}
                  {groupedSuggestions.popular.length > 0 && (
                    <>
                      <li className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                          Popular Locations
                        </span>
                      </li>
                      {groupedSuggestions.popular.map((suggestion) => {
                        const IconComponent = suggestion.icon;
                        const isSelected = currentIndex === selectedIndex;
                        currentIndex++;
                        
                        return (
                          <li
                            key={`${suggestion.type}-${suggestion.text}`}
                            id={`suggestion-${currentIndex - 1}`}
                            role="option"
                            aria-selected={isSelected}
                            className={`pl-8 pr-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                              isSelected
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-700"
                            }`}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              selectSuggestion(suggestion.text);
                            }}
                          >
                            <div className="flex items-center">
                              <IconComponent className="w-4 h-4 mr-3 text-green-500" aria-hidden="true" />
                              <span className="text-sm font-medium">{suggestion.text}</span>
                            </div>
                          </li>
                        );
                      })}
                    </>
                  )}

                  {/* Location Results Section */}
                  {groupedSuggestions.location.length > 0 && (
                    <>
                      <li className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                          Results
                        </span>
                      </li>
                      {groupedSuggestions.location.map((suggestion) => {
                        const IconComponent = suggestion.icon;
                        const isSelected = currentIndex === selectedIndex;
                        currentIndex++;
                        
                        return (
                          <li
                            key={`${suggestion.type}-${suggestion.text}`}
                            id={`suggestion-${currentIndex - 1}`}
                            role="option"
                            aria-selected={isSelected}
                            className={`pl-8 pr-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                              isSelected
                                ? "bg-blue-50 text-blue-600"
                                : "text-gray-700"
                            }`}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              selectSuggestion(suggestion.text);
                            }}
                          >
                            <div className="flex items-center">
                              <IconComponent className="w-4 h-4 mr-3 text-blue-500" aria-hidden="true" />
                              <span className="text-sm font-medium">{suggestion.text}</span>
                            </div>
                          </li>
                        );
                      })}
                    </>
                  )}
                </ul>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

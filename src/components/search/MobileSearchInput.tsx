"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, MapPin, X, Clock, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isFocused, setIsFocused] = useState(false);
  const [justSelected, setJustSelected] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
      const remaining = 6 - suggestions.length;
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
      
      filtered.slice(0, 8).forEach(location => {
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
      setShowSuggestions(isFocused && enhancedSuggestions.length > 0);
    },
    [isFocused, generateSuggestions, justSelected]
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
          prev < flatSuggestions.length - 1 ? prev + 1 : prev
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
        inputRef.current?.blur();
        break;
    }
  };

  const selectSuggestion = (location: string) => {
    onChange(location);
    saveRecentSearch(location); // Save to recent searches
    setShowSuggestions(false);
    setSelectedIndex(-1);
    setIsFocused(false);
    setJustSelected(true);
    inputRef.current?.blur();
    
    // Reset the flag after a short delay
    setTimeout(() => {
      setJustSelected(false);
    }, 300);
  };

  const handleFocus = () => {
    setIsFocused(true);
    // Don't show suggestions immediately after selection
    if (justSelected) return;
    
    // Generate fresh suggestions when focused (including recent/popular)
    const freshSuggestions = generateSuggestions(value);
    setSuggestions(freshSuggestions);
    if (freshSuggestions.length > 0) {
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
            "focus:bg-white focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/50",
            "placeholder:text-gray-500 placeholder:text-base transition-all duration-200"
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
            <X className="h-5 w-5 text-gray-400" />
          </Button>
        )}
      </div>

      {/* Mobile-optimized Suggestions with Sections */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-[1000001] mt-1" role="listbox" aria-label="Location suggestions">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-y-auto">
            {(() => {
              // Group suggestions by type
              const groupedSuggestions = {
                recent: suggestions.filter(s => s.type === 'recent'),
                popular: suggestions.filter(s => s.type === 'popular'),
                location: suggestions.filter(s => s.type === 'location')
              };

              let currentIndex = 0;

              return (
                <>
                  {/* Recent Searches Section */}
                  {groupedSuggestions.recent.length > 0 && (
                    <>
                      <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                          Recent Searches
                        </span>
                      </div>
                      {groupedSuggestions.recent.map((suggestion) => {
                        const IconComponent = suggestion.icon;
                        const isSelected = currentIndex === selectedIndex;
                        currentIndex++;
                        
                        return (
                          <button
                            key={`${suggestion.type}-${suggestion.text}`}
                            type="button"
                            className={cn(
                              "w-full pl-8 pr-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100",
                              "focus:outline-none focus:bg-gray-50 transition-colors",
                              isSelected && "bg-blue-50 text-blue-600"
                            )}
                            role="option"
                            aria-selected={isSelected}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              selectSuggestion(suggestion.text);
                            }}
                          >
                            <div className="flex items-center">
                              <IconComponent className="w-4 h-4 mr-3 text-orange-500 flex-shrink-0" />
                              <span className="text-sm font-medium text-gray-900 truncate">
                                {suggestion.text}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </>
                  )}

                  {/* Popular Locations Section */}
                  {groupedSuggestions.popular.length > 0 && (
                    <>
                      <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                          Popular Locations
                        </span>
                      </div>
                      {groupedSuggestions.popular.map((suggestion) => {
                        const IconComponent = suggestion.icon;
                        const isSelected = currentIndex === selectedIndex;
                        currentIndex++;
                        
                        return (
                          <button
                            key={`${suggestion.type}-${suggestion.text}`}
                            type="button"
                            className={cn(
                              "w-full pl-8 pr-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100",
                              "focus:outline-none focus:bg-gray-50 transition-colors",
                              isSelected && "bg-blue-50 text-blue-600"
                            )}
                            role="option"
                            aria-selected={isSelected}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              selectSuggestion(suggestion.text);
                            }}
                          >
                            <div className="flex items-center">
                              <IconComponent className="w-4 h-4 mr-3 text-green-500 flex-shrink-0" />
                              <span className="text-sm font-medium text-gray-900 truncate">
                                {suggestion.text}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </>
                  )}

                  {/* Location Results Section */}
                  {groupedSuggestions.location.length > 0 && (
                    <>
                      <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                        <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                          Results
                        </span>
                      </div>
                      {groupedSuggestions.location.map((suggestion) => {
                        const IconComponent = suggestion.icon;
                        const isSelected = currentIndex === selectedIndex;
                        currentIndex++;
                        
                        return (
                          <button
                            key={`${suggestion.type}-${suggestion.text}`}
                            type="button"
                            className={cn(
                              "w-full pl-8 pr-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0",
                              "focus:outline-none focus:bg-gray-50 transition-colors",
                              isSelected && "bg-blue-50 text-blue-600"
                            )}
                            role="option"
                            aria-selected={isSelected}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              selectSuggestion(suggestion.text);
                            }}
                          >
                            <div className="flex items-center">
                              <IconComponent className="w-4 h-4 mr-3 text-blue-500 flex-shrink-0" />
                              <span className="text-sm font-medium text-gray-900 truncate">
                                {suggestion.text}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
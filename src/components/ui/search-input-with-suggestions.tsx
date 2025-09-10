"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Search, MapPin, Clock, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { mockLocations } from "@/config/locations";
import { cn } from "@/lib/utils";

// Enhanced suggestion types
export interface Suggestion {
  text: string;
  type: "location" | "recent" | "popular";
  icon: React.ComponentType<{ className?: string }>;
}

// Popular searches - can be dynamic from API later
const popularSearches = [
  "East Legon",
  "Airport Residential",
  "Cantonments",
  "Labone",
  "Roman Ridge",
  "Dzorwulu",
];

// Recent searches helper (localStorage)
const getRecentSearches = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const recent = localStorage.getItem("meqasa_recent_searches");
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
  if (typeof window === "undefined" || !search.trim()) return;
  try {
    const recent = getRecentSearches();
    const updated = [search, ...recent.filter((r) => r !== search)].slice(0, 5);
    localStorage.setItem("meqasa_recent_searches", JSON.stringify(updated));
  } catch {
    // Silently fail if localStorage is not available
  }
};

// Generate enhanced suggestions
const generateSuggestions = (
  searchQuery: string,
  maxSuggestions = 5
): Suggestion[] => {
  const suggestions: Suggestion[] = [];

  if (searchQuery.length === 0) {
    // Show recent searches and popular when no query
    const recent = getRecentSearches();
    recent.forEach((search) => {
      suggestions.push({
        text: search,
        type: "recent",
        icon: Clock,
      });
    });

    // Add popular searches if we have space
    const remaining = maxSuggestions - suggestions.length;
    popularSearches.slice(0, remaining).forEach((search) => {
      if (!suggestions.some((s) => s.text === search)) {
        suggestions.push({
          text: search,
          type: "popular",
          icon: TrendingUp,
        });
      }
    });
  } else if (searchQuery.length > 0) {
    // Filter locations based on query
    const filtered =
      mockLocations?.filter((location) =>
        location.toLowerCase().includes(searchQuery.toLowerCase())
      ) || [];

    filtered.slice(0, maxSuggestions).forEach((location) => {
      suggestions.push({
        text: location,
        type: "location",
        icon: MapPin,
      });
    });
  }

  return suggestions;
};

// Variant-specific styling configurations
const getVariantStyles = (variant: "home" | "results" | "mobile") => {
  switch (variant) {
    case "home":
      return {
        container: "relative search-input-container",
        wrapper: (focused: boolean) =>
          cn(
            "relative mt-3 hidden h-[60px] w-full items-center rounded-lg bg-white shadow-sm lg:flex transition-all duration-200",
            focused
              ? "ring-2 ring-brand-primary/50 ring-offset-2 shadow-lg"
              : "hover:shadow-md"
          ),
        icon: (focused: boolean) =>
          cn(
            "absolute left-4 z-10 transition-colors duration-200",
            focused ? "text-brand-primary" : "text-gray-400"
          ),
        input:
          "h-full rounded-lg border-none py-4 pl-[52px] pr-4 text-sm sm:text-base font-light text-b-accent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none lg:rounded-l-xl lg:rounded-r-none placeholder:text-base placeholder:text-gray-400 transition-all duration-200",
        dropdown: "absolute top-[75px] left-0 right-0 z-[100] hidden lg:block",
        dropdownContent:
          "bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto",
      };

    case "results":
      return {
        container:
          "relative flex-1 min-w-[180px] sm:min-w-[200px] search-input-container",
        wrapper: (focused: boolean) =>
          cn(
            "relative transition-all duration-200 rounded-md",
            focused ? "ring-2 ring-brand-primary/50 ring-offset-1" : ""
          ),
        icon: (focused: boolean) =>
          cn(
            "absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-200",
            focused ? "text-brand-primary" : "text-brand-accent"
          ),
        input:
          "h-10 sm:h-12 pl-8 sm:pl-10 bg-white shadow-none border-gray-200 text-brand-accent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none hover:border-gray-300 transition-all duration-200 placeholder:text-gray-400 text-sm",
        dropdown: "", // Portal will handle positioning
        dropdownContent: "",
      };

    case "mobile":
      return {
        container: "relative w-full",
        wrapper: () => "relative",
        icon: () =>
          "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400",
        input:
          "h-12 pl-10 pr-10 text-base bg-gray-50 border-gray-200 rounded-lg text-gray-700 placeholder:text-gray-500",
        dropdown: "absolute top-full left-0 right-0 z-[999999] mt-1",
        dropdownContent:
          "bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto",
      };

    default:
      return getVariantStyles("home");
  }
};

interface SearchInputWithSuggestionsProps {
  variant?: "home" | "results" | "mobile";
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  placeholder?: string;
  showButton?: boolean;
  buttonText?: string;
  maxSuggestions?: number;
  className?: string;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export function SearchInputWithSuggestions({
  variant = "home",
  value,
  onChange,
  onSubmit: _onSubmit,
  placeholder = "Search for location",
  showButton = false,
  buttonText = "Search",
  maxSuggestions = 5,
  className = "",
  inputProps = {},
}: SearchInputWithSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [justSelected, setJustSelected] = useState(false);
  const [userIsTyping, setUserIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isSelectingRef = useRef(false);

  const styles = getVariantStyles(variant);

  // Debounced search function
  const debouncedSearch = useCallback(
    (searchQuery: string) => {
      // Only generate suggestions if user is typing or not just selected
      if (justSelected && !userIsTyping) return;

      const enhancedSuggestions = generateSuggestions(
        searchQuery,
        maxSuggestions
      );
      setSuggestions(enhancedSuggestions);
      if (isInputFocused && enhancedSuggestions.length > 0) {
        setShowSuggestions(true);
      } else if (enhancedSuggestions.length === 0) {
        setShowSuggestions(false);
      }

      // Reset typing flag after processing
      if (userIsTyping) {
        setUserIsTyping(false);
      }
    },
    [isInputFocused, justSelected, userIsTyping, maxSuggestions]
  );

  // Debounce utility
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
    debouncedFn(value);
  }, [value, debouncedSearch]);

  // Calculate dropdown position for portal (results variant only)
  // Use viewport-relative positioning so it stays under input without scrolling
  const getPortalPosition = useCallback(() => {
    if (variant === "results" && inputRef.current && showSuggestions) {
      const rect = inputRef.current.getBoundingClientRect();
      return {
        top: rect.bottom + 4, // Viewport-relative, no scroll offset
        left: rect.left, // Viewport-relative, no scroll offset
        width: Math.max(rect.width, 200),
      };
    }
    return { top: 0, left: 0, width: 200 };
  }, [variant, showSuggestions]);

  // Update position when scrolling to keep dropdown under input
  const [portalPosition, setPortalPosition] = useState({
    top: 0,
    left: 0,
    width: 200,
  });

  useEffect(() => {
    if (variant === "results" && showSuggestions) {
      const updatePosition = () => {
        setPortalPosition(getPortalPosition());
      };

      // Update position immediately
      updatePosition();

      // Update position on scroll/resize to keep it under the input
      window.addEventListener("scroll", updatePosition, { passive: true });
      window.addEventListener("resize", updatePosition, { passive: true });

      return () => {
        window.removeEventListener("scroll", updatePosition);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [variant, showSuggestions, getPortalPosition]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setSelectedIndex(-1);
    setUserIsTyping(true);

    // Clear justSelected flag when user is actively typing
    if (justSelected) {
      setJustSelected(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    // Create flat suggestions array for navigation
    const groupedSuggestions = {
      recent: suggestions.filter((s) => s.type === "recent"),
      popular: suggestions.filter((s) => s.type === "popular"),
      location: suggestions.filter((s) => s.type === "location"),
    };

    const flatSuggestions = [
      ...groupedSuggestions.recent,
      ...groupedSuggestions.popular,
      ...groupedSuggestions.location,
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
        break;
    }
  };

  const selectSuggestion = (location: string) => {
    // Immediately update the input value
    onChange(location);
    saveRecentSearch(location);

    // Hide suggestions and reset state
    setShowSuggestions(false);
    setSelectedIndex(-1);
    setIsInputFocused(false);
    setJustSelected(true);
    setUserIsTyping(false);

    // Reset selecting flag
    setTimeout(() => {
      isSelectingRef.current = false;
      setJustSelected(false);
    }, 500);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);

    // Show suggestions on focus only if not just selected, or if user has been typing
    if (justSelected && !userIsTyping) return;

    const freshSuggestions = generateSuggestions(value, maxSuggestions);
    setSuggestions(freshSuggestions);
    if (freshSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    if (variant !== "results") {
      setIsInputFocused(false);

      // Don't hide suggestions if user is in the middle of selecting
      if (isSelectingRef.current) {
        return;
      }

      const timeout = variant === "mobile" ? 150 : 200;
      setTimeout(() => {
        if (!isSelectingRef.current) {
          setShowSuggestions(false);
          setSelectedIndex(-1);
        }
      }, timeout);
    }
  };

  // Handle clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement;
      const containers = [
        ".search-input-container",
        "[data-dropdown-suggestions]",
      ];
      if (!containers.some((selector) => target.closest(selector))) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
        setIsInputFocused(false);
      }
    };

    const handleTouchOutside = (event: TouchEvent) => {
      handleClickOutside(event);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleTouchOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleTouchOutside);
    };
  }, []);

  // Render grouped suggestions
  const renderSuggestions = () => {
    if (!showSuggestions || suggestions.length === 0) return null;

    const groupedSuggestions = {
      recent: suggestions.filter((s) => s.type === "recent"),
      popular: suggestions.filter((s) => s.type === "popular"),
      location: suggestions.filter((s) => s.type === "location"),
    };

    let currentIndex = 0;

    // For results variant, use portal to render at document root
    if (variant === "results") {
      const dropdownContent = (
        <>
          <div
            className="fixed inset-0 bg-transparent z-[9999]"
            onTouchStart={(e) => {
              // Handle touch events for mobile
              e.preventDefault();
              setShowSuggestions(false);
              setSelectedIndex(-1);
              setIsInputFocused(false);
            }}
            onClick={(e) => {
              e.preventDefault();
              setShowSuggestions(false);
              setSelectedIndex(-1);
              setIsInputFocused(false);
            }}
          />
          <div
            className="fixed bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto z-[10000]"
            style={{
              top: `${portalPosition.top}px`,
              left: `${portalPosition.left}px`,
              width: `${portalPosition.width}px`,
              minWidth: "200px",
              maxWidth: "90vw",
            }}
            data-dropdown-suggestions
            onClick={(e) => e.stopPropagation()}
          >
            <ul role="listbox" aria-label="Location suggestions">
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
                    const itemIndex = currentIndex;
                    currentIndex++;

                    return (
                      <li
                        key={`${suggestion.type}-${suggestion.text}`}
                        role="option"
                        aria-selected={isSelected}
                        className={cn(
                          "pl-8 pr-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 transition-colors",
                          isSelected
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700"
                        )}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          isSelectingRef.current = true;
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          selectSuggestion(suggestion.text);
                        }}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          selectSuggestion(suggestion.text);
                        }}
                        onMouseEnter={() => setSelectedIndex(itemIndex)}
                      >
                        <div className="flex items-center">
                          <IconComponent
                            className="w-4 h-4 mr-3 text-orange-500"
                            aria-hidden="true"
                          />
                          <span className="text-sm font-medium">
                            {suggestion.text}
                          </span>
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
                    const itemIndex = currentIndex;
                    currentIndex++;

                    return (
                      <li
                        key={`${suggestion.type}-${suggestion.text}`}
                        role="option"
                        aria-selected={isSelected}
                        className={cn(
                          "pl-8 pr-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 transition-colors",
                          isSelected
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700"
                        )}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          isSelectingRef.current = true;
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          selectSuggestion(suggestion.text);
                        }}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          selectSuggestion(suggestion.text);
                        }}
                        onMouseEnter={() => setSelectedIndex(itemIndex)}
                      >
                        <div className="flex items-center">
                          <IconComponent
                            className="w-4 h-4 mr-3 text-green-500"
                            aria-hidden="true"
                          />
                          <span className="text-sm font-medium">
                            {suggestion.text}
                          </span>
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
                    const itemIndex = currentIndex;
                    currentIndex++;

                    return (
                      <li
                        key={`${suggestion.type}-${suggestion.text}`}
                        role="option"
                        aria-selected={isSelected}
                        className={cn(
                          "pl-8 pr-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors",
                          isSelected
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700"
                        )}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          isSelectingRef.current = true;
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          selectSuggestion(suggestion.text);
                        }}
                        onTouchEnd={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          selectSuggestion(suggestion.text);
                        }}
                        onMouseEnter={() => setSelectedIndex(itemIndex)}
                      >
                        <div className="flex items-center">
                          <IconComponent
                            className="w-4 h-4 mr-3 text-blue-500"
                            aria-hidden="true"
                          />
                          <span className="text-sm font-medium">
                            {suggestion.text}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </>
              )}
            </ul>
          </div>
        </>
      );

      return typeof document !== "undefined"
        ? createPortal(dropdownContent, document.body)
        : null;
    }

    // For home and mobile variants, use regular positioning
    return (
      <div className={styles.dropdown}>
        <div className={styles.dropdownContent}>
          <ul role="listbox" aria-label="Location suggestions">
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
                  const itemIndex = currentIndex;
                  currentIndex++;

                  return (
                    <li
                      key={`${suggestion.type}-${suggestion.text}`}
                      role="option"
                      aria-selected={isSelected}
                      className={cn(
                        "pl-8 pr-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 transition-colors",
                        isSelected
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700"
                      )}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        isSelectingRef.current = true;
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        selectSuggestion(suggestion.text);
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        selectSuggestion(suggestion.text);
                      }}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                    >
                      <div className="flex items-center">
                        <IconComponent
                          className="w-4 h-4 mr-3 text-orange-500"
                          aria-hidden="true"
                        />
                        <span className="text-sm font-medium">
                          {suggestion.text}
                        </span>
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
                  const itemIndex = currentIndex;
                  currentIndex++;

                  return (
                    <li
                      key={`${suggestion.type}-${suggestion.text}`}
                      role="option"
                      aria-selected={isSelected}
                      className={cn(
                        "pl-8 pr-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 transition-colors",
                        isSelected
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700"
                      )}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        isSelectingRef.current = true;
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        selectSuggestion(suggestion.text);
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        selectSuggestion(suggestion.text);
                      }}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                    >
                      <div className="flex items-center">
                        <IconComponent
                          className="w-4 h-4 mr-3 text-green-500"
                          aria-hidden="true"
                        />
                        <span className="text-sm font-medium">
                          {suggestion.text}
                        </span>
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
                  const itemIndex = currentIndex;
                  currentIndex++;

                  return (
                    <li
                      key={`${suggestion.type}-${suggestion.text}`}
                      role="option"
                      aria-selected={isSelected}
                      className={cn(
                        "pl-8 pr-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors",
                        isSelected
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700"
                      )}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        isSelectingRef.current = true;
                      }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        selectSuggestion(suggestion.text);
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        selectSuggestion(suggestion.text);
                      }}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                    >
                      <div className="flex items-center">
                        <IconComponent
                          className="w-4 h-4 mr-3 text-blue-500"
                          aria-hidden="true"
                        />
                        <span className="text-sm font-medium">
                          {suggestion.text}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </>
            )}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className={cn(styles.container, className)}>
      <div className={styles.wrapper(isInputFocused)}>
        <Label htmlFor={`search-${variant}`} className="sr-only">
          Search
        </Label>
        <Search className={styles.icon(isInputFocused)} />
        <Input
          {...inputProps}
          ref={inputRef}
          id={`search-${variant}`}
          name="search"
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onKeyUp={(e) => {
            // Set typing flag for any character input
            if (
              e.key.length === 1 ||
              e.key === "Backspace" ||
              e.key === "Delete"
            ) {
              setUserIsTyping(true);
            }
          }}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className={styles.input}
          role="combobox"
          aria-expanded={showSuggestions}
          aria-haspopup="listbox"
          aria-controls={`location-suggestions-${variant}`}
          aria-activedescendant={
            selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined
          }
          aria-autocomplete="list"
        />
        {showButton && (
          <Button
            type="submit"
            variant="brand-primary"
            className="my-1.5 mr-1.5 hidden h-12 w-[115px] rounded-lg font-bold md:block"
          >
            {buttonText}
          </Button>
        )}
      </div>

      {renderSuggestions()}
    </div>
  );
}

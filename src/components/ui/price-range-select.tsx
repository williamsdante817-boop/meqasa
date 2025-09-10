"use client";

import React from "react";
import { ChevronDown, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PriceRange {
  min: number;
  max: number;
  step: number;
}

interface PriceRangeSelectProps {
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  priceRange: PriceRange;

  // Context-specific props
  title?: string;
  currency?: string;
  variant?: "default" | "compact" | "home";
  className?: string;
  showQuickSelections?: boolean;
  placeholder?: { min: string; max: string };
}

export function PriceRangeSelect({
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  priceRange,
  title = "Price Range",
  currency = "GH₵",
  variant = "default",
  className = "",
  showQuickSelections = true,
  placeholder: _placeholder = { min: "Min price", max: "Max price" },
}: PriceRangeSelectProps) {
  const getDisplayText = () => {
    const min = minValue ? Number.parseInt(minValue) : null;
    const max = maxValue ? Number.parseInt(maxValue) : null;

    const formatNumber = (num: number) => num.toLocaleString();

    if (min && max) {
      return variant === "home"
        ? `${formatNumber(min)} to ${formatNumber(max)}`
        : `${currency}${formatNumber(min)} - ${currency}${formatNumber(max)}`;
    } else if (min) {
      return variant === "home"
        ? `${formatNumber(min)}+`
        : `${currency}${formatNumber(min)}+`;
    } else if (max) {
      return variant === "home"
        ? `Up to ${formatNumber(max)}`
        : `Up to ${currency}${formatNumber(max)}`;
    }

    return variant === "home" ? title : "Price range";
  };

  const isInvalid = () => {
    if (!minValue || !maxValue) return false;
    const minNum = Number.parseInt(minValue);
    const maxNum = Number.parseInt(maxValue);

    if (isNaN(minNum) || isNaN(maxNum)) return false;
    return minNum >= maxNum;
  };

  // Variant-specific styling
  const getTriggerClassName = () => {
    const base = "shadow-none justify-between transition-all duration-200";

    switch (variant) {
      case "home":
        return `flex min-w-[150px] max-w-[200px] cursor-pointer items-center rounded-lg hover:border-none hover:bg-transparent text-base font-medium text-white hover:text-white ${className}`;
      case "compact":
        return `h-10 ${base} bg-white border-gray-200 hover:bg-gray-50 hover:border-brand-primary/50 text-brand-accent font-normal text-sm px-2 w-28 min-w-[112px] flex-shrink-0`;
      default:
        return `h-10 sm:h-12 ${base} bg-white border-gray-200 hover:bg-gray-50 hover:border-brand-primary/50 text-brand-accent font-normal text-sm px-2 sm:px-4 w-28 sm:w-auto min-w-[112px] sm:min-w-[160px] flex-shrink-0`;
    }
  };

  const getContentClassName = () => {
    switch (variant) {
      case "home":
        return "w-[60vw] max-w-[296px] md:w-[296px] z-[100] shadow-md border border-gray-200 bg-white rounded-md";
      case "compact":
        return "w-[230px] z-[100] shadow-lg border border-gray-200 bg-white rounded-md";
      default:
        return "w-[65vw] max-w-[296px] md:w-[296px] z-[100] shadow-md border border-gray-200 bg-white rounded-md";
    }
  };

  const renderContent = () => {
    // All variants now use the same enhanced layout for consistent modal content

    // Enhanced layout for results page and compact variant
    return (
      <div className="space-y-5 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-base text-brand-accent">{title}</h4>
          <div className="w-8 h-1 bg-brand-primary/20 rounded-full" />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="min-price"
                className="text-sm font-medium text-brand-accent"
              >
                Minimum Price
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-muted text-sm font-medium">
                  {currency}
                </span>
                <Input
                  id="min-price"
                  placeholder="0"
                  type="number"
                  min={priceRange.min}
                  max={priceRange.max}
                  step={priceRange.step}
                  value={minValue}
                  onChange={(e) => onMinChange(e.target.value)}
                  className={`h-12 pl-12 pr-4 text-sm text-brand-muted font-medium transition-all duration-200 ${
                    isInvalid()
                      ? "border-red-500 focus:border-red-500 bg-red-50"
                      : "border-gray-200 focus:border-brand-primary hover:border-gray-300 bg-gray-50/50 focus:bg-white"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="max-price"
                className="text-sm font-medium text-brand-accent"
              >
                Maximum Price
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-muted text-sm font-medium">
                  {currency}
                </span>
                <Input
                  id="max-price"
                  placeholder="Any"
                  type="number"
                  min={priceRange.min}
                  max={priceRange.max}
                  step={priceRange.step}
                  value={maxValue}
                  onChange={(e) => onMaxChange(e.target.value)}
                  className={`h-12 pl-12 pr-4 text-sm text-brand-muted font-medium transition-all duration-200 ${
                    isInvalid()
                      ? "border-red-500 focus:border-red-500 bg-red-50"
                      : "border-gray-200 focus:border-brand-primary hover:border-gray-300 bg-gray-50/50 focus:bg-white"
                  }`}
                />
              </div>
            </div>
          </div>

          {isInvalid() && (
            <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-700 text-sm font-medium">
                  Invalid price range
                </p>
                <p className="text-red-600 text-xs mt-1">
                  Maximum price must be greater than minimum price
                </p>
              </div>
            </div>
          )}

          {/* Quick price range suggestions */}
          {showQuickSelections && variant !== "compact" && (
            <div className="border-t border-gray-100 pt-4">
              <p className="text-xs font-medium text-brand-muted mb-3">
                Popular ranges
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { min: "0", max: "500000", label: "Under 500K" },
                  { min: "500000", max: "1000000", label: "500K - 1M" },
                  { min: "1000000", max: "2000000", label: "1M - 2M" },
                  { min: "2000000", max: "", label: "2M+" },
                ].map((range) => (
                  <button
                    key={range.label}
                    onClick={() => {
                      onMinChange(range.min);
                      onMaxChange(range.max);
                    }}
                    className="px-3 py-2 text-xs font-medium text-brand-muted hover:text-brand-primary hover:bg-brand-primary/5 border border-gray-200 hover:border-brand-primary/30 rounded-lg transition-all duration-200"
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={variant === "home" ? "ghost" : "outline"}
          className={getTriggerClassName()}
        >
          <span className="truncate">{getDisplayText()}</span>
          {variant !== "home" && (
            <ChevronDown className="h-4 w-4 opacity-50 ml-1 transition-transform duration-200 group-hover:rotate-180" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={getContentClassName()}
        align="start"
        side="bottom"
        sideOffset={variant === "home" ? 4 : 8}
        style={{ zIndex: 100 }}
      >
        {renderContent()}
      </PopoverContent>
    </Popover>
  );
}

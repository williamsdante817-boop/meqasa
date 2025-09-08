"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PriceRange {
  min: number;
  max: number;
  step: number;
}

interface MobilePriceInputProps {
  title: string;
  unit: string;
  placeholder: {
    min: string;
    max: string;
  };
  range: PriceRange;
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
  className?: string;
}

export function MobilePriceInput({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  title,
  unit,
  placeholder,
  range,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
  className,
}: MobilePriceInputProps) {
  const formatNumber = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^\d.]/g, "");

    // Convert to number and format with commas
    const num = parseFloat(numericValue);
    if (isNaN(num)) return "";

    return num.toLocaleString();
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow typing numbers and decimal points
    const cleanValue = value.replace(/[^\d.]/g, "");
    onMinChange(cleanValue);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow typing numbers and decimal points
    const cleanValue = value.replace(/[^\d.]/g, "");
    onMaxChange(cleanValue);
  };

  const handleMinBlur = () => {
    if (minValue) {
      const num = parseFloat(minValue);
      if (!isNaN(num)) {
        // Ensure min doesn't exceed max
        if (maxValue) {
          const maxNum = parseFloat(maxValue);
          if (!isNaN(maxNum) && num > maxNum) {
            onMinChange(maxValue);
            return;
          }
        }
        // Ensure min is within range
        if (num < range.min) {
          onMinChange(String(range.min));
        } else if (num > range.max) {
          onMinChange(String(range.max));
        }
      }
    }
  };

  const handleMaxBlur = () => {
    if (maxValue) {
      const num = parseFloat(maxValue);
      if (!isNaN(num)) {
        // Ensure max doesn't go below min
        if (minValue) {
          const minNum = parseFloat(minValue);
          if (!isNaN(minNum) && num < minNum) {
            onMaxChange(minValue);
            return;
          }
        }
        // Ensure max is within range
        if (num < range.min) {
          onMaxChange(String(range.min));
        } else if (num > range.max) {
          onMaxChange(String(range.max));
        }
      }
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid grid-cols-2 gap-3">
        {/* Min Price Input */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-600 pointer-events-none">
            {unit}
          </div>
          <Input
            type="text"
            inputMode="numeric"
            value={minValue ? formatNumber(minValue) : ""}
            onChange={handleMinChange}
            onBlur={handleMinBlur}
            placeholder={placeholder.min}
            className={cn(
              "h-12 pl-12 bg-gray-50 border-gray-200 rounded-lg",
              "focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20",
              "text-base placeholder:text-gray-500 placeholder:text-base"
            )}
          />
        </div>

        {/* Max Price Input */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-600 pointer-events-none">
            {unit}
          </div>
          <Input
            type="text"
            inputMode="numeric"
            value={maxValue ? formatNumber(maxValue) : ""}
            onChange={handleMaxChange}
            onBlur={handleMaxBlur}
            placeholder={placeholder.max}
            className={cn(
              "h-12 pl-12 bg-gray-50 border-gray-200 rounded-lg",
              "focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20",
              "text-base placeholder:text-gray-500 placeholder:text-base"
            )}
          />
        </div>
      </div>

      {/* Quick price range suggestions */}
      {unit === "GH₵" && (
        <div className="border-t border-gray-100 pt-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Quick Select</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { min: "0", max: "500000", label: "Under 500K" },
              { min: "500000", max: "1000000", label: "500K - 1M" },
              { min: "1000000", max: "2000000", label: "1M - 2M" },
              { min: "2000000", max: "", label: "2M+" },
            ].map((priceRange) => (
              <button
                type="button"
                key={priceRange.label}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onMinChange(priceRange.min);
                  onMaxChange(priceRange.max);
                }}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-brand-primary hover:bg-brand-primary/5 border border-gray-200 hover:border-brand-primary/30 rounded-lg transition-all duration-200 active:scale-95"
              >
                {priceRange.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Range Hint */}
      <div className="text-sm text-gray-500 text-start">
        Range: {unit}
        {range.min.toLocaleString()} - {unit}
        {range.max.toLocaleString()}
      </div>
    </div>
  );
}

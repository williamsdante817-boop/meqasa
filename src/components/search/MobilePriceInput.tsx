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

      {/* Range Hint */}
      <div className="text-xs text-gray-500 text-start">
        Range: {unit}{range.min.toLocaleString()} - {unit}{range.max.toLocaleString()}
      </div>
    </div>
  );
}
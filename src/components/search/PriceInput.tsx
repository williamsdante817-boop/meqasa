"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PriceInputProps {
  title: string;
  unit: string;
  placeholder: { min: string; max: string };
  range: { min: number; max: number; step: number };
  className?: string;
  minValue: string;
  maxValue: string;
  onMinChange: (value: string) => void;
  onMaxChange: (value: string) => void;
}

export function PriceInput({
  title,
  unit,
  placeholder,
  range,
  className,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
}: PriceInputProps) {
  const getDisplayText = () => {
    const min = minValue ? Number.parseInt(minValue) : null;
    const max = maxValue ? Number.parseInt(maxValue) : null;
    const formatNumber = (num: number) => num.toLocaleString();

    if (min && max) {
      return `${formatNumber(min)} to ${formatNumber(max)}`;
    } else if (min) {
      return `${formatNumber(min)}+`;
    } else if (max) {
      return `Up to ${formatNumber(max)}`;
    }

    return title;
  };

  return (
    <Popover>
      <PopoverTrigger
        className={`flex min-w-[150px] max-w-[200px] cursor-pointer items-center rounded-lg text-base font-medium text-white ${className}`}
      >
        {getDisplayText()}
      </PopoverTrigger>
      <PopoverContent className="w-80 z-[100]">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">{title}</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="min-price">Min ({unit})</Label>
              <Input
                id="min-price"
                placeholder={placeholder.min}
                type="number"
                min={range.min}
                max={range.max}
                step={range.step}
                value={minValue}
                onChange={(e) => onMinChange(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="max-price">Max ({unit})</Label>
              <Input
                id="max-price"
                placeholder={placeholder.max}
                type="number"
                min={range.min}
                max={range.max}
                step={range.step}
                value={maxValue}
                onChange={(e) => onMaxChange(e.target.value)}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

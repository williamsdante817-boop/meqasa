"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface MobileSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function MobileSearchInput({
  value,
  onChange,
  placeholder = "Search for location, area, or project",
  className,
}: MobileSearchInputProps) {
  return (
    <div className={cn("relative w-full", className)}>
      <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="focus:border-brand-primary focus:ring-brand-primary/20 h-12 rounded-lg border-gray-200 bg-gray-50 pr-4 pl-10 text-base text-gray-700 placeholder:text-gray-500 focus:bg-white focus:ring-2"
      />
    </div>
  );
}

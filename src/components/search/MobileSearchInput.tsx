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
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 pl-10 pr-4 text-base bg-gray-50 border-gray-200 rounded-lg text-gray-700 placeholder:text-gray-500 focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
      />
    </div>
  );
}
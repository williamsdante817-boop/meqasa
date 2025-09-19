"use client";

import { SearchIcon } from "lucide-react";

interface MobileSearchTriggerProps {
  onOpen: () => void;
  className?: string;
  placeholder?: string;
  showFiltersHint?: boolean;
}

export function MobileSearchTrigger({
  onOpen,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  className,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  placeholder = "Search for location, area, or project",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  showFiltersHint = true,
}: MobileSearchTriggerProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onOpen();
  };

  return (
    <button
      className="lgs:hidden shadow-elegant border-brand-primary mx-auto mt-4 flex h-12 w-[80%] cursor-pointer items-center justify-between rounded-lg border bg-white px-4 py-2 transition-shadow hover:shadow-lg"
      onClick={handleClick}
      style={{ pointerEvents: "auto" }}
      aria-label="Open search filters"
    >
      <div className="flex items-center gap-2">
        <SearchIcon size={18} className="text-gray-400" />
        <p className="text-brand-muted text-sm">Enter Location</p>
      </div>
      <div className="rounded bg-[#f93a5d] px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-[#f93a5d]/90">
        Search
      </div>
    </button>
  );
}

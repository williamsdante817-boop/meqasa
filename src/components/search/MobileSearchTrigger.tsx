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
      className="lgs:hidden flex justify-between h-12 items-center bg-white shadow-elegant border-rose-300 border w-[80%] mx-auto rounded-lg mt-4 px-4 py-2 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
      style={{ pointerEvents: "auto" }}
      aria-label="Open search filters"
    >
      <div className="flex items-center gap-2">
        <SearchIcon size={18} className=" text-gray-400" />
        <p className="text-brand-muted text-sm">Enter Location</p>
      </div>
      <div className="bg-[#f93a5d] hover:bg-[#f93a5d]/90 px-3 py-1 rounded text-white text-sm font-medium transition-colors">
        Search
      </div>
    </button>
  );
}

"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import React from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface SearchItem {
  developerid: string;
  name: string;
}

export default function SearchInput({
  data,
  path,
  triggerLabel = "Search...",
  inputPlaceholder = "Search...",
}: {
  data: SearchItem[];
  path: string;
  triggerLabel?: string;
  inputPlaceholder?: string;
}) {
  const [open, setOpen] = React.useState(false);

  function handleOpen() {
    setOpen((prev) => !prev);
  }
  return (
    <>
      <div className="w-full max-w-lg flex-1 md:w-auto md:flex-none">
        <button
          className="border-input bg-background text-muted-foreground hover:bg-accent hover:text-b-accent focus-visible:ring-ring relative inline-flex w-full cursor-pointer items-center justify-start gap-2 rounded-[0.5rem] border px-4 py-2 text-sm font-normal whitespace-nowrap shadow-none transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 sm:pr-12"
          onClick={handleOpen}
        >
          <Search className="h-4 w-4" />
          <span className="inline-flex">{triggerLabel}</span>
        </button>
      </div>
      <CommandDialog open={open} onOpenChange={handleOpen}>
        <CommandInput placeholder={inputPlaceholder} />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Results">
            {data.map((item, i) => {
              const nameSlug = item.name.toLowerCase().replace(/\s+/g, "-");
              const href =
                path === "/agents"
                  ? `/agents/${encodeURIComponent(item.name.toLowerCase())}?g=${item.developerid}`
                  : `${path}/${nameSlug}-${item.developerid}`;
              return (
                <Link href={href} key={i}>
                  <CommandItem className="cursor-pointer capitalize">
                    {item.name}
                  </CommandItem>
                </Link>
              );
            })}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

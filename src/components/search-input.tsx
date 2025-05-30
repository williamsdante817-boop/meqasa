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

}: {
  data: SearchItem[];
  path: string;
}) {
  const [open, setOpen] = React.useState(false);

  function handleOpen() {
    setOpen((prev) => !prev);
  }
  return (
    <>
      <div className="w-full flex-1 md:w-auto md:flex-none">
        <button
          className="relative inline-flex w-full items-center justify-start gap-2 whitespace-nowrap rounded-[0.5rem] border border-input bg-background px-4 py-2 text-sm font-normal text-muted-foreground shadow-none transition-colors hover:bg-accent hover:text-b-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 sm:pr-12"
          onClick={handleOpen}
        >
          <Search className="h-4 w-4" />
          <span className="inline-flex">Search developers...</span>
        </button>
      </div>
      <CommandDialog open={open} onOpenChange={handleOpen}>
        <CommandInput placeholder="Search for agents..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Results">
            {data.map((item, i) => (
              <Link
                href={`/projects-by-developer/${item.name.toLowerCase().replace(/\s+/g, "-")}-${item.developerid}`}
                key={i}
              >
                <CommandItem className="capitalize">{item.name} </CommandItem>
              </Link>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

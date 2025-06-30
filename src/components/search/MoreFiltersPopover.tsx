/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Filter, ListFilter, ListFilterPlus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { searchConfig } from "@/config/search";
import { type FormState } from "@/types/search";

interface MoreFiltersPopoverProps {
  formState: FormState;
  updateFormState: (updates: Partial<FormState>) => void;
}

export function MoreFiltersPopover({
  formState,
  updateFormState,
}: MoreFiltersPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger className="flex min-w-[150px] h-5 max-w-[150px] cursor-pointer items-center rounded-lg text-base font-medium text-white">
        More filters <ListFilterPlus className="ml-2 h-5 w-5" />
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-4">
        <div className="mb-4 grid grid-cols-2 items-center gap-2">
          <Select
            value={formState.period}
            onValueChange={(value) => updateFormState({ period: value })}
          >
            <SelectTrigger className="h-11 min-w-fit font-semibold text-b-accent">
              <SelectValue placeholder="Rent period" />
            </SelectTrigger>
            <SelectContent className="text-b-accent">
              <SelectGroup>
                {searchConfig.selectOptions.period.map(({ value, label }) => (
                  <SelectItem value={value} key={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select
            value={formState.sort}
            onValueChange={(value) => updateFormState({ sort: value })}
          >
            <SelectTrigger className="h-11 min-w-full font-semibold text-b-accent">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="border-none text-b-accent shadow-spread">
              <SelectGroup>
                {searchConfig.selectOptions.sort.map(({ value, label }) => (
                  <SelectItem value={value} key={value+label}>
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-start justify-between pt-8 text-sm font-semibold text-b-accent">
          <span>Only show...</span>
          <div>
            <div className="mb-2 flex items-center space-x-2">
              <Checkbox
                id="furnished"
                checked={formState.furnished}
                onCheckedChange={(checked) =>
                  updateFormState({ furnished: !!checked })
                }
                className="data-[state=checked]:border-0 data-[state=checked]:bg-primary data-[state=checked]:text-white"
              />
              <label
                htmlFor="furnished"
                className="cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Furnished Properties
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="owner"
                checked={formState.owner}
                onCheckedChange={(checked) =>
                  updateFormState({ owner: !!checked })
                }
                className="data-[state=checked]:border-0 data-[state=checked]:bg-primary data-[state=checked]:text-white"
              />
              <label
                htmlFor="owner"
                className="cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                For by Owner
              </label>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

"use client";

import { ListFilter } from "lucide-react";
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
import { FormState } from "@/types/search";

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
        More filters <ListFilter className="ml-2 h-4 w-5" />
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-4 z-[100]">
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
                  <SelectItem
                    value={value}
                    className="py-1.5 hover:text-b-accent"
                    key={value}
                  >
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
                  <SelectItem
                    value={value}
                    className="py-1.5 hover:text-b-accent"
                    key={value}
                  >
                    {label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="border-b pb-4">
          <RadioGroup
            value={formState.bedroomRadio}
            onValueChange={(value: string) =>
              updateFormState({ bedroomRadio: value })
            }
            className="flex flex-wrap items-center"
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                key={num}
                className="flex items-center space-x-1 rounded-full border px-2 py-1.5"
              >
                <RadioGroupItem value={num.toString()} id={`r${num}`} />
                <Label htmlFor={`r${num}`} className="cursor-pointer text-xs">
                  {num} Bedroom{num > 1 ? "s" : ""}
                </Label>
              </div>
            ))}
          </RadioGroup>
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
                className="data-[state=checked]:border-0 data-[state=checked]:bg-rose-500 data-[state=checked]:text-white"
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
                className="data-[state=checked]:border-0 data-[state=checked]:bg-rose-500 data-[state=checked]:text-white"
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

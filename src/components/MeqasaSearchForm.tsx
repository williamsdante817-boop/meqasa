"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type {
  PropertyType,
  ContractType,
  RentPeriod,
  SortOrder,
  MeqasaListing,
  MeqasaSearchParams,
} from "@/types/meqasa";
import { searchProperties } from "@/lib/meqasa";

const PROPERTY_TYPES: PropertyType[] = [
  "apartment",
  "house",
  "office",
  "warehouse",
  "guesthouse",
  "townhouse",
  "land",
];
const BEDROOM_OPTIONS = ["- Any -", "1", "2", "3", "4", "5", "6+"];
const BATHROOM_OPTIONS = ["- Any -", "1", "2", "3", "4", "5+"];
const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: "date", label: "Newest First" },
  { value: "date2", label: "Oldest First" },
  { value: "price", label: "Lowest Price First" },
  { value: "price2", label: "Highest Price First" },
];

interface MeqasaSearchFormProps {
  onSearchResults: (
    results: MeqasaListing[],
    totalCount: number,
    searchId: number,
    contract: string,
    locality: string,
  ) => void;
  onLoadMore: () => Promise<void>;
}

export default function MeqasaSearchForm({
  onSearchResults,
  onLoadMore,
}: MeqasaSearchFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const contract = formData.get("contract") as ContractType;
      const locality = formData.get("place") as string;

      if (!contract || !locality) {
        setError("Please select a contract type and enter a location");
        return;
      }

      const params: MeqasaSearchParams = {
        ftype: formData.get("ftype") as PropertyType | undefined,
        fbeds:
          formData.get("fbeds") === "- Any -"
            ? "- Any -"
            : formData.get("fbeds")
              ? Number(formData.get("fbeds"))
              : undefined,
        fbaths:
          formData.get("fbaths") === "- Any -"
            ? "- Any -"
            : formData.get("fbaths")
              ? Number(formData.get("fbaths"))
              : undefined,
        fmin: formData.get("fmin") ? Number(formData.get("fmin")) : undefined,
        fmax: formData.get("fmax") ? Number(formData.get("fmax")) : undefined,
        frentperiod: formData.get("frentperiod") as
          | RentPeriod
          | "- Any -"
          | undefined,
        fsort: formData.get("fsort") as SortOrder | undefined,
        app: "vercel",
      };

      // Only add boolean parameters if they are checked
      if (formData.has("fisfurnished")) {
        params.fisfurnished = 1;
      }
      if (formData.has("ffsbo")) {
        params.ffsbo = 1;
      }

      const response = await searchProperties(contract, locality, params);
      onSearchResults(
        response.results,
        response.resultcount,
        response.searchid,
        contract,
        locality,
      );
    } catch (error) {
      console.error("Error searching properties:", error);
      setError("Failed to search properties. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-gray-50 p-6 rounded-lg"
      >
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center justify-center">
            <a
              href="https://meqasa.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="https://meqasa.com/assets2/images/badge.png"
                alt="Property search powered by meQasa.com"
                width={150}
                height={50}
              />
            </a>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Property Type</label>
            <Select name="ftype">
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Bedrooms</label>
            <Select name="fbeds">
              <SelectTrigger>
                <SelectValue placeholder="Select bedrooms" />
              </SelectTrigger>
              <SelectContent>
                {BEDROOM_OPTIONS.map((beds) => (
                  <SelectItem key={beds} value={beds}>
                    {beds}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Bathrooms</label>
            <Select name="fbaths">
              <SelectTrigger>
                <SelectValue placeholder="Select bathrooms" />
              </SelectTrigger>
              <SelectContent>
                {BATHROOM_OPTIONS.map((baths) => (
                  <SelectItem key={baths} value={baths}>
                    {baths}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Contract Type</label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="rent"
                  name="contract"
                  value="rent"
                  defaultChecked
                  className="h-4 w-4 border-gray-300 text-[#cf007a] focus:ring-[#cf007a]"
                />
                <Label htmlFor="rent">For rent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="sale"
                  name="contract"
                  value="sale"
                  className="h-4 w-4 border-gray-300 text-[#cf007a] focus:ring-[#cf007a]"
                />
                <Label htmlFor="sale">For sale</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Rent Period</label>
            <Select name="frentperiod">
              <SelectTrigger>
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="- Any -">Any</SelectItem>
                <SelectItem value="shortrent">Short Term</SelectItem>
                <SelectItem value="longrent">Long Term</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input
              name="place"
              type="text"
              placeholder="Enter location"
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sort By</label>
            <Select name="fsort">
              <SelectTrigger>
                <SelectValue placeholder="Select sort order" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Price Range (GHS)</label>
            <div className="grid grid-cols-2 gap-2">
              <Input
                name="fmin"
                type="number"
                min="0"
                placeholder="Min"
                className="w-full"
              />
              <Input
                name="fmax"
                type="number"
                min="0"
                placeholder="Max"
                className="w-full"
              />
            </div>
          </div>

          <div className="flex items-end space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="fisfurnished" name="fisfurnished" />
              <Label htmlFor="fisfurnished">Furnished</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="ffsbo" name="ffsbo" />
              <Label htmlFor="ffsbo">For Sale/Rent by Owner</Label>
            </div>
          </div>

          <div className="flex items-end">
            <Button
              type="submit"
              className="w-full bg-[#cf007a] hover:bg-[#b3006a]"
              disabled={isLoading}
            >
              {isLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
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

const CONTRACT_TYPES = [
  { value: "rent", label: "Rent" },
  { value: "sale", label: "Sale" },
  { value: "land", label: "Land" },
  { value: "short-let", label: "Short Let" },
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
      const propertyType = formData.get("ftype") as PropertyType;

      if (!contract || !locality) {
        setError("Please select a contract type and enter a location");
        return;
      }

      // Build search params
      const searchParams = new URLSearchParams();
      searchParams.set("contract", contract);
      searchParams.set("q", locality);
      searchParams.set("type", propertyType || "");

      // Add optional parameters
      const fbeds = formData.get("fbeds") as string | null;
      if (fbeds && fbeds !== "- Any -") searchParams.set("fbeds", fbeds);

      const fbaths = formData.get("fbaths") as string | null;
      if (fbaths && fbaths !== "- Any -") searchParams.set("fbaths", fbaths);

      const fmin = formData.get("fmin") as string | null;
      if (fmin) searchParams.set("fmin", fmin);

      const fmax = formData.get("fmax") as string | null;
      if (fmax) searchParams.set("fmax", fmax);

      const frentperiod = formData.get("frentperiod") as string | null;
      if (frentperiod && frentperiod !== "- Any -")
        searchParams.set("frentperiod", frentperiod);

      const fsort = formData.get("fsort") as string | null;
      if (fsort) searchParams.set("fsort", fsort);

      if (formData.has("fisfurnished")) searchParams.set("fisfurnished", "1");
      if (formData.has("ffsbo")) searchParams.set("ffsbo", "1");

      // Navigate to search page with parameters
      window.location.href = `/search/${contract}?${searchParams.toString()}`;
    } catch (error) {
      console.error("Error preparing search:", error);
      setError("Failed to prepare search. Please try again.");
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
            <label className="text-sm font-medium">Contract Type</label>
            <Select name="contract" required>
              <SelectTrigger>
                <SelectValue placeholder="Select contract type" />
              </SelectTrigger>
              <SelectContent>
                {CONTRACT_TYPES.map((contract) => (
                  <SelectItem key={contract.value} value={contract.value}>
                    {contract.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              placeholder="Enter location"
              required
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

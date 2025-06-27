"use client";

import { useState } from "react";
import MeqasaSearchForm from "@/components/MeqasaSearchForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { MeqasaListing } from "@/types/meqasa";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PropertySearchPage() {
  const [searchResults, setSearchResults] = useState<MeqasaListing[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [searchId, setSearchId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [contract, setContract] = useState<string>("");
  const [locality, setLocality] = useState<string>("");
  console.log(searchResults);
  console.log("Loaded more properties:", searchResults);

  const handleSearchResults = (
    results: MeqasaListing[],
    totalCount: number,
    searchId: number,
  ) => {
    setSearchResults(results);
    setTotalResults(totalCount);
    setSearchId(searchId);
    setCurrentPage(1);
  };

  const handleLoadMore = async () => {
    if (!searchId || !contract || !locality) return;

    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "loadMore",
          params: {
            y: searchId,
            w: currentPage + 1,
            contract,
            locality,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to load more properties");
      const data = (await response.json()) as { results: MeqasaListing[] };

      setSearchResults((prev) => [...prev, ...data.results]);
      setCurrentPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error loading more properties:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Property Search</h1>

      <MeqasaSearchForm
        onSearchResults={(
          results: MeqasaListing[],
          totalCount: number,
          searchId: number,
          contractValue: string,
          localityValue: string,
        ) => {
          handleSearchResults(results, totalCount, searchId);
          setContract(contractValue);
          setLocality(localityValue);
        }}
        onLoadMore={handleLoadMore}
      />

      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Search Results</h2>
          {searchResults.length > 0 && (
            <Badge variant="secondary" className="text-sm">
              {searchResults.length} of {totalResults} properties
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((property) => (
            <Link
              key={property.listingid}
              href={`/listings/${property.type}-for-${property.contract}-at-${property.locationstring.replace(/,/g, "-").replace(/\s+/g, "-")}-${property.listingid}`}
              aria-label={property.summary}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg line-clamp-1">
                    {property.summary}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="text-gray-600 text-sm mb-3">
                    {property.locationstring}
                  </p>
                  <p className="text-[#cf007a] font-bold text-xl mb-3">
                    {(() => {
                      const numericPrice = Number(property.pricepart1);
                      if (!isNaN(numericPrice)) {
                        return (
                          <>
                            {new Intl.NumberFormat("en-GH", {
                              style: "currency",
                              currency: "GHS",
                              maximumFractionDigits: 0,
                            }).format(numericPrice)}
                            {property.contract === "rent" &&
                              property.pricepart2 && (
                                <span className="text-sm font-normal text-gray-600">
                                  /{property.pricepart2}
                                </span>
                              )}
                          </>
                        );
                      }
                      return (
                        <>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: property.pricepart1,
                            }}
                          />
                          {property.pricepart2 && (
                            <span className="text-sm font-normal text-gray-600">
                              {property.pricepart2}
                            </span>
                          )}
                        </>
                      );
                    })()}
                  </p>
                  <Separator className="my-3" />
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      {property.bedroomcount} beds
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {property.bathroomcount} baths
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {property.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {property.contract}
                    </Badge>
                  </div>
                  {property.recency && (
                    <p className="text-xs text-gray-500 mt-2">
                      Listed {property.recency}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {searchResults.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No properties found. Try adjusting your search criteria.
          </div>
        )}

        {searchResults.length > 0 && searchResults.length < totalResults && (
          <div className="mt-8 text-center">
            <Button
              onClick={handleLoadMore}
              className="bg-[#cf007a] hover:bg-[#b3006a]"
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

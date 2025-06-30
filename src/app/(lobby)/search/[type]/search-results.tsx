"use client";

import { Breadcrumbs } from "@/components/bread-crumbs";
import RealEstateAd from "@/components/search/ad";
import { CarouselPlugin } from "@/components/search/carousel-plugin";
import { FeaturedPropertyVariantCard } from "@/components/search/featured-property-variant";
import { PremiumPlusPropertyCard } from "@/components/search/premium-plus-card";
import { ResultsCard } from "@/components/search/results-card";
import { ResultSearchFilter } from "@/components/search/results-search-filter";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import Shell from "@/layouts/shell";
import type {
  MeqasaListing,
  MeqasaProject,
  MeqasaSearchResponse,
} from "@/types/meqasa";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import SearchResultsSkeleton from "./SearchResultsSkeleton";

interface SearchResultsProps {
  type: string;
}

const sampleProject: MeqasaProject = {
  city: "Accra",
  projectname: "The Lennox Development Project",
  projectid: "2",
  photo:
    "https://images.unsplash.com/photo-1694032593958-2d018f015a47?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=3270&q=80",
  logo: "https://dve7rykno93gs.cloudfront.net/fascimos/somics/1263632747",
  name: "Airport Residential",
};

function getPaginationItems(current: number, total: number) {
  const pages = [];
  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push("start-ellipsis");
    for (
      let i = Math.max(2, current - 1);
      i <= Math.min(total - 1, current + 1);
      i++
    ) {
      pages.push(i);
    }
    if (current < total - 2) pages.push("end-ellipsis");
    pages.push(total);
  }
  return pages;
}

export function SearchResults({ type }: SearchResultsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<MeqasaListing[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [search, setSearch] = useState<MeqasaSearchResponse>();
  const [searchId, setSearchId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const manualSearchRef = useRef<boolean>(false);
  const lastSearchParamsRef = useRef<string>("");

  // Map UI contract types to API contract types
  const contractMap: Record<string, string> = {
    rent: "rent",
    buy: "sale",
    land: "sale",
    "short-let": "rent",
  };

  // Get the API-compliant contract type
  const apiContract = contractMap[type] ?? type;

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      const currentSearchParams = searchParams.toString();

      // Skip if search params haven't changed (prevents duplicate calls)
      if (currentSearchParams === lastSearchParamsRef.current) {
        return;
      }

      // Skip if we're handling search manually
      if (manualSearchRef.current) {
        manualSearchRef.current = false;
        return;
      }

      // Update the last search params ref
      lastSearchParamsRef.current = currentSearchParams;

      setIsLoading(true);
      try {
        const searchParamsObj = Object.fromEntries(searchParams.entries());
        const locality = searchParamsObj.q;
        const pageParam = searchParamsObj.page
          ? parseInt(searchParamsObj.page)
          : 1;
        const urlSearchId = searchParamsObj.searchId
          ? parseInt(searchParamsObj.searchId)
          : null;

        if (!locality) {
          console.error("Missing required parameter: locality");
          return;
        }

        // If we have a searchId, use loadMore API
        if (urlSearchId && pageParam > 1) {
          console.log("Making loadMore request:", {
            searchId: urlSearchId,
            page: pageParam,
          });

          const response = await fetch("/api/properties", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "loadMore",
              params: {
                y: urlSearchId,
                w: pageParam,
                contract: apiContract,
                locality,
              },
            }),
          });

          if (!response.ok) throw new Error("Failed to fetch page");
          const data = (await response.json()) as MeqasaSearchResponse;

          setSearchResults(data.results);
          setTotalResults(data.resultcount);
          setSearch(data);
          setCurrentPage(pageParam);
          setSearchId(urlSearchId);
        } else {
          // Initial search
          console.log("Making initial search request:", {
            contract: apiContract,
            locality,
          });

          const response = await fetch("/api/properties", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "search",
              params: {
                ...searchParamsObj,
                contract: apiContract,
                locality,
              },
            }),
          });

          if (!response.ok) throw new Error("Failed to fetch properties");
          const data = (await response.json()) as MeqasaSearchResponse;

          setSearchResults(data.results);
          setTotalResults(data.resultcount);
          setSearch(data);
          setSearchId(data.searchid);
          setCurrentPage(pageParam);

          // Update URL with searchId for persistence
          if (data.searchid && !searchParamsObj.searchId) {
            const newSearchParams = new URLSearchParams(searchParamsObj);
            newSearchParams.set("searchId", data.searchid.toString());
            // Set flag to prevent useEffect from running again
            manualSearchRef.current = true;
            router.push(`?${newSearchParams.toString()}`, { scroll: false });
          }
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (searchParams.toString()) {
      void fetchResults();
    }
  }, [searchParams, apiContract]);

  const handlePageChange = async (pageNumber: number) => {
    if (pageNumber === currentPage) return;

    const searchParamsObj = Object.fromEntries(searchParams.entries());
    const urlSearchId = searchParamsObj.searchId
      ? parseInt(searchParamsObj.searchId)
      : null;

    if (!urlSearchId) {
      console.error("No searchId found in URL parameters");
      return;
    }

    const newSearchParams = new URLSearchParams(searchParamsObj);
    newSearchParams.set("page", pageNumber.toString());
    newSearchParams.set("searchId", urlSearchId.toString());

    router.push(`?${newSearchParams.toString()}`, { scroll: false });
  };

  if (isLoading) {
    return <SearchResultsSkeleton />;
  }

  return (
    <>
      <div className="relative">
        <div
          className="hidden lg:block max-h-[280px] h-[280px] relative bg-contain bg-center"
          style={{
            backgroundImage: `url(https://dve7rykno93gs.cloudfront.net/pieoq/904309523`,
          }}
          role="img"
          aria-label="Hero banner showcasing featured properties"
        ></div>
      </div>

      <ResultSearchFilter />
      <Shell className="mt-12 flex gap-8">
        <div>
          <aside className="hidden md:flex md:flex-col md:gap-3">
            <div className="">
              <ul className="w-max text-xs">
                <li className="mb-2">
                  <Link
                    className="flex h-8 items-center rounded-sm bg-[#F0F6FF] px-2 text-[10px] font-bold uppercase text-slate-500 shadow-none"
                    href="#"
                  >
                    House
                  </Link>
                </li>
                <li className="mb-2">
                  {" "}
                  <Link
                    className="flex h-8 items-center rounded-sm bg-[#F0F6FF] px-2 text-[10px] font-bold uppercase text-slate-500 shadow-none"
                    href="#"
                  >
                    Apartments
                  </Link>
                </li>
                <li className="mb-2">
                  {" "}
                  <Link
                    className="flex h-8 items-center rounded-sm bg-[#F0F6FF] px-2 text-[10px] font-bold uppercase text-slate-500 shadow-none"
                    href="#"
                  >
                    Office space
                  </Link>
                </li>
                <li className="mb-2">
                  {" "}
                  <Link
                    className="flex h-8 items-center rounded-sm bg-[#F0F6FF] px-2 text-[10px] font-bold uppercase text-slate-500 shadow-none"
                    href="#"
                  >
                    Townhouses
                  </Link>
                </li>
                <li className="mb-2">
                  {" "}
                  <Link
                    className="flex h-8 items-center rounded-sm bg-[#F0F6FF] px-2 text-[10px] font-bold uppercase text-slate-500 shadow-none"
                    href="#"
                  >
                    Warehouses
                  </Link>
                </li>
                <li className="mb-2">
                  {" "}
                  <Link
                    className="flex h-8 items-center rounded-sm bg-[#F0F6FF] px-2 text-[10px] font-bold uppercase text-slate-500 shadow-none"
                    href="#"
                  >
                    Shops
                  </Link>
                </li>
                <li className="mb-2">
                  {" "}
                  <Link
                    className="flex h-8 items-center rounded-sm bg-[#F0F6FF] px-2 text-[10px] font-bold uppercase text-slate-500 shadow-none"
                    href="#"
                  >
                    Commercial
                  </Link>
                </li>
                <li className="mb-2">
                  {" "}
                  <Link
                    className="flex h-8 items-center rounded-sm bg-[#F0F6FF] px-2 text-[10px] font-bold uppercase text-slate-500 shadow-none"
                    href="#"
                  >
                    Retail
                  </Link>
                </li>
                <li className="mb-2">
                  {" "}
                  <Link
                    className="flex h-8 items-center rounded-sm bg-[#F0F6FF] px-2 text-[10px] font-bold uppercase text-slate-500 shadow-none"
                    href="#"
                  >
                    Land
                  </Link>
                </li>
                <li className="mb-2">
                  {" "}
                  <Link
                    className="flex h-8 items-center rounded-sm bg-[#F0F6FF] px-2 text-[10px] font-bold uppercase text-slate-500 shadow-none"
                    href="#"
                  >
                    Guest houses
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>

        <div>
          <aside>
            <Breadcrumbs
              segments={[
                { title: "Home", href: "/" },
                { title: "search", href: "/1" },
                { title: "results", href: "/2" },
              ]}
            />
            <h1 className="mt-2 text-lg font-bold leading-6 text-brand-accent md:text-xl">
              Property for {type} in {searchParams.get("q") ?? "Ghana"}
            </h1>
            <p className="mt-3 text-sm text-brand-muted">
              {totalResults} properties found
            </p>
          </aside>
          <div className="mt-12 grid grid-cols-1 gap-8 px-4 md:grid-cols-[736px,1fr] md:px-0">
            <div className="">
              {search?.project1 && !("empty" in search.project1) && (
                <div className="mb-8">
                  <Card className="relative p-0 h-[200px] w-full overflow-hidden md:h-[330px]">
                    <Link
                      href={`/development-projects/538`}
                      className="block h-full"
                    >
                      <div className="relative h-full">
                        <Image
                          alt={`${search.project1.projectname} project in ${search.project1.city}`}
                          src={`https://meqasa.com//uploads/imgs/${search.project1.photo}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 736px"
                          className="object-cover"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4 text-white sr-only">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white">
                              <Image
                                alt="Developer logo"
                                src={`https://dve7rykno93gs.cloudfront.net/pieoq/${search.project1.logo}`}
                                fill
                                sizes="32px"
                                className="object-cover"
                              />
                            </div>
                            <span className="text-sm font-medium">
                              {search.project1.name}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold mb-1">
                            {search.project1.projectname}
                          </h3>
                          <p className="text-sm opacity-90">
                            {search.project1.city}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </Card>
                </div>
              )}
              {search?.topads && search.topads.length > 0 ? (
                <CarouselPlugin>
                  {search?.topads?.map((property) => (
                    <PremiumPlusPropertyCard
                      key={property.listingid}
                      data={property}
                    />
                  ))}
                </CarouselPlugin>
              ) : null}
              <FeaturedPropertyVariantCard project={sampleProject} />
              <div className="grid grid-cols-1 gap-8">
                {searchResults.map((property) => (
                  <ResultsCard key={property.listingid} result={property} />
                ))}
              </div>

              {searchResults.length > 0 && (
                <div className="my-8 flex justify-center text-brand-accent">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) {
                              void handlePageChange(currentPage - 1);
                            }
                          }}
                          aria-disabled={currentPage === 1}
                        />
                      </PaginationItem>
                      {getPaginationItems(
                        currentPage,
                        Math.ceil(totalResults / 20),
                      ).map((item, idx) => (
                        <PaginationItem key={idx}>
                          {item === "start-ellipsis" ||
                          item === "end-ellipsis" ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              href="#"
                              isActive={currentPage === item}
                              onClick={(e) => {
                                e.preventDefault();
                                if (currentPage !== item) {
                                  void handlePageChange(item as number);
                                }
                              }}
                            >
                              {item}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < Math.ceil(totalResults / 20)) {
                              void handlePageChange(currentPage + 1);
                            }
                          }}
                          aria-disabled={
                            currentPage === Math.ceil(totalResults / 20)
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
            <div>
              <aside className="w-full items-center grid grid-cols-1 gap-4">
                <RealEstateAd />
                <RealEstateAd />
                <RealEstateAd />
              </aside>
            </div>
          </div>
          {searchResults.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No properties found. Try adjusting your search criteria.
            </div>
          )}
        </div>
      </Shell>
    </>
  );
}

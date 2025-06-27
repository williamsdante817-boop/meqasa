"use client";

import { Breadcrumbs } from "@/components/bread-crumbs";
import RealEstateAd from "@/components/search/ad";
import { CarouselPlugin } from "@/components/search/carousel-plugin";
import { FeaturedPropertyVariantCard } from "@/components/search/featured-property-variant";
import { PremiumPlusPropertyCard } from "@/components/search/premium-plus-card";
import { ResultsCard } from "@/components/search/results-card";
import { ResultSearchFilter } from "@/components/search/results-search-filter";
import { Button } from "@/components/ui/button";
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
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
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
  const [searchId, setSearchId] = useState<number | null>(() => {
    // Try to get searchId from URL parameters first, then sessionStorage
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlSearchId = urlParams.get("searchId");
      if (urlSearchId) {
        return parseInt(urlSearchId);
      }
      const stored = sessionStorage.getItem("meqasa_searchId");
      return stored ? parseInt(stored) : null;
    }
    return null;
  });
  const [currentPage, setCurrentPage] = useState(() => {
    // Try to get currentPage from URL parameters
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const pageParam = urlParams.get("page");
      return pageParam ? parseInt(pageParam) : 1;
    }
    return 1;
  });
  const [isLoading, setIsLoading] = useState(true);

  console.log("Search Params:", Object.fromEntries(searchParams.entries()));
  console.log("search", search);

  // Store searchId in sessionStorage whenever it changes (for backward compatibility)
  useEffect(() => {
    if (searchId && typeof window !== "undefined") {
      sessionStorage.setItem("meqasa_searchId", searchId.toString());
    }
  }, [searchId]);

  // Scroll to top when loading starts
  useEffect(() => {
    if (isLoading) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isLoading]);

  useEffect(() => {
    const fetchResults = async () => {
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

        // If we have a searchId (from URL or state) and page param, fetch that specific page
        const currentSearchId = urlSearchId ?? searchId;
        if (currentSearchId && pageParam > 1) {
          const response = await fetch("/api/properties", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: "loadMore",
              params: {
                y: currentSearchId,
                w: pageParam,
                ...searchParamsObj,
                contract: type,
                locality,
                propertyType: searchParamsObj.type ?? "",
                app: "vercel",
              },
            }),
          });

          if (!response.ok) throw new Error("Failed to fetch page");
          const data = (await response.json()) as MeqasaSearchResponse;
          setSearchResults(data.results);
          setTotalResults(data.resultcount);
          setSearch(data);
          setCurrentPage(pageParam);
          setSearchId(currentSearchId);
          setIsLoading(false);
          return;
        }

        // Initial search
        const response = await fetch("/api/properties", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "search",
            params: {
              ...searchParamsObj,
              contract: type,
              locality,
              propertyType: searchParamsObj.type ?? "",
              app: "vercel",
            },
          }),
        });

        if (!response.ok) throw new Error("Failed to fetch properties");
        const data = (await response.json()) as MeqasaSearchResponse;
        console.log(data);
        setSearchResults(data.results);
        setTotalResults(data.resultcount);
        setSearch(data);
        setSearchId(data.searchid);
        setCurrentPage(pageParam);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (searchParams.toString()) {
      void fetchResults();
    }
  }, [searchParams, type]);

  const handlePageChange = async (pageNumber: number) => {
    if (!searchId || pageNumber === currentPage) return;

    // Update URL with new page parameter and searchId
    const searchParamsObj = Object.fromEntries(searchParams.entries());
    const newSearchParams = new URLSearchParams(searchParamsObj);
    newSearchParams.set("page", pageNumber.toString());
    newSearchParams.set("searchId", searchId.toString());

    // Update URL without page reload
    router.push(`?${newSearchParams.toString()}`, { scroll: false });

    setIsLoading(true);
    try {
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "loadMore",
          params: {
            y: searchId,
            w: pageNumber,
            ...searchParamsObj,
            contract: type,
            locality: searchParamsObj.q,
            propertyType: searchParamsObj.type ?? "",
            app: "vercel",
          },
        }),
      });
      if (!response.ok) throw new Error("Failed to fetch page");
      const data = (await response.json()) as MeqasaSearchResponse;
      setSearchResults(data.results);
      setTotalResults(data.resultcount);
      setSearch(data);
      setCurrentPage(pageNumber);
    } catch (error) {
      console.error("Error fetching page:", error);
    } finally {
      setIsLoading(false);
    }
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
        {/* <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Search Results</h2>
          {searchResults.length > 0 && (
            <Badge variant="secondary" className="text-sm">
              {searchResults.length} of {totalResults} properties
            </Badge>
          )}
        </div> */}

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
              Property for sale in east legon
            </h1>
            <p className="mt-3 text-sm text-brand-muted">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam
              adipisci ullam deserunt est dolorem impedit ratione, ut blanditiis
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam
              adipisci ullam deserunt est dolorem impedit ratione, ut blanditiis
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam
              adipisci ullam deserunt est dolorem impedit ratione, ut blanditiis
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
                {/* <Card className="relative h-[450px] w-[225px] overflow-hidden">
                  <Link
                    href="https://meqasa.com/follow-ad-1883?u=https://oneelm.quaorealty.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Image
                      alt="Luxury Real Estate Property"
                      src="https://dve7rykno93gs.cloudfront.net/pieoq/844216596"
                      fill
                      sizes=""
                      className="object-contain"
                      priority // Load this image with priority for faster rendering.
                    />
                  </Link>
                </Card> */}
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

/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AgentPropertyCard } from "./agent-property-card";
import { AgentListingsSkeleton } from "./agent-listings-skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import type { AgentListing } from "@/types/agent-listings";

interface AgentListingsProps {
  agentId: string | number;
  agentName: string;
  initialListings?: AgentListing[];
  totalCount?: number;
}

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

export function AgentListings({
  agentId,
  agentName,
  initialListings = [],
  totalCount = 0,
}: AgentListingsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<AgentListing[]>(initialListings);
  const [currentPage, setCurrentPage] = useState(() => {
    const pageParam = searchParams.get("page");
    return pageParam ? parseInt(pageParam) : 1;
  });
  const [totalPages, setTotalPages] = useState(Math.ceil(totalCount / 20));
  const [isLoading, setIsLoading] = useState(false);
  const listingsTopRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false); // Prevent race conditions
  const paginationClickedRef = useRef(false); // Track if pagination button was clicked

  // Sync current page with URL changes (for browser back/forward)
  useEffect(() => {
    const pageParam = searchParams.get("page");
    const urlPage = pageParam ? parseInt(pageParam) : 1;
    if (urlPage !== currentPage) {
      setCurrentPage(urlPage);
    }
  }, [searchParams]);

  // Fetch listings when page changes
  useEffect(() => {
    const fetchListings = async () => {
      if (isFetchingRef.current) return; // Prevent race conditions
      isFetchingRef.current = true;
      // Always fetch, even for page 1
      setIsLoading(true);
      try {
        const response = await fetch("/api/agent-listings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agentId,
            agentName,
            page: currentPage,
            limit: 16,
          }),
        });
        if (!response.ok) throw new Error("Failed to fetch listings");
        const data = (await response.json()) as {
          listings: AgentListing[];
          totalPages: number;
        };
        setListings(data.listings);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching agent listings:", error);
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    };
    void fetchListings();
  }, [agentId, agentName, currentPage]);

  // Scroll to top of listings only when pagination button is clicked
  useEffect(() => {
    if (paginationClickedRef.current && listingsTopRef.current) {
      listingsTopRef.current.scrollIntoView({ behavior: "smooth" });
      paginationClickedRef.current = false;
    }
  }, [currentPage]);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber === currentPage) return;
    paginationClickedRef.current = true; // Mark that pagination was clicked
    setCurrentPage(pageNumber); // Optimistically update state
    // Update URL with new page parameter
    const url = new URL(window.location.href);
    url.searchParams.set("page", pageNumber.toString());
    router.push(url.pathname + url.search, { scroll: false });
  };

  if (isLoading) {
    return <AgentListingsSkeleton />;
  }

  return (
    <div className="mb-8">
      {/* Total listings count badge */}
      <div
        ref={listingsTopRef}
        className="mb-6 flex items-center justify-between"
      >
        <div className="flex items-center">
          <span className="text-sm text-brand-muted">
            Showing {Math.min(currentPage * 16, totalCount)} of
          </span>
          <Badge
            variant="secondary"
            className="bg-brand-primary/10 text-brand-primary font-medium"
          >
            {totalCount} {totalCount === 1 ? "listing" : "listings"} total
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 mb-8">
        {listings?.map((listing, index) => (
          <AgentPropertyCard
            key={listing.listingid ?? index}
            listing={listing}
          />
        ))}
      </div>

      {listings.length > 0 && totalPages > 1 && (
        <div className="flex justify-center text-brand-accent">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      handlePageChange(currentPage - 1);
                    }
                  }}
                  aria-disabled={currentPage === 1}
                />
              </PaginationItem>
              {getPaginationItems(currentPage, totalPages).map((item, idx) => (
                <PaginationItem key={idx}>
                  {item === "start-ellipsis" || item === "end-ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      isActive={currentPage === item}
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage !== item) {
                          handlePageChange(item as number);
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
                    if (currentPage < totalPages) {
                      handlePageChange(currentPage + 1);
                    }
                  }}
                  aria-disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {listings.length === 0 && !isLoading && (
        <div className="text-center py-12 text-gray-500">
          No properties found for this agent.
        </div>
      )}
    </div>
  );
}

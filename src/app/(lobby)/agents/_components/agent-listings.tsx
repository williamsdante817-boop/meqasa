"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AgentPropertyCard } from "./agent-property-card";
import { AgentListingsSkeleton } from "./agent-listings-skeleton";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { useAgentListingsPagination } from "@/hooks/queries";

// Constants
const ITEMS_PER_PAGE = 16;
const PAGINATION_THRESHOLD = 5;

interface AgentListingsProps {
  agentId: string | number;
  agentName: string;
  initialListings?: AgentListing[];
  totalCount?: number;
}

function getPaginationItems(current: number, total: number) {
  const pages = [];
  if (total <= PAGINATION_THRESHOLD) {
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
  const [currentPage, setCurrentPage] = useState(() => {
    const pageParam = searchParams.get("page");
    const parsedPage = pageParam ? parseInt(pageParam) : 1;
    return isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
  });
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const listingsTopRef = useRef<HTMLDivElement>(null);
  const paginationClickedRef = useRef(false); // Track if pagination button was clicked

  // Use React Query for pagination (page 2+)
  const {
    data: paginationData,
    isLoading: isPaginationQueryLoading,
    error: paginationError,
    isFetching: isPaginationFetching,
  } = useAgentListingsPagination(
    agentId,
    agentName,
    currentPage,
    ITEMS_PER_PAGE
  );

  // Determine what data to show - no useEffect needed!
  const listings =
    currentPage === 1 ? initialListings : (paginationData?.listings ?? []);
  const totalPages =
    currentPage === 1
      ? Math.ceil(totalCount / ITEMS_PER_PAGE)
      : (paginationData?.totalPages ?? 0);
  const isLoading =
    currentPage > 1 ? isPaginationQueryLoading || isPaginationFetching : false;
  const error = currentPage > 1 ? paginationError : null;

  // Calculate pagination range for display
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalCount);
  const hasListings = listings.length > 0;

  // Sync current page with URL changes (for browser back/forward)
  useEffect(() => {
    const pageParam = searchParams.get("page");
    const urlPage = pageParam ? parseInt(pageParam) : 1;
    if (!isNaN(urlPage) && urlPage >= 1 && urlPage !== currentPage) {
      setCurrentPage(urlPage);
    }
  }, [searchParams, currentPage]);

  // Scroll behavior: handle all page transitions in one place
  useEffect(() => {
    if (paginationClickedRef.current && listingsTopRef.current) {
      // For page 1: scroll immediately (data already available)
      // For pages 2+: scroll after a short delay to let React Query finish
      const scrollDelay = currentPage === 1 ? 0 : 100;

      setTimeout(() => {
        if (listingsTopRef.current) {
          listingsTopRef.current.scrollIntoView({ behavior: "smooth" });
          paginationClickedRef.current = false;
        }
      }, scrollDelay);
    }
  }, [currentPage]);

  const handlePageChange = async (pageNumber: number) => {
    if (pageNumber === currentPage || pageNumber < 1 || pageNumber > totalPages)
      return;

    paginationClickedRef.current = true;
    setIsPaginationLoading(true);

    try {
      setCurrentPage(pageNumber);
      // Update URL with new page parameter
      const url = new URL(window.location.href);
      url.searchParams.set("page", pageNumber.toString());
      router.push(url.pathname + url.search, { scroll: false });
    } finally {
      setIsPaginationLoading(false);
    }
  };

  if (isLoading) {
    return <AgentListingsSkeleton />;
  }

  return (
    <div className="mb-8">
      {/* Error Display */}
      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            {error instanceof Error ? error.message : String(error)}. Please try
            again.
          </AlertDescription>
        </Alert>
      )}

      {/* Listings Section */}
      <div
        ref={listingsTopRef}
        className="grid grid-cols-1 lg:grid-cols-4 gap-8"
      >
        {/* Left: Property Listings */}
        <div className="lg:col-span-3">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-xl font-semibold text-brand-accent">
              Listings By {agentName}
            </h2>
            <Badge className="bg-brand-primary text-white font-medium">
              {totalCount} total
            </Badge>
          </div>

          <p className="text-brand-muted text-sm mb-6">
            {hasListings && totalCount > 0
              ? totalCount <= ITEMS_PER_PAGE
                ? `Showing all ${totalCount} listings`
                : `Showing ${startItem}-${endItem} of ${totalCount} listings`
              : "No listings found"}
          </p>
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
                    if (currentPage > 1 && !isPaginationLoading) {
                      void handlePageChange(currentPage - 1);
                    }
                  }}
                  aria-disabled={currentPage === 1 || isPaginationLoading}
                  aria-label={`Go to previous page (${currentPage - 1})`}
                  className={
                    isPaginationLoading ? "opacity-50 cursor-not-allowed" : ""
                  }
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
                        if (currentPage !== item && !isPaginationLoading) {
                          void handlePageChange(item as number);
                        }
                      }}
                      className="text-brand-accent shadow-none"
                      aria-label={`Go to page ${item}`}
                      aria-current={currentPage === item ? "page" : undefined}
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
                    if (currentPage < totalPages && !isPaginationLoading) {
                      void handlePageChange(currentPage + 1);
                    }
                  }}
                  aria-disabled={
                    currentPage === totalPages || isPaginationLoading
                  }
                  aria-label={`Go to next page (${currentPage + 1})`}
                  className={
                    isPaginationLoading ? "opacity-50 cursor-not-allowed" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {listings.length === 0 && !isLoading && !error && (
        <div className="text-center py-12 text-gray-500">
          No properties found for this agent.
        </div>
      )}
    </div>
  );
}

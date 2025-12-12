"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ClientPaginationProps {
  currentPage: number;
  totalPages: number;
  searchId: number;
  searchParams: Record<string, string>;
}

function getPaginationItems(current: number, total: number) {
  const pages: (number | string)[] = [];
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

export function ClientPagination({
  currentPage,
  totalPages,
  searchId,
  searchParams: initialSearchParams,
}: ClientPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Build URL for a specific page
  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams(initialSearchParams);
    params.set("w", page.toString());
    params.set("y", searchId.toString());
    if (totalPages > 0) {
      params.set("rtotal", (totalPages * 20).toString());
    }
    return `?${params.toString()}`;
  };

  // Handle page navigation with smooth transition
  const handlePageChange = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages) return;

    startTransition(() => {
      router.push(buildPageUrl(page));
    });
  };

  return (
    <div className="my-8 hidden w-full justify-center overflow-x-auto md:flex">
      {isPending && (
        <div className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
          <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-white px-4 py-2.5 shadow-lg">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-primary border-t-transparent"></div>
            <span className="text-sm font-medium text-gray-700">Loading results...</span>
          </div>
        </div>
      )}

      <Pagination>
        <PaginationContent>
          {/* Previous Button */}
          <PaginationItem>
            {currentPage > 1 ? (
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={isPending}
                className="inline-flex h-10 cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Previous
              </button>
            ) : (
              <span className="inline-flex h-10 cursor-not-allowed items-center justify-center gap-1 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium opacity-50">
                Previous
              </span>
            )}
          </PaginationItem>

          {/* Page Numbers */}
          {getPaginationItems(currentPage, totalPages).map((item, idx) => (
            <PaginationItem key={idx}>
              {item === "start-ellipsis" || item === "end-ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <button
                  onClick={() => handlePageChange(item as number)}
                  disabled={isPending}
                  className={`inline-flex h-10 min-w-10 cursor-pointer items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                    currentPage === item
                      ? "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {item}
                </button>
              )}
            </PaginationItem>
          ))}

          {/* Next Button */}
          <PaginationItem>
            {currentPage < totalPages ? (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={isPending}
                className="inline-flex h-10 cursor-pointer items-center justify-center gap-1 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Next
              </button>
            ) : (
              <span className="inline-flex h-10 cursor-not-allowed items-center justify-center gap-1 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium opacity-50">
                Next
              </span>
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

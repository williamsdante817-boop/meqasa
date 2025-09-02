"use client";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem
} from "@/components/ui/pagination";
import { usePagination } from "@/hooks/use-pagination";
import React from "react";

interface PaginatedContentProps<T> {
  items: T[];
  itemsPerPage?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  gridClassName?: string;
  emptyMessage?: string;
  showPagination?: boolean;
}

export function PaginatedContent<T>({
  items,
  itemsPerPage = 6,
  renderItem,
  gridClassName = "grid grid-cols-2 gap-4 lg:gap-8",
  emptyMessage = "No items found",
  showPagination = true,
}: PaginatedContentProps<T>) {
  const {
    currentItems,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage,
  } = usePagination({ items, itemsPerPage });

  if (items.length === 0) {
    return <div className="text-center py-8 text-gray-500">{emptyMessage}</div>;
  }

  const renderPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, last page, and pages around current
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis-start");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis-end");
      }

      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="space-y-6">
      <div className={gridClassName}>
        {currentItems.map((item, index) => renderItem(item, index))}
      </div>

      {showPagination && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent className="gap-2">
              <PaginationItem>
                <Button
                  variant="ghost"
                  onClick={previousPage}
                  disabled={!hasPreviousPage}
                  className="gap-1 pl-2.5"
                  size="sm"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  <span className="hidden sm:inline">Previous</span>
                </Button>
              </PaginationItem>

              {renderPaginationNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "ellipsis-start" || page === "ellipsis-end" ? (
                    <PaginationEllipsis />
                  ) : (
                    <Button
                      variant={currentPage === page ? "outline" : "ghost"}
                      onClick={() => goToPage(page as number)}
                      className="h-9 w-9 p-0 font-medium"
                      size="sm"
                    >
                      {page}
                    </Button>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <Button
                  variant="ghost"
                  onClick={nextPage}
                  disabled={!hasNextPage}
                  className="gap-1 pr-2.5"
                  size="sm"
                >
                  <span className="hidden sm:inline">Next</span>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}

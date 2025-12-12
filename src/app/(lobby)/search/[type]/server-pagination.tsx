import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ServerPaginationProps {
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

export function ServerPagination({
  currentPage,
  totalPages,
  searchId,
  searchParams,
}: ServerPaginationProps) {
  // Build URL for a specific page
  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("w", page.toString());
    params.set("y", searchId.toString());
    if (totalPages > 0) {
      params.set("rtotal", (totalPages * 20).toString());
    }
    return `?${params.toString()}`;
  };

  return (
    <div className="my-8 hidden w-full justify-center overflow-x-auto md:flex">
      <Pagination>
        <PaginationContent>
          {/* Previous Button */}
          <PaginationItem>
            {currentPage > 1 ? (
              <PaginationPrevious href={buildPageUrl(currentPage - 1)} />
            ) : (
              <span className="inline-flex h-10 items-center justify-center gap-1 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium opacity-50 cursor-not-allowed">
                ← Previous
              </span>
            )}
          </PaginationItem>

          {/* Page Numbers */}
          {getPaginationItems(currentPage, totalPages).map((item, idx) => (
            <PaginationItem key={idx}>
              {item === "start-ellipsis" || item === "end-ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href={buildPageUrl(item as number)}
                  isActive={currentPage === item}
                >
                  {item}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* Next Button */}
          <PaginationItem>
            {currentPage < totalPages ? (
              <PaginationNext href={buildPageUrl(currentPage + 1)} />
            ) : (
              <span className="inline-flex h-10 items-center justify-center gap-1 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium opacity-50 cursor-not-allowed">
                Next →
              </span>
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

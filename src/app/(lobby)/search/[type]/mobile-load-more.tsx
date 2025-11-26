"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";

interface MobileLoadMoreProps {
  currentPage: number;
  totalPages: number;
  searchId: number;
  searchParams: Record<string, string>;
  totalResults: number;
}

export function MobileLoadMore({
  currentPage,
  totalPages,
  searchId,
  searchParams,
  totalResults,
}: MobileLoadMoreProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    const params = new URLSearchParams(searchParams);
    params.set("w", nextPage.toString());
    params.set("y", searchId.toString());
    if (totalPages > 0) {
      params.set("rtotal", totalResults.toString());
    }

    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  if (currentPage >= totalPages) {
    return null;
  }

  return (
    <div className="my-8 block w-full text-center md:hidden">
      <Button
        onClick={handleLoadMore}
        disabled={isPending}
        className="text-brand-accent rounded px-4 py-2 font-semibold"
        variant="outline"
      >
        {isPending ? "Loading..." : "Load More"}
      </Button>
    </div>
  );
}

"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { AgentCard } from "./agent-card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

type AgentSocials = {
  linkedin: string | null;
  twitter: string | null;
  instagram: string | null;
  youtube: string | null;
  facebook: string | null;
};

type Agent = {
  name: string;
  photo: string;
  company: string;
  logo: string;
  about: string;
  locality: string;
  type: string;
  verified: string;
  listings: string;
  socials: AgentSocials;
};

interface AgentsListProps {
  agents: Agent[];
}

const PAGE_SIZE = 16;
const PAGINATION_THRESHOLD = 5;

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

export function AgentsList({ agents }: AgentsListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isPaginationLoading, setIsPaginationLoading] = useState(false);
  const paginationClickedRef = useRef(false);
  const agentsTopRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(agents.length / PAGE_SIZE);

  const visibleAgents = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return agents.slice(startIndex, endIndex);
  }, [agents, currentPage]);

  // Scroll to top of agents section when pagination button is clicked
  useEffect(() => {
    if (paginationClickedRef.current && agentsTopRef.current) {
      agentsTopRef.current.scrollIntoView({ behavior: "smooth" });
      paginationClickedRef.current = false;
    }
  }, [currentPage]);

  const handlePageChange = useCallback(
    (pageNumber: number) => {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        paginationClickedRef.current = true;
        setIsPaginationLoading(true);
        setCurrentPage(pageNumber);
        // Reset loading state after a short delay to allow for smooth scrolling
        setTimeout(() => setIsPaginationLoading(false), 100);
      }
    },
    [totalPages],
  );

  // Don't show pagination if there's only one page or no agents
  if (totalPages <= 1) {
    return (
      <div className="flex flex-col gap-6">
        {visibleAgents.map((agent) => (
          <AgentCard
            key={agent.name}
            id={agent.photo}
            name={agent.name}
            logo={agent.logo}
            location={agent.locality}
            listings={agent.listings}
            description={agent.about}
            isVerified={agent.verified}
            socials={agent.socials}
            website={agent.company}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Reference point for scrolling to top */}
      <div ref={agentsTopRef} />

      {visibleAgents.map((agent) => (
        <AgentCard
          key={agent.name}
          id={agent.photo}
          name={agent.name}
          logo={agent.logo}
          location={agent.locality}
          listings={agent.listings}
          description={agent.about}
          isVerified={agent.verified}
          socials={agent.socials}
          website={agent.company}
        />
      ))}

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1 && !isPaginationLoading) {
                    handlePageChange(currentPage - 1);
                  }
                }}
                aria-disabled={currentPage === 1 || isPaginationLoading}
                aria-label={`Go to previous page (${currentPage - 1})`}
                className={
                  currentPage === 1 || isPaginationLoading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
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
                        handlePageChange(item as number);
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
                    handlePageChange(currentPage + 1);
                  }
                }}
                aria-disabled={
                  currentPage === totalPages || isPaginationLoading
                }
                aria-label={`Go to next page (${currentPage + 1})`}
                className={
                  currentPage === totalPages || isPaginationLoading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

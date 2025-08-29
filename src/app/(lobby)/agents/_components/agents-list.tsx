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
  id: string;
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
  const agentsTopRef = useRef<HTMLDivElement>(null);

  // Ensure agents is an array and has content
  const validAgents = useMemo(
    () => (Array.isArray(agents) ? agents : []),
    [agents],
  );
  const totalPages = Math.ceil(validAgents.length / PAGE_SIZE);

  const visibleAgents = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return validAgents.slice(startIndex, endIndex);
  }, [validAgents, currentPage]);

  console.log("AgentsListProps", agents);

  // Reset to first page when agents data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [validAgents]);

  // Scroll to top of agents section when pagination button is clicked
  useEffect(() => {
    if (agentsTopRef.current) {
      agentsTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage]);

  const handlePageChange = useCallback(
    (pageNumber: number) => {
      console.log("handlePageChange called with:", pageNumber);
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
      }
    },
    [totalPages],
  );

  // Don't show pagination if there's only one page or no agents
  if (totalPages <= 1) {
    return (
      <div className="flex flex-col gap-6">
        {visibleAgents.map((agent, index) => (
          <AgentCard
            key={`${agent.name}-${agent.photo}-${index}`}
            id={agent.id}
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

      {/* Page info */}
      <div className="text-sm text-muted-foreground text-center">
        Showing {(currentPage - 1) * PAGE_SIZE + 1} to{" "}
        {Math.min(currentPage * PAGE_SIZE, validAgents.length)} of{" "}
        {validAgents.length} agents
      </div>

      {visibleAgents.map((agent, index) => (
        <AgentCard
          key={`${agent.name}-${agent.photo}-${currentPage}-${index}`}
          id={agent.id}
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
      <div className="mt-6 flex justify-center relative z-10">
        <Pagination className="isolate">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={(e) => {
                  console.log("Previous button clicked");
                  e.preventDefault();
                  e.stopPropagation();
                  if (currentPage > 1) {
                    handlePageChange(currentPage - 1);
                  }
                }}
                aria-disabled={currentPage === 1}
                aria-label={`Go to previous page (${currentPage - 1})`}
                className={`cursor-pointer ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed pointer-events-none"
                    : ""
                }`}
                style={{
                  pointerEvents: currentPage === 1 ? "none" : "auto",
                  textDecoration: "none",
                  userSelect: "none",
                }}
              />
            </PaginationItem>

            {getPaginationItems(currentPage, totalPages).map((item, idx) => (
              <PaginationItem key={`page-${item}-${idx}`}>
                {item === "start-ellipsis" || item === "end-ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={(e) => {
                      console.log("Page number clicked:", item);
                      e.preventDefault();
                      e.stopPropagation();
                      if (currentPage !== item) {
                        handlePageChange(item as number);
                      }
                    }}
                    isActive={currentPage === item}
                    className="text-brand-accent shadow-none cursor-pointer"
                    aria-label={`Go to page ${item}`}
                    aria-current={currentPage === item ? "page" : undefined}
                    style={{
                      pointerEvents: "auto",
                      textDecoration: "none",
                      userSelect: "none",
                    }}
                  >
                    {item}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={(e) => {
                  console.log("Next button clicked");
                  e.preventDefault();
                  e.stopPropagation();
                  if (currentPage < totalPages) {
                    handlePageChange(currentPage + 1);
                  }
                }}
                aria-disabled={currentPage === totalPages}
                aria-label={`Go to next page (${currentPage + 1})`}
                className={`cursor-pointer ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed pointer-events-none"
                    : ""
                }`}
                style={{
                  pointerEvents: currentPage === totalPages ? "none" : "auto",
                  textDecoration: "none",
                  userSelect: "none",
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

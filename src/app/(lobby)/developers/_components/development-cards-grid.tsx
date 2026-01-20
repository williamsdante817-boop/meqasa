"use client";

import { DevelopmentCard } from "./development-card";

interface Development {
  id: string;
  imageUrl: string;
  developmentName: string;
  location: string;
  developerName: string;
  developerLogo?: string;
  city: string;
  projectId: number;
  webUrl?: string;
}

interface DevelopmentCardsGridProps {
  developments: Development[];
}

// Helper function to create project URL slug to match existing pattern
function createProjectSlug(
  projectName: string,
  city: string,
  projectId: number
): string {
  const nameSlug = projectName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const citySlug = city
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  return `${citySlug}-${nameSlug}-${projectId}`;
}

export function DevelopmentCardsGrid({
  developments,
}: DevelopmentCardsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {developments.map((development) => {
        // Determine href based on development data
        let href: string | undefined;
        let onClick: (() => void) | undefined;

        if (development.projectId) {
          // Internal navigation - use href for better SEO and prefetching
          const projectSlug = createProjectSlug(
            development.developmentName,
            development.city,
            development.projectId
          );
          href = `/development-projects/${projectSlug}`;
        } else if (development.webUrl && development.webUrl.trim() !== "") {
          // External URL - use onClick to open in new tab
          onClick = () => {
            window.open(development.webUrl, "_blank");
          };
        }

        return (
          <DevelopmentCard
            key={development.id}
            id={development.id}
            imageUrl={development.imageUrl}
            developmentName={development.developmentName}
            location={development.location}
            developerName={development.developerName}
            developerLogo={development.developerLogo}
            href={href}
            onClick={onClick}
          />
        );
      })}
    </div>
  );
}

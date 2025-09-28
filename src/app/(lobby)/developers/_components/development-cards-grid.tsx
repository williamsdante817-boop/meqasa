"use client";

import { DevelopmentCard } from "./development-card";
import { useRouter } from "next/navigation";

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
function createProjectSlug(projectName: string, city: string, projectId: number): string {
  const nameSlug = projectName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const citySlug = city.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  return `${citySlug}-${nameSlug}-${projectId}`;
}

export function DevelopmentCardsGrid({
  developments,
}: DevelopmentCardsGridProps) {
  const router = useRouter();

  const handleDevelopmentClick = (development: Development) => {
    // Navigate to internal project details page using project ID
    if (development.projectId) {
      const projectSlug = createProjectSlug(
        development.developmentName,
        development.city,
        development.projectId
      );
      router.push(`/development-projects/${projectSlug}`);
      return;
    }

    // Fallback: if no project ID, check for external webUrl
    if (development.webUrl && development.webUrl.trim() !== '') {
      window.open(development.webUrl, '_blank');
      return;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {developments.map((development) => (
        <DevelopmentCard
          key={development.id}
          id={development.id}
          imageUrl={development.imageUrl}
          developmentName={development.developmentName}
          location={development.location}
          developerName={development.developerName}
          developerLogo={development.developerLogo}
          onClick={() => handleDevelopmentClick(development)}
        />
      ))}
    </div>
  );
}

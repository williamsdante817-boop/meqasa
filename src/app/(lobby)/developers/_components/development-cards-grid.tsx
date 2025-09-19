"use client";

import { DevelopmentCard } from "./development-card";

interface Development {
  id: string;
  imageUrl: string;
  developmentName: string;
  location: string;
  developerName: string;
  developerLogo?: string;
  projectValue?: string;
}

interface DevelopmentCardsGridProps {
  developments: Development[];
}

export function DevelopmentCardsGrid({
  developments,
}: DevelopmentCardsGridProps) {
  // Handler functions for the development cards
  const handleViewProject = (id: string) => {
    // Navigate to project details page (to be implemented later)
    console.log("View project:", id);
  };

  const handleDevelopmentClick = (id: string) => {
    // Navigate to development details page (to be implemented later)
    console.log("Development clicked:", id);
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
          projectValue={development.projectValue}
          onViewProject={handleViewProject}
          onClick={handleDevelopmentClick}
        />
      ))}
    </div>
  );
}

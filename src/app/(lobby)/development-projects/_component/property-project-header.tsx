"use client";

import { Badge } from "@/components/ui/badge";
import { Dot, MapPin } from "lucide-react";
import type { DeveloperProject } from "@/types";
import { getStatusBadgeVariant } from "./property-container-utils";

interface PropertyProjectHeaderProps {
  projectData: DeveloperProject;
  unityTypes: string[];
  projectType: string;
}

export function PropertyProjectHeader({
  projectData,
  unityTypes,
  projectType,
}: PropertyProjectHeaderProps) {
  const statusBadgeVariant = getStatusBadgeVariant(
    projectData.project.projectstatus
  );

  return (
    <div className="text-brand-accent">
      <span className="text-base font-semibold">Project Highlight</span>
      <div className="item-center mt-3 mb-1 flex h-full gap-4">
        <h1 className="text-3xl font-extrabold text-inherit">
          {projectData.project.projectname}
        </h1>
        {projectData.project.projectstatus && (
          <div className="flex items-center">
            <Badge
              variant={statusBadgeVariant}
              className="uppercase"
              aria-label={`Project status: ${projectData.project.projectstatus}`}
            >
              {projectData.project.projectstatus}
            </Badge>
          </div>
        )}
      </div>
      <div className="mb-2 text-sm">
        <span className="flex items-center font-light text-inherit">
          {projectType} <Dot className="h-4 w-4" aria-hidden="true" />
          <span className="line-clamp-1 uppercase">
            {unityTypes.map((type) => type)}
          </span>
        </span>
      </div>
      <div className="mt-1 flex items-center gap-2 text-end text-xs font-medium text-blue-600 lg:text-sm">
        <MapPin className="h-5 w-5" strokeWidth="1.3" aria-hidden="true" />
        {projectData.project.formatted_address || projectData.project.city}
      </div>
    </div>
  );
}
/**
 * Data utilities for PropertyContainer component
 * Handles validation, transformation, and business logic
 */

import type { Listing } from "@/components/property/cards/property-card";
import { sanitizeRichHtmlToInnerHtml } from "@/lib/dom-sanitizer";
import { buildTempImageUrl } from "@/lib/image-utils";
import type { DeveloperProject, Unit } from "@/types";
import { useMemo } from "react";

// Constants for better maintainability
export const SECTION_IDS = {
  FLOOR_PLAN: "floor-plan",
  SITE_PLAN: "site-plan",
  LOCATION: "location",
  AVAILABLE_UNITS: "available-units",
} as const;

export const STATUS_BADGE_VARIANTS = {
  completed: "success",
  ongoing: "warning",
  default: "default",
} as const;

// Enhanced data validation helper
export function validateProjectData(data: DeveloperProject): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check if data exists
  if (!data) {
    errors.push("No project data provided");
    return { isValid: false, errors };
  }

  // Check if project object exists
  if (!data.project) {
    errors.push("Project information is missing");
    return { isValid: false, errors };
  }

  // Check required project fields
  if (!data.project.projectid) errors.push("Missing project ID");
  if (!data.project.projectname) errors.push("Missing project name");
  if (!data.project.companyname) errors.push("Missing company name");

  // Check if arrays exist to prevent runtime errors
  if (!Array.isArray(data.unittypes)) errors.push("Unit types data is invalid");
  if (!Array.isArray(data.projecttypes))
    errors.push("Project types data is invalid");
  if (!Array.isArray(data.photos)) errors.push("Photos data is invalid");
  if (!Array.isArray(data.features)) errors.push("Features data is invalid");
  if (!Array.isArray(data.units)) errors.push("Units data is invalid");

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Memoized project data transformers with safety checks
export function useProjectDataTransformers(projectData: DeveloperProject) {
  console.log(projectData);
  return useMemo(
    () => ({
      markup: sanitizeRichHtmlToInnerHtml(
        projectData.project?.aboutproject ?? ""
      ),
      unityTypes: (projectData.unittypes ?? []).map(
        (unitType) => unitType.type + " "
      ),
      projectType:
        (projectData.projecttypes ?? []).map((project) => project.type)[0] ??
        "Not specified",
      images: (projectData.photos ?? []).map((photo) => photo.photo),
      projectDetails: [
        { title: "Name", value: projectData.project?.name ?? "Not specified" },
        {
          title: "Neighborhood",
          value: projectData.project?.city ?? "Not specified",
        },
        {
          title: "Location",
          value: projectData.project?.formatted_address ?? "Not specified",
        },
        {
          title: "Region",
          value: projectData.project?.region ?? "Not specified",
        },
        {
          title: "Status",
          value: projectData.project?.projectstatus ?? "Not specified",
        },
        {
          title: "Number of Buildings",
          value: projectData.project?.unitcount ?? "Not specified",
        },
        {
          title: "Project Types",
          value:
            (projectData.projecttypes ?? []).map((pt) => pt.type).join(", ") ||
            "Not specified",
        },
        {
          title: "Unit Types",
          value:
            (projectData.unittypes ?? []).map((ut) => ut.type).join(", ") ||
            "Not specified",
        },
        {
          title: "Parking Types",
          value:
            (projectData.parkingtypes ?? []).map((pt) => pt.type).join(", ") ||
            "Not specified",
        },
        {
          title: "Date Updated",
          value: projectData.project?.updated_at ?? "Not specified",
        },
      ],
    }),
    [projectData]
  );
}

// Memoize status badge variant helper
export function getStatusBadgeVariant(projectStatus?: string) {
  const status = projectStatus?.toLowerCase();
  return (
    STATUS_BADGE_VARIANTS[status as keyof typeof STATUS_BADGE_VARIANTS] ||
    STATUS_BADGE_VARIANTS.default
  );
}

// Memoize units mapping helper
export function mapProjectUnits(units: Unit[]): Listing[] {
  if (!units || units.length === 0) return [];

  return units.map(
    (unit): Listing => ({
      ...unit,
      image: buildTempImageUrl(unit.coverphoto),
      detailreq: `/developer-unit/${unit.unitid}`,
      listingid: String(unit.unitid),
      streetaddress: unit.address,
      contract: unit.terms,
      title: unit.title ?? unit.unitname,
      garages: unit.garages?.toString() ?? "0",
      price: unit.price?.toString() ?? "0",
      bathroomcount: unit.baths?.toString() ?? "0",
      bedroomcount: unit.beds?.toString() ?? "0",
      summary: unit.title ?? unit.unitname,
      pricepart1: unit.price?.toString() ?? "0",
      pricepart2: unit.terms === "rent" ? "/month" : "",
      featured: Boolean(unit.featured),
    })
  );
}

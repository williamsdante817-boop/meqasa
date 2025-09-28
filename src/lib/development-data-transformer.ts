import type { Development, DevelopmentProjectResponse, ApiProject } from '@/types/development';

/**
 * Transforms API data to component format with error handling and validation
 * @param apiData - Raw API response data
 * @returns Array of transformed Development objects
 */
export function transformApiDataToDevelopments(apiData: DevelopmentProjectResponse | null): Development[] {
  if (!apiData?.projects || !Array.isArray(apiData.projects)) {
    console.warn("Invalid or missing projects data:", apiData);
    return [];
  }

  return apiData.projects
    .filter((project: ApiProject) => project?.projectid && project?.projectname)
    .map((project: ApiProject) => ({
      id: project.projectid.toString(),
      imageUrl: project.photoUrl || "/images/development-placeholder.jpg",
      developmentName: project.projectname,
      location: formatProjectLocation(project),
      developerName: project.companyname || project.name || "Developer",
      developerLogo: project.logoUrl,
      city: project.city || "Unknown",
      projectId: project.projectid,
      webUrl: project.weburl,
    }));
}

/**
 * Formats project location with proper fallbacks
 * @param project - API project data
 * @returns Formatted location string
 */
function formatProjectLocation(project: ApiProject): string {
  if (project.fullLocation) {
    return project.fullLocation;
  }

  const address = project.address || "";
  const city = project.city || "";

  return `${address}, ${city}`
    .trim()
    .replace(/^,\s*/, "")
    .replace(/,\s*$/, "");
}
import { logger } from "@/lib/logger";
import type { DevelopmentProjectResponse } from "@/app/api/development-projects/route";

const CLOUDFRONT_BASE = "https://dve7rykno93gs.cloudfront.net";

// Function to process API response data (same as in development-projects route)
function processApiResponse(data: DevelopmentProjectResponse) {
  return {
    ...data,
    developers:
      data.developers?.map((dev) => ({
        ...dev,
        logoUrl: dev.logo
          ? `${CLOUDFRONT_BASE}/uploads/imgs/${dev.logo}`
          : null,
      })) || [],
    projects:
      data.projects?.map((project) => ({
        ...project,
        photoUrl: project.photo
          ? `${CLOUDFRONT_BASE}/tn5/uploads/imgs/${project.photo}`
          : null,
        logoUrl: project.logo
          ? `${CLOUDFRONT_BASE}/uploads/imgs/${project.logo}`
          : null,
        isFeatured: project.featured === 1,
        isPublished: project.publish === 1,
        status:
          project.projectstatus === "uncompleted"
            ? "ongoing"
            : project.projectstatus === "completed"
              ? "completed"
              : "new",
        location:
          project.formatted_address || `${project.address}, ${project.city}`,
        fullLocation: `${project.address}, ${project.city}, ${project.region}`,
      })) || [],
  };
}

export async function getDevelopments(): Promise<DevelopmentProjectResponse | null> {
  try {
    // Create query parameters for GET request
    const queryParams = new URLSearchParams();
    queryParams.set("app", "vercel");

    const url = `https://meqasa.com/real-estate-developments?${queryParams.toString()}`;

    logger.debug("Fetching development projects from:", {
      url,
      queryParams: Object.fromEntries(queryParams.entries()),
    });

    const response = await fetch(url, {
      method: "GET",
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (response.ok) {
      const rawData: DevelopmentProjectResponse = await response.json();
      logger.debug("Raw development projects API response:", {
        projectCount: rawData.projects?.length ?? 0,
        developerCount: rawData.developers?.length ?? 0,
      });

      // Process the data to add CloudFront URLs
      const processedData = processApiResponse(rawData);
      logger.debug("Processed development projects data:", {
        projectCount: processedData.projects?.length ?? 0,
        developerCount: processedData.developers?.length ?? 0,
      });

      return processedData;
    } else {
      logger.error(`API returned ${response.status}`);
      return null;
    }
  } catch (error) {
    logger.error("Error fetching development projects:", error);
    return null;
  }
}

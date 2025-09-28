import type { DevelopmentProjectResponse } from '@/app/api/development-projects/route';

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

    console.log("Fetching development projects from:", {
      url,
      queryParams: Object.fromEntries(queryParams.entries()),
    });

    const response = await fetch(url, {
      method: "GET",
    });

    if (response.ok) {
      const rawData: DevelopmentProjectResponse = await response.json();
      console.log("Raw development projects API response:", rawData);

      // Process the data to add CloudFront URLs
      const processedData = processApiResponse(rawData);
      console.log("Processed development projects data:", processedData);

      return processedData;
    } else {
      console.error(`API returned ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching development projects:", error);
    return null;
  }
}
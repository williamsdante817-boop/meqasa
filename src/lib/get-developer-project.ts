import type { DeveloperProject } from "@/types";
import { apiFetch } from "./api-client";


export async function getDeveloperProject(
  projectId: number,
): Promise<DeveloperProject> {
  const url = `https://meqasa.com/developer-projects/profile/${projectId}?app=vercel`; 
  return await apiFetch({
    url,
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded", // Set content type to x-www-form-urlencoded
    },
  });
}

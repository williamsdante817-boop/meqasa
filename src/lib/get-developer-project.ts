import type { DeveloperProject } from "@/types";
import { apiClient } from "./axios-client";

export async function getDeveloperProject(
  projectId: number,
): Promise<DeveloperProject> {
  const url = `https://meqasa.com/developer-projects/profile/${projectId}?app=vercel`;
  return await apiClient.get<DeveloperProject>(url, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded", // Set content type to x-www-form-urlencoded
    },
  });
}

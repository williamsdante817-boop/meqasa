import { apiClient } from "./axios-client";
import type { DeveloperDetails } from "@/types";

/**
 * Fetches the developer profile details for a specific developer ID from the MeQasa server.
 *
 * @param projectId - The unique identifier for the developer project to retrieve details for.
 * @returns A promise that resolves with an object of type {@link DeveloperDetails},
 *          which includes various details such as the developer's name, logo, contact details,
 *          and an array of project IDs.
 * @throws An error if the request fails or the server returns an error.
 */
export async function getDeveloperProfile(
  developerId: number,
): Promise<DeveloperDetails> {
  const url = `https://meqasa.com/developer-developer/${developerId}?app=vercel`;
  console.log(url);
  console.log(developerId);

  return await apiClient.get<DeveloperDetails>(url, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded", // Set content type to x-www-form-urlencoded
    },
  });
}

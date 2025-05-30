import { apiFetch } from "./api-client";

export interface Developer {
  developerid: string;
  about: string;
  email: string;
  logo: string;
  subdomain: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  instagram: string;
  hero: string;
  city: string;
  address: string;
  website: string;
  companyname: string;
  name: string;
  unitcount: number;
  landcount: number;
  prcount: number;
}

export interface DevelopersResponse {
  developers: Developer[];
}

/**
 * Fetches the list of developers from the MeQasa server.
 *
 * @returns A promise that resolves with a {@link DevelopersResponse} object,
 *          containing an array of developer details.
 * @throws An error if the request fails or the server returns an error.
 */
export async function getDevelopers(): Promise<DevelopersResponse> {
  const url = "https://meqasa.com/real-estate-developers";

  return await apiFetch<DevelopersResponse>({
    url,
    method: "POST",
    params: {
      app: "vercel",
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}

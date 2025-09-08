import { apiClient } from "./axios-client";

interface BrokerSocials {
  linkedin: string | null;
  twitter: string | null;
  instagram: string | null;
  youtube: string | null;
  facebook: string | null;
}

interface BrokerObject {
  name: string;
  photo: string;
  company: string;
  logo: string;
  about: string;
  locality: string;
  type: string;
  verified: string;
  listings: string;
  id: string;
  socials: BrokerSocials;
}

interface AgentsResponse {
  list: BrokerObject[];
}

/**
 * Fetches a list of featured real estate agents from the MeQasa API.
 *
 * @returns A promise that resolves to an object containing an array of broker objects.
 * Each broker object includes details such as name, photo, company, logo, and social media links.
 */
export async function getAllAgents(): Promise<AgentsResponse> {
  const url = "https://meqasa.com/real-estate-agents?app=vercel";

  return await apiClient.post<AgentsResponse>(
    url,
    {},
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
}

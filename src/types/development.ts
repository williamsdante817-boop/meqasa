/**
 * Types for developer projects and development-related components
 */

export interface Development {
  id: string;
  imageUrl: string;
  developmentName: string;
  location: string;
  developerName: string;
  developerLogo?: string;
  city: string;
  projectId: number;
  webUrl?: string;
}

export interface ApiDeveloper {
  developerid: string;
  logo: string;
  companyname: string;
  name: string;
  logoUrl?: string;
}

export interface ApiProject {
  projectid: number;
  projectname: string;
  photoUrl?: string;
  photo?: string;
  logoUrl?: string;
  logo?: string;
  companyname?: string;
  name?: string;
  fullLocation?: string;
  address?: string;
  city?: string;
  weburl?: string;
}

export interface DevelopmentProjectResponse {
  projects?: ApiProject[];
  developers?: ApiDeveloper[];
}

export interface DeveloperProjectsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}
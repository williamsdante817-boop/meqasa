// https://meqasa.com/real-estate-developments

import { apiFetch } from "./api-client";

interface LogoObject {
  developerid: string;
  logo: string;
  companyname: string;
  name: string;
}

interface ProjectObject {
  projectid: number;
  projectname: string;
  address: string;
  city: string;
  region: string;
  aboutproject: string;
  photo: string;
  projectstatus: string;
  propertymanagement: string;
  associationdues: string;
  unitcount: number;
  tourvideo: string;
  imcount: number | null;
  developerid: number;
  dateadded: string;
  featured: number;
  test: number;
  numparkingspace: number;
  publish: number;
  oldproject: number;
  formatted_address: string;
  lat: number;
  lng: number;
  pageviews: number;
  landonly: number;
  updated_at: string;
  top: string | null;
  bottom: string | null;
  sidebar: string | null;
  title: string | null;
  description: string | null;
  weburl: string;
  photostorage: string;
  logo: string;
}

interface SeoContentObject {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
}

interface UnitTypeObject {
  type: string;
  description: string;
  features: string[];
}

interface DevelopmentsResponse {
  hero: {
    src: string;
    href: string;
  };
  developers: LogoObject[];
  projects: ProjectObject[];
  seocontent: SeoContentObject[];
  unittypes: UnitTypeObject[];
}

export async function getDevelopments(): Promise<DevelopmentsResponse> {
  const url = `https://meqasa.com/real-estate-developments?app=vercel`;
  return await apiFetch({
    url,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
}

import { apiClient } from "./axios-client";

interface UnitPhoto {
  unitid: string;
  photo: string;
}

interface UnitFeature {
  feature: string;
  unitid: string;
  ufid: string;
}

export interface SimilarUnit {
  unitid: number;
  terms: string;
  unittype: string;
  beds: number;
  baths: number;
  garages: number;
  hasbalcony: number;
  price: number;
  floorarea: number;
  description: string;
  coverphoto: string;
  dateadded: string;
  soldout: number;
  unitname: string;
  sellingprice: number;
  city: string;
  address: string;
  title: string;
  unittypename: string;
  unittypeslug: string;
  status: string;
}

export interface UnitDetails {
  unit: {
    unitid: string;
    terms: string;
    unittype: string;
    beds: number;
    baths: number;
    garages: number;
    hasbalcony: number;
    price: string;
    floorarea: number;
    description: string;
    imcount?: number | null;
    projectid?: number;
    coverphoto: string;
    dateadded: string;
    soldout: number;
    csign: string;
    unitname: string;
    fullyfurnished: number;
    availableunits: number;
    featured: number;
    test?: number;
    developerid: number;
    rentduration?: number;
    parkingspace?: number;
    sellingpricecsign?: string;
    rentpricecsignpermonth?: string;
    rentpricecsignperweek?: string;
    rentpricecsignperday?: string;
    rentdurationindays?: number;
    rentdurationinweeks?: number;
    rentdurationinmonths?: number;
    rentpricepermonth?: number;
    rentpriceperweek?: number;
    rentpriceperday?: number;
    sellingprice: number;
    rentdurationtype?: string;
    hasparkingspace?: number;
    city: string;
    address: string;
    tourvideo?: string;
    publish?: number;
    lng?: number;
    lat?: number;
    formatted_address?: string;
    pageviews: number;
    negotiable?: number;
    landmesurement?: string;
    landlength?: number;
    landwidth?: number;
    title: string;
    persquaremeter?: number;
    photostorage?: string;
    unitexists?: number;
    projectname?: string;
    name?: string;
    png?: string | null;
    companyname: string;
    logo: string;
    topad?: number;
    unittypename: string;
    unittypeslug: string;
    url: string;
    durtyp?: string;
    updated_at: string;
    cediequiv?: string;
  };
  features: UnitFeature[];
  photos: UnitPhoto[];
  similarunits: SimilarUnit[];
}

export async function getUnitDetails(unitId: string): Promise<UnitDetails> {
  try {
    const url = `https://meqasa.com/developer-units/details/${unitId}?app=vercel`;
    const data = await apiClient.get<UnitDetails>(url, {
      headers: {
        Accept: "application/json",
      },
    });

    return data;
  } catch (error) {
    throw new Error(
      `API fetch failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

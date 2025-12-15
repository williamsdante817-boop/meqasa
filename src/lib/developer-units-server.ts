/**
 * Server-side utilities for fetching developer units directly from Meqasa API
 * 
 * **SERVER COMPONENTS ONLY** - Use these functions in Server Components
 * All data fetching is now server-side for optimal performance
 */

interface DeveloperUnitParams {
  app?: string;
  terms?: string;
  unittype?: string;
  address?: string;
  maxprice?: number;
  beds?: number;
  baths?: number;
  projectid?: number;
  offset?: number;
}

interface RawDeveloperUnit {
  unitid?: number | string;
  title?: string;
  unittypename?: string;
  unittype?: string;
  beds?: number | string;
  baths?: number | string;
  terms?: string;
  city?: string;
  location?: string;
  address?: string;
  coverphoto?: string;
  companyname?: string;
  name?: string;
  description?: string;
  price?: number | string;
  sellingprice?: number | string;
  sellingpricecsign?: string;
  rentpricepermonth?: number | string;
  rentpricecsignpermonth?: string;
  featured?: boolean;
  developerlogo?: string;
  logo?: string;
  developermobile?: string;
  mobile?: string;
  developeremail?: string;
  email?: string;
  floorarea?: number | string;
  timestamp?: string;
  dateadded?: string;
  [key: string]: unknown;
}

export interface DeveloperUnit {
  id: string;
  unitid?: number;
  title: string;
  price: string;
  location: string;
  address?: string;
  city?: string;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  baths: number;
  unittype: string;
  unittypename: string;
  terms: string;
  image?: string;
  coverphoto?: string;
  developer?: string;
  companyname?: string;
  name?: string;
  area?: string;
  floorarea?: number;
  sellingprice?: string;
  sellingpricecsign?: string;
  rentpricepermonth?: string;
  rentpricecsignpermonth?: string;
  description?: string;
  featured?: boolean;
  developerlogo?: string;
  developermobile?: string;
  developeremail?: string;
  timestamp?: string;
  dateadded?: string;
  [key: string]: unknown;
}

const DEFAULT_APP_ID = "vercel";

/**
 * Fetch developer units directly from Meqasa API
 * **SERVER COMPONENTS ONLY**
 */
export async function fetchDeveloperUnitsServer(
  params: DeveloperUnitParams = {}
): Promise<DeveloperUnit[]> {
  try {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value == null) return;
      const stringValue = String(value).trim();
      if (stringValue === "") return;
      searchParams.set(key, stringValue);
    });

    if (!searchParams.has("app")) {
      searchParams.set("app", DEFAULT_APP_ID);
    }

    const apiUrl = `https://meqasa.com/new-development-units?${searchParams.toString()}`;
    console.log("🏠 [Server] Fetching developer units from:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "MeQasa-Vercel-App/1.0",
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error("Developer units API error:", {
        status: response.status,
        statusText: response.statusText,
        url: apiUrl,
      });
      return [];
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      console.warn("Developer units API returned non-JSON response");
      return [];
    }

    const rawData = await response.json();

    if (!Array.isArray(rawData)) {
      console.warn("Developer units API returned non-array data");
      return [];
    }

    const units = rawData as RawDeveloperUnit[];
    console.log(`✅ [Server] Developer units API returned ${units.length} units`);

    return units.map((unit) => {
      const unitIdString = unit.unitid != null ? String(unit.unitid) : Math.random().toString();
      const bedsValue = Number(unit.beds ?? 0) || 0;
      const bathsValue = Number(unit.baths ?? 0) || 0;
      const propertyType = (unit.unittypename ?? unit.unittype ?? "Apartment").toString();
      const terms = (unit.terms ?? "sale").toString();
      const locationSource = unit.address ?? unit.city ?? unit.location ?? "Ghana";
      const locationText = typeof locationSource === "string" ? locationSource : String(locationSource);
      
      const coverPhoto = typeof unit.coverphoto === "string" ? unit.coverphoto : undefined;
      const fallbackImage = "https://dve7rykno93gs.cloudfront.net/pieoq/1572277987";
      const imageUrl = coverPhoto
        ? `https://dve7rykno93gs.cloudfront.net/uploads/imgs/${coverPhoto}?dim=256x190`
        : fallbackImage;

      const priceValue = unit.price != null ? String(unit.price) : "";
      const sellingPriceValue = unit.sellingprice != null ? String(unit.sellingprice) : undefined;

      return {
        id: unitIdString,
        unitid: typeof unit.unitid === "number" ? unit.unitid : undefined,
        title:
          typeof unit.title === "string" && unit.title.trim() !== ""
            ? unit.title
            : `${bedsValue === 1 ? "1 Bedroom" : `${bedsValue} Bedroom`} ${propertyType} ${terms === "rent" ? "For Rent" : "For Sale"} in ${locationText}`,
        price: priceValue,
        location: locationText,
        address: typeof unit.address === "string" ? unit.address : undefined,
        city: typeof unit.city === "string" ? unit.city : undefined,
        bedrooms: bedsValue,
        beds: bedsValue,
        bathrooms: bathsValue,
        baths: bathsValue,
        unittype: (unit.unittype ?? "apartment").toString(),
        unittypename: propertyType,
        terms,
        image: imageUrl,
        coverphoto: coverPhoto,
        developer:
          typeof unit.companyname === "string"
            ? unit.companyname
            : typeof unit.name === "string"
              ? unit.name
              : "Developer",
        companyname: typeof unit.companyname === "string" ? unit.companyname : undefined,
        name: typeof unit.name === "string" ? unit.name : undefined,
        area: unit.floorarea != null && unit.floorarea !== "" ? `${String(unit.floorarea)} sqm` : undefined,
        floorarea:
          typeof unit.floorarea === "number"
            ? unit.floorarea
            : unit.floorarea != null
              ? Number(unit.floorarea) || undefined
              : undefined,
        sellingprice: sellingPriceValue,
        sellingpricecsign: typeof unit.sellingpricecsign === "string" ? unit.sellingpricecsign : undefined,
        rentpricepermonth: unit.rentpricepermonth != null ? String(unit.rentpricepermonth) : undefined,
        rentpricecsignpermonth: typeof unit.rentpricecsignpermonth === "string" ? unit.rentpricecsignpermonth : undefined,
        description: typeof unit.description === "string" ? unit.description : undefined,
        featured: Boolean(unit.featured),
        developerlogo:
          typeof unit.developerlogo === "string"
            ? unit.developerlogo
            : typeof unit.logo === "string"
              ? unit.logo
              : undefined,
        developermobile:
          typeof unit.developermobile === "string"
            ? unit.developermobile
            : typeof unit.mobile === "string"
              ? unit.mobile
              : undefined,
        developeremail:
          typeof unit.developeremail === "string"
            ? unit.developeremail
            : typeof unit.email === "string"
              ? unit.email
              : undefined,
        timestamp: typeof unit.timestamp === "string" ? unit.timestamp : typeof unit.dateadded === "string" ? unit.dateadded : undefined,
        dateadded: typeof unit.dateadded === "string" ? unit.dateadded : undefined,
        ...unit,
      };
    });
  } catch (error) {
    console.error("Error fetching developer units:", error);
    return [];
  }
}

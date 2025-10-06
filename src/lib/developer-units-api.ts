interface DeveloperUnitParams {
  terms?: "sale" | "rent" | "preselling";
  unittype?: string;
  address?: string;
  maxprice?: number;
  beds?: number;
  baths?: number;
  app?: string;
}

interface DeveloperUnit {
  id: string;
  unitid: number;
  title: string;
  price: string;
  location: string;
  address: string;
  city: string;
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
  sellingprice?: number;
  sellingpricecsign?: string;
  description?: string;
  featured?: boolean;
  developerlogo?: string;
  developermobile?: string;
  developeremail?: string;
  timestamp?: string;
  dateadded?: string;
  [key: string]: any;
}

export async function fetchDeveloperUnits(
  params: DeveloperUnitParams = {}
): Promise<DeveloperUnit[]> {
  try {
    // Set default app parameter
    const searchParams = new URLSearchParams({
      app: "vercel",
      ...Object.entries(params).reduce(
        (acc, [key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            acc[key] = String(value);
          }
          return acc;
        },
        {} as Record<string, string>
      ),
    });

    const url = `https://meqasa.com/new-development-units?${searchParams.toString()}`;
    console.log("🏠 Fetching developer units from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "MeQasa-Vercel-App/1.0",
      },
      // Add cache and revalidation for production
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });

    if (!response.ok) {
      console.error("Developer units API error:", {
        status: response.status,
        statusText: response.statusText,
        url,
      });
      throw new Error(
        `Failed to fetch developer units: ${response.status} ${response.statusText}`
      );
    }

    const rawData = await response.json();

    // Ensure we return an array
    if (!Array.isArray(rawData)) {
      console.warn("Developer units API returned non-array data:", rawData);
      return [];
    }

    // Transform the API response to match our interface
    console.log(`✅ Developer units API returned ${rawData.length} units`);

    const data: DeveloperUnit[] = rawData.map((unit: any) => ({
      id:
        unit.unitid?.toString() ||
        `fallback-${unit.title?.slice(0, 10) || "unit"}`
          .replace(/\s+/g, "-")
          .toLowerCase(),
      unitid: unit.unitid,
      title:
        unit.title ||
        `${unit.beds || 1}BR ${unit.unittypename || "Apartment"} in ${unit.city || "Location"}`,
      price:
        unit.price ||
        `${unit.sellingpricecsign || ""}${unit.sellingprice || 0}`,
      location: `${unit.address || unit.city || "Ghana"}`,
      address: unit.address,
      city: unit.city,
      bedrooms: unit.beds || 0,
      beds: unit.beds || 0,
      bathrooms: unit.baths || 0,
      baths: unit.baths || 0,
      unittype: unit.unittype || "apartment",
      unittypename: unit.unittypename || "Apartment",
      terms: unit.terms || "sale",
      image: unit.coverphoto
        ? `https://dve7rykno93gs.cloudfront.net/temp/temp/${unit.coverphoto}`
        : undefined,
      coverphoto: unit.coverphoto,
      developer: unit.companyname || unit.name,
      companyname: unit.companyname,
      name: unit.name,
      area: unit.floorarea ? `${unit.floorarea} sqm` : undefined,
      floorarea: unit.floorarea,
      sellingprice: unit.sellingprice,
      sellingpricecsign: unit.sellingpricecsign,
      description: unit.description,
      featured: false, // Will be set by calling function
      // Add developer logo fields
      developerlogo: unit.developerlogo || unit.logo,
      developermobile: unit.developermobile || unit.mobile,
      developeremail: unit.developeremail || unit.email,
      timestamp: unit.timestamp || unit.dateadded,
      dateadded: unit.dateadded,
    }));

    console.log(`🏠 Transformed ${data.length} developer units for display`);
    return data;
  } catch (error) {
    console.error("Error fetching developer units:", error);
    return [];
  }
}

export async function fetchFeaturedDeveloperUnits(): Promise<DeveloperUnit[]> {
  // Fetch a mix of sale and rent units for featured display
  const [saleUnits, rentUnits] = await Promise.all([
    fetchDeveloperUnits({ terms: "sale" }),
    fetchDeveloperUnits({ terms: "rent" }),
  ]);

  // Combine and take first 6 units as featured
  const allUnits = [...saleUnits, ...rentUnits];
  return allUnits.slice(0, 6).map((unit) => ({ ...unit, featured: true }));
}

// Helper function to get unit types for filtering
export const UNIT_TYPES = [
  "apartment",
  "house",
  "townhouse",
  "land",
  "office",
  "commercial",
  "warehouse",
  "shop",
] as const;

// Helper function to format price
export function formatPrice(price: string | number): string {
  if (!price) return "Price on request";

  const numPrice =
    typeof price === "string"
      ? parseFloat(price.replace(/[^\d.]/g, ""))
      : price;
  if (isNaN(numPrice)) return "Price on request";

  return `GH₵ ${numPrice.toLocaleString()}`;
}

// Helper function to get display name for unit type
export function getUnitTypeDisplayName(unittype: string): string {
  const displayNames: Record<string, string> = {
    apartment: "Apartment",
    house: "House",
    townhouse: "Townhouse",
    land: "Land",
    office: "Office Space",
    commercial: "Commercial Space",
    warehouse: "Warehouse",
    shop: "Shop",
  };

  return displayNames[unittype.toLowerCase()] || unittype;
}

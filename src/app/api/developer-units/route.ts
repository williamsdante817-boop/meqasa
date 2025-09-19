import { NextRequest, NextResponse } from "next/server";

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
  unitid: number;
  floorarea: number;
  beds: number;
  baths: number;
  description: string;
  sellingprice: number;
  sellingpricecsign: string;
  unittype: string;
  terms: string;
  city: string;
  address: string;
  coverphoto: string;
  companyname: string;
  name: string;
  price: string;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const params: DeveloperUnitParams = body;

    // Build query parameters to match live MeQasa site exactly
    const searchParams = new URLSearchParams();

    // Always include app parameter
    searchParams.set("app", "vercel");

    // Include all parameters, even if empty (to match live site behavior)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value));
      }
    });

    const apiUrl = `https://meqasa.com/new-development-units?${searchParams.toString()}`;
    console.log("🏠 Fetching developer units from:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent": "MeQasa-Vercel-App/1.0",
      },
      // Add caching
      next: { revalidate: 300 }, // 5 minutes
    });

    if (!response.ok) {
      console.error("Developer units API error:", {
        status: response.status,
        statusText: response.statusText,
        url: apiUrl,
      });
      throw new Error(
        `MeQasa API error: ${response.status} ${response.statusText}`
      );
    }

    const rawData = await response.json();

    if (!Array.isArray(rawData)) {
      console.warn("Developer units API returned non-array data:", rawData);
      return NextResponse.json([], { status: 200 });
    }

    console.log(`✅ Developer units API returned ${rawData.length} units`);

    // Debug: Log first unit to see what fields are available
    if (rawData.length > 0) {
      console.log("🔍 First unit raw data:", {
        unitid: rawData[0].unitid,
        title: rawData[0].title,
        coverphoto: rawData[0].coverphoto,
        photos: rawData[0].photos,
        images: rawData[0].images,
        photo: rawData[0].photo,
        gallery: rawData[0].gallery,
        keys: Object.keys(rawData[0]),
      });

      // Debug date fields specifically
      console.log("📅 Date fields debug:", {
        unitid: rawData[0].unitid,
        timestamp: rawData[0].timestamp,
        dateadded: rawData[0].dateadded,
        updated_at: rawData[0].updated_at,
        timestampType: typeof rawData[0].timestamp,
        dateaddedType: typeof rawData[0].dateadded,
        updated_atType: typeof rawData[0].updated_at,
      });
    }

    // Transform the data to a consistent format
    const transformedData = rawData.map((unit: Record<string, unknown>) => ({
      id: unit.unitid?.toString() || Math.random().toString(),
      unitid: unit.unitid,
      title:
        unit.title ||
        `${String(unit.beds || 1)}BR ${String(unit.unittypename || unit.unittype)} in ${String(unit.city)}`,
      price: unit.price, // Use the raw price field as-is
      location: `${String(unit.address || unit.city || "Ghana")}`,
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
        ? `https://dve7rykno93gs.cloudfront.net/temp/${String(unit.coverphoto)}`
        : `https://dve7rykno93gs.cloudfront.net/pieoq/1572277987`,
      coverphoto: unit.coverphoto,
      developer: unit.companyname || unit.name || "Developer",
      companyname: unit.companyname,
      name: unit.name,
      area: unit.floorarea ? `${String(unit.floorarea)} sqm` : undefined,
      floorarea: unit.floorarea,
      // Pass through all the price fields as-is from the API
      sellingprice: unit.sellingprice,
      sellingpricecsign: unit.sellingpricecsign,
      rentpricepermonth: unit.rentpricepermonth,
      rentpricecsignpermonth: unit.rentpricecsignpermonth,
      rentpriceperweek: unit.rentpriceperweek,
      rentpricecsignperweek: unit.rentpricecsignperweek,
      rentpriceperday: unit.rentpriceperday,
      rentpricecsignperday: unit.rentpricecsignperday,
      description: unit.description,
      featured: false,
      // Developer logo fields
      developerlogo: unit.developerlogo || unit.logo,
      developermobile: unit.developermobile || unit.mobile,
      developeremail: unit.developeremail || unit.email,
      timestamp: unit.timestamp || unit.dateadded,
      dateadded: unit.dateadded,
      ...unit, // Include all original fields
    }));

    console.log(
      `🏠 Transformed ${transformedData.length} developer units for response`
    );

    // Debug: Log first transformed unit to see what we're sending
    if (transformedData.length > 0) {
      console.log("🔍 First transformed unit:", {
        unitid: transformedData[0]?.unitid,
        developerlogo: transformedData[0]?.developerlogo,
        developer: transformedData[0]?.developer,
        companyname: transformedData[0]?.companyname,
      });
    }

    return NextResponse.json(transformedData, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600", // 5 min cache, 10 min stale
      },
    });
  } catch (error) {
    console.error("Error in developer units API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch developer units" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Handle GET requests by calling POST with empty params
  return POST(
    new NextRequest("http://localhost/api/developer-units", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
  );
}

import { NextRequest, NextResponse } from "next/server";
import { buildTempImageUrl } from "@/lib/image-utils";

interface DeveloperUnitParams {
  terms?: "sale" | "rent" | "preselling";
  unittype?: string;
  address?: string;
  maxprice?: number;
  beds?: number;
  baths?: number;
  app?: string;
}

interface RawDeveloperUnit {
  unitid?: number | string;
  unitname?: string;
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
  rentpricepermonth?: number | string;
  rentpricecsignpermonth?: string;
  rentpriceperweek?: number | string;
  rentpricecsignperweek?: string;
  rentpriceperday?: number | string;
  rentpricecsignperday?: string;
  sellingprice?: number | string;
  sellingpricecsign?: string;
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
  updated_at?: string;
  photos?: unknown;
  images?: unknown;
  photo?: unknown;
  gallery?: unknown;
  [key: string]: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const params: DeveloperUnitParams = body;

    // Build query parameters to match live MeQasa site exactly
    const searchParams = new URLSearchParams();

    // Include all parameters (app is already included in params from client)
    Object.entries(params).forEach(([key, value]) => {
      if (value != null) {
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
      // Return empty array instead of throwing error
      return NextResponse.json([], { status: 200 });
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
      // Get response text to see what we're actually receiving
      const responseText = await response.text();
      console.warn("Developer units API returned non-JSON response:", {
        contentType,
        url: apiUrl,
        status: response.status,
        statusText: response.statusText,
        responsePreview: responseText.substring(0, 500), // First 500 chars
        headers: Object.fromEntries(response.headers.entries()),
      });
      // Return empty array for non-JSON responses
      return NextResponse.json([], { status: 200 });
    }

    let rawData;
    try {
      rawData = await response.json();
      console.log("🔍 Raw API response data:", rawData);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError);
      // Return empty array if JSON parsing fails
      return NextResponse.json([], { status: 200 });
    }

    if (!Array.isArray(rawData)) {
      console.warn("Developer units API returned non-array data:", rawData);
      return NextResponse.json([], { status: 200 });
    }

    const units = rawData as RawDeveloperUnit[];

    console.log(`✅ Developer units API returned ${units.length} units`);

    // Debug: Log first unit to see what fields are available
    if (units.length > 0) {
      const firstUnit = units[0];
      if (firstUnit) {
        console.log("🔍 First unit raw data:", {
          unitid: firstUnit.unitid,
          title: firstUnit.title,
          coverphoto: firstUnit.coverphoto,
          photos: firstUnit.photos,
          images: firstUnit.images,
          photo: firstUnit.photo,
          gallery: firstUnit.gallery,
          keys: Object.keys(firstUnit),
        });
      }

      // Debug date fields specifically
      if (firstUnit) {
        console.log("📅 Date fields debug:", {
          unitid: firstUnit.unitid,
          timestamp: firstUnit.timestamp,
          dateadded: firstUnit.dateadded,
          updated_at: firstUnit.updated_at,
          timestampType: typeof firstUnit.timestamp,
          dateaddedType: typeof firstUnit.dateadded,
          updated_atType: typeof firstUnit.updated_at,
        });
      }
    }

    // Transform the data to a consistent format
    const transformedData = units.map((unit) => {
      const unitIdString =
        unit.unitid != null ? String(unit.unitid) : Math.random().toString();
      const bedsValue = Number(unit.beds ?? 0) || 0;
      const bathsValue = Number(unit.baths ?? 0) || 0;
      const propertyType = (
        unit.unittypename ??
        unit.unittype ??
        "Apartment"
      ).toString();
      const terms = (unit.terms ?? "sale").toString();
      const locationSource =
        unit.address ?? unit.city ?? unit.location ?? "Ghana";
      const locationText =
        typeof locationSource === "string"
          ? locationSource
          : String(locationSource);
      const coverPhoto =
        typeof unit.coverphoto === "string" ? unit.coverphoto : undefined;
      const fallbackImage =
        "https://dve7rykno93gs.cloudfront.net/pieoq/1572277987";
      const imageUrl = buildTempImageUrl(coverPhoto) || fallbackImage;

      const priceValue = unit.price != null ? String(unit.price) : "";
      const sellingPriceValue =
        unit.sellingprice != null ? String(unit.sellingprice) : undefined;

      return {
        id: unitIdString,
        unitid: unit.unitid,
        title:
          typeof unit.title === "string" && unit.title.trim() !== ""
            ? unit.title
            : (() => {
                const bedroomText =
                  bedsValue === 1 ? "1 Bedroom" : `${bedsValue} Bedroom`;
                const transactionText =
                  terms === "rent" ? "For Rent" : "For Sale";
                return `${bedroomText} ${propertyType} ${transactionText} in ${locationText}`;
              })(),
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
        companyname:
          typeof unit.companyname === "string" ? unit.companyname : undefined,
        name: typeof unit.name === "string" ? unit.name : undefined,
        area:
          unit.floorarea != null && unit.floorarea !== ""
            ? `${String(unit.floorarea)} sqm`
            : undefined,
        floorarea:
          typeof unit.floorarea === "number"
            ? unit.floorarea
            : unit.floorarea != null
              ? Number(unit.floorarea) || undefined
              : undefined,
        sellingprice: sellingPriceValue,
        sellingpricecsign: unit.sellingpricecsign,
        rentpricepermonth:
          unit.rentpricepermonth != null
            ? String(unit.rentpricepermonth)
            : undefined,
        rentpricecsignpermonth: unit.rentpricecsignpermonth,
        rentpriceperweek:
          unit.rentpriceperweek != null
            ? String(unit.rentpriceperweek)
            : undefined,
        rentpricecsignperweek: unit.rentpricecsignperweek,
        rentpriceperday:
          unit.rentpriceperday != null
            ? String(unit.rentpriceperday)
            : undefined,
        rentpricecsignperday: unit.rentpricecsignperday,
        description:
          typeof unit.description === "string" ? unit.description : undefined,
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
        timestamp: unit.timestamp ?? unit.dateadded ?? undefined,
        dateadded: unit.dateadded,
        ...unit,
      };
    });

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

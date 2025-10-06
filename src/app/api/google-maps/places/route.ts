import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Improved type mapping for more relevant results
const ENHANCED_TYPE_MAPPING: Record<
  string,
  {
    types: string[];
    keywords?: string[];
    excludeKeywords?: string[];
  }
> = {
  school: {
    types: ["school", "primary_school", "secondary_school", "university"],
    keywords: [
      "school",
      "academy",
      "college",
      "university",
      "kindergarten",
      "nursery",
    ],
    excludeKeywords: ["driving", "beauty", "dance", "music", "art", "cooking"],
  },
  bank: {
    types: ["bank", "atm", "finance"],
    keywords: ["bank", "atm", "credit union", "savings", "financial"],
    excludeKeywords: ["food", "blood", "river", "left bank", "right bank"],
  },
  hospital: {
    types: ["hospital", "doctor", "health", "pharmacy"],
    keywords: ["hospital", "clinic", "medical", "health", "doctor", "pharmacy"],
    excludeKeywords: ["veterinary", "vet", "animal"],
  },
  supermarket: {
    types: ["supermarket", "grocery_or_supermarket", "store"],
    keywords: ["supermarket", "grocery", "market", "shopping", "mall", "store"],
    excludeKeywords: ["car", "auto", "gas", "fuel", "electronics"],
  },
  airport: {
    types: ["airport"],
    keywords: ["airport", "international airport", "domestic airport"],
    excludeKeywords: [],
  },
};

type GooglePlace = {
  place_id?: string;
  name: string;
  types?: string[];
  rating?: number;
};

function filterRelevantPlaces(
  places: GooglePlace[],
  requestedType: string
): GooglePlace[] {
  const typeConfig = ENHANCED_TYPE_MAPPING[requestedType];
  if (!typeConfig) return places;

  return places.filter((place) => {
    const placeName = place.name.toLowerCase();
    const placeTypes = place.types || [];

    // Check if place has relevant types
    const hasRelevantType = typeConfig.types.some((type) =>
      placeTypes.includes(type)
    );

    // Check if place name contains relevant keywords
    const hasRelevantKeyword =
      typeConfig.keywords?.some((keyword) =>
        placeName.includes(keyword.toLowerCase())
      ) || false;

    // Check if place name contains excluded keywords
    const hasExcludedKeyword =
      typeConfig.excludeKeywords?.some((keyword) =>
        placeName.includes(keyword.toLowerCase())
      ) || false;

    // Return true if relevant and not excluded
    return (hasRelevantType || hasRelevantKeyword) && !hasExcludedKeyword;
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");
  const radius = searchParams.get("radius") || "5000";
  const type = searchParams.get("type");
  const limit = parseInt(searchParams.get("limit") || "10"); // Allow configurable limit

  if (!location || !type) {
    return NextResponse.json(
      { error: "Location and type parameters are required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Google Maps API key not configured" },
      { status: 500 }
    );
  }

  try {
    console.log(
      `🔍 Server-side places search: ${type} near ${location} (radius: ${radius}m, limit: ${limit})`
    );

    // Use multiple API calls for better results - search by different types and combine
    const typeConfig = ENHANCED_TYPE_MAPPING[type];
    if (!typeConfig) {
      return NextResponse.json(
        { error: `Unsupported establishment type: ${type}` },
        { status: 400 }
      );
    }

    const allPlaces: GooglePlace[] = [];

    // Search by each relevant type
    for (const searchType of typeConfig.types) {
      try {
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${searchType}&key=${apiKey}&language=en`;

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (data.status === "OK" && data.results) {
            allPlaces.push(...data.results);
          }
        }

        // Small delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.warn(`Failed to search for type ${searchType}:`, error);
      }
    }

    console.log(
      `📝 Raw results: ${allPlaces.length} places found before filtering`
    );

    // Remove duplicates based on place_id
    const uniquePlaces: GooglePlace[] = allPlaces.filter(
      (place, index, self) =>
        index === self.findIndex((p) => p.place_id === place.place_id)
    );

    // Filter for relevance
    const relevantPlaces = filterRelevantPlaces(uniquePlaces, type);

    // Sort by rating (highest first), then by distance (implied by Google's API)
    const sortedPlaces = relevantPlaces.sort((a, b) => {
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      return ratingB - ratingA;
    });

    // Limit results
    const limitedPlaces = sortedPlaces.slice(0, limit);

    const places = limitedPlaces.map((place: any) => ({
      place_id: place.place_id,
      name: place.name,
      address: place.vicinity || place.formatted_address || "",
      location: place.geometry.location,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      price_level: place.price_level,
      types: place.types,
      business_status: place.business_status,
      opening_hours: place.opening_hours,
      photos:
        place.photos?.slice(0, 1).map((photo: any) => ({
          photo_reference: photo.photo_reference,
          width: photo.width,
          height: photo.height,
        })) || [],
    }));

    console.log(
      `✅ Filtered to ${places.length} relevant ${type} establishments (from ${uniquePlaces.length} unique results)`
    );

    return NextResponse.json({
      success: true,
      places,
      total_found: uniquePlaces.length,
      filtered_count: places.length,
      next_page_token: null, // We handle pagination ourselves
    });
  } catch (error) {
    console.error(`🚨 Places search error:`, error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

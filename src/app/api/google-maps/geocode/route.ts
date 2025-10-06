import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address) {
    return NextResponse.json(
      { error: "Address parameter is required" },
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
    console.log(`🌍 Server-side geocoding for: "${address}"`);

    // Make address more specific by appending Ghana if not already present
    const enhancedAddress = address.toLowerCase().includes("ghana")
      ? address
      : `${address}, Ghana`;

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(enhancedAddress)}&key=${apiKey}&region=gh`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`📝 Geocoding response status: ${data.status}`);
    console.log(`🔍 Enhanced address used: "${enhancedAddress}"`);

    if (data.status === "OK" && data.results && data.results.length > 0) {
      const result = data.results[0];
      const coordinates = {
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
      };

      console.log(`✅ SUCCESS: "${address}" geocoded to:`, coordinates);
      console.log(`📍 Full address: ${result.formatted_address}`);

      return NextResponse.json({
        success: true,
        coordinates,
        formatted_address: result.formatted_address,
        place_id: result.place_id,
      });
    } else {
      console.log(
        `❌ Geocoding failed: ${data.status} - ${data.error_message || "No results"}`
      );
      console.log(`🔍 Full response:`, JSON.stringify(data, null, 2));
      return NextResponse.json(
        {
          error: `Geocoding failed: ${data.status}`,
          details: data.error_message,
          enhanced_address: enhancedAddress,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(`🚨 Geocoding error:`, error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

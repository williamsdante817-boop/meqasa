import { NextResponse } from "next/server";
import { getFeaturedProjects } from "@/lib/get-featured-projects";

export async function GET() {
  try {
    const data = await getFeaturedProjects();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching featured projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured projects" },
      { status: 500 }
    );
  }
}

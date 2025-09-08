import { NextRequest, NextResponse } from "next/server";

export interface DevelopmentProjectResponse {
  hero: {
    src: string;
    href: string;
  };
  developers: DeveloperLogo[];
  projects: ProjectObject[];
  seocontent: any[];
  unittypes: any[];
}

export interface DeveloperLogo {
  developerid: string;
  logo: string;
  companyname: string;
  name: string;
}

export interface ProjectObject {
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

const CLOUDFRONT_BASE = "https://dve7rykno93gs.cloudfront.net";

// Mock data for development/fallback
const mockData: DevelopmentProjectResponse = {
  hero: {
    src: "/pieoq/1854304265",
    href: "/follow-ad-2511?u=https://www.thorpe-bedu.com/belton-residences/",
  },
  developers: [
    {
      developerid: "18929975",
      logo: "f752f86705ef4ac685e67ab8f506b2d9",
      companyname: "Clifton Homes",
      name: "CLIFTON HOMES",
    },
    {
      developerid: "18929976",
      logo: "g852f86705ef4ac685e67ab8f506b2d8",
      companyname: "Premier Developments",
      name: "PREMIER DEVELOPMENTS",
    },
  ],
  projects: [
    {
      projectid: 539,
      projectname: "Agora Luxury Residences",
      address: "Airport Residential Area",
      city: "Airport",
      region: "Greater Accra",
      aboutproject:
        "Agora represents the pinnacle of luxury living in Accra, featuring world-class amenities, smart home technology, and breathtaking city views. This premium development offers a sophisticated lifestyle with 24/7 security, fitness center, swimming pool, and landscaped gardens.",
      photo: "dbb8547f7216528a388afe4ce30a6d1d",
      projectstatus: "uncompleted",
      propertymanagement: "",
      associationdues: "",
      unitcount: 120,
      tourvideo: "",
      imcount: null,
      developerid: 1616320005,
      dateadded: "2025-03-14T15:16:32.000Z",
      featured: 1,
      test: 0,
      numparkingspace: 0,
      publish: 1,
      oldproject: 0,
      formatted_address: "",
      lat: 0,
      lng: 0,
      pageviews: 2693,
      landonly: 0,
      updated_at: "2025-05-15T16:32:48.000Z",
      top: null,
      bottom: null,
      sidebar: null,
      title: null,
      description: null,
      weburl: "https://vaal.com.gh/agora/",
      photostorage: "local",
      logo: "3d30c4a775d6448460f58316039938fe",
    },
    {
      projectid: 540,
      projectname: "Lakeside Gardens",
      address: "East Legon Hills",
      city: "East Legon",
      region: "Greater Accra",
      aboutproject:
        "Experience luxury living at Lakeside Gardens, a prestigious residential development featuring modern apartments with stunning lake views, premium amenities, and meticulously designed living spaces in the heart of East Legon.",
      photo: "ebb8547f7216528a388afe4ce30a6d2d",
      projectstatus: "uncompleted",
      propertymanagement: "",
      associationdues: "",
      unitcount: 85,
      tourvideo: "",
      imcount: null,
      developerid: 1616320006,
      dateadded: "2025-02-20T10:30:15.000Z",
      featured: 1,
      test: 0,
      numparkingspace: 0,
      publish: 1,
      oldproject: 0,
      formatted_address: "",
      lat: 0,
      lng: 0,
      pageviews: 1847,
      landonly: 0,
      updated_at: "2025-05-10T14:22:30.000Z",
      top: null,
      bottom: null,
      sidebar: null,
      title: null,
      description: null,
      weburl: "https://lakesidegardens.gh/",
      photostorage: "local",
      logo: "4d30c4a775d6448460f58316039938ef",
    },
    {
      projectid: 541,
      projectname: "Heritage Villas",
      address: "Cantonments",
      city: "Cantonments",
      region: "Greater Accra",
      aboutproject:
        "Heritage Villas offers exclusive luxury villas in the prestigious Cantonments area. Each villa features private gardens, premium finishes, and architectural excellence designed for discerning homeowners seeking the ultimate in luxury living.",
      photo: "fbb8547f7216528a388afe4ce30a6d3d",
      projectstatus: "completed",
      propertymanagement: "",
      associationdues: "",
      unitcount: 24,
      tourvideo: "",
      imcount: null,
      developerid: 1616320007,
      dateadded: "2024-11-15T08:45:22.000Z",
      featured: 0,
      test: 0,
      numparkingspace: 0,
      publish: 1,
      oldproject: 0,
      formatted_address: "",
      lat: 0,
      lng: 0,
      pageviews: 3421,
      landonly: 0,
      updated_at: "2025-01-20T16:15:45.000Z",
      top: null,
      bottom: null,
      sidebar: null,
      title: null,
      description: null,
      weburl: "",
      photostorage: "local",
      logo: "5d30c4a775d6448460f58316039938e0",
    },
  ],
  seocontent: [],
  unittypes: [],
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Try to call the MeQasa API first, fall back to mock data if it fails
    try {
      // Create form data in the same format as other MeQasa API calls
      const postParams = new URLSearchParams();
      postParams.set("app", "vercel");

      // Add any additional parameters from the request body
      Object.entries(body).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          postParams.set(key, String(value));
        }
      });

      console.log("Development Projects API call:", {
        url: "https://meqasa.com/real-estate-developments",
        postParams: Object.fromEntries(postParams.entries()),
      });

      const response = await fetch(
        "https://meqasa.com/real-estate-developments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: postParams.toString(),
        }
      );

      if (response.ok) {
        const data: DevelopmentProjectResponse = await response.json();
        // Process live data
        const processedData = processApiResponse(data);
        return NextResponse.json(processedData);
      } else {
        console.warn(
          `API returned ${response.status}, falling back to mock data`
        );
      }
    } catch (fetchError) {
      console.warn("API fetch failed, falling back to mock data:", fetchError);
    }

    // Use mock data as fallback
    const data = mockData;
    const processedData = processApiResponse(data);
    return NextResponse.json(processedData);
  } catch (error) {
    console.error("Error fetching development projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch development projects" },
      { status: 500 }
    );
  }
}

// Function to process API response data
function processApiResponse(data: DevelopmentProjectResponse) {
  return {
    ...data,
    developers:
      data.developers?.map((dev) => ({
        ...dev,
        logoUrl: dev.logo
          ? `${CLOUDFRONT_BASE}/uploads/imgs/${dev.logo}`
          : null,
      })) || [],
    projects:
      data.projects?.map((project) => ({
        ...project,
        photoUrl: project.photo
          ? `${CLOUDFRONT_BASE}/tn5/uploads/imgs/${project.photo}`
          : null,
        logoUrl: project.logo
          ? `${CLOUDFRONT_BASE}/uploads/imgs/${project.logo}`
          : null,
        isFeatured: project.featured === 1,
        isPublished: project.publish === 1,
        status:
          project.projectstatus === "uncompleted"
            ? "ongoing"
            : project.projectstatus === "completed"
              ? "completed"
              : "new",
        location:
          project.formatted_address || `${project.address}, ${project.city}`,
        fullLocation: `${project.address}, ${project.city}, ${project.region}`,
      })) || [],
  };
}

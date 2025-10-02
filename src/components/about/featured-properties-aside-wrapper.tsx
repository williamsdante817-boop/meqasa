import { propertyDataFetchers } from "@/lib/api/data-fetchers";
import { Suspense } from "react";
import FeaturedPropertiesAside from "./featured-properties-aside";
import FeaturedPropertiesAsideSkeleton from "./featured-properties-aside-skeleton";

/**
 * Server component that fetches featured properties data
 */
async function FeaturedPropertiesAsideData() {
  const featuredListings = await propertyDataFetchers.getFeaturedListings();
  return <FeaturedPropertiesAside initialData={featuredListings} />;
}

/**
 * Wrapper component with Suspense for streaming featured properties
 * This allows the about page to render immediately while featured properties load
 */
export default function FeaturedPropertiesAsideWrapper() {
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <Suspense fallback={<FeaturedPropertiesAsideSkeleton />}>
        <FeaturedPropertiesAsideData />
      </Suspense>
    </div>
  );
}

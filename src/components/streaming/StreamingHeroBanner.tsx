import { HeroBanner } from "@/components/search/HeroBanner";
import { HeroBannerSkeleton } from "./LoadingSkeletons";
import type { AdLink } from "@/types";

interface StreamingHeroBannerProps {
  heroBannerPromise: Promise<AdLink>;
}

export async function StreamingHeroBanner({
  heroBannerPromise,
}: StreamingHeroBannerProps) {
  try {
    const heroBanner = await heroBannerPromise;

    if (!heroBanner) {
      return <HeroBannerSkeleton />;
    }

    return (
      <HeroBanner
        src={`https://dve7rykno93gs.cloudfront.net${heroBanner.src}`}
        href={heroBanner.href}
        alt="Hero banner showcasing featured properties"
      />
    );
  } catch (error) {
    console.error("Failed to load hero banner:", error);
    return <HeroBannerSkeleton />;
  }
}

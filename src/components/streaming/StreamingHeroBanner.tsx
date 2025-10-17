import {
  HeroBanner,
  HeroBannerFallback,
} from "@/components/search/HeroBanner";
import { logError } from "@/lib/logger";
import { normalizeHeroBanner } from "@/lib/hero-banner";
import type { AdLink } from "@/types";

interface StreamingHeroBannerProps {
  heroBannerPromise: Promise<AdLink>;
}

export async function StreamingHeroBanner({
  heroBannerPromise,
}: StreamingHeroBannerProps) {
  try {
    const heroBanner = await heroBannerPromise;

    const normalizedHeroBanner = normalizeHeroBanner(heroBanner);

    if (!normalizedHeroBanner) {
      logError("Hero banner payload missing required fields", undefined, {
        component: "StreamingHeroBanner",
        payload: heroBanner,
      });
      return <HeroBannerFallback />;
    }

    return (
      <HeroBanner
        src={normalizedHeroBanner.src}
        href={normalizedHeroBanner.href}
        alt={normalizedHeroBanner.alt}
        ariaLabel={normalizedHeroBanner.ariaLabel}
        priority
      />
    );
  } catch (error) {
    logError("Failed to load hero banner", error, {
      component: "StreamingHeroBanner",
    });
    return <HeroBannerFallback />;
  }
}

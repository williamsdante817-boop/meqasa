import GridAd from "@/components/grid-ad";
import Shell from "@/layouts/shell";
import type { getFlexiBanner } from "@/lib/get-flexi-banner";
import { logError } from "@/lib/logger";

interface StreamingGridBannerProps {
  flexiBannerPromise: ReturnType<typeof getFlexiBanner>;
}

export async function StreamingGridBanner({
  flexiBannerPromise,
}: StreamingGridBannerProps) {
  try {
    const flexiBanner = await flexiBannerPromise;

    if (!flexiBanner) {
      logError("Grid banner data is null or undefined", undefined, {
        component: "StreamingGridBanner",
      });
      return null;
    }

    return (
      <Shell>
        <GridAd flexiBanner={flexiBanner} />
      </Shell>
    );
  } catch (error) {
    logError("Failed to load grid banner", error, {
      component: "StreamingGridBanner",
    });
    // Let the error boundary handle the error by re-throwing
    throw error;
  }
}

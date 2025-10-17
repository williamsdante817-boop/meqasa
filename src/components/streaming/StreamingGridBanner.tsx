import GridAd from "@/components/grid-ad";
import { ErrorStateCard } from "@/components/common/error-state-card";
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
      return (
        <Shell>
          <ErrorStateCard
            variant="info"
            className="my-6"
            title="Promoted content is currently unavailable"
            description="Sponsored highlights will return shortly."
          />
        </Shell>
      );
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
    return (
      <Shell>
        <ErrorStateCard
          variant="error"
          className="my-6"
          title="Unable to load promoted content"
          description="Please refresh the page or try again later."
        />
      </Shell>
    );
  }
}

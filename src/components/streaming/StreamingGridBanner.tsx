import Shell from "@/layouts/shell";
import { GridAdWithImageLoading } from "@/components/streaming/GridAdWithImageLoading";
import type { getFlexiBanner } from "@/lib/get-flexi-banner";

interface StreamingGridBannerProps {
  flexiBannerPromise: ReturnType<typeof getFlexiBanner>;
}

export async function StreamingGridBanner({
  flexiBannerPromise,
}: StreamingGridBannerProps) {
  try {
    const flexiBanner = await flexiBannerPromise;

    return (
      <Shell>
        <GridAdWithImageLoading flexiBanner={flexiBanner} />
      </Shell>
    );
  } catch (error) {
    console.error("Failed to load grid banner:", error);
    return (
      <Shell>
        <div className="text-center py-8 text-brand-muted">
          Unable to load banner content. Please try again later.
        </div>
      </Shell>
    );
  }
}

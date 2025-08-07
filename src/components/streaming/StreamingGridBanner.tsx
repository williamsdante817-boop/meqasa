import { GridAdWithImageLoading } from "@/components/streaming/GridAdWithImageLoading";
import Shell from "@/layouts/shell";
import type { getFlexiBanner } from "@/lib/get-flexi-banner";

interface StreamingGridBannerProps {
  flexiBannerPromise: ReturnType<typeof getFlexiBanner>;
}

export async function StreamingGridBanner({
  flexiBannerPromise,
}: StreamingGridBannerProps) {
  const flexiBanner = await flexiBannerPromise;

  return (
    <Shell>
      <GridAdWithImageLoading flexiBanner={flexiBanner} />
    </Shell>
  );
}

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/layout/page-header";
import { MobileSearchOverlay } from "@/components/search/MobileSearchOverlay";

export default function MobilePageHeader() {
  return (
    <PageHeader
      as="section"
      className="mx-auto items-center gap-2 text-center lg:hidden flex"
      withPadding
      role="banner"
      aria-label="Mobile property search header"
    >
      <PageHeaderHeading
        className="animate-fade-up text-brand-accent"
        style={{ animationDelay: "0.20s", animationFillMode: "both" }}
        as="h1"
      >
        Find Your Dream Home
      </PageHeaderHeading>
      <PageHeaderDescription
        className="max-w-[46.875rem] animate-fade-up text-brand-muted"
        style={{ animationDelay: "0.30s", animationFillMode: "both" }}
      >
        Discover the perfect property tailored to your lifestyle and preference
      </PageHeaderDescription>
      {/* Mobile Search Overlay - Rendered at root level */}
      <MobileSearchOverlay />
      {/* <MobileSearchForm /> */}
    </PageHeader>
  );
}

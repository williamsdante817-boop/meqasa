import { Breadcrumbs } from "@/components/layout/bread-crumbs";

interface BreadcrumbSegment {
  title: string;
  href: string;
  key: string;
}

interface PageHeaderProps {
  segments: BreadcrumbSegment[];
}

/**
 * Header component for developer projects page with breadcrumbs and introduction
 * @param segments - Array of breadcrumb segments for navigation
 */
export function PageHeader({ segments }: PageHeaderProps) {

  return (
    <>
      {/* Breadcrumbs */}
      <Breadcrumbs segments={segments} className="mb-8" />

      {/* Introductory Content */}
      <header className="mb-16 text-left">
        <h1 className="text-brand-accent mb-6 text-3xl leading-tight font-bold tracking-tight md:text-4xl lg:text-5xl">
          Developer Projects in Ghana
        </h1>
        <p className="text-brand-muted max-w-4xl text-lg leading-relaxed md:text-xl">
          Professional Property Developments For Sale & Rent In Ghana.
          Discover quality residential and commercial projects from verified
          developers and property companies across Ghana&apos;s leading real
          estate markets.
        </p>
      </header>
    </>
  );
}
import { siteConfig } from "@/config/site";
import Link from "next/link";

interface QuickLinkItem {
  title: string;
  href: string;
}

interface QuickLinksColumnProps {
  title: string;
  links: QuickLinkItem[];
}

function QuickLinksColumn({ title, links }: QuickLinksColumnProps) {
  return (
    <div>
      <h3 className="text-brand-accent mb-4 text-lg font-semibold">{title}</h3>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              href={link.href}
              className="text-brand-muted hover:text-brand-primary text-sm transition-colors"
            >
              {link.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PropertyQuickLinks() {
  // Extract relevant sections from footerNav
  const officeSpacesSection = siteConfig.footerNav.find(
    (section) => section.title === "Office Spaces for rent"
  );
  const apartmentsForRentSection = siteConfig.footerNav.find(
    (section) => section.title === "Apartments for rent"
  );
  const housesForSaleSection = siteConfig.footerNav.find(
    (section) => section.title === "Houses for sale"
  );
  const housesForRentSection = siteConfig.footerNav.find(
    (section) => section.title === "Houses for rent"
  );

  return (
    <section className="border-brand-border border-t bg-white py-12">
      <div className="container mx-auto max-w-[1250px] px-4">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {officeSpacesSection && (
            <QuickLinksColumn
              title="Office Spaces"
              links={officeSpacesSection.items}
            />
          )}
          {apartmentsForRentSection && (
            <QuickLinksColumn
              title="Apartments for Rent"
              links={apartmentsForRentSection.items}
            />
          )}
          {housesForSaleSection && (
            <QuickLinksColumn
              title="Houses for Sale"
              links={housesForSaleSection.items}
            />
          )}
          {housesForRentSection && (
            <QuickLinksColumn
              title="Houses for Rent"
              links={housesForRentSection.items}
            />
          )}
        </div>
      </div>
    </section>
  );
}

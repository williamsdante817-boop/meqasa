import type { LocationLink } from "./types";

interface SidebarLinksProps {
  links: LocationLink[];
  title?: string;
}

export function SidebarLinks({
  links,
  title = "Find more new Apartment units for sale in these locations:",
}: SidebarLinksProps) {
  return (
    <div className="mt-4 hidden overflow-hidden rounded-lg border border-gray-200 bg-white md:block">
      <div className="p-4">
        <p className="text-brand-muted mb-3 text-sm">{title}</p>
        <ul className="space-y-1">
          {links.map((link, index) => (
            <li key={index}>
              <a
                href={link.href}
                title={link.aria || link.title}
                className="text-brand-accent text-sm transition-all duration-200 hover:underline"
              >
                {link.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Configuration for location links - easily maintainable
export const DEFAULT_LOCATION_LINKS: LocationLink[] = [
  {
    title: "Airport Residential Area",
    href: "/units/search?terms=sale&unittype=apartment&address=Airport%20Residential%20Area&maxprice=&beds=0&baths=0",
    aria: "Search apartments for sale in Airport Residential Area",
  },
  {
    title: "Ridge",
    href: "/units/search?terms=sale&unittype=apartment&address=Ridge&maxprice=&beds=0&baths=0",
    aria: "Search apartments for sale in Ridge",
  },
  {
    title: "Airport",
    href: "/units/search?terms=sale&unittype=apartment&address=Airport&maxprice=&beds=0&baths=0",
    aria: "Search apartments for sale in Airport",
  },
  {
    title: "Tse Addo",
    href: "/units/search?terms=sale&unittype=apartment&address=Tse%20Addo&maxprice=&beds=0&baths=0",
    aria: "Search apartments for sale in Tse Addo",
  },
  {
    title: "Oyarifa",
    href: "/units/search?terms=sale&unittype=apartment&address=Oyarifa&maxprice=&beds=0&baths=0",
    aria: "Search apartments for sale in Oyarifa",
  },
  {
    title: "Nungua",
    href: "/units/search?terms=sale&unittype=apartment&address=Nungua&maxprice=&beds=0&baths=0",
    aria: "Search apartments for sale in Nungua",
  },
  {
    title: "Labone",
    href: "/units/search?terms=sale&unittype=apartment&address=Labone&maxprice=&beds=0&baths=0",
    aria: "Search apartments for sale in Labone",
  },
  {
    title: "Dansoman",
    href: "/units/search?terms=sale&unittype=apartment&address=Dansoman&maxprice=&beds=0&baths=0",
    aria: "Search apartments for sale in Dansoman",
  },
  {
    title: "Airport Residential",
    href: "/units/search?terms=sale&unittype=apartment&address=Airport%20Residential&maxprice=&beds=0&baths=0",
    aria: "Search apartments for sale in Airport Residential",
  },
  {
    title: "Cantonments",
    href: "/units/search?terms=sale&unittype=apartment&address=Cantonments&maxprice=&beds=0&baths=0",
    aria: "Search apartments for sale in Cantonments",
  },
  {
    title: "Tse Addo Round About",
    href: "/units/search?terms=sale&unittype=apartment&address=Tse%20Addo%20Round%20About&maxprice=&beds=0&baths=0",
    aria: "Search apartments for sale in Tse Addo Round About",
  },
];

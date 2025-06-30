import type { MainNavItem } from "@/types";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectOptionGroup {
  label: string;
  id: string;
  description: string;
  options: SelectOption[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface SelectOptionsConfig {
  option: {
    propertyType: SelectOptionGroup;
    bedrooms: SelectOptionGroup;
    minPrice: SelectOptionGroup;
    maxPrice: SelectOptionGroup;
  };
  land: {
    landType: SelectOptionGroup;
    size: SelectOptionGroup;
    priceRange: SelectOptionGroup;
  };
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  email: string;
  links: {
    x: string;
    github: string;
    githubAccount: string;
    discord: string;
    calDotCom: string;
  };
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
  };
  mainNav: MainNavItem[];
  footerNav: {
    title: string;
    items: {
      title: string;
      href: string;
      external?: boolean;
    }[];
  }[];
  selectOptions: {
    propertyType: SelectOption[];
    bedrooms: SelectOption[];
    bathrooms: SelectOption[];
    landType: SelectOption[];
    landSize: SelectOption[];
  };
}

export type { SiteConfig as SiteConfigType };

const links = {
  x: "https://twitter.com/sadmann17",
  github: "https://github.com/sadmann7/skateshop",
  githubAccount: "https://github.com/sadmann7",
  discord: "https://discord.com/users/sadmann7",
  calDotCom: "https://cal.com/sadmann7",
};

const socialLinks = {
  facebook: "https://facebook.com/meqasa",
  twitter: "https://twitter.com/meqasa",
  instagram: "https://instagram.com/meqasa",
  youtube: "https://youtube.com/meqasa",
};

export const siteConfig: SiteConfig = {
  name: "Meqasa",
  description:
    "Find your dream home on meQasa, Ghana's real estate marketplace. We provide a wide range of properties for rent and sale, including houses, apartments, offices, and land.",
  url: "https://meqasa.com",
  ogImage: "https://skateshop.sadmn.com/opengraph-image.png",
  email: "info@meqasa.com",
  links,
  socialLinks,
  mainNav: [
    {
      title: "For Rent",
      description: "Explore properties available for rent in Ghana.",
      items: [
        {
          title: "Apartments For Rent",
          href: "/apartments-for-rent-in-Accra",
          description: "Browse apartments available for rent in Accra.",
          items: [],
        },
        {
          title: "Houses For Sale in Ghana",
          href: "/houses-for-rent-in-ghana",
          description: "Explore houses available for rent across Ghana.",
          items: [],
        },
        {
          title: "Office Spaces",
          href: "/offices-for-rent-in-Accra",
          description: "Find office spaces for rent in Accra.",
          items: [],
        },
        {
          title: "Houses For Rent in Ghana",
          href: "/houses-for-rent-in-Accra",
          description: "Discover houses for rent in Accra and beyond.",
          items: [],
        },
        {
          title: "Rented Properties",
          href: "/rented-properties",
          description: "View properties that have been rented.",
          items: [],
        },
      ],
    },

    {
      title: "For Sale",
      description:
        "Browse properties for sale, including houses and apartments.",
      items: [
        {
          title: "Apartment For Sale",
          href: "/apartments-for-sale-in-Accra",
          description: "Find apartments for sale in Accra.",
          items: [],
        },
        {
          title: "Apartment For Sale",
          href: "/apartments-for-sale-in-Accra",
          description: "Explore available apartments for sale.",
          items: [],
        },
        {
          title: "Houses For sale",
          href: "/houses-for-sale-in-ghana",
          description: "Browse houses available for sale in Ghana.",
          items: [],
        },
        {
          title: "Office Spaces",
          href: "/offices-for-sale-in-Accra",
          description: "Find office spaces available for sale in Accra.",
          items: [],
        },
        {
          title: "Sold Properties",
          href: "/rented-properties",
          description: "View properties that have been sold.",
          items: [],
        },
      ],
    },
    {
      title: "Blog",
      description:
        "Stay updated with the latest real estate news, events, and insights.",
      items: [
        {
          title: "Press & Events",
          href: "/blog/category/press-and-events/",
          description:
            "Discover the latest press releases and events in the real estate industry.",
          items: [],
        },
        {
          title: "Real Estate News",
          href: "/blog/category/real-estate-news/",
          description:
            "Get the latest updates and trends in the real estate market.",
          items: [],
        },
        {
          title: "Living In...",
          href: "//blog/category/living-in-neighbourhood-series/",
          description:
            "Explore neighborhood guides and learn about living in different areas.",
          items: [],
        },
      ],
    },
    {
      title: "Advice",
      description:
        "Get expert tips and advice on buying, renting, and managing properties.",
      items: [
        {
          title: "Real Estate Advice & Tip",
          href: "https://blog.meqasa.com/category/tips-and-advice/",
          description:
            "Learn practical tips and advice for navigating the real estate market.",
          items: [],
        },
        {
          title: "Meqasa Accra Housing Guide",
          href: "/accra-housing-guide",
          description: "A comprehensive guide to housing options in Accra.",
          items: [],
        },
        {
          title: "Real Estate Report 2020",
          href: "/real-estate-report",
          description:
            "Access detailed insights and analysis from the 2020 real estate report.",
          items: [],
        },
      ],
    },
    {
      title: "Agents",
      description:
        "Browse properties for sale, including houses and apartments.",
      items: [],
    },
    {
      title: "Developers",
      description:
        "Browse properties for sale, including houses and apartments.",
      items: [],
    },
    {
      title: "Development",
      description:
        "Browse properties for sale, including houses and apartments.",
      items: [],
    },
    {
      title: "Land",
      description:
        "Browse properties for sale, including houses and apartments.",
      items: [],
    },
  ] satisfies MainNavItem[],
  footerNav: [
    {
      title: "Houses for rent",
      items: [
        {
          title: "Houses for rent in Accra",
          href: "/houses-for-rent-in-Accra",
          external: false,
        },
        {
          title: "Houses for rent in East Legon",
          href: "/houses-for-rent-in-East Legon",
          external: false,
        },
        {
          title: "Houses for rent in Cantonments",
          href: "/houses-for-rent-in-Cantonments",
          external: false,
        },
        {
          title: "Houses for rent in Spintex",
          href: "/houses-for-rent-in-Spintex",
          external: false,
        },
        {
          title: "Houses for rent in Dworwulu",
          href: "/houses-for-rent-in-Dworwulu",
          external: false,
        },
        {
          title: "Houses for rent in Airport Hills",
          href: "/houses-for-rent-in-Airport Hills",
          external: false,
        },
        {
          title: "Houses for sale in Airport Area",
          href: "Airport Area",
          external: false,
        },
        {
          title: "Houses for rent in Labone",
          href: "/houses-for-rent-in-Labone",
          external: false,
        },
        {
          title: "Houses for rent in Tema",
          href: "/houses-for-rent-in-Tema",
          external: false,
        },
      ],
    },
    {
      title: "Houses for sale",
      items: [
        {
          title: "Houses for sale in Accra",
          href: "/houses-for-sale-in-Accra",
          external: false,
        },
        {
          title: "Houses for sale in Kasoa",
          href: "/houses-for-sale-in-Kasoa",
          external: false,
        },
        {
          title: "Houses for sale in Tema",
          href: "/houses-for-sale-in-Tema",
          external: false,
        },
        {
          title: "Houses for sale in Kwabenya",
          href: "/houses-for-sale-in-Kwabenya",
          external: false,
        },
        {
          title: "Houses for sale in East Legon",
          href: "/houses-for-sale-in-East Legon",
          external: false,
        },
        {
          title: "Houses for sale in Adjiringanor",
          href: "/houses-for-sale-in-Adjirigonor",
          external: false,
        },
        {
          title: "Houses for sale in Airport Area",
          href: "/houses-for-sale-in-Airport Area",
          external: false,
        },
        {
          title: "Houses for sale in Airport Hills",
          href: "/houses-for-sale-in-Airport Hills",
          external: false,
        },
        {
          title: "Houses for sale in Spintex Road",
          href: "/houses-for-sale-in-Spintex Road",
          external: false,
        },
      ],
    },
    {
      title: "Apartments for sale",
      items: [
        {
          title: "Apartments for sale in Ridge",
          href: "/apartments-for-sale-in-Ridge",
          external: false,
        },
        {
          title: "Apartments for sale in Dzorwulu",
          href: "/apartments-for-sale-in-Dzorwulu",
          external: false,
        },
        {
          title: "Apartments for sale in Spintex Road",
          href: "/apartments-for-sale-in-Spintex Road",
          external: false,
        },
        {
          title: "Apartments for sale in Osu",
          href: "/apartments-for-sale-in-Osu",
          external: false,
        },
        {
          title: "Apartments for sale in Tema",
          href: "/apartments-for-sale-in-Tema",
          external: false,
        },
        {
          title: "Apartments for sale in Cantonments",
          href: "/apartments-for-sale-in-Cantonments",
          external: false,
        },
        {
          title: "Apartments for sale in Labone",
          href: "/apartments-for-sale-in-Labone",
          external: false,
        },
        {
          title: "Apartments for sale in Airport Area",
          href: "/apartments-for-sale-in-Airport Area",
          external: false,
        },
        {
          title: "Apartments for sale in East Legon",
          href: "/apartments-for-sale-in-East Legon",
          external: false,
        },
      ],
    },
    {
      title: "Apartments for rent",
      items: [
        {
          title: "Apartments for rent in Dzorwulu",
          href: "/apartments-for-rent-in-Dzorwulu",
          external: false,
        },
        {
          title: "Apartments for rent in Tema",
          href: "/apartments-for-rent-in-Tema",
          external: false,
        },
        {
          title: "Apartments for rent in Spintex Road",
          href: "/apartments-for-rent-in-Spintex Road",
          external: false,
        },
        {
          title: "Apartments for rent in Osu",
          href: "/apartments-for-rent-in-Osu",
          external: false,
        },
        {
          title: "Apartments for rent in Ridge",
          href: "/apartments-for-rent-in-Ridge",
          external: false,
        },
        {
          title: "Apartments for rent in Cantonments",
          href: "/apartments-for-rent-in-Cantonments",
          external: false,
        },
        {
          title: "Apartments for rent in Airport Area",
          href: "/apartments-for-rent-in-Airport Area",
          external: false,
        },
        {
          title: "Apartments for rent in Labone",
          href: "/apartments-for-rent-in-Labone",
          external: false,
        },
        {
          title: "Apartments for rent in East Legon",
          href: "/apartments-for-rent-in-East Legon",
          external: false,
        },
      ],
    },
    {
      title: "Office Spaces for rent",
      items: [
        {
          title: "Office spaces for rent in Accra",
          href: "/offices-for-rent-in-Accra",
          external: false,
        },
        {
          title: "Office spaces for rent in Cantonments",
          href: "/offices-for-rent-in-Cantonments",
          external: false,
        },
        {
          title: "Office spaces for rent in Airport Area",
          href: "/offices-for-rent-in-Airport Area",
          external: false,
        },
        {
          title: "Office spaces for rent in Tema",
          href: "/offices-for-rent-in-Tema",
          external: false,
        },
        {
          title: "Office spaces for rent in East Legon",
          href: "/offices-for-rent-in-East Legon",
          external: false,
        },
        {
          title: "Office spaces for rent in Tesano",
          href: "/offices-for-rent-in-Tesano",
          external: false,
        },
        {
          title: "Office spaces for rent in Spintex Road",
          href: "/offices-for-rent-in-Spintex Road",
          external: false,
        },
        {
          title: "Office spaces for rent in Dzorwulu",
          href: "/offices-for-rent-in-Dzorwulu",
          external: false,
        },
        {
          title: "Office spaces for rent in Osu",
          href: "/offices-for-rent-in-Osu",
          external: false,
        },
      ],
    },
    {
      title: "For Sale",
      items: [
        {
          title: "Apartment For sale",
          href: "/apartment-for-sale-in-Accra",
          external: false,
        },
        {
          title: "Townhouses For sale",
          href: "/townhouses-for-sale-in-Accra",
          external: false,
        },
        {
          title: "Warehouses For sale",
          href: "/warehouses-for-sale-in-Accra",
          external: false,
        },
        {
          title: "Commercial Spaces For sale",
          href: "/commercial-space-for-sale-in-Accra",
          external: false,
        },
        {
          title: "Shops For sale",
          href: "/shops-for-sale-in-Accra",
          external: false,
        },
      ],
    },
    {
      title: "For Rent",
      items: [
        {
          title: "Retail Spaces For rent",
          href: "/retail-space-for-rent-in-Accra",
          external: false,
        },
        {
          title: "Land For rent",
          href: "/land-for-rent-in-Accra",
          external: false,
        },
        {
          title: "Guest Houses For rent",
          href: "/guest-houses-for-rent-in-Accra",
          external: false,
        },
        {
          title: "Office Spaces For rent",
          href: "/office-space-for-rent-in-Accra",
          external: false,
        },
        {
          title: "Townhouses For rent",
          href: "/townhouses-for-rent-in-Accra",
          external: false,
        },
      ],
    },
    {
      title: "Discover",
      items: [
        {
          title: "Shops For Sale",
          href: "/shops-for-sale-in-Accra",
          external: false,
        },
        {
          title: "Commercial Spaces For Sale",
          href: "/commercial-space-for-sale-in-Accra",
          external: false,
        },
        {
          title: "Retail Spaces For Sale",
          href: "/retail-space-for-sale-in-Accra",
          external: false,
        },
        {
          title: "Land For Sale",
          href: "/land-for-sale-in-Accra",
          external: false,
        },
        {
          title: "Guest Houses For Sale",
          href: "/guest-house-for-sale-in-Accra",
          external: false,
        },
      ],
    },
  ],
  selectOptions: {
    propertyType: [
      { value: "house", label: "House" },
      { value: "apartment", label: "Apartment" },
      { value: "office", label: "Office" },
      { value: "land", label: "Land" },
      { value: "townhouse", label: "Townhouse" },
      { value: "commercial space", label: "Commercial" },
      { value: "warehouse", label: "Warehouse" },
      { value: "guest house", label: "Guest" },
      { value: "shop", label: "Shop" },
      { value: "retail", label: "Retail" },
      { value: "beach house", label: "Beach" },
    ],
    bedrooms: [
      { value: "1", label: "1 Bedroom" },
      { value: "2", label: "2 Bedrooms" },
      { value: "3", label: "3 Bedrooms" },
      { value: "4", label: "4 Bedrooms" },
      { value: "5", label: "5+ Bedrooms" },
    ],
    bathrooms: [
      { value: "1", label: "1 Bathroom" },
      { value: "2", label: "2 Bathrooms" },
      { value: "3", label: "3 Bathrooms" },
      { value: "4", label: "4 Bathrooms" },
      { value: "5", label: "5+ Bathrooms" },
    ],

    landType: [
      { value: "residential", label: "Residential" },
      { value: "commercial", label: "Commercial" },
      { value: "industrial", label: "Industrial" },
    ],
    landSize: [
      { value: "0-100", label: "0-100 sqm" },
      { value: "100-500", label: "100-500 sqm" },
      { value: "500-1000", label: "500-1000 sqm" },
      { value: "1000", label: "1000+ sqm" },
    ],
  },
};

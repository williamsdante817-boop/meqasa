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
  x: "https://twitter.com/meqasa",
  github: "https://github.com/meqasa",
  githubAccount: "https://github.com/meqasa",
  discord: "https://discord.gg/meqasa",
  calDotCom: "https://cal.com/meqasa",
};

const socialLinks = {
  facebook: "https://facebook.com/meqasa",
  twitter: "https://twitter.com/meqasa",
  instagram: "https://instagram.com/meqasa",
  youtube: "https://youtube.com/meqasa",
};

export const siteConfig: SiteConfig = {
  name: "MeQasa",
  description:
    "Find your dream home on MeQasa, Ghana's leading real estate marketplace. Browse thousands of verified properties for rent and sale including houses, apartments, offices, and land across Ghana.",
  url: "https://meqasa.com",
  ogImage: "https://meqasa.com/opengraph-image.png",
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
          href: "/search/rent?q=ghana&ftype=apartment",
          description: "Browse apartments available for rent in Accra.",
          items: [],
        },
        {
          title: "Houses For Rent in Ghana",
          href: "/search/rent?q=ghana&ftype=house",
          description: "Discover houses for rent in Accra and beyond.",
          items: [],
        },
        {
          title: "Office Spaces",
          href: "/search/rent?q=ghana&ftype=office",
          description: "Find office spaces for rent in Accra.",
          items: [],
        },
        {
          title: "Houses For Rent in Accra",
          href: "/search/rent?q=accra&ftype=house",
          description: "Discover houses for rent in Accra and beyond.",
          items: [],
        },

        {
          title: "Rented Properties",
          href: "/search/rent?q=ghana&ftype=sold",
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
          title: "Houses For sale",
          href: "/search/sale?q=ghana&ftype=house",
          description: "Browse houses available for sale in Ghana.",
          items: [],
        },
        {
          title: "Apartment For Sale",
          href: "/search/sale?q=ghana&ftype=apartment",
          description: "Find apartments for sale in Accra.",
          items: [],
        },
        {
          title: "Office Spaces",
          href: "/search/sale?q=ghana&ftype=office",
          description: "Find office spaces available for sale in Accra.",
          items: [],
        },
        {
          title: "Sold Properties",
          href: "/search/sale?q=ghana&ftype=sold",
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
      title: "All Projects",
      href: "/development-projects",
      description: "Explore all real estate development projects in Ghana.",
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
          href: "/search/rent?q=accra&ftype=house",
          external: false,
        },
        {
          title: "Houses for rent in East Legon",
          href: "/search/rent?q=east%20legon&ftype=house",
          external: false,
        },
        {
          title: "Houses for rent in Cantonments",
          href: "/search/rent?q=cantonments&ftype=house",
          external: false,
        },
        {
          title: "Houses for rent in Spintex",
          href: "/search/rent?q=spintex&ftype=house",
          external: false,
        },
        {
          title: "Houses for rent in Dworwulu",
          href: "/search/rent?q=dzorwulu&ftype=house",
          external: false,
        },
        {
          title: "Houses for rent in Airport Hills",
          href: "/search/rent?q=airport%20hills&ftype=house",
          external: false,
        },
        {
          title: "Houses for sale in Airport Area",
          href: "/search/sale?q=airport&ftype=house",
          external: false,
        },
        {
          title: "Houses for rent in Labone",
          href: "/search/rent?q=labone&ftype=house",
          external: false,
        },
        {
          title: "Houses for rent in Tema",
          href: "/search/rent?q=tema&ftype=house",
          external: false,
        },
      ],
    },
    {
      title: "Houses for sale",
      items: [
        {
          title: "Houses for sale in Accra",
          href: "/search/sale?q=accra&ftype=house",
          external: false,
        },
        {
          title: "Houses for sale in Kasoa",
          href: "/search/sale?q=kasoa&ftype=house",
          external: false,
        },
        {
          title: "Houses for sale in Tema",
          href: "/search/sale?q=tema&ftype=house",
          external: false,
        },
        {
          title: "Houses for sale in Kwabenya",
          href: "/search/sale?q=kwabenya&ftype=house",
          external: false,
        },
        {
          title: "Houses for sale in East Legon",
          href: "/search/sale?q=east%20legon&ftype=house",
          external: false,
        },
        {
          title: "Houses for sale in Adjiringanor",
          href: "/search/sale?q=adjiringanor&ftype=house",
          external: false,
        },
        {
          title: "Houses for sale in Airport Area",
          href: "/search/sale?q=airport&ftype=house",
          external: false,
        },
        {
          title: "Houses for sale in Airport Hills",
          href: "/search/sale?q=airport%20hills&ftype=house",
          external: false,
        },
        {
          title: "Houses for sale in Spintex Road",
          href: "/search/sale?q=spintex&ftype=house",
          external: false,
        },
      ],
    },
    {
      title: "Apartments for sale",
      items: [
        {
          title: "Apartments for sale in Ridge",
          href: "/search/sale?q=ridge&ftype=apartment",
          external: false,
        },
        {
          title: "Apartments for sale in Dzorwulu",
          href: "/search/sale?q=dzorwulu&ftype=apartment",
          external: false,
        },
        {
          title: "Apartments for sale in Spintex Road",
          href: "/search/sale?q=spintex&ftype=apartment",
          external: false,
        },
        {
          title: "Apartments for sale in Osu",
          href: "/search/sale?q=osu&ftype=apartment",
          external: false,
        },
        {
          title: "Apartments for sale in Tema",
          href: "/search/sale?q=tema&ftype=apartment",
          external: false,
        },
        {
          title: "Apartments for sale in Cantonments",
          href: "/search/sale?q=cantonments&ftype=apartment",
          external: false,
        },
        {
          title: "Apartments for sale in Labone",
          href: "/search/sale?q=labone&ftype=apartment",
          external: false,
        },
        {
          title: "Apartments for sale in Airport Area",
          href: "/search/sale?q=airport&ftype=apartment",
          external: false,
        },
        {
          title: "Apartments for sale in East Legon",
          href: "/search/sale?q=east%20legon&ftype=apartment",
          external: false,
        },
      ],
    },
    {
      title: "Apartments for rent",
      items: [
        {
          title: "Apartments for rent in Dzorwulu",
          href: "/search/rent?q=dzorwulu&ftype=apartment",
          external: false,
        },
        {
          title: "Apartments for rent in Tema",
          href: "/search/rent?q=tema&ftype=apartment",
          external: false,
        },
        {
          title: "Apartments for rent in Spintex Road",
          href: "/search/rent?q=spintex&ftype=apartment",
          external: false,
        },
        {
          title: "Apartments for rent in Osu",
          href: "/search/rent?q=osu&ftype=apartment",
          external: false,
        },
        {
          title: "Apartments for rent in Ridge",
          href: "/search/rent?q=ridge&ftype=apartment",
          external: false,
        },
        {
          title: "Apartments for rent in Cantonments",
          href: "/search/rent?q=cantonments&ftype=apartment",
          external: false,
        },
        {
          title: "Apartments for rent in Airport Area",
          href: "/search/rent?q=airport&ftype=apartment",
          external: false,
        },
        {
          title: "Apartments for rent in Labone",
          href: "/search/rent?q=labone&ftype=apartment",
          external: false,
        },
        {
          title: "Apartments for rent in East Legon",
          href: "/search/rent?q=east%20legon&ftype=apartment",
          external: false,
        },
      ],
    },
    {
      title: "Office Spaces for rent",
      items: [
        {
          title: "Office spaces for rent in Accra",
          href: "/search/rent?q=accra&ftype=office",
          external: false,
        },
        {
          title: "Office spaces for rent in Cantonments",
          href: "/search/rent?q=cantonments&ftype=office",
          external: false,
        },
        {
          title: "Office spaces for rent in Airport Area",
          href: "/search/rent?q=airport&ftype=office",
          external: false,
        },
        {
          title: "Office spaces for rent in Tema",
          href: "/search/rent?q=tema&ftype=office",
          external: false,
        },
        {
          title: "Office spaces for rent in East Legon",
          href: "/search/rent?q=east%20legon&ftype=office",
          external: false,
        },
        {
          title: "Office spaces for rent in Tesano",
          href: "/search/rent?q=tesano&ftype=office",
          external: false,
        },
        {
          title: "Office spaces for rent in Spintex Road",
          href: "/search/rent?q=spintex&ftype=office",
          external: false,
        },
        {
          title: "Office spaces for rent in Dzorwulu",
          href: "/search/rent?q=dzorwulu&ftype=office",
          external: false,
        },
        {
          title: "Office spaces for rent in Osu",
          href: "/search/rent?q=osu&ftype=office",
          external: false,
        },
      ],
    },
    {
      title: "For Sale",
      items: [
        {
          title: "Apartment For sale",
          href: "/search/sale?q=accra&ftype=apartment",
          external: false,
        },
        {
          title: "Townhouses For sale",
          href: "/search/sale?q=accra&ftype=townhouse",
          external: false,
        },
        {
          title: "Warehouses For sale",
          href: "/search/sale?q=accra&ftype=warehouse",
          external: false,
        },
        {
          title: "Commercial Spaces For sale",
          href: "/search/sale?q=ghana&ftype=commercial",
          external: false,
        },
        {
          title: "Shops For sale",
          href: "/search/sale?q=ghana&ftype=shop",
          external: false,
        },
      ],
    },
    {
      title: "For Rent",
      items: [
        {
          title: "Retail Spaces For rent",
          href: "/search/rent?q=ghana&ftype=retail",
          external: false,
        },
        {
          title: "Land For rent",
          href: "/search/rent?q=ghana&ftype=land",
          external: false,
        },
        {
          title: "Guest Houses For rent",
          href: "/search/rent?q=ghana&ftype=guest%20house",
          external: false,
        },
        {
          title: "Office Spaces For rent",
          href: "/search/rent?q=ghana&ftype=office",
          external: false,
        },
        {
          title: "Townhouses For rent",
          href: "/search/rent?q=ghana&ftype=townhouse",
          external: false,
        },
      ],
    },
    {
      title: "Discover",
      items: [
        {
          title: "Shops For Sale",
          href: "/search/sale?q=accra&ftype=shop",
          external: false,
        },
        {
          title: "Commercial Spaces For Sale",
          href: "/search/sale?q=accra&ftype=commercial",
          external: false,
        },
        {
          title: "Retail Spaces For Sale",
          href: "/search/sale?q=accra&ftype=retail",
          external: false,
        },
        {
          title: "Land For Sale",
          href: "/search/sale?q=ghana&ftype=land",
          external: false,
        },
        {
          title: "Guest Houses For Sale",
          href: "/search/sale?q=ghana&ftype=guest%20house",
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
      // Note: "land" removed - users should use the dedicated Land tab
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

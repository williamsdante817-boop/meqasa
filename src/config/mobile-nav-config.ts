import {
  Building2,
  Heart,
  Home,
  MapPin,
  Phone,
  Search,
  Users,
  type LucideIcon,
} from "lucide-react";

type QuickAction = {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
  triggerSearch?: boolean;
};

export const quickActions: readonly QuickAction[] = [
  {
    title: "Search Properties",
    href: "/",
    icon: Search,
    description: "Find your dream home",
    triggerSearch: true, // Special flag to trigger mobile search modal
  },
  {
    title: "Saved Properties",
    href: "/favorites",
    icon: Heart,
    description: "View saved listings",
  },
  {
    title: "Agents",
    href: "/agents",
    icon: Users,
    description: "Browse real estate agents",
  },
  {
    title: "Developers",
    href: "/developers",
    icon: Building2,
    description: "View development projects",
  },
  {
    title: "All Projects",
    href: "/developers/projects",
    icon: Building2,
    description: "Explore all development projects",
  },
  {
    title: "Newly Built Units",
    href: "/newly-built-units",
    icon: MapPin,
    description: "Explore newly built units",
  },
  {
    title: "Contact",
    href: "/contact",
    icon: Phone,
    description: "Get in touch with us",
  },
  {
    title: "Work With Us",
    href: "/work-with-us",
    icon: Users,
    description: "Join our team",
  },
  {
    title: "Feedback",
    href: "/feedback",
    icon: Heart,
    description: "Share your thoughts",
  },
  {
    title: "Advertise with us",
    href: "/advertising-options-with-meqasa",
    icon: Building2,
    description: "Discover advertising opportunities",
  },
] as const;

type PrimaryCategory = {
  title: string;
  icon: LucideIcon;
  items?: Array<{ title: string; href: string }>;
  href?: string;
};

export const primaryCategories: readonly PrimaryCategory[] = [
  {
    title: "For Rent",
    icon: Home,
    items: [
      { title: "Houses", href: "/search/rent?q=ghana&ftype=house" },
      { title: "Apartments", href: "/search/rent?q=ghana&ftype=apartment" },
      { title: "Office Spaces", href: "/search/rent?q=ghana&ftype=office" },
      {
        title: "Short Let",
        href: "/search/rent?q=ghana&frentperiod=shortrent",
      },
    ],
  },
  {
    title: "For Sale",
    icon: Building2,
    items: [
      { title: "Houses", href: "/search/sale?q=ghana&ftype=house" },
      { title: "Apartments", href: "/search/sale?q=ghana&ftype=apartment" },
      { title: "Office Spaces", href: "/search/sale?q=ghana&ftype=office" },
      {
        title: "Commercial Spaces",
        href: "/search/sale?q=ghana&ftype=commercial space",
      },
    ],
  },
  {
    title: "Land",
    icon: MapPin,
    href: "/search/sale?q=ghana&ftype=land",
  },
] as const;

// Mobile navigation labels and configuration
export const mobileNavLabels = {
  quickAccessTitle: "Quick Access",
  browsePropertiesTitle: "Browse Properties",
  sheetDescription: "Browse properties, agents, and developers",
} as const;

// Configuration for quick actions display
export const quickActionsConfig = {
  gridDisplayCount: 4, // Number of quick actions to show in the grid
} as const;

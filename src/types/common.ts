import type { Icons } from "@/components/icons";

export interface AdLink {
  src: string;
  href: string;
}

export interface PopupData {
  src: string;
  href: string;
  alt: string;
  title: string;
}

export interface PopupDataWithUrls extends PopupData {
  imageUrl: string; // Full URL with cloudfront prefix
  linkUrl: string; // Full URL with meqasa.com prefix
}

export interface NavItem {
  title: string;
  href?: string;
  active?: boolean;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

export interface NavItemWithChildren extends NavItem {
  items?: NavItemWithChildren[];
}

interface MainNav {
  title: string;
  description: string;
  href?: string;
  items: {
    title: string;
    href: string;
    description: string;
    items: [];
  }[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = MainNav;
export type SidebarNavItem = NavItemWithChildren;

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
  footerNav: FooterItem[];
  selectOptions: Record<string, Array<{ value: string; label: string }>>;
}
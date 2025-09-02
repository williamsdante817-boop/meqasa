// import type { User } from "@clerk/nextjs/server"
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
// Import new DOMPurify-based sanitization functions
import {
  sanitizeHtml,
  sanitizeToInnerHtml,
  sanitizeRichHtml,
  sanitizeRichHtmlToInnerHtml,
} from "./dom-sanitizer";
import type { PropertyType, Currency, ContractType } from "@/config/property";
import { parsePhoneNumberFromString, isValidPhoneNumber } from "libphonenumber-js";
import type { CountryCode } from "libphonenumber-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formatter for currency to GHS (Ghanaian Cedi)
function createNumberFormatter(
  locale?: string,
  config?: Intl.NumberFormatOptions,
) {
  return new Intl.NumberFormat(locale, config);
}

// Formatter for currency to GHS (Ghanaian Cedi)
export const formatToGhsCurrency = createNumberFormatter("en-GH", {
  style: "currency",
  currency: "GHS",
  useGrouping: true,
  maximumSignificantDigits: 3,
  notation: "compact",
});

export function formatPrice(
  price: number | string,
  opts: Intl.NumberFormatOptions = {},
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: opts.currency ?? "USD",
    notation: opts.notation ?? "compact",
    ...opts,
  }).format(Number(price));
}

export function formatNumber(
  number: number | string,
  opts: Intl.NumberFormatOptions = {},
) {
  return new Intl.NumberFormat("en-US", {
    style: opts.style ?? "decimal",
    notation: opts.notation ?? "standard",
    minimumFractionDigits: opts.minimumFractionDigits ?? 0,
    maximumFractionDigits: opts.maximumFractionDigits ?? 2,
    ...opts,
  }).format(Number(number));
}

export function formatDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {},
) {
  return new Intl.DateTimeFormat("en-US", {
    month: opts.month ?? "long",
    day: opts.day ?? "numeric",
    year: opts.year ?? "numeric",
    ...opts,
  }).format(new Date(date));
}

export function formatBytes(
  bytes: number,
  decimals = 0,
  sizeType: "accurate" | "normal" = "normal",
) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytest")
      : (sizes[i] ?? "Bytes")
  }`;
}

export function formatId(id: string) {
  return `#${id.toString().padStart(4, "0")}`;
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export function unslugify(str: string) {
  return str.replace(/-/g, " ");
}

export function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
  );
}

export function toSentenceCase(str: string) {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

// Utility
export function extractSlugAndId(
  path: string,
  prefix: string,
): [string, string] {
  const remaining = path.replace(prefix, "");
  const match = /(.+)-(\d+)$/.exec(remaining);
  if (!match) return [remaining, ""];
  return [match[1]!, match[2]!];
}

export function isMacOs() {
  if (typeof window === "undefined") return false;

  return window.navigator.userAgent.includes("Mac");
}

// Format number to Ghanaian Cedis
export function formatNumberToCedis(
  value: string | number,
  locale = "en-GH",
  options: Intl.NumberFormatOptions = {},
) {
  const defaultOptions: Intl.NumberFormatOptions = {
    style: "currency",
    currency: "GHS",
    maximumSignificantDigits: 3,
  };

  const formatter = new Intl.NumberFormat(locale, {
    ...defaultOptions,
    ...options,
  });
  return formatter.format(Number(value));
}

// Parse comma-separated number string to number
export function parseCommaSeparatedNumber(value: string): number {
  // Remove all non-numeric characters except decimal point
  const cleanValue = value.replace(/[^0-9.]/g, "");
  return Number(cleanValue) || 0;
}

// Shimmer effect for image loading
export function shimmer(w: number, h: number) {
  return `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#f6f7f8" offset="20%" />
          <stop stop-color="#edeef1" offset="50%" />
          <stop stop-color="#f6f7f8" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#f6f7f8" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
    </svg>
  `;
}

// Convert string to base64
export function toBase64(str: string) {
  return typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);
}

// Sanitize HTML to prevent XSS in server/client rendering contexts
// DEPRECATED: Use sanitizeHtml from dom-sanitizer instead
export function sanitizeHtmlString(html: string): string {
  console.warn(
    "sanitizeHtmlString is deprecated. Use sanitizeHtml from dom-sanitizer instead.",
  );
  return sanitizeHtml(html);
}

// Build a React dangerouslySetInnerHTML payload with sanitized content
// DEPRECATED: Use sanitizeToInnerHtml from dom-sanitizer instead
export function toInnerHtml(html: string): { __html: string } {
  console.warn(
    "toInnerHtml is deprecated. Use sanitizeToInnerHtml from dom-sanitizer instead.",
  );
  return sanitizeToInnerHtml(html);
}

// Rich HTML sanitizer for ad/banner markup that may contain images and links
// DEPRECATED: Use sanitizeRichHtml from dom-sanitizer instead
export function sanitizeRichHtmlString(html: string): string {
  console.warn(
    "sanitizeRichHtmlString is deprecated. Use sanitizeRichHtml from dom-sanitizer instead.",
  );
  return sanitizeRichHtml(html);
}

export function buildInnerHtml(html: string): { __html: string } {
  return sanitizeToInnerHtml(html);
}

export function buildRichInnerHtml(html: string): { __html: string } {
  return sanitizeRichHtmlToInnerHtml(html);
}

// Property-specific utility functions
// Based on skateshop patterns for domain-specific helpers

export function formatPropertyPrice(
  price: number | string,
  currency: Currency = "GHS",
  contractType?: ContractType
): string {
  const numericPrice = Number(price);
  
  if (numericPrice === 0) return "Price on request";
  
  let formattedPrice: string;
  
  if (currency === "GHS") {
    formattedPrice = formatNumberToCedis(numericPrice, "en-GH", {
      maximumSignificantDigits: 3,
      notation: numericPrice >= 1000000 ? "compact" : "standard"
    });
  } else {
    formattedPrice = formatPrice(numericPrice, {
      currency,
      notation: numericPrice >= 1000000 ? "compact" : "standard"
    });
  }
  
  if (contractType === "rent") {
    return `${formattedPrice}/month`;
  }
  
  return formattedPrice;
}

export function formatPropertyArea(area: number | string): string {
  const numericArea = Number(area);
  if (numericArea <= 0) return "";
  
  return `${formatNumber(numericArea)} sqft`;
}

export function formatPropertyLocation(location: string, area?: string): string {
  if (!location) return "";
  
  const parts = [location];
  if (area && area !== location) {
    parts.push(area);
  }
  
  return parts.join(", ");
}

export function generatePropertySlug(
  title: string, 
  propertyType: PropertyType,
  location?: string
): string {
  const parts = [title, propertyType];
  if (location) {
    parts.push(location);
  }
  
  return slugify(parts.join(" "));
}

export function extractPropertyReference(url: string): string | null {
  const match = /\/listings\/([^\/]+)/.exec(url);
  return match?.[1] ?? null;
}

export function validateInternationalPhone(phone: string, defaultCountry?: string): boolean {
  try {
    return isValidPhoneNumber(phone, defaultCountry as CountryCode | { defaultCountry?: CountryCode; defaultCallingCode?: string } | undefined);
  } catch {
    return false;
  }
}

export function formatInternationalPhone(phone: string, defaultCountry?: string): string {
  try {
    const phoneNumber = parsePhoneNumberFromString(phone, defaultCountry as CountryCode | { defaultCountry?: CountryCode; defaultCallingCode?: string; extract?: boolean } | undefined);
    if (phoneNumber?.isValid()) {
      return phoneNumber.formatInternational();
    }
    return phone;
  } catch {
    return phone;
  }
}

export function formatNationalPhone(phone: string, defaultCountry?: string): string {
  try {
    const phoneNumber = parsePhoneNumberFromString(phone, defaultCountry as CountryCode | { defaultCountry?: CountryCode; defaultCallingCode?: string; extract?: boolean } | undefined);
    if (phoneNumber?.isValid()) {
      return phoneNumber.formatNational();
    }
    return phone;
  } catch {
    return phone;
  }
}

export function getPhoneCountryCode(phone: string, defaultCountry?: string): string | undefined {
  try {
    const phoneNumber = parsePhoneNumberFromString(phone, defaultCountry as CountryCode | { defaultCountry?: CountryCode; defaultCallingCode?: string; extract?: boolean } | undefined);
    return phoneNumber?.country;
  } catch {
    return undefined;
  }
}

export function getPropertyTypeLabel(type: PropertyType): string {
  const labels: Record<PropertyType, string> = {
    "house": "House",
    "apartment": "Apartment",
    "office": "Office",
    "land": "Land",
    "townhouse": "Townhouse", 
    "commercial space": "Commercial Space",
    "warehouse": "Warehouse",
    "guest house": "Guest House",
    "shop": "Shop",
    "retail": "Retail",
    "beach house": "Beach House",
  };
  
  return labels[type] || toTitleCase(type);
}

export function formatPropertyFeatures(features: string[]): string {
  if (features.length === 0) return "";
  if (features.length === 1) return features[0]!;
  if (features.length === 2) return features.join(" • ");
  
  return `${features.slice(0, 2).join(" • ")} +${features.length - 2} more`;
}

export function generatePropertyId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `MQ${timestamp}${random}`.toUpperCase();
}

export function formatPropertyBedrooms(bedrooms: number): string {
  if (bedrooms === 0) return "Studio";
  if (bedrooms === 1) return "1 Bedroom";
  return `${bedrooms} Bedrooms`;
}

export function formatPropertyBathrooms(bathrooms: number): string {
  if (bathrooms === 1) return "1 Bathroom";
  return `${bathrooms} Bathrooms`;
}

export function getPropertyStatusBadgeColor(status: string): string {
  const colors: Record<string, string> = {
    "active": "bg-green-100 text-green-800",
    "pending": "bg-yellow-100 text-yellow-800", 
    "sold": "bg-red-100 text-red-800",
    "rented": "bg-blue-100 text-blue-800",
    "withdrawn": "bg-gray-100 text-gray-800",
  };
  
  return colors[status] ?? "bg-gray-100 text-gray-800";
}

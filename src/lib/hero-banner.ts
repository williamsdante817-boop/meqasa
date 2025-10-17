import type { AdLink } from "@/types";

export interface NormalizedHeroBanner {
  src: string;
  href?: string;
  alt?: string;
  ariaLabel?: string;
}

const HERO_CDN_BASE_URL = "https://dve7rykno93gs.cloudfront.net";
const HERO_SITE_BASE_URL = "https://meqasa.com";

function isValidUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

type RawHeroBanner =
  | (Partial<Pick<AdLink, "src" | "href" | "alt" | "ariaLabel">> & {
      src?: string | null;
      href?: string | null;
      alt?: string | null;
      ariaLabel?: string | null;
    })
  | null
  | undefined;

export function normalizeHeroBanner(
  banner: RawHeroBanner
): NormalizedHeroBanner | null {
  if (!banner) return null;

  const rawSrc = banner.src?.trim();
  if (!rawSrc) return null;

  const src = rawSrc.startsWith("http")
    ? rawSrc
    : `${HERO_CDN_BASE_URL}${rawSrc}`;

  if (!isValidUrl(src)) {
    return null;
  }

  let href: string | undefined;
  const rawHref = banner.href?.trim();
  if (rawHref) {
    const normalizedHref = rawHref.startsWith("http")
      ? rawHref
      : `${HERO_SITE_BASE_URL}${rawHref}`;
    if (isValidUrl(normalizedHref)) {
      href = normalizedHref;
    }
  }

  const alt = banner.alt?.trim() || "";
  const ariaLabel =
    banner.ariaLabel?.trim() || (alt || undefined) || "View featured property promotion";

  return {
    src,
    href,
    alt,
    ariaLabel,
  };
}

export function isValidHeroBanner(
  banner: NormalizedHeroBanner | null
): banner is NormalizedHeroBanner {
  return Boolean(banner?.src);
}

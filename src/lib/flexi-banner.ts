export function extractFlexiBannerBlocks(html: string): string[] {
  const trimmed = html?.trim();
  if (!trimmed) return [];

  const blockRegex = /<div class="row mqs-featured-prop-inner-wrap"[\s\S]*?(?=<div class="row mqs-featured-prop-inner-wrap"|$)/g;
  const matches = trimmed.match(blockRegex);

  if (matches && matches.length > 0) {
    return matches.map((block) => block.trim());
  }

  return [trimmed];
}

export function extractImageUrlsFromFlexi(html: string): string[] {
  const urls = new Set<string>();

  const srcsetRegex = /<source[^>]+srcset="([^"]+)"/gi;
  let match: RegExpExecArray | null;
  while ((match = srcsetRegex.exec(html)) !== null) {
    if (match[1]) urls.add(match[1]);
  }

  const imgSrcRegex = /<img[^>]+(?:(?:src|data-src|lz-src)="([^"]+)")/gi;
  while ((match = imgSrcRegex.exec(html)) !== null) {
    if (match[1]) {
      urls.add(match[1]);
    }
  }

  return Array.from(urls);
}

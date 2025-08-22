// Lightweight image preloading helpers with a shared in-memory cache.

const preloadedImageCache = new Set<string>();
const inflightPreloads = new Map<string, Promise<void>>();

export function isImagePreloaded(url: string | undefined): boolean {
  if (!url) return false;
  return preloadedImageCache.has(url);
}

export function preloadImage(url: string | undefined): Promise<void> {
  if (!url) return Promise.resolve();
  if (preloadedImageCache.has(url)) return Promise.resolve();
  const existing = inflightPreloads.get(url);
  if (existing) return existing;

  const promise = new Promise<void>((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }

    const img = new Image();
    img.decoding = "async";
    // Hint to fetch immediately; browsers may ignore but helps intent
    img.loading = "eager";
    img.onload = () => {
      preloadedImageCache.add(url);
      inflightPreloads.delete(url);
      resolve();
    };
    img.onerror = () => {
      // Do not cache errors; just resolve to avoid blocking
      inflightPreloads.delete(url);
      resolve();
    };
    img.src = url;
  });

  inflightPreloads.set(url, promise);
  return promise;
}

export function preloadImages(urls: Array<string | undefined>): Promise<void> {
  const tasks = urls.map((u) => preloadImage(u));
  return Promise.all(tasks).then(() => void 0);
}

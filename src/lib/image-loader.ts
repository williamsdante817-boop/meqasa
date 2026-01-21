export default function cloudflareLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  // For local images, return as-is
  if (src.startsWith("/")) {
    return src;
  }

  // For CloudFront images, use query params for optimization
  // Requires CloudFront with image optimization (Lambda@Edge or CloudFront Functions)
  if (src.includes("cloudfront.net")) {
    const params = new URLSearchParams();
    params.set("w", width.toString());
    if (quality) {
      params.set("q", quality.toString());
    }
    return `${src}?${params.toString()}`;
  }

  // For other external images, return original
  return src;
}

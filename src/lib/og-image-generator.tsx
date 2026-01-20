import { ImageResponse } from "next/og";

interface OGImageProps {
  title: string;
  subtitle?: string;
  gradient?: string;
}

export const runtime = "edge";

/**
 * Reusable OG image generator for MeQasa pages
 * Usage: Import and use in any route's opengraph-image.tsx
 */
export function generateOGImage({
  title,
  subtitle = "MeQasa Ghana",
  gradient = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
}: OGImageProps) {
  return new ImageResponse(
    (
      <div
        style={{
          background: gradient,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "sans-serif",
          padding: "40px",
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: "bold",
            marginBottom: 20,
            textAlign: "center",
            maxWidth: "90%",
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 32, opacity: 0.9, textAlign: "center" }}>
          {subtitle}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

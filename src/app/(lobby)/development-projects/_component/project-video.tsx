import { Card } from "@/components/ui/card";
import ContentSection from "@/components/content-section";
import { useMemo } from "react";

// Helper function to convert YouTube URL to embed format
const getYouTubeEmbedUrl = (url: string): string | undefined => {
  if (!url || typeof url !== "string") return undefined;

  // Handle different YouTube URL formats
  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = regExp.exec(url);

  if (match?.[2]?.length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }

  return undefined;
};

// Validate YouTube URL format
const isValidYouTubeUrl = (url: string): boolean => {
  if (!url || typeof url !== "string") return false;

  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
  return youtubeRegex.test(url);
};

interface ProjectVideoProps {
  videoUrl: string | null;
  title?: string;
  description?: string;
}

export default function ProjectVideo({
  videoUrl,
  title = "Project Video",
  description = "Watch a video tour of this development project",
}: ProjectVideoProps) {
  // Memoize the embed URL to avoid unnecessary recalculations
  const embedUrl = useMemo(() => {
    if (!videoUrl || !isValidYouTubeUrl(videoUrl)) return undefined;
    return getYouTubeEmbedUrl(videoUrl);
  }, [videoUrl]);

  // Check if we have a valid video URL
  const hasValidVideo = Boolean(embedUrl);

  return (
    <ContentSection
      title={title}
      description={description}
      href=""
      className="pt-14 px-0 md:pt-20"
      btnHidden
      aria-label={`${title} section`}
    >
      <Card
        className="flex h-[250px] overflow-hidden rounded-lg border-orange-300 p-0 lg:h-[400px]"
        role="region"
        aria-label={`${title} player`}
      >
        {hasValidVideo ? (
          <div className="grow relative">
            <iframe
              className="w-full h-full"
              src={embedUrl}
              title={`${title} Tour`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"
              referrerPolicy="no-referrer-when-downgrade"
              aria-label={`${title} video player`}
            />
            {/* Fallback content for screen readers and browsers without iframe support */}
            <div className="sr-only">
              <p>{title} video tour. Your browser supports embedded videos.</p>
            </div>
          </div>
        ) : (
          <div className="grow flex items-center justify-center bg-gray-50">
            <div className="text-center p-4">
              <p className="text-brand-muted mb-2">Video not available</p>
              <p className="text-sm text-brand-muted">
                {videoUrl && !isValidYouTubeUrl(videoUrl)
                  ? "Please provide a valid YouTube URL."
                  : "Please check back later."}
              </p>
            </div>
          </div>
        )}
      </Card>
    </ContentSection>
  );
}

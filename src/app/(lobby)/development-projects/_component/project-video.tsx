"use client";

import { Card } from "@/components/ui/card";
import ContentSection from "@/components/layout/content-section";
import { useMemo } from "react";
import { AlertCircle } from "lucide-react";

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
      className="px-0 pt-14 md:pt-20"
      btnHidden
      aria-label={`${title} section`}
    >
      <Card
        className="border-brand-badge-ongoing flex h-[250px] overflow-hidden rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 p-0 lg:h-[400px]"
        role="region"
        aria-label={`${title} player`}
      >
        {hasValidVideo ? (
          <iframe
            className="grow"
            src={embedUrl}
            title={`${title} Tour`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-popups-to-escape-sandbox"
            referrerPolicy="no-referrer-when-downgrade"
            aria-label={`${title} video player`}
          />
        ) : (
          <div className="flex grow items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-brand-accent mb-2 font-medium">
                Video not available
              </h3>
              <p className="text-brand-muted max-w-xs text-sm">
                {videoUrl && !isValidYouTubeUrl(videoUrl)
                  ? "The video URL provided is not valid. Please contact support if this issue persists."
                  : "We're working to make this video available. Please check back later."}
              </p>
            </div>
          </div>
        )}
      </Card>
    </ContentSection>
  );
}

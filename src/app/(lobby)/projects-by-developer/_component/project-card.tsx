import { ImageWithFallback } from "@/components/common/image-with-fallback";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function ProjectCard({
  name,
  src,
  status,
  url,
}: {
  name: string;
  src: string;
  status: string;
  url: string;
}) {
  return (
    <Card className="group relative h-full overflow-hidden rounded-lg border-0 bg-transparent p-0 shadow-none hover:shadow-md transition-shadow duration-200">
      <Link href={url} className="block h-full">
        <CardHeader className="p-0 gap-0">
          <AspectRatio ratio={16 / 9} className="relative">
            <ImageWithFallback
              src={src}
              alt={`${name} project image`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 256px, (max-width: 1024px) 300px, 256px"
              quality={90}
              className="h-[180px] w-full rounded-lg object-cover transition-transform duration-300 lg:h-[254px] lg:group-hover:scale-105"
              placeholder="blur"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/duYy7cAAAAASUVORK5CYII="
              fallbackAlt="Project image not available"
            />

            {/* Status Badge */}
            <div className="absolute bottom-3 left-3 z-20 lg:bottom-4 lg:left-4">
              <Badge
                className={cn(
                  "uppercase rounded-sm",
                  status?.toLowerCase() === "completed"
                    ? "bg-brand-badge-completed text-white"
                    : status?.toLowerCase() === "ongoing"
                      ? "bg-brand-badge-ongoing text-white"
                      : "bg-brand-badge-muted text-white"
                )}
              >
                {status}
              </Badge>

              {/* Project Name */}
              <h4 className="mt-2 line-clamp-1 font-bold text-white lg:text-xl leading-tight">
                {name}
              </h4>
            </div>

            {/* Gradient Overlay */}
            <div
              className="absolute inset-0 z-10 rounded-lg bg-gradient-to-b from-transparent via-transparent to-slate-900/60"
              aria-hidden="true"
            />
          </AspectRatio>
        </CardHeader>
      </Link>
    </Card>
  );
}

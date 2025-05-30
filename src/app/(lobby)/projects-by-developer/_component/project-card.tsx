import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function ProjectCard({
  name,
  src,
  status,
  url
}: {
  name: string;
  src: string;
  status: string;
  url:string
}) {

  console.log("ProjectCard rendered with URL:", url);
  return (
    <Card className="group relative overflow-hidden rounded-lg border-0 bg-transparent p-0">
      <Link href={url} className="inline-block">
        <AspectRatio ratio={16/9}>
          <Image
            alt="test"
            src={src}
            width={200}
            height={200}
            className="h-[180px] w-full rounded-lg object-cover transition lg:h-[254px] lg:group-hover:scale-105"
          />
        </AspectRatio>
        <span className="absolute bottom-3 left-3 z-20 lg:bottom-4 lg:left-4">
          <Badge
            className={cn(
              status === "completed"
                ? "bg-green-500"
                : "bg-amber-500 text-white",
              "uppercase ",
            )}
          >
            {status}
          </Badge>
          <h4 className="mt-1 line-clamp-1 font-bold text-white lg:text-xl">
            {name}
          </h4>
        </span>
        {/* overlay */}
        <div
          className="absolute inset-0 z-10 overflow-hidden rounded-lg transition group-hover:scale-105"
          style={{
            backgroundImage:
              "linear-gradient(180deg,rgba(0,0,0,.14),rgba(0,0,0,.18) 16.31%,transparent 37.79%),linear-gradient(1turn,rgba(0,0,0,.5),transparent 79.49%)",
          }}
        />
      </Link>
    </Card>
  );
}

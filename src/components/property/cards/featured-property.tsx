// import Image from "next/image";
// import Link from "next/link";

// import { Icons } from "@/components/icons";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import type { Listing } from "@/types";
// import { AspectRatio } from "@radix-ui/react-aspect-ratio";
// import { PlaceholderImage } from "@/components/common/placeholder-image";
// import { useState } from "react";

// export default function FeaturedProperty({ item }: { item: Listing }) {
//   const [imgError, setImgError] = useState(false);
//   const {
//     title,
//     thumbnail,
//     agentimage,
//     agentname,
//     description,
//     contract,
//     bedrooms,
//     bathrooms,
//     location,
//   } = item;

//   return (
//     <Card className="size-full overflow-hidden rounded-xl p-0 relative gap-0">
//       <Link href={`/developers/1/projects/1`} aria-label={title}>
//         <CardHeader className="p-0 border-b gap-0">
//           <AspectRatio ratio={16 / 9}>
//             {!imgError ? (
//               <Image
//                 className="object-cover"
//                 src={thumbnail}
//                 onError={() => setImgError(true)}
//                 alt={title}
//                 sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
//                 fill
//                 loading="lazy"
//               />
//             ) : (
//               <PlaceholderImage asChild />
//             )}
//           </AspectRatio>
//           <Badge className="absolute top-3 left-3 z-10 rounded-sm  capitalize bg-accent-foreground">
//             Featured
//           </Badge>
//           <Badge className="absolute top-3 left-24 z-10 rounded-sm  capitalize bg-accent-foreground">
//             {contract}
//           </Badge>
//         </CardHeader>
//       </Link>
//       <Link href={`/developers/1/projects/1`} aria-label={title}>
//         <CardContent className="p-4 flex items-start justify-between">
//           <div className="space-y-2.5">
//             <CardTitle className="line-clamp-2 font-semibold capitalize  text-lg text-accent-foreground">
//               {title}
//             </CardTitle>
//             <div className="flex items-center gap-[5px] text-xs font-medium leading-6 text-muted-foreground lg:text-sm lg:leading-8">
//               <span>{location}</span>
//               <Icons.dot className="h-16 w-[15px]" />
//               <span>{bedrooms} Beds</span>
//               <Icons.dot className="h-4 w-[15px]" />
//               <span>{bathrooms} Baths</span>
//             </div>
//             <p className="line-clamp-2 text-sm text-accent-foreground">
//               {description}
//             </p>
//           </div>
//           {/* eslint-disable-next-line @next/next/no-img-element */}
//           <img
//             src={agentimage}
//             alt={agentname}
//             className="h-auto w-full rounded-sm object-contain lg:h-[70px] lg:w-[70px]"
//           />
//         </CardContent>
//       </Link>
//     </Card>
//   );
// }

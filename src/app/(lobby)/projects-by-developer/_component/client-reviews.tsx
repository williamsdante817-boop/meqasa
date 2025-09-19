"use client";

import * as React from "react";
import { useState, useCallback, useEffect } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  Quote,
  ThumbsUp,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Enhanced mock data with realistic real estate reviews
const mockReviews = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Property Owner",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=female&s=1",
    rating: 5,
    date: "2024-01-15",
    project: "Eden Heights Apartments",
    review:
      "Absolutely exceptional service! The team delivered exactly what was promised. The quality of construction and attention to detail exceeded our expectations. Our apartment complex has been fully occupied since completion.",
    verified: true,
    helpful: 12,
    category: "Construction Quality",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "First-time Buyer",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=male&s=2",
    rating: 5,
    date: "2024-01-08",
    project: "Sunrise Villas",
    review:
      "Professional team that guided us through every step of our first home purchase. Communication was excellent and they delivered on time. Highly recommend for anyone looking for quality homes.",
    verified: true,
    helpful: 8,
    category: "Customer Service",
  },
  {
    id: 3,
    name: "Priya Patel",
    role: "Property Investor",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=female&s=3",
    rating: 4,
    date: "2023-12-20",
    project: "Golden Gate Commercial",
    review:
      "Great investment opportunity. The location was perfect and the development timeline was met. Minor issues with finishing but overall very satisfied with the ROI.",
    verified: true,
    helpful: 15,
    category: "Investment Value",
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Homeowner",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=male&s=4",
    rating: 5,
    date: "2023-12-10",
    project: "Parkview Residences",
    review:
      "Outstanding craftsmanship and innovative design. The smart home features and energy efficiency exceeded expectations. Living here has been an absolute joy.",
    verified: true,
    helpful: 9,
    category: "Design & Innovation",
  },
  {
    id: 5,
    name: "Emma Wilson",
    role: "Corporate Client",
    avatar: "https://xsgames.co/randomusers/avatar.php?g=female&s=5",
    rating: 5,
    date: "2023-11-28",
    project: "Business Park Complex",
    review:
      "Delivered our office complex ahead of schedule with premium finishes. Their project management was exceptional. Would definitely work with them again for future developments.",
    verified: true,
    helpful: 20,
    category: "Project Management",
  },
];

interface CarouselApi {
  canScrollNext(): boolean;
  canScrollPrev(): boolean;
  scrollNext(): void;
  scrollTo(index: number): void;
  selectedScrollSnap(): number;
  on(event: string, callback: () => void): void;
  off?(event: string, callback: () => void): void;
}

export default function ClientReviews() {
  const [selectedReview, setSelectedReview] = useState<
    (typeof mockReviews)[0] | null
  >(null);
  const [api, setApi] = useState<CarouselApi | undefined>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!api) return;

    const autoplay = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5000); // Auto-scroll every 5 seconds

    return () => clearInterval(autoplay);
  }, [api]);

  // Update carousel state
  useEffect(() => {
    if (!api) return;

    const updateState = () => {
      setCurrentSlide(api.selectedScrollSnap());
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    api.on("select", updateState);
    updateState();

    return () => {
      if (api?.off) {
        api.off("select", updateState);
      }
    };
  }, [api]);

  const getTimeAgo = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-300 text-gray-300"
        )}
      />
    ));
  };

  const slides = mockReviews.map((review) => (
    <CarouselItem className="basis-[320px] sm:basis-[350px]" key={review.id}>
      <ReviewCard
        review={review}
        onSelect={setSelectedReview}
        getTimeAgo={getTimeAgo}
        renderStars={renderStars}
      />
    </CarouselItem>
  ));

  return (
    <section aria-labelledby="reviews-heading" className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <h2
              id="reviews-heading"
              className="text-brand-accent text-lg font-semibold"
            >
              Client Reviews
            </h2>
            <p className="text-brand-muted text-sm">
              {mockReviews.length} verified reviews •{" "}
              {Math.round(
                (mockReviews.reduce((acc, r) => acc + r.rating, 0) /
                  mockReviews.length) *
                  10
              ) / 10}{" "}
              average rating
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <div className="flex items-center gap-1">{renderStars(5)}</div>
          <span className="text-brand-accent text-sm font-medium">
            {Math.round(
              (mockReviews.reduce((acc, r) => acc + r.rating, 0) /
                mockReviews.length) *
                10
            ) / 10}
          </span>
        </div>
      </div>

      <div className="relative">
        <Carousel
          setApi={setApi}
          className="w-full max-w-3xl"
          opts={{
            align: "start",
            loop: true,
            skipSnaps: false,
            dragFree: true,
          }}
        >
          <CarouselContent
            aria-label="Client reviews carousel"
            className="-ml-2 md:-ml-4"
          >
            {slides}
          </CarouselContent>

          {/* Enhanced Navigation Controls */}
          <CarouselPrevious
            className={cn(
              "left-0 hidden h-10 w-10 border-0 bg-white shadow-lg transition-all duration-200 sm:left-4 sm:h-12 sm:w-12 lg:flex",
              canScrollPrev
                ? "cursor-pointer opacity-100 hover:scale-110 hover:bg-gray-50"
                : "cursor-not-allowed opacity-40"
            )}
            aria-label="Previous review"
            disabled={!canScrollPrev}
          />
          <CarouselNext
            className={cn(
              "right-0 hidden h-10 w-10 border-0 bg-white shadow-lg transition-all duration-200 sm:right-4 sm:h-12 sm:w-12 lg:flex",
              canScrollNext
                ? "cursor-pointer opacity-100 hover:scale-110 hover:bg-gray-50"
                : "cursor-not-allowed opacity-40"
            )}
            aria-label="Next review"
            disabled={!canScrollNext}
          />
        </Carousel>

        {/* Dot Indicators */}
        <div className="mt-6 flex justify-center gap-2">
          {mockReviews.map((_, index) => (
            <button
              key={index}
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-200",
                currentSlide === index
                  ? "w-6 bg-blue-600"
                  : "bg-gray-300 hover:bg-gray-400"
              )}
              onClick={() => {
                if (api) {
                  api.scrollTo(index);
                }
              }}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-1 rounded-full bg-blue-600 transition-all duration-300 ease-out"
            style={{
              width: `${((currentSlide + 1) / mockReviews.length) * 100}%`,
            }}
          />
        </div>

        {/* Mobile Touch Instructions */}
        <div className="mt-4 text-center lg:hidden">
          <p className="text-brand-muted text-xs">
            Swipe left or right to browse reviews
          </p>
        </div>
      </div>

      {/* Enhanced Dialog */}
      {selectedReview && (
        <Dialog
          open={!!selectedReview}
          onOpenChange={() => setSelectedReview(null)}
        >
          <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[500px]">
            <DialogTitle className="sr-only">
              Review from {selectedReview.name}
            </DialogTitle>
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start gap-4 border-b pb-4">
                <Avatar className="h-12 w-12 border-2 border-blue-100">
                  <AvatarImage
                    src={selectedReview.avatar}
                    alt={`${selectedReview.name}'s profile picture`}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-blue-100 font-semibold text-blue-700">
                    {selectedReview.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="text-brand-accent font-semibold">
                      {selectedReview.name}
                    </h3>
                    {selectedReview.verified && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-brand-muted mb-2 text-sm">
                    {selectedReview.role}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {renderStars(selectedReview.rating)}
                    </div>
                    <span className="text-brand-muted text-sm">
                      {getTimeAgo(selectedReview.date)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Project Info */}
              <div className="rounded-lg bg-blue-50 p-3">
                <p className="text-sm font-medium text-blue-900">
                  Project: {selectedReview.project}
                </p>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {selectedReview.category}
                </Badge>
              </div>

              {/* Review Content */}
              <div className="relative">
                <Quote className="absolute -top-2 -left-2 h-6 w-6 fill-blue-200 text-blue-200" />
                <p className="text-brand-accent pl-4 text-sm leading-relaxed">
                  {selectedReview.review}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between border-t pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ThumbsUp className="h-4 w-4" />
                  Helpful ({selectedReview.helpful})
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-brand-muted text-xs">
                    Verified Purchase
                  </span>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
}

interface ReviewCardProps {
  review: (typeof mockReviews)[0];
  onSelect: (review: (typeof mockReviews)[0]) => void;
  getTimeAgo: (dateString: string) => string;
  renderStars: (rating: number) => React.ReactNode;
}

function ReviewCard({
  review,
  onSelect,
  getTimeAgo,
  renderStars,
}: ReviewCardProps) {
  return (
    <div className="p-2 md:p-3">
      <Card
        className="group h-full w-full cursor-pointer rounded-xl border border-gray-200 p-4 transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
        onClick={() => onSelect(review)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect(review);
          }
        }}
      >
        <CardContent className="space-y-3 p-0">
          {/* Rating and Category */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {renderStars(review.rating)}
            </div>
            <Badge variant="outline" className="text-xs">
              {review.category}
            </Badge>
          </div>

          {/* Review Text */}
          <p className="text-brand-accent line-clamp-4 text-sm leading-relaxed">
            &ldquo;{review.review}&rdquo;
          </p>

          {/* Project */}
          <div className="text-brand-muted rounded bg-gray-50 p-2 text-xs">
            Project: <span className="font-medium">{review.project}</span>
          </div>
        </CardContent>

        <CardFooter className="mt-4 flex items-center justify-between p-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border">
              <AvatarImage
                src={review.avatar}
                className="object-cover"
                alt={`${review.name}'s profile picture`}
              />
              <AvatarFallback className="bg-blue-100 text-xs font-semibold text-blue-700">
                {review.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-brand-accent text-sm font-medium">
                  {review.name}
                </span>
                {review.verified && (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                )}
              </div>
              <p className="text-brand-muted text-xs">{review.role}</p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-brand-muted flex items-center gap-1 text-xs">
              <ThumbsUp className="h-3 w-3" />
              <span>{review.helpful}</span>
            </div>
            <p className="text-brand-muted mt-1 text-xs">
              {getTimeAgo(review.date)}
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

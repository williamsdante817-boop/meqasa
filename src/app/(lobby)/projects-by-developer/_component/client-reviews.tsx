"use client";

import * as React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icons } from "@/components/icons";

const slides = Array.from({ length: 8 }).map((_, index) => (
  <CarouselItem className="basis-[320px]" key={index}>
    <ReviewCard />
  </CarouselItem>
));

export default function ClientReviews() {
  return (
    <section aria-labelledby="reviews-heading" className="w-full">
      <h2 id="reviews-heading" className="sr-only">
        Client Reviews
      </h2>
      <Carousel
        className="w-full max-w-3xl"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent aria-label="Client reviews carousel">
          {slides}
        </CarouselContent>
        <CarouselPrevious
          className="left-4 hidden h-12 w-12 bg-white lg:flex"
          aria-label="Previous review"
        />
        <CarouselNext
          className="right-4 hidden h-12 w-12 bg-white lg:flex"
          aria-label="Next review"
        />
      </Carousel>
    </section>
  );
}

function ReviewCard() {
  return (
    <div className="md:my-6">
      <Dialog>
        <DialogTrigger asChild>
          <Card
            className="h-full w-[300px] cursor-pointer rounded-xl border p-4 transition md:hover:-translate-y-3"
            role="button"
            tabIndex={0}
          >
            <CardContent className="p-0">
              <p className="line-clamp-5 text-sm text-brand-accent">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Molestias, eaque ab doloremque consequatur quaerat at laborum
                laudantium totam illum veritatis vel consequuntur vero,
                obcaecati deserunt mollitia culpa quos labore! Voluptatum.
              </p>
            </CardContent>
            <CardFooter className="mt-4 p-0">
              <span className="flex items-center gap-2">
                <span>
                  <Avatar className="flex h-[35px] w-[35px] items-center rounded-full text-b-accent shadow-spread">
                    <AvatarImage
                      src="https://xsgames.co/randomusers/avatar.php?g=female"
                      className="rounded-full object-cover"
                      alt="William's profile picture"
                    />
                    <AvatarFallback className="flex h-[35px] w-[35px] items-center justify-center rounded-full border bg-slate-50 text-sm font-bold text-inherit">
                      WD
                    </AvatarFallback>
                  </Avatar>
                </span>
                <span>
                  <span className="font-semibold capitalize text-brand-accent">
                    William
                  </span>
                  <small className="flex items-center text-blue-500">
                    Posted <Icons.dot className="h-4 w-4" aria-hidden="true" />a
                    day ago
                  </small>
                </span>
              </span>
            </CardFooter>
          </Card>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-[425px]"
          aria-labelledby="review-dialog-title"
          aria-describedby="review-dialog-description"
        >
          <DialogTitle id="review-dialog-title" className="sr-only">
            Review Details
          </DialogTitle>
          <div id="review-dialog-description">
            <div className="p-0">
              <p className="text-sm text-brand-accent">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Molestias, eaque ab doloremque consequatur quaerat at laborum
                laudantium totam illum veritatis vel consequuntur vero,
                obcaecati deserunt mollitia culpa quos labore! Voluptatum.
              </p>
            </div>
            <div className="mt-4 p-0">
              <span className="flex items-center gap-2">
                <span>
                  <Avatar className="flex h-[35px] w-[35px] items-center rounded-full text-b-accent shadow-spread">
                    <AvatarImage
                      src="https://xsgames.co/randomusers/avatar.php?g=female"
                      className="rounded-full object-cover"
                      alt="William's profile picture"
                      loading="lazy"
                    />
                    <AvatarFallback className="flex h-[35px] w-[35px] items-center justify-center rounded-full border bg-slate-50 text-sm font-bold text-inherit">
                      WD
                    </AvatarFallback>
                  </Avatar>
                </span>
                <span>
                  <span className="font-semibold capitalize text-brand-accent">
                    William
                  </span>
                  <small className="flex items-center text-brand-blue">
                    Posted <Icons.dot className="h-4 w-4" aria-hidden="true" />a
                    day ago
                  </small>
                </span>
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

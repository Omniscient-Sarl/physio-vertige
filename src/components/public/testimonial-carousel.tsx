"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

type Testimonial = {
  id: number;
  authorName: string;
  content: string;
  rating: number | null;
};

export function TestimonialCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  if (testimonials.length === 0) return null;

  return (
    <Carousel
      opts={{ align: "start", loop: true }}
      className="mx-auto w-full max-w-5xl"
    >
      <CarouselContent className="-ml-4">
        {testimonials.map((t) => (
          <CarouselItem
            key={t.id}
            className="pl-4 sm:basis-1/2 lg:basis-1/3"
          >
            <Card className="h-full border-border/60">
              <CardContent className="flex h-full flex-col p-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-coral-500 text-coral-500"
                    />
                  ))}
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground italic">
                  &ldquo;{t.content}&rdquo;
                </p>
                <p className="mt-4 text-sm font-semibold text-foreground">
                  {t.authorName}
                </p>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-4 hidden sm:flex" />
      <CarouselNext className="-right-4 hidden sm:flex" />
    </Carousel>
  );
}

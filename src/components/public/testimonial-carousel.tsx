"use client";

import Image from "next/image";
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
  authorAvatarUrl?: string | null;
  source?: string | null;
  sourceUrl?: string | null;
  relativeTime?: string | null;
};

function GoogleBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-gray-600 shadow-sm ring-1 ring-gray-200">
      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-red-500 to-yellow-500 text-[8px] font-bold text-white">
        G
      </span>
      Avis Google
    </span>
  );
}

function AuthorAvatar({ name, url }: { name: string; url?: string | null }) {
  if (url) {
    return (
      <Image
        src={url}
        alt={name}
        width={32}
        height={32}
        className="h-8 w-8 rounded-full object-cover"
        unoptimized
      />
    );
  }
  const initial = name.charAt(0).toUpperCase();
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-700">
      {initial}
    </span>
  );
}

export function TestimonialCarousel({
  testimonials,
  googleBusinessUrl,
}: {
  testimonials: Testimonial[];
  googleBusinessUrl?: string | null;
}) {
  if (testimonials.length === 0) return null;

  const useCarousel = testimonials.length > 2;

  const cards = testimonials.map((t) => (
    <Card key={t.id} className="h-full border-border/60">
      <CardContent className="flex h-full flex-col p-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-0.5">
            {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
              <Star
                key={i}
                className="h-4 w-4 fill-coral-500 text-coral-500"
              />
            ))}
          </div>
          {t.source === "google" && <GoogleBadge />}
        </div>
        <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground italic">
          &ldquo;{t.content}&rdquo;
        </p>
        <div className="mt-4 flex items-center gap-2">
          <AuthorAvatar name={t.authorName} url={t.authorAvatarUrl} />
          <div>
            <p className="text-sm font-semibold text-foreground">
              {t.authorName}
            </p>
            {t.relativeTime && (
              <p className="text-xs text-muted-foreground">
                {t.relativeTime}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  ));

  return (
    <div>
      {useCarousel ? (
        <Carousel
          opts={{ align: "start", loop: true }}
          className="mx-auto w-full max-w-5xl"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((t, i) => (
              <CarouselItem
                key={t.id}
                className="pl-4 sm:basis-1/2 lg:basis-1/3"
              >
                {cards[i]}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4 hidden sm:flex" />
          <CarouselNext className="-right-4 hidden sm:flex" />
        </Carousel>
      ) : (
        <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
          {cards}
        </div>
      )}
      {googleBusinessUrl && (
        <div className="mt-6 text-center">
          <a
            href={googleBusinessUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Voir tous les avis sur Google &rarr;
          </a>
        </div>
      )}
    </div>
  );
}

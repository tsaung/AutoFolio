import React from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SanityImage = {
  asset: { _ref: string };
  hotspot?: { x: number; y: number };
};

type Testimonial = {
  _key: string;
  quote: string;
  author: string;
  role?: string;
  avatar?: SanityImage;
};

export type TestimonialBlockData = {
  _type: "testimonialBlock";
  _key: string;
  name: string;
  headline?: string;
  testimonials: Testimonial[];
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function TestimonialBlock({ data }: { data: TestimonialBlockData }) {
  if (!data.testimonials || data.testimonials.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-6 py-20 lg:py-24">
      {data.headline && (
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            {data.headline}
          </h2>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {data.testimonials.map((testimonial) => (
          <div
            key={testimonial._key}
            className="flex flex-col rounded-2xl bg-card p-8 shadow-sm border border-border"
          >
            <div className="mb-6 flex-1 text-lg leading-relaxed text-muted-foreground italic">
              &ldquo;{testimonial.quote}&rdquo;
            </div>
            <div className="mt-auto flex items-center gap-4">
              {testimonial.avatar?.asset ? (
                <div className="relative h-12 w-12 overflow-hidden rounded-full border border-border bg-muted">
                  <Image
                    src={urlFor(testimonial.avatar).width(96).height(96).url()}
                    alt={testimonial.author}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                  {testimonial.author.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">
                  {testimonial.author}
                </span>
                {testimonial.role && (
                  <span className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

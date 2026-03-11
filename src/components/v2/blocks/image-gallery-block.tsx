import React from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type GalleryImage = {
  _key: string;
  asset: { _ref: string };
  hotspot?: { x: number; y: number };
  alt?: string;
  caption?: string;
};

export type ImageGalleryBlockData = {
  _type: "imageGalleryBlock";
  _key: string;
  name: string;
  headline?: string;
  subheadline?: string;
  images: GalleryImage[];
  layout?: "grid" | "masonry" | "carousel";
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ImageGalleryBlock({ data }: { data: ImageGalleryBlockData }) {
  if (!data.images || data.images.length === 0) {
    return null;
  }

  const layout = data.layout || "grid";

  return (
    <section className="container mx-auto px-6 py-20 lg:py-24">
      {(data.headline || data.subheadline) && (
        <div className="mb-12 max-w-2xl text-left sm:text-center sm:mx-auto">
          {data.headline && (
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              {data.headline}
            </h2>
          )}
          {data.subheadline && (
            <p className="mt-4 text-lg text-muted-foreground">
              {data.subheadline}
            </p>
          )}
        </div>
      )}

      {/* For now, we use a responsive grid for all layout options until specific libraries (masonry/carousel) are added if needed */}
      <div 
        className={`grid gap-4 sm:gap-6 ${
          layout === "masonry" ? "columns-1 sm:columns-2 lg:columns-3 block" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {data.images.map((img, index) => {
          const isMasonry = layout === "masonry";
          return (
            <figure 
              key={img._key || index} 
              className={`group relative overflow-hidden rounded-xl bg-muted ${isMasonry ? "mb-4 sm:mb-6 break-inside-avoid" : "aspect-[4/3]"}`}
            >
              <Image
                src={urlFor(img).width(800).auto('format').url()}
                alt={img.alt || "Gallery Image"}
                width={800}
                height={isMasonry ? undefined : 600}
                className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${!isMasonry && "h-full absolute inset-0"}`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {img.caption && (
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-sm font-medium">{img.caption}</p>
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>
    </section>
  );
}

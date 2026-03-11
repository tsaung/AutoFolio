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

type Logo = {
  _key: string;
  name: string;
  image: SanityImage;
  url?: string;
};

export type LogoCloudBlockData = {
  _type: "logoCloudBlock";
  _key: string;
  name: string;
  headline?: string;
  logos: Logo[];
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LogoCloudBlock({ data }: { data: LogoCloudBlockData }) {
  if (!data.logos || data.logos.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-6 py-16">
      <div className="flex flex-col items-center justify-center space-y-8">
        {data.headline && (
          <h2 className="text-center text-lg font-semibold uppercase tracking-wider text-muted-foreground">
            {data.headline}
          </h2>
        )}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {data.logos.map((logo, index) => {
            const logoUrl = urlFor(logo.image).height(80).fit('max').auto('format').url();
            const content = (
              <div
                className="relative flex h-12 w-32 items-center justify-center opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0 md:h-16 md:w-40"
              >
                <Image
                  src={logoUrl}
                  alt={logo.name}
                  width={160}
                  height={64}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            );

            if (logo.url) {
              return (
                <a
                  key={logo._key || index}
                  href={logo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                >
                  {content}
                </a>
              );
            }

            return <div key={logo._key || index}>{content}</div>;
          })}
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CtaButton = {
  _key: string;
  label: string;
  url?: string;
  style?: "primary" | "secondary" | "outline";
};

type HeroBlockData = {
  _type: "heroBlock";
  _key: string;
  name: string;
  headline: string;
  subheadline?: string;
  buttons?: CtaButton[];
  backgroundImage?: {
    asset: { _ref: string };
    hotspot?: { x: number; y: number };
  };
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function HeroBlock({ data }: { data: HeroBlockData }) {
  const bgUrl = data.backgroundImage?.asset
    ? urlFor(data.backgroundImage).width(1920).quality(80).url()
    : null;

  return (
    <section
      className="relative flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 py-24 text-center"
      style={
        bgUrl
          ? {
              backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${bgUrl})`,
              backgroundSize: "cover",
              backgroundPosition: data.backgroundImage?.hotspot
                ? `${data.backgroundImage.hotspot.x * 100}% ${data.backgroundImage.hotspot.y * 100}%`
                : "center",
            }
          : undefined
      }
    >
      <h1
        className={`max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl ${bgUrl ? "text-white" : ""}`}
      >
        {data.headline}
      </h1>

      {data.subheadline && (
        <p
          className={`max-w-2xl text-lg sm:text-xl ${bgUrl ? "text-white/80" : "text-muted-foreground"}`}
        >
          {data.subheadline}
        </p>
      )}

      {data.buttons && data.buttons.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          {data.buttons.map((btn, index) => (
            <Link
              key={btn._key || index}
              href={btn.url || "#"}
              className={buttonClass(btn.style)}
            >
              {btn.label}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buttonClass(style?: string): string {
  const base =
    "inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  switch (style) {
    case "secondary":
      return `${base} bg-secondary text-secondary-foreground hover:bg-secondary/80`;
    case "outline":
      return `${base} border border-input bg-background hover:bg-accent hover:text-accent-foreground`;
    default: // primary
      return `${base} bg-primary text-primary-foreground hover:bg-primary/90`;
  }
}

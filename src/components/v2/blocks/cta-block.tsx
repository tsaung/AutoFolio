import Link from "next/link";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CtaBlockData = {
  _type: "ctaBlock";
  _key: string;
  heading: string;
  text?: string;
  button?: {
    label: string;
    url?: string;
  };
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CtaBlock({ data }: { data: CtaBlockData }) {
  return (
    <section className="bg-muted/50 px-6 py-16 text-center">
      <div className="mx-auto max-w-2xl">
        <h2 className="mb-4 text-3xl font-bold tracking-tight">
          {data.heading}
        </h2>

        {data.text && (
          <p className="mb-8 text-lg text-muted-foreground">{data.text}</p>
        )}

        {data.button?.label && (
          <Link
            href={data.button.url || "#"}
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {data.button.label}
          </Link>
        )}
      </div>
    </section>
  );
}

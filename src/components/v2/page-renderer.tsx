import { HeroBlock } from "@/components/v2/blocks/hero-block";
import { RichTextBlock } from "@/components/v2/blocks/rich-text-block";
import { CtaBlock } from "@/components/v2/blocks/cta-block";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Minimal shape shared by every Sanity page-builder block. */
export type SanityBlock = {
  _type: string;
  _key: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

// ---------------------------------------------------------------------------
// Block Registry
// ---------------------------------------------------------------------------

/**
 * Maps a Sanity block `_type` to the React component that renders it.
 *
 * When you add a new block schema in Phase 2 (e.g. `featureGridBlock`),
 * import its component and add an entry here — that's the only wiring needed.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const blockComponents: Record<string, React.ComponentType<{ data: any }>> = {
  heroBlock: HeroBlock,
  richTextBlock: RichTextBlock,
  ctaBlock: CtaBlock,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type PageRendererProps = {
  blocks: SanityBlock[];
};

export function PageRenderer({ blocks }: PageRendererProps) {
  if (!blocks || blocks.length === 0) {
    return (
      <p className="py-24 text-center text-muted-foreground">
        This page has no content blocks yet. Add some in Sanity Studio.
      </p>
    );
  }

  return (
    <main>
      {blocks.map((block) => {
        const Component = blockComponents[block._type];

        if (!Component) {
          // In development, render a visible placeholder so authors notice.
          if (process.env.NODE_ENV === "development") {
            return (
              <div
                key={block._key}
                className="my-4 rounded border border-dashed border-yellow-500 bg-yellow-500/10 p-4 text-sm text-yellow-700"
              >
                ⚠️ Unknown block type: <code>{block._type}</code>
              </div>
            );
          }
          return null;
        }

        return <Component key={block._key} data={block} />;
      })}
    </main>
  );
}

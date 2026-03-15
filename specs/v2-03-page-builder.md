# V2 Page Builder & Frontend

This document details how the V2 architecture renders Sanity content on the frontend.

## 1. Next.js Component Mapping

A dynamic catch-all route (`app/[[...slug]]/page.tsx`) fetches the `page` document from Sanity via GROQ. The `pageBuilder` array contains **references**, so the GROQ query must **dereference** them:

```groq
*[_type == "page" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  seo,
  pageBuilder[]->{
    _id,
    _type,
    name,
    ...
  }
}
```

## 2. PageRenderer Component

A `PageRenderer` component iterates over the dereferenced blocks and maps each block's `_type` to a React component:

```tsx
const blockComponents: Record<string, React.ComponentType<{ data: any }>> = {
  heroBlock: Hero,
  richTextBlock: RichText,
  projectGridBlock: ProjectGrid,
  ctaBlock: CallToAction,
  faqBlock: FAQ,
  statsBlock: Stats,
  embedBlock: Embed,
  featureGridBlock: FeatureGrid,
  testimonialBlock: Testimonial,
  imageGalleryBlock: ImageGallery,
  logoCloudBlock: LogoCloud,
  contactFormBlock: ContactForm,
  experienceTimelineBlock: ExperienceTimeline,
  skillsBlock: Skills,
};

export function PageRenderer({ blocks }: { blocks: SanityBlock[] }) {
  return blocks.map((block) => {
    const Component = blockComponents[block._type];
    return Component ? <Component key={block._id} data={block} /> : null;
  });
}
```

## 3. Live Preview & Draft Mode

The V2 dashboard allows users to preview unpublished pages.

**Preview Flow:**
```text
User clicks "Preview" → Enable Next.js draft mode → Fetch draft documents from Sanity
→ Render page with unpublished content → User clicks "Publish" → Publish Sanity document
```

To ensure immediate updates and bypass caching, when the admin page builder iframe loads the visitor route, it uses URL parameters like `?preview=true` to conditionally skip CDN caching.
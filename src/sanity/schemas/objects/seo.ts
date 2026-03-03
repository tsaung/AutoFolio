import { defineType, defineField } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
      description:
        "Override the page title for search engines. Falls back to page title if empty.",
      validation: (rule) =>
        rule.max(60).warning("Keep under 60 characters for best SEO results."),
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
      description: "A short summary for search engine results.",
      validation: (rule) =>
        rule
          .max(160)
          .warning("Keep under 160 characters for best SEO results."),
    }),
    defineField({
      name: "ogImage",
      title: "Social Share Image",
      type: "image",
      description:
        "Image displayed when shared on social media (recommended 1200×630px).",
      options: { hotspot: true },
    }),
    defineField({
      name: "noIndex",
      title: "Hide from Search Engines",
      type: "boolean",
      description: "If enabled, search engines will not index this page.",
      initialValue: false,
    }),
  ],
});

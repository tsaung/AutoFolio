import { defineType, defineField } from "sanity";

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  icon: () => "📄",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description:
        "The internal name for this page (and default title used for SEO).",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "The route path for this page (e.g., 'about' or 'services'). Use 'home' for the root index page.",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "seo",
    }),
    defineField({
      name: "pageBuilder",
      title: "Page Builder",
      description: "Add, reorder, and configure the sections visually.",
      type: "array",
      of: [
        { type: "heroBlock" },
        { type: "richTextBlock" },
        { type: "ctaBlock" },
        // Future blocks to be added in Phase 2
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
    },
    prepare: ({ title, slug }) => ({
      title,
      subtitle: slug === "home" ? "/" : `/${slug}`,
      media: () => "📄",
    }),
  },
});

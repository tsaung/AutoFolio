import { defineType, defineField } from "sanity";

export const heroBlock = defineType({
  name: "heroBlock",
  title: "Hero",
  type: "document",
  icon: () => "🦸",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Internal name for this block in the library",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subheadline",
      title: "Subheadline",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "buttons",
      title: "CTA Buttons",
      type: "array",
      of: [
        {
          type: "object",
          name: "ctaButton",
          title: "Button",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) =>
                rule.uri({
                  allowRelative: true,
                  scheme: ["http", "https", "mailto", "tel"],
                }),
            }),
            defineField({
              name: "style",
              title: "Style",
              type: "string",
              options: {
                list: [
                  { title: "Primary", value: "primary" },
                  { title: "Secondary", value: "secondary" },
                  { title: "Outline", value: "outline" },
                ],
                layout: "radio",
              },
              initialValue: "primary",
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "url" },
          },
        },
      ],
      validation: (rule) =>
        rule
          .max(3)
          .warning("More than 3 buttons may clutter the hero section."),
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: "headline", subtitle: "subheadline" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Hero Block",
      subtitle: subtitle || "No subheadline",
      media: () => "🦸",
    }),
  },
});

import { defineType, defineField } from "sanity";

export const ctaBlock = defineType({
  name: "ctaBlock",
  title: "Call to Action",
  type: "object",
  icon: () => "📣",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "text",
      title: "Supporting Text",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "button",
      title: "Button",
      type: "object",
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
      ],
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "text" },
    prepare: ({ title, subtitle }) => ({
      title: title || "CTA Block",
      subtitle: subtitle || "No supporting text",
      media: () => "📣",
    }),
  },
});

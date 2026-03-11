import { defineType, defineField } from "sanity";

export const featureGridBlock = defineType({
  name: "featureGridBlock",
  title: "Feature Grid",
  type: "document",
  icon: () => "🎛️",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Internal name for this block in the library",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "features",
      title: "Features",
      type: "array",
      of: [
        {
          type: "object",
          name: "featureItem",
          fields: [
            defineField({
              name: "icon",
              title: "Icon (optional SVG or Emoji)",
              type: "string",
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "description" },
          },
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "name" },
    prepare: ({ title }) => ({
      title: title || "Feature Grid Block",
      media: () => "🎛️",
    }),
  },
});

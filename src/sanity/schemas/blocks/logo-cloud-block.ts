import { defineType, defineField } from "sanity";

export const logoCloudBlock = defineType({
  name: "logoCloudBlock",
  title: "Logo Cloud",
  type: "document",
  icon: () => "☁️",
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
    }),
    defineField({
      name: "logos",
      title: "Logos",
      type: "array",
      of: [
        {
          type: "object",
          name: "logo",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
            }),
          ],
          preview: {
            select: {
              title: "name",
              media: "image",
            },
          },
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "name", logos: "logos" },
    prepare: ({ title, logos }) => ({
      title: title || "Logo Cloud Block",
      subtitle: logos ? `${logos.length} logos` : "0 logos",
      media: () => "☁️",
    }),
  },
});

import { defineType, defineField } from "sanity";

export const statsBlock = defineType({
  name: "statsBlock",
  title: "Stats",
  type: "document",
  icon: () => "📊",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Internal name for this block in the library",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "items",
      title: "Stat Items",
      type: "array",
      of: [
        {
          type: "object",
          name: "statItem",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "suffix",
              title: "Suffix (e.g. +, %, M)",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "name" },
    prepare: ({ title }) => ({
      title: title || "Stats Block",
      media: () => "📊",
    }),
  },
});

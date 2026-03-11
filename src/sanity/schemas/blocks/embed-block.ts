import { defineType, defineField } from "sanity";

export const embedBlock = defineType({
  name: "embedBlock",
  title: "Embed",
  type: "document",
  icon: () => "🔗",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Internal name for this block in the library",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "embedType",
      title: "Embed Type",
      type: "string",
      options: {
        list: [
          { title: "YouTube", value: "youtube" },
          { title: "Vimeo", value: "vimeo" },
          { title: "Custom HTML", value: "custom" },
        ],
        layout: "radio",
      },
      initialValue: "youtube",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "Video URL",
      type: "url",
      hidden: ({ parent }) => parent?.embedType === "custom",
    }),
    defineField({
      name: "code",
      title: "Custom HTML Code",
      type: "text",
      rows: 5,
      hidden: ({ parent }) => parent?.embedType !== "custom",
    }),
  ],
  preview: {
    select: { title: "name", embedType: "embedType" },
    prepare: ({ title, embedType }) => ({
      title: title || "Embed Block",
      subtitle: embedType ? `Type: ${embedType}` : "",
      media: () => "🔗",
    }),
  },
});
